const stmt=(db,s,a=[])=>db.prepare(s).bind(...a);
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
const stamp=()=>new Date().toISOString();
export async function authenticateLegacy(db,request,b,mode,hash,equal,digest){
 const username=String(b.username||'').trim().toLowerCase(),deviceId=String(b.deviceId||'').trim(),label=String(b.deviceLabel||'Equipo autorizado').slice(0,180);
 if(!username||username.length>150||deviceId.length>200)fail('Usuario o dispositivo inválido');
 const key=await digest((request.headers.get('CF-Connecting-IP')||'local')+':'+username),time=Date.now();
 await stmt(db,'INSERT INTO mp_login_limits(key,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN expires_at<? THEN 1 ELSE attempts+1 END,expires_at=CASE WHEN expires_at<? THEN excluded.expires_at ELSE expires_at END',[key,time+900000,time,time]).run();
 if((await stmt(db,'SELECT attempts FROM mp_login_limits WHERE key=?',[key]).first()).attempts>10)fail('Demasiados intentos. Espera 15 minutos.',429);
 let user=await stmt(db,mode==='device'?'SELECT * FROM users WHERE lower(username)=? OR lower(name)=? LIMIT 1':'SELECT * FROM users WHERE lower(username)=?',[username,...(mode==='device'?[username]:[])]).first();
 if(mode==='device'){
  if(user?.role==='admin')fail('El administrador debe ingresar con su PIN o contraseña.',401);
  if(!deviceId)fail('No se pudo identificar el dispositivo.');
  if(user?.active&&user.authorized_device_id===deviceId){
   await stmt(db,'UPDATE users SET last_login_at=? WHERE id=?',[stamp(),user.id]).run();
   await stmt(db,'DELETE FROM mp_login_limits WHERE key=?',[key]).run();return {user,deviceId};
  }
  if(user&&!user.active)fail('Usuario inactivo. Contacta al administrador.',403);
  const pending=await stmt(db,"SELECT id FROM access_requests WHERE lower(username)=? AND device_id=? AND status='pending'",[username,deviceId]).first();
  if(!pending)await stmt(db,"INSERT INTO access_requests(id,requested_name,username,device_id,device_label,status,user_id,role,detail,created_at,updated_at) VALUES (?,?,?,?,?,'pending',?,?,?,?,?)",
   [crypto.randomUUID(),String(b.name||username).slice(0,150),username,deviceId,label,user?.id||'',user?.role||'consulta','Pendiente de autorización del administrador.',stamp(),stamp()]).run();
  return {pending:true};
 }
 const password=String(b.password??b.pin??'').trim();if(!password||password.length>200)fail('Introduce tu PIN o contraseña.',401);
 const credential=user?await stmt(db,'SELECT * FROM mp_credentials WHERE user_id=?',[user.id]).first():null;
 const valid=credential?equal(await hash(password,credential.salt),credential.password_hash):user?.pin?equal(await digest(password),await digest(String(user.pin))):false;
 if(!user||!user.active||!valid)fail('Usuario o contraseña incorrectos',401);
 if(user.role!=='admin'){
  if(!deviceId)fail('Se requiere el dispositivo autorizado.',403);
  if(!user.authorized_device_id){
   await stmt(db,"UPDATE users SET authorized_device_id=?,authorized_device_label=?,authorized_device_at=?,updated_at=? WHERE id=? AND (authorized_device_id='' OR authorized_device_id IS NULL)",[deviceId,label,stamp(),stamp(),user.id]).run();
   user=await stmt(db,'SELECT * FROM users WHERE id=?',[user.id]).first();
  }
  if(user.authorized_device_id!==deviceId)fail('Usuario autorizado en otro equipo. Solicita autorización al administrador.',403);
 }
 await stmt(db,'UPDATE users SET last_login_at=? WHERE id=?',[stamp(),user.id]).run();
 await stmt(db,'DELETE FROM mp_login_limits WHERE key=?',[key]).run();
 return {user,deviceId:user.role==='admin'?'':deviceId};
}
export async function approveRequest(db,requestId,decision,actorId){
 const row=await stmt(db,'SELECT * FROM access_requests WHERE id=?',[requestId]).first();if(!row)fail('Solicitud no encontrada',404);
 if(row.status!=='pending')fail('Esta solicitud ya fue atendida.',409);
 if(!['approved','denied'].includes(decision))fail('Decisión inválida');
 const operations=[],time=stamp();let uid=row.user_id;
 if(decision==='approved'){
  let user=uid?await stmt(db,'SELECT * FROM users WHERE id=?',[uid]).first():null;
  user=user||await stmt(db,'SELECT * FROM users WHERE lower(username)=?',[row.username.toLowerCase()]).first();
  if(user?.role==='admin')fail('No se puede autorizar un administrador mediante solicitud de dispositivo.',403);
  uid=user?.id||crypto.randomUUID();
  if(user)operations.push(stmt(db,'UPDATE users SET active=1,authorized_device_id=?,authorized_device_label=?,authorized_device_at=?,updated_at=? WHERE id=?',[row.device_id,row.device_label||'',time,time,uid]));
  else operations.push(stmt(db,"INSERT INTO users(id,name,username,pin,role,note,active,authorized_device_id,authorized_device_label,authorized_device_at,created_at,updated_at) VALUES (?,?,?,'','consulta','Creado por solicitud aprobada',1,?,?,?,?,?)",[uid,row.requested_name,row.username,row.device_id,row.device_label||'',time,time,time]));
  operations.push(stmt(db,'DELETE FROM mp_sessions WHERE user_id=?',[uid]));
  if(!user){
   operations.push(stmt(db,"INSERT INTO mp_access(user_id,plant_id,module,permission) VALUES (?,'HIPOCALCIO','lubricacion','lectura')",[uid]));
   operations.push(stmt(db,"INSERT INTO mp_lub_actions(user_id,plant_id,actions) VALUES (?,'HIPOCALCIO','[]')",[uid]));
  }
 }
 operations.push(stmt(db,'UPDATE access_requests SET status=?,user_id=?,detail=?,updated_at=? WHERE id=?',[decision,uid||'',decision==='approved'?'Autorizado por administrador':'Negado por administrador',time,row.id]));
 operations.push(stmt(db,'INSERT INTO mp_audit(id,actor_id,action,plant_id,target_id,created_at) VALUES (?,?,?,?,?,?)',[crypto.randomUUID(),actorId,'solicitud_'+decision,'HIPOCALCIO',row.id,time]));
 await db.batch(operations);
}
