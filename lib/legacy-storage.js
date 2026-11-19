// Adaptador de HIPOCALCIO: lee y escribe las tablas EXISTENTES, sin copiarlas ni reiniciarlas.
import {withThermalHistory} from './thermal-config.js';
const mappings={
 equipment:{table:'equipment',fields:'id code name area system subsystem family criticality costCenter:cost_center active'},
 routines:{table:'routines',fields:'id code name scope description frequencyDays:frequency_days frequencyText:frequency_text responsible lubricant requiresLoto:requires_loto procedure active'},
 planAssignments:{table:'plan_assignments',fields:'id equipmentId:equipment_id routineId:routine_id baseDate:base_date responsible procedure lubricant standardQuantity:standard_quantity requiresLoto:requires_loto plannedSapOrder:planned_sap_order observations active'},
 records:{table:'execution_records',fields:'id equipmentId:equipment_id equipmentCode:equipment_code routineId:routine_id routineCode:routine_code date time shift technician status hourmeter lubricant quantity loto oilCondition:oil_condition sapNotice:sap_notice sapOrder:sap_order evidence supervisor findings action closeDate:close_date observations createdAt:created_at'}
};
const stmt=(db,s,a=[])=>db.prepare(s).bind(...a);
const all=async(db,s,a=[]) => (await stmt(db,s,a).all()).results||[];
const fail=(message,status=409)=>{throw Object.assign(new Error(message),{status});};
const pairs=k=>mappings[k].fields.split(' ').map(p=>{const [key,column]=p.split(':');return [key,column||key];});
function fromRow(k,row){return Object.fromEntries(pairs(k).map(([key,column])=>[key,key==='active'?!!row[column]:row[column]??'']));}
export async function readLegacy(db){
 const before=await stmt(db,"SELECT revision FROM mp_versions WHERE plant_id='HIPOCALCIO'").first();
 if(!before)fail('Primero debe aplicarse la migración aditiva.',503);
 const state={};const settings=Object.fromEntries((await all(db,'SELECT key,value FROM app_settings')).map(x=>[x.key,x.value]));
 state.config={baseDate:settings.baseDate||'2026-05-01',prealertDays:Number(settings.prealertDays||7),site:'HIPOCALCIO',masterSystem:settings.masterSystem||'SAP',supportSystem:settings.supportSystem||'Cloudflare D1'};
 for(const k of Object.keys(mappings))state[k]=(await all(db,'SELECT * FROM '+mappings[k].table+' ORDER BY id')).map(row=>fromRow(k,row));
 const thermal=Object.fromEntries((await all(db,"SELECT key,value FROM mp_meta WHERE key LIKE 'thermal-equipment:%'")).map(r=>[r.key,r.value]));
 for(const e of state.equipment)if(thermal['thermal-equipment:'+e.id]!==undefined)e.thermalConfig=thermal['thermal-equipment:'+e.id];
 await withThermalHistory(db,'HIPOCALCIO',state.equipment);
 const after=await stmt(db,"SELECT revision FROM mp_versions WHERE plant_id='HIPOCALCIO'").first();
 if(before.revision!==after.revision)fail('Los datos cambiaron durante la lectura. Recarga.');
 return {state,revision:before.revision};
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export async function saveLegacy(db,previous,next,revision,auditStatement){
 const token=crypto.randomUUID();
 const guard="EXISTS(SELECT 1 FROM mp_versions WHERE plant_id='HIPOCALCIO' AND token=?)";
 const operations=[stmt(db,"UPDATE mp_versions SET revision=revision+1,token=? WHERE plant_id='HIPOCALCIO' AND revision=?",[token,revision])];
 for(const e of next.equipment)if(e.thermalConfig!==undefined)operations.push(stmt(db,'INSERT INTO mp_meta(key,value) SELECT ?,? WHERE '+guard+' ON CONFLICT(key) DO UPDATE SET value=excluded.value',['thermal-equipment:'+e.id,e.thermalConfig,token]));
 // No se permiten eliminaciones en cascada de un equipo/rutina con histórico o asignaciones.
 for(const [section,ref] of [['equipment','equipmentId'],['routines','routineId']]){
  const remaining=new Set(next[section].map(x=>x.id));
  for(const row of previous[section])if(!remaining.has(row.id)&&(previous.records.some(r=>r[ref]===row.id)||previous.planAssignments.some(r=>r[ref]===row.id)))fail('No se puede eliminar un equipo o rutina con histórico/asignaciones. Conserva el registro y desactívalo.',400);
 }
 // Dependencias primero al insertar; al eliminar, descendientes primero.
 for(const section of Object.keys(mappings)){
  const existing=new Map(previous[section].map(x=>[x.id,x]));
  for(const row of next[section]){
   if(same(row,existing.get(row.id)))continue;
   const fields=pairs(section).filter(([key])=>key in row&&key!=='id');
   const columns=fields.map(([,column])=>column);
   const values=fields.map(([key])=>typeof row[key]==='boolean'?(row[key]?1:0):row[key]);
   if(existing.has(row.id))operations.push(stmt(db,'UPDATE '+mappings[section].table+' SET '+columns.map(c=>'"'+c+'"=?').join(',')+' WHERE id=? AND '+guard,[...values,row.id,token]));
   else operations.push(stmt(db,'INSERT INTO '+mappings[section].table+' (id,'+columns.map(c=>'"'+c+'"').join(',')+') SELECT '+[row.id,...values].map(()=>'?').join(',')+' WHERE '+guard,[row.id,...values,token]));
  }
 }
 for(const section of ['records','planAssignments','routines','equipment']){
  const nextIds=new Set(next[section].map(x=>x.id));
  for(const row of previous[section])if(!nextIds.has(row.id))operations.push(stmt(db,'DELETE FROM '+mappings[section].table+' WHERE id=? AND '+guard,[row.id,token]));
 }
 for(const key of ['baseDate','prealertDays','masterSystem','supportSystem'])if(previous.config[key]!==next.config[key])
  operations.push(stmt(db,'INSERT INTO app_settings(key,value) SELECT ?,? WHERE '+guard+' ON CONFLICT(key) DO UPDATE SET value=excluded.value',[key,String(next.config[key]),token]));
 // La auditoría se incluye en la misma transacción y solo si esta escritura adquirió la versión.
 const audit=auditStatement;
 operations.push(stmt(db,'INSERT INTO mp_audit(id,actor_id,action,plant_id,target_id,created_at) SELECT ?,?,?,?,?,? WHERE '+guard,[crypto.randomUUID(),audit.userId,'guardar_lubricacion','HIPOCALCIO','HIPOCALCIO',new Date().toISOString(),token]));
 const result=await db.batch(operations);
 if(Number(result[0].meta.changes)!==1)fail('Otro usuario modificó la planta. Recarga antes de guardar.');
 return revision+1;
}
