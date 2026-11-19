// Catálogo de puntos por equipo. Los puntos retirados conservan su identidad.
export function parseThermalConfig(value){
 const fail=()=>{throw Object.assign(new Error('Puntos térmicos inválidos: usa nombres únicos y hasta 100 puntos.'),{status:400});};
 let points;try{points=JSON.parse(value);}catch{fail();}
 if(!Array.isArray(points)||points.length>100)fail();
 const ids=new Set(),names=new Set();
 return points.map(p=>{
  if(!p||typeof p.id!=='string'||!p.id||p.id.length>100||ids.has(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>150||typeof p.active!=='boolean')fail();
  const name=p.name.trim(),key=name.toUpperCase();if(p.active&&names.has(key))fail();ids.add(p.id);if(p.active)names.add(key);
  return {id:p.id,name,active:p.active};
 });
}
export async function withThermalHistory(db,plant,equipment){
 // Equipos anteriores: recuperar identidades existentes, nunca regenerarlas.
 const pending=equipment.filter(e=>e.thermalConfig===undefined);if(!pending.length)return equipment;
 const records=(await db.prepare("SELECT data FROM mp_items WHERE plant_id=? AND kind='medicion' ORDER BY updated_at DESC,id DESC").bind(plant).all()).results||[];
 for(const e of pending){const points=new Map();for(const r of records){const d=JSON.parse(r.data);if(d.technique!=='Termografía'||d.equipmentId!==e.id)continue;for(const p of d.thermalPoints||[])if(!points.has(p.id))points.set(p.id,{id:p.id,name:p.name,active:true});}if(points.size)e.thermalConfig=JSON.stringify([...points.values()]);}
 return equipment;
}
