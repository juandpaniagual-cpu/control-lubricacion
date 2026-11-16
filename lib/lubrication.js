// Plantilla compartida por todas las plantas; datos aislados por plant_id.
export const actions=['record','editMaster','delete','export','config'];
const die=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
export const emptyState=name=>({config:{baseDate:new Date().toISOString().slice(0,10),prealertDays:7,site:name,masterSystem:'SAP',supportSystem:'CMMS multiplanta'},equipment:[],routines:[],planAssignments:[],records:[]});
const fieldSets={
 equipment:['id','code','name','area','system','subsystem','family','criticality','costCenter','active'],
 routines:['id','code','name','scope','description','frequencyDays','frequencyText','responsible','lubricant','requiresLoto','procedure','active'],
 planAssignments:['id','equipmentId','routineId','baseDate','responsible','procedure','lubricant','standardQuantity','requiresLoto','plannedSapOrder','observations','active'],
 records:['id','equipmentId','equipmentCode','routineId','routineCode','date','time','shift','technician','status','hourmeter','lubricant','quantity','loto','oilCondition','sapNotice','sapOrder','evidence','supervisor','findings','action','closeDate','observations','createdAt']
};
function validDate(v){return typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;}
export function cleanState(input,name){
 if(!input||typeof input!=='object')die('Respaldo o estado inválido');const result=emptyState(name);
 for(const [section,fields] of Object.entries(fieldSets)){
  if(!Array.isArray(input[section])||input[section].length>10000)die(`Sección inválida: ${section}`);const ids=new Set();
  result[section]=input[section].map(row=>{if(!row||typeof row!=='object'||typeof row.id!=='string'||!row.id||row.id.length>150||ids.has(row.id))die(`ID vacío o duplicado en ${section}`);ids.add(row.id);const out={};
   for(const key of fields)if(row[key]!==undefined){const v=row[key];if(!['string','number','boolean'].includes(typeof v)||String(v).length>10000)die(`Valor inválido: ${section}.${key}`);out[key]=v;}
   if(section==='equipment'||section==='routines'){if(!String(out.code||'').trim()||!String(out.name||'').trim())die('Código y nombre son requeridos');}
   if(section==='routines'&&(!Number.isInteger(out.frequencyDays)||out.frequencyDays<1||out.frequencyDays>3650))die('Frecuencia inválida');
   if(section==='records'&&!validDate(out.date))die('Fecha de ejecución inválida');
   if(section==='planAssignments'&&!validDate(out.baseDate))die('Fecha base de rutina inválida');return out;});
 }
 const config=input.config||{};
 for(const key of ['baseDate','masterSystem','supportSystem'])if(config[key]!==undefined){if(typeof config[key]!=='string'||config[key].length>500)die('Configuración inválida');result.config[key]=config[key];}
 if(!validDate(result.config.baseDate))die('Fecha base inválida');const prealert=Number(config.prealertDays??7);if(!Number.isInteger(prealert)||prealert<1||prealert>60)die('Días de prealerta inválidos');result.config.prealertDays=prealert;
 return result;
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function authorizeChanges(old,next,grants){
 const has=a=>{if(!grants.includes(a))die(`No tienes permiso para esta acción: ${a}`,403);};
 for(const section of ['equipment','routines','planAssignments','records']){
  const before=new Map(old[section].map(r=>[r.id,r])),after=new Map(next[section].map(r=>[r.id,r]));
  for(const [id,row] of after)if(!same(before.get(id),row))has(section==='records'?'record':'editMaster');
  for(const id of before.keys())if(!after.has(id))has('delete');
 }
 if(!same(old.config,next.config))has('config');
 // Nuevas referencias deben pertenecer a la planta. El histórico antiguo puede conservar
 // equipos/rutinas eliminados, pero no pueden agregarse referencias nuevas inexistentes.
 for(const section of ['planAssignments','records']){
  const before=new Map(old[section].map(r=>[r.id,r]));
  for(const row of next[section]){
   const previous=before.get(row.id);if(previous&&previous.equipmentId===row.equipmentId&&previous.routineId===row.routineId)continue;
   if(!next.equipment.some(e=>e.id===row.equipmentId)||!next.routines.some(r=>r.id===row.routineId))die('El equipo y la rutina deben pertenecer a esta planta',403);
  }
 }
}
