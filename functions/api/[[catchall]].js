import {failureModes,diagnosticStates} from '../../vibration.js';
import {validateThermal,thermalSummary} from '../../thermal.js';
import {readLegacy,saveLegacy} from '../../lib/legacy-storage.js';
import {withThermalHistory,parseThermalConfig} from '../../lib/thermal-config.js';
import {authenticateLegacy,approveRequest} from '../../lib/legacy-auth.js';
import {actions as lubricationActions,emptyState,cleanState,authorizeChanges} from '../../lib/lubrication.js';
const modules = ['lubricacion','medicion'];
const kinds = ['medicion'];
const techniques = ['Vibraciones','Termografía','Ultrasonido','Espesores','Análisis de aceite'];
const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();
const fail = (message,status=400) => { throw Object.assign(new Error(message),{status}); };
const json = (data,status=200,headers={}) => new Response(JSON.stringify(data), {status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
const stmt = (db,sql,args=[]) => db.prepare(sql).bind(...args);
const first = (db,sql,args=[]) => stmt(db,sql,args).first();
const rows = async(db,sql,args=[]) => (await stmt(db,sql,args).all()).results || [];
async function equipmentCatalog(db,plant){
 if(plant==='HIPOCALCIO')return (await readLegacy(db)).state.equipment;
 const saved=await first(db,'SELECT data FROM mp_lubrication WHERE plant_id=?',[plant]);
 return withThermalHistory(db,plant,saved?(JSON.parse(saved.data).equipment||[]):[]);
}
const encode = value => new TextEncoder().encode(value);
const hex = buffer => Array.from(new Uint8Array(buffer),v=>v.toString(16).padStart(2,'0')).join('');
const digest = async text => hex(await crypto.subtle.digest('SHA-256',encode(text)));
async function hash(password,salt) {
 const key=await crypto.subtle.importKey('raw',encode(password),'PBKDF2',false,['deriveBits']);
 return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encode(salt),iterations:100000,hash:'SHA-256'},key,256));
}
function equal(a,b){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function body(request){if(!request.headers.get('content-type')?.includes('application/json'))fail('Se requiere JSON',415);const text=await request.text();if(text.length>2000000)fail('Solicitud demasiado grande (máximo 2 MB)',413);try{return JSON.parse(text);}catch{fail('JSON inválido');}}
function str(value,name,max=300,required=false){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))fail(`Campo inválido: ${name}`);return value.trim();}
function date(value,name,required=false){if(!value&&!required)return '';str(value,name,10,true);if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)fail(`Fecha inválida: ${name}`);return value;}
const publicUser = u => ({id:u.id,name:u.name,username:u.username,role:u.role,active:!!u.active,authorizedDeviceLabel:u.authorized_device_label||'',authorizedDeviceAt:u.authorized_device_at||''});
function cookie(token,age=28800){return `mp_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${age}`;}
async function identity(request,db){const token=request.headers.get('cookie')?.match(/(?:^|;\s*)mp_session=([a-f0-9]{64})(?:;|$)/)?.[1];if(!token)fail('Inicia sesión',401);const user=await first(db,'SELECT u.* FROM mp_sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1 AND (u.role=\'admin\' OR (s.device_id=u.authorized_device_id AND s.device_id!=\'\'))',[await digest(token),Date.now()]);if(!user)fail('Sesión vencida o desactivada',401);return user;}
const admin = u => {if(u.role!=='admin')fail('Solo el administrador puede gestionar usuarios, plantas y permisos',403);};
async function access(db,user,plant,module,write=false){if(!modules.includes(module))fail('Módulo inválido');if(!await first(db,'SELECT id FROM mp_plants WHERE id=?',[plant]))fail('Planta no disponible',404);if(user.role==='admin')return 'edicion';const grant=await first(db,'SELECT permission FROM mp_access WHERE user_id=? AND plant_id=? AND module=?',[user.id,plant,module]);if(!grant||(write&&grant.permission!=='edicion'))fail('Sin acceso a esta planta o módulo',403);return grant.permission;}
function audit(db,user,action,plant,target){return stmt(db,'INSERT INTO mp_audit(id,actor_id,action,plant_id,target_id,created_at) VALUES (?,?,?,?,?,?)',[id(),user.id,action,plant||null,target||null,now()]);}
function validate(kind,input){
 if(!input||typeof input!=='object'||Array.isArray(input))fail('Registro inválido');
 const data={}; const fields=['equipment','name','area','point','responsible','lubricant','quantity','procedure','sap','technician','findings','action','reference','instrument','conditions','evidence','diagnosis','status','priority','condition','technique','planId'];
 if(input.thermalPoints!==undefined){if(input.technique!=='Termografía')fail('Los puntos térmicos solo se admiten en Termografía');data.thermalPoints=validateThermal(input.thermalPoints);}
 if(input.technique==='Vibraciones'){
  data.failureMode=input.failureMode||'No determinado';data.diagnosticState=input.diagnosticState||'Por evaluar';
  if(!failureModes.includes(data.failureMode)||!diagnosticStates.includes(data.diagnosticState))fail('Modo de falla o estado inválido');
  data.failureDetail=str(input.failureDetail||'','detalle de falla',4000,data.failureMode==='Otro');
  if(data.failureMode==='No determinado'&&data.diagnosticState==='Confirmado por analista')fail('Una falla no determinada no puede marcarse como confirmada');
 }
 if(input.oilMethod!==undefined){
  if(input.technique!=='Análisis de aceite'||!['Laboratorio','TMEH1'].includes(input.oilMethod))fail('Método de aceite inválido');
  data.oilMethod=input.oilMethod;
  if(input.oilMethod==='TMEH1'){
   for(const f of ['oilBrand','oilProduct','oilGrade','oilReference','oilSeries','instrumentSerial'])data[f]=str(input[f],f,250,true);
   data.referenceDate=date(input.referenceDate,'referencia',true);if(data.referenceDate>input.date)fail('La referencia no puede ser posterior a la muestra');
   for(const f of ['oilReading','sampleTemperature','equipmentHours','oilHours']){
    const v=input[f];if((v===undefined||v==='')&&['equipmentHours','oilHours'].includes(f)){data[f]='';continue;}
    if(typeof v!=='string'||!v.trim()||!Number.isFinite(Number(v)))fail('Valor numérico inválido: '+f);
    const n=Number(v);if(f==='oilReading'&&(!Number.isInteger(n)||n< -999||n>999))fail('Lectura TMEH 1 fuera de rango (-999 a 999)');
    if(f==='sampleTemperature'&&(n< -273.15||n>40))fail('La muestra debe estar a no más de 40 °C; acondicione y repita la medición');
    if(f.endsWith('Hours')&&n<0)fail('Las horas no pueden ser negativas');data[f]=String(n);
   }
   if(!['Verde','Roja','No determinada'].includes(input.oilVisual))fail('Indicación visual inválida');data.oilVisual=input.oilVisual;
   if(!['Ninguna','Cambio de aceite','Reposición','Filtración','Cambio de referencia'].includes(input.oilIntervention))fail('Intervención inválida');data.oilIntervention=input.oilIntervention;
  }
 }
 for(const field of fields)if(input[field]!==undefined)data[field]=str(input[field],field,field==='findings'||field==='diagnosis'||field==='action'||field==='reference'?4000:500);
 str(data.equipment,'equipo',150,true);
 if(data.evidence&&!/^https:\/\//i.test(data.evidence))fail('El enlace del informe debe comenzar por https://');
 if(kind==='plan'){
  str(data.name,'rutina',300,true); data.frequency=Number(input.frequency);if(!Number.isInteger(data.frequency)||data.frequency<1||data.frequency>3650)fail('Frecuencia: entre 1 y 3650');
  data.unit=input.unit;if(!['dias','meses'].includes(data.unit))fail('Unidad de frecuencia inválida');data.baseDate=date(input.baseDate,'fecha base',true);
 }else{
  data.date=date(input.date,'fecha del análisis / ejecución',true);
  if(kind==='ejecucion')str(data.planId,'rutina del plan',100,true);
  if(kind==='medicion'){
   if(!techniques.includes(data.technique))fail('Técnica inválida');str(data.point,'punto o muestra',300,true);str(data.diagnosis,'diagnóstico',4000,true);
   if(!['Pendiente','Normal','Observación','Alarma','Crítica'].includes(data.condition))fail('Condición inválida');
   if(!['Abierto','En seguimiento','Cerrado'].includes(data.status))fail('Estado inválido');
   data.nextDate=date(input.nextDate,'próximo análisis');if(data.nextDate&&data.nextDate<data.date)fail('La próxima fecha debe ser posterior al análisis');
   if(data.thermalPoints)data.measurements=thermalSummary(data.thermalPoints);
   else {if(!Array.isArray(input.measurements)||input.measurements.length>24)fail('Mediciones inválidas');
   data.measurements=input.measurements.map(m=>({name:str(m.name,'medición',120,true),value:str(m.value,'resultado',300),unit:str(m.unit,'unidad',60)}));}
  }
 }
 return data;
}
export async function onRequest({request,env}) {
 try{
  const db=env.DB;if(!db)fail('Falta configurar la base D1',503);
  const url=new URL(request.url),path=url.pathname.replace(/\/$/,''),method=request.method;
  if(!['GET','POST','PUT'].includes(method))fail('Método no permitido',405);
  if(method!=='GET'&&request.headers.get('origin')!==url.origin)fail('Origen no permitido',403);
  if(path==='/api/health'&&method==='GET'){await first(db,"SELECT value FROM mp_meta WHERE key='version'");return json({ok:true,app:'cmms-lubricacion',version:'actualizacion-multiplanta-v1',d1:true});}
  if(path==='/api/setup')fail('Esta es una actualización. Utiliza los usuarios existentes.',409);
  if(['/api/login','/api/auth/login','/api/auth/request-access'].includes(path)&&method==='POST'){
   const b=await body(request);const result=await authenticateLegacy(db,request,b,path.endsWith('request-access')?'device':'password',hash,equal,digest);
   if(result.pending)return json({ok:true,status:'PENDING'},202);
   const token=hex(crypto.getRandomValues(new Uint8Array(32)));
   await db.batch([stmt(db,'DELETE FROM mp_sessions WHERE expires_at<?',[Date.now()]),stmt(db,'INSERT INTO mp_sessions(token_hash,user_id,expires_at,device_id) VALUES (?,?,?,?)',[await digest(token),result.user.id,Date.now()+28800000,result.deviceId])]);
   return json({ok:true,status:'APPROVED',user:publicUser(result.user)},200,{'Set-Cookie':cookie(token)});
  }
  const user=await identity(request,db);
  if(path==='/api/logout'&&method==='POST'){const token=request.headers.get('cookie').match(/mp_session=([a-f0-9]{64})/)[1];await stmt(db,'DELETE FROM mp_sessions WHERE token_hash=?',[await digest(token)]).run();return json({ok:true},200,{'Set-Cookie':cookie('',0)});}
  if(path==='/api/me'&&method==='GET'){
   const plants=user.role==='admin'?await rows(db,'SELECT * FROM mp_plants ORDER BY name'):await rows(db,'SELECT p.* FROM mp_plants p WHERE EXISTS(SELECT 1 FROM mp_access a WHERE a.plant_id=p.id AND a.user_id=?) ORDER BY name',[user.id]);
   const grants=user.role==='admin'?plants.flatMap(p=>modules.map(module=>({plant_id:p.id,module,permission:'edicion'}))):await rows(db,'SELECT plant_id,module,permission FROM mp_access WHERE user_id=?',[user.id]);
   const techGrants=user.role==='admin'?[]:await rows(db,'SELECT plant_id,technique,permission FROM mp_tech_access WHERE user_id=?',[user.id]);
   return json({user:publicUser(user),plants,grants,techGrants});
  }
  if(path.startsWith('/api/admin/')){
   admin(user);
   if(path==='/api/admin/state'&&method==='GET')return json({users:(await rows(db,'SELECT id,username,name,role,active,authorized_device_label,authorized_device_at FROM users ORDER BY name')).map(publicUser),plants:await rows(db,'SELECT * FROM mp_plants ORDER BY name'),grants:await rows(db,'SELECT * FROM mp_access'),lubActions:await rows(db,'SELECT * FROM mp_lub_actions'),techGrants:await rows(db,'SELECT * FROM mp_tech_access'),requests:await rows(db,'SELECT id,requested_name,username,device_label,status,created_at FROM access_requests ORDER BY created_at DESC')});
   const b=method==='GET'?{}:await body(request);
   if(path==='/api/admin/plants'&&method==='POST'){const plant=id(),name=str(b.name,'nombre de planta',150,true).toUpperCase();if(await first(db,'SELECT id FROM mp_plants WHERE upper(name)=?',[name]))fail('Ya existe una planta con ese nombre',409);await db.batch([stmt(db,'INSERT INTO mp_plants(id,name,created_at) VALUES (?,?,?)',[plant,name,now()]),audit(db,user,'crear_planta',plant,plant)]);return json({id:plant},201);}
   if(path==='/api/admin/lub-actions'&&method==='PUT'){
    const target=await first(db,"SELECT id FROM users WHERE id=? AND role!='admin'",[b.userId]);if(!target||!await first(db,'SELECT id FROM mp_plants WHERE id=?',[b.plantId]))fail('Usuario o planta inválidos');
    if(!Array.isArray(b.actions)||b.actions.some(a=>!lubricationActions.includes(a)))fail('Acciones inválidas');
    await db.batch([stmt(db,'INSERT INTO mp_lub_actions(user_id,plant_id,actions) VALUES (?,?,?) ON CONFLICT(user_id,plant_id) DO UPDATE SET actions=excluded.actions',[b.userId,b.plantId,JSON.stringify([...new Set(b.actions)])]),audit(db,user,'permisos_lubricacion',b.plantId,b.userId)]);return json({ok:true});
   }
   if(path==='/api/admin/tech-access'&&method==='PUT'){
    const target=await first(db,"SELECT id FROM users WHERE id=? AND role!='admin'",[b.userId]);if(!target||!await first(db,'SELECT id FROM mp_plants WHERE id=?',[b.plantId])||!techniques.includes(b.technique)||!['ninguno','lectura','edicion'].includes(b.permission))fail('Permiso de técnica inválido');
    await db.batch([stmt(db,'INSERT INTO mp_tech_access(user_id,plant_id,technique,permission) VALUES (?,?,?,?) ON CONFLICT(user_id,plant_id,technique) DO UPDATE SET permission=excluded.permission',[b.userId,b.plantId,b.technique,b.permission]),audit(db,user,`tecnica_${b.technique}_${b.permission}`,b.plantId,b.userId)]);return json({ok:true});
   }
   if(path==='/api/admin/request'&&method==='PUT'){
    await approveRequest(db,b.requestId,b.decision,user.id);return json({ok:true});
   }
   if(path==='/api/admin/release-device'&&method==='PUT'){
    const target=await first(db,'SELECT * FROM users WHERE id=?',[b.userId]);if(!target||target.role==='admin')fail('Usuario inválido');
    await db.batch([stmt(db,"UPDATE users SET authorized_device_id='',authorized_device_label='',authorized_device_at='',updated_at=? WHERE id=?",[now(),b.userId]),stmt(db,'DELETE FROM mp_sessions WHERE user_id=?',[b.userId]),audit(db,user,'liberar_dispositivo',null,b.userId)]);return json({ok:true});
   }
   if(path==='/api/admin/users'&&method==='POST'){
    const username=str(b.username,'usuario',80,true).toLowerCase(),name=str(b.name,'nombre',150,true),password=str(b.password,'contraseña',200,true);if(password.length<12)fail('Contraseña nueva: mínimo 12 caracteres');
    if(await first(db,'SELECT id FROM users WHERE lower(username)=?',[username]))fail('El usuario ya existe',409);
    const role=b.role||'tecnico';if(!['tecnico','supervisor','consulta'].includes(role))fail('Rol inválido');
    const salt=id(),uid=id();await db.batch([
     stmt(db,"INSERT INTO users(id,username,name,pin,role,created_at,updated_at) VALUES (?,?,?,'',?,?,?)",[uid,username,name,role,now(),now()]),
     stmt(db,'INSERT INTO mp_credentials(user_id,password_hash,salt) VALUES (?,?,?)',[uid,await hash(password,salt),salt]),
     audit(db,user,'crear_usuario',null,uid)]);return json({id:uid},201);
   }
   if(path==='/api/admin/user-profile'&&method==='PUT'){
    const target=await first(db,'SELECT * FROM users WHERE id=?',[b.userId]);if(!target)fail('Usuario inválido');
    const name=str(b.name,'nombre',150,true),username=str(b.username,'usuario',80,true).toLowerCase(),role=b.role||target.role;
    if(target.role==='admin'?role!=='admin':!['tecnico','supervisor','consulta'].includes(role))fail('No se puede cambiar la condición de administrador desde este formulario');
    const duplicate=await first(db,'SELECT id FROM users WHERE lower(username)=? AND id!=?',[username,target.id]);if(duplicate)fail('Ya existe ese usuario',409);
    const ops=[stmt(db,'UPDATE users SET name=?,username=?,role=?,updated_at=? WHERE id=?',[name,username,role,now(),target.id]),audit(db,user,'editar_usuario',null,target.id)];
    if(b.password){const password=str(b.password,'contraseña',200,true);if(password.length<12)fail('La nueva contraseña requiere 12 caracteres');const salt=id();ops.push(stmt(db,'INSERT INTO mp_credentials(user_id,password_hash,salt) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET password_hash=excluded.password_hash,salt=excluded.salt',[target.id,await hash(password,salt),salt]));ops.push(stmt(db,'DELETE FROM mp_sessions WHERE user_id=?',[target.id]));}
    await db.batch(ops);return json({ok:true});
   }
   if(path==='/api/admin/access'&&method==='PUT'){
    const target=await first(db,'SELECT * FROM users WHERE id=?',[b.userId]);if(!target||target.role==='admin')fail('Selecciona un usuario no administrador');
    if(!await first(db,'SELECT id FROM mp_plants WHERE id=?',[b.plantId])||!modules.includes(b.module))fail('Planta o módulo inválido');
    if(!['ninguno','lectura','edicion'].includes(b.permission))fail('Permiso inválido');
    const operation=b.permission==='ninguno'?stmt(db,'DELETE FROM mp_access WHERE user_id=? AND plant_id=? AND module=?',[b.userId,b.plantId,b.module]):stmt(db,'INSERT INTO mp_access(user_id,plant_id,module,permission) VALUES (?,?,?,?) ON CONFLICT(user_id,plant_id,module) DO UPDATE SET permission=excluded.permission',[b.userId,b.plantId,b.module,b.permission]);
    await db.batch([operation,audit(db,user,`acceso_${b.module}_${b.permission}`,b.plantId,b.userId)]);return json({ok:true});
   }
   if(path==='/api/admin/user-status'&&method==='PUT'){
    const target=await first(db,'SELECT * FROM users WHERE id=?',[b.userId]);if(!target||target.role==='admin')fail('No se puede desactivar el administrador desde esta pantalla');if(typeof b.active!=='boolean')fail('Estado inválido');
    await db.batch([stmt(db,'UPDATE users SET active=? WHERE id=?',[b.active?1:0,b.userId]),stmt(db,'DELETE FROM mp_sessions WHERE user_id=?',[b.userId]),audit(db,user,b.active?'activar_usuario':'desactivar_usuario',null,b.userId)]);return json({ok:true});
   }
   fail('Ruta no encontrada',404);
  }
  if(path==='/api/measurement-equipment'&&method==='GET'){
   const plant=url.searchParams.get('plant');await access(db,user,plant,'medicion');
   return json({equipment:(await equipmentCatalog(db,plant)).map(e=>({id:e.id,code:e.code,name:e.name,area:e.area||'',active:e.active!==false&&e.active!==0,thermalConfig:e.thermalConfig}))});
  }
  if(path.startsWith('/api/lubrication/')){
   const plantId=url.searchParams.get('plant');const permission=await access(db,user,plantId,'lubricacion');
   const plantRow=await first(db,'SELECT name FROM mp_plants WHERE id=?',[plantId]);
   const legacy=plantId==='HIPOCALCIO'?await readLegacy(db):null;
   const stored=legacy?{revision:legacy.revision}:await first(db,'SELECT * FROM mp_lubrication WHERE plant_id=?',[plantId]);
   const saved=legacy?legacy.state:stored?JSON.parse(stored.data):emptyState(plantRow.name);
   if(!legacy)await withThermalHistory(db,plantId,saved.equipment);
   const custom=await first(db,'SELECT actions FROM mp_lub_actions WHERE user_id=? AND plant_id=?',[user.id,plantId]);
   const allowed=user.role==='admin'?lubricationActions:permission==='lectura'?(custom?JSON.parse(custom.actions).filter(a=>a==='export'):['export']):(custom?JSON.parse(custom.actions):['record','editMaster','export']);
   if(path==='/api/lubrication/bootstrap'&&method==='GET')return json({...saved,revision:stored?.revision||0,plantId,user:publicUser(user),actions:allowed});
   if(path==='/api/lubrication/state'&&method==='POST'){
    if(user.role!=='admin'&&permission!=='edicion')fail('Solo lectura',403);
    const b=await body(request);if(b.revision!==(stored?.revision||0))fail('Otro usuario modificó esta planta. Recarga antes de guardar.',409);
    const next=cleanState(b.state,plantRow.name);authorizeChanges(saved,next,allowed);
    if(legacy){const revision=await saveLegacy(db,saved,next,b.revision,{userId:user.id});return json({ok:true,revision});}
    if(stored){const result=await stmt(db,'UPDATE mp_lubrication SET data=?,revision=revision+1,updated_at=? WHERE plant_id=? AND revision=?',[JSON.stringify(next),now(),plantId,b.revision]).run();if(result.meta.changes!==1)fail('Los datos cambiaron. Recarga.',409);}
    else await stmt(db,'INSERT INTO mp_lubrication(plant_id,data,revision,updated_at) VALUES (?,?,1,?)',[plantId,JSON.stringify(next),now()]).run();
    await audit(db,user,'guardar_lubricacion',plantId,plantId).run();return json({ok:true,revision:(stored?.revision||0)+1});
   }
   if(path==='/api/lubrication/import')fail('HIPOCALCIO utiliza directamente la base existente. No se importa ni reemplaza desde JSON.',409);
   fail('Ruta de lubricación no disponible',404);
  }
  if(path==='/api/items'&&(method==='GET'||method==='POST')){
   const plant=url.searchParams.get('plant'),kind=url.searchParams.get('kind');if(!kinds.includes(kind))fail('Tipo inválido');
   const permission=await access(db,user,plant,kind==='medicion'?'medicion':'lubricacion',method==='POST');
   const overrides=kind==='medicion'&&user.role!=='admin'?await rows(db,'SELECT technique,permission FROM mp_tech_access WHERE user_id=? AND plant_id=?',[user.id,plant]):[];
   if(method==='GET')return json({permission,items:(await rows(db,'SELECT * FROM mp_items WHERE plant_id=? AND kind=? ORDER BY updated_at DESC',[plant,kind])).map(r=>({...r,data:JSON.parse(r.data)})).filter(r=>!overrides.some(g=>g.technique===r.data.technique&&g.permission==='ninguno'))});
   const b=await body(request),data=validate(kind,b.data);
   if(overrides.some(g=>g.technique===data.technique&&g.permission!=='edicion'))fail('Sin permiso de registro para esta técnica',403);
   if(kind==='ejecucion'){
    const plan=await first(db,"SELECT data FROM mp_items WHERE id=? AND plant_id=? AND kind='plan'",[data.planId,plant]);if(!plan)fail('Rutina de otra planta o inexistente',403);if(JSON.parse(plan.data).equipment!==data.equipment)fail('El equipo no coincide con la rutina');
   }
   const itemId=b.id?str(b.id,'id',100,true):id(),old=await first(db,'SELECT * FROM mp_items WHERE id=?',[itemId]);
   if(b.id&&!old)fail('Registro no disponible',404);if(old&&(old.plant_id!==plant||old.kind!==kind))fail('Registro de otra planta o módulo',403);
   if(old&&kind==='medicion'&&JSON.parse(old.data).technique!==data.technique)fail('No se puede cambiar la técnica de un registro existente',403);
   if(old&&b.revision!==old.revision)fail('Otro usuario modificó este registro. Recarga antes de editar.',409);
   const previous=old?JSON.parse(old.data):null;
   if(previous&&((previous.equipmentId&&previous.equipmentId===b.data.equipmentId)||(!previous.equipmentId&&!b.data.equipmentId&&previous.equipment===data.equipment))){
    data.equipment=previous.equipment;if(previous.equipmentId)data.equipmentId=previous.equipmentId;
   }else{
    const chosen=(await equipmentCatalog(db,plant)).find(e=>e.id===b.data.equipmentId&&e.active!==false&&e.active!==0);
    if(!chosen)fail('Selecciona un equipo activo del catálogo de esta planta',400);
    data.equipmentId=chosen.id;data.equipment=chosen.code;
   }
   if(previous?.thermalPoints&&(!data.thermalPoints||previous.equipmentId!==data.equipmentId))fail('No se puede cambiar el equipo ni retirar los puntos de una inspección multipunto');
   if(data.thermalPoints){
    if(!previous){const equipment=(await equipmentCatalog(db,plant)).find(e=>e.id===data.equipmentId);if(equipment?.thermalConfig!==undefined){const expected=parseThermalConfig(equipment.thermalConfig).filter(p=>p.active);if(expected.length!==data.thermalPoints.length||expected.some(p=>!data.thermalPoints.some(n=>n.id===p.id&&n.name===p.name)))fail('Los puntos del equipo cambiaron. Recarga y usa su configuración actual.');}}
    if(previous?.thermalPoints?.some(p=>!data.thermalPoints.some(n=>n.id===p.id)))fail('Conserva los puntos existentes; marca No medido si corresponde');
    if(user.role!=='admin'){
     const prior=previous?.thermalPoints?previous:(await rows(db,"SELECT data FROM mp_items WHERE plant_id=? AND kind='medicion' ORDER BY updated_at DESC",[plant])).map(r=>JSON.parse(r.data)).find(d=>d.technique==='Termografía'&&d.equipmentId===data.equipmentId&&d.thermalPoints);
     for(const p of data.thermalPoints){const c=prior?.thermalPoints.find(x=>x.id===p.id)?.criteria||null;if(JSON.stringify(p.criteria)!==JSON.stringify(c))fail('Solo el administrador puede aprobar o cambiar criterios térmicos',403);}
    }
   }
   if(old){const result=await stmt(db,'UPDATE mp_items SET data=?,revision=revision+1,updated_at=? WHERE id=? AND plant_id=? AND revision=?',[JSON.stringify(data),now(),itemId,plant,b.revision]).run();if(result.meta.changes!==1)fail('El registro cambió. Recarga.',409);await audit(db,user,`editar_${kind}`,plant,itemId).run();}
   else await db.batch([stmt(db,'INSERT INTO mp_items(id,plant_id,kind,data,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?)',[itemId,plant,kind,JSON.stringify(data),user.id,now(),now()]),audit(db,user,`crear_${kind}`,plant,itemId)]);
   return json({ok:true,id:itemId},old?200:201);
  }
  fail('Ruta no encontrada',404);
 }catch(error){if(!error.status)console.error(error);return json({error:error.status?error.message:'Error interno. Revisa la configuración y el registro del servidor.'},error.status||500);}
}
