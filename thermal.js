// Termografía multipunto. Sin límites técnicos predeterminados.
const escapeText=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function thermalState(p){
 if(p.temperature===null)return 'No medido';
 if(!p.criteria||!p.comparable)return 'Sin evaluar';
 const delta=p.temperature-p.criteria.base;
 return delta>=p.criteria.critical?'Crítica':delta>=p.criteria.alarm?'Alarma':delta>=p.criteria.watch?'Observación':'Normal';
}
export function validateThermal(input){
 const fail=m=>{throw Object.assign(new Error(m),{status:400});};
 const text=(v,label,max=500)=>{if(typeof v!=='string'||!v.trim()||v.length>max)fail('Completa '+label);return v.trim();};
 const number=(v,label)=>{if(typeof v!=='number'||!Number.isFinite(v))fail('Valor inválido: '+label);return v;};
 if(!Array.isArray(input)||!input.length||input.length>100)fail('Registra entre 1 y 100 puntos');
 const ids=new Set(),names=new Set();
 return input.map(raw=>{
  const id=text(raw.id,'identificador del punto',100),name=text(raw.name,'nombre del punto',150);
  if(ids.has(id)||names.has(name.toUpperCase()))fail('No repitas identificadores ni nombres de puntos');ids.add(id);names.add(name.toUpperCase());
  const temperature=raw.temperature===null?null:number(raw.temperature,'temperatura');if(temperature!==null&&temperature< -273.15)fail('Temperatura imposible');
  const note=typeof raw.note==='string'?raw.note.trim():'';if(note.length>2000)fail('Observación demasiado larga');if(temperature===null&&!note)fail('Explica por qué no se midió el punto '+name);
  let criteria=null;
  if(raw.criteria){const c=raw.criteria;criteria={base:number(c.base,'base'),watch:number(c.watch,'observación'),alarm:number(c.alarm,'alarma'),critical:number(c.critical,'crítica'),reference:text(c.reference,'criterio y condiciones de referencia',2000)};if(criteria.base< -273.15||!(criteria.watch>0&&criteria.watch<criteria.alarm&&criteria.alarm<criteria.critical))fail('Los incrementos deben ser positivos: observación < alarma < crítica');}
  return {id,name,temperature,note,comparable:raw.comparable===true,criteria};
 });
}
function readings(records,equipmentId,pointId){return records.filter(r=>r.data.technique==='Termografía'&&r.data.equipmentId===equipmentId).flatMap(r=>(r.data.thermalPoints||[]).filter(p=>p.id===pointId).map(p=>({...p,date:r.data.date}))).sort((a,b)=>a.date.localeCompare(b.date));}
function trendHTML(rows){
 if(!rows.length)return '<p>Todavía no hay lecturas guardadas de este punto.</p>';
 const measured=rows.filter(p=>p.temperature!==null),vals=measured.map(p=>p.temperature);let graph='';
 if(vals.length){const lo=Math.min(...vals)-2,hi=Math.max(...vals)+2,x=i=>50+i*490/Math.max(1,vals.length-1),y=v=>150-(v-lo)/(hi-lo)*110;
 graph=`<svg viewBox="0 0 600 200" role="img" aria-label="Tendencia térmica del punto" style="width:100%;max-width:800px"><text x="0" y="35">${hi} °C</text><text x="0" y="155">${lo} °C</text><polyline fill="none" stroke="#2563eb" stroke-width="2" points="${vals.map((v,i)=>`${x(i)},${y(v)}`).join(' ')}"/>${measured.map((r,i)=>`<circle cx="${x(i)}" cy="${y(r.temperature)}" r="4" fill="#2563eb"><title>${r.date}: ${r.temperature} °C</title></circle>`).join('')}<text x="50" y="185">${escapeText(measured[0].date)}</text><text x="450" y="185">${escapeText(measured.at(-1).date)}</text></svg>`;}
 return graph+'<p class="field-help">Muestras ordenadas por fecha; separación no proporcional al tiempo. Los estados usan el criterio guardado con cada inspección. No comparar condiciones incompatibles.</p><div class="table-wrap"><table><thead><tr><th>Fecha</th><th>°C</th><th>Base °C</th><th>Δ °C</th><th>Criticidad térmica</th><th>Observación</th></tr></thead><tbody>'+rows.map(p=>`<tr><td>${escapeText(p.date)}</td><td>${p.temperature??'No medido'}</td><td>${p.criteria?.base??'—'}</td><td>${p.temperature!==null&&p.criteria?(p.temperature-p.criteria.base).toFixed(1):'—'}</td><td>${thermalState(p)}</td><td>${escapeText(p.note)}</td></tr>`).join('')+'</tbody></table></div>';
}
export function thermalSummary(points){return points.map(p=>({name:p.name,value:`${p.temperature===null?'No medido':p.temperature+' °C'} | ${thermalState(p)} | Base: ${p.criteria?.base??'sin definir'} | Δ observación/alarma/crítica: ${p.criteria?[p.criteria.watch,p.criteria.alarm,p.criteria.critical].join('/'):'sin definir'} | Criterio: ${p.criteria?.reference||''} | ${p.note}`,unit:''}));}
export function thermalHistory(records,catalog){
 const section=document.createElement('section');section.className='panel';section.innerHTML='<h3>Tendencia y criticidad por punto</h3>';const groups=new Map();
 for(const r of records)for(const p of r.data.thermalPoints||[]){const key=JSON.stringify([r.data.equipmentId,p.id]);if(!groups.has(key))groups.set(key,{equipment:r.data.equipmentId,id:p.id,label:`${catalog.find(e=>e.id===r.data.equipmentId)?.code||r.data.equipment} · ${p.name}`});}
 if(!groups.size){section.insertAdjacentHTML('beforeend','<p>Registra una inspección con puntos para ver sus tendencias.</p>');return section;}
 const select=document.createElement('select');select.setAttribute('aria-label','Equipo y punto termográfico');const body=document.createElement('div');for(const [key,g] of groups){const option=document.createElement('option');option.value=key;option.textContent=g.label;select.append(option);}select.onchange=()=>{const g=groups.get(select.value);body.innerHTML=trendHTML(readings(records,g.equipment,g.id));};section.append(select,body);select.onchange();return section;
}
export function mountThermal(root,{data,records,equipmentId,admin,writable,catalog=[],saveConfiguration}){
 let points=[],saving=false;
 const historicalIds=new Set((data?.thermalPoints||[]).map(p=>p.id));
 async function persistPoints(){
  if(data?.thermalPoints)return;
  if(saving)throw new Error("Espera a que termine de guardar los puntos.");
  const equipment=catalog.find(e=>e.id===equipmentId);if(!equipment)throw new Error("Selecciona un equipo.");
  const values=capture(),names=new Set();
  const active=values.map(p=>{const name=p.name.trim();if(!name||names.has(name.toUpperCase()))throw new Error("Completa nombres únicos para los puntos.");names.add(name.toUpperCase());return {id:p.id,name,active:true};});
  const previous=equipment.thermalConfig?JSON.parse(equipment.thermalConfig):[];
  const configuration=[...previous.filter(p=>!active.some(n=>n.id===p.id)).map(p=>({...p,active:false})),...active];
  if(JSON.stringify(configuration)===equipment.thermalConfig)return;
  saving=true;const controls=[...root.querySelectorAll("input,button"),root.ownerDocument.querySelector("[name=equipmentId]"),root.ownerDocument.querySelector("#saveRecord")].filter(Boolean),disabled=controls.map(c=>c.disabled);controls.forEach(c=>c.disabled=true);
  try{await saveConfiguration(equipment,configuration);equipment.thermalConfig=JSON.stringify(configuration);equipment.thermalRevision=equipment.thermalConfig;}finally{saving=false;controls.forEach((c,i)=>c.disabled=disabled[i]);}
 }

 const num=(v)=>v===''?null:Number(v);
 function capture(){return [...root.querySelectorAll('[data-tpoint]')].map(row=>{const get=n=>row.querySelector(`[data-field=${n}]`),original=points.find(p=>p.id===row.dataset.tpoint);return {missing:get('missing').checked,id:original.id,name:get('name').value,temperature:get('missing').checked?null:num(get('temperature').value),note:get('note').value,comparable:get('comparable').checked,criteria:admin?(get('approved').checked?{base:num(get('base').value),watch:num(get('watch').value),alarm:num(get('alarm').value),critical:num(get('critical').value),reference:get('reference').value}:null):original.criteria};});}
 function field(n,label,value='',type='text',disabled=false){return `<label>${label}<input data-field="${n}" type="${type}" ${type==='number'?'step="any"':''} value="${escapeText(value??'')}" ${disabled?'disabled':''}></label>`;}
 function draw(){root.innerHTML='<div class="full"><h3>Puntos de medición</h3><p class="field-help">Agrega o quita los puntos aquí. Guarda solo los puntos para preparar el equipo sin registrar lecturas. Al guardar el análisis también se guardan los puntos. Quitar un punto de una nueva inspección no borra su histórico.</p><button type="button" id="addThermalPoint" '+(!writable?'disabled':'')+'>+ Agregar punto</button>'+(!data?.thermalPoints?'<button type="button" id="saveThermalPoints" '+(!writable?'disabled':'')+'>Guardar solo puntos</button>':'')+'<p id="thermalPointsMessage" role="status"></p></div>'+points.map(p=>`<section class="panel full" data-tpoint="${escapeText(p.id)}"><button type="button" data-remove-point ${!writable||historicalIds.has(p.id)?'disabled':''}>Quitar punto</button>${historicalIds.has(p.id)?'<p class="field-help">Este punto pertenece al registro guardado. Para conservar su histórico, no se puede quitar al editarlo.</p>':''}<div class="grid">${field('name','Nombre / ubicación del punto',p.name,'text',!writable)}${field('temperature','Temperatura (°C)',p.temperature,'number',!writable||p.temperature===null&&p.missing)}<label class="check"><input data-field="missing" type="checkbox" ${p.missing?'checked':''} ${!writable?'disabled':''}>No medido</label>${field('note','Observación / motivo',p.note,'text',!writable)}<label class="check full"><input data-field="comparable" type="checkbox" ${p.comparable?'checked':''} ${!writable?'disabled':''}>Condiciones comparables con la referencia aprobada</label><p class="full" data-evaluation></p><details class="full"><summary>Línea base y criterios de este punto</summary><p class="field-help">Solo el administrador aprueba estos criterios con respaldo técnico. No hay límites predeterminados. Los valores de alerta son incrementos de temperatura respecto de la base, no temperaturas absolutas. No equivale a criticidad del activo.</p><div class="grid">${field('base','Base (°C)',p.criteria?.base,'number',!admin||!writable)}${field('watch','Incremento para observación (°C)',p.criteria?.watch,'number',!admin||!writable)}${field('alarm','Incremento para alarma (°C)',p.criteria?.alarm,'number',!admin||!writable)}${field('critical','Incremento para crítica (°C)',p.criteria?.critical,'number',!admin||!writable)}${field('reference','Criterio, condiciones y referencia técnica',p.criteria?.reference,'text',!admin||!writable)}<label class="check"><input data-field="approved" type="checkbox" ${p.criteria?'checked':''} ${!admin||!writable?'disabled':''}>Apruebo el criterio para este punto</label></div></details><details class="full"><summary>Ver tendencia de este punto</summary>${trendHTML(readings(records,equipmentId,p.id))}</details></div></section>`).join('');
 root.querySelectorAll('[data-tpoint]').forEach(row=>{row.querySelector('[data-remove-point]').onclick=()=>{if(saving)return;if(points.length===1){root.querySelector('#thermalPointsMessage').textContent='Conserva al menos un punto.';return;}points=capture().filter(p=>p.id!==row.dataset.tpoint);draw();};const update=()=>{const missing=row.querySelector('[data-field=missing]').checked;row.querySelector('[data-field=temperature]').disabled=!writable||missing;const point=capture().find(p=>p.id===row.dataset.tpoint);let message='Sin evaluar';try{if(!missing&&point.temperature===null)message='Pendiente de lectura';else message=thermalState(validateThermal([point])[0]);}catch{message='Sin evaluar · revisa los campos del punto';}row.querySelector('[data-evaluation]').textContent='Criticidad térmica: '+message;};row.querySelectorAll('input').forEach(e=>e.addEventListener('input',update));update();});
 const saveButton=root.querySelector('#saveThermalPoints');if(saveButton)saveButton.onclick=async()=>{const message=root.querySelector('#thermalPointsMessage');try{await persistPoints();message.textContent='Puntos guardados. No se han creado lecturas.';}catch(e){message.textContent=e.message;}};
 root.querySelector('#addThermalPoint').onclick=()=>{points=capture();if(points.length>=100)return;points.push({id:crypto.randomUUID(),name:'Punto '+(points.length+1),temperature:null,note:'',criteria:null,comparable:false,missing:false});draw();};}
 function loadEquipment(id){equipmentId=id;const latest=records.filter(r=>r.data.technique==='Termografía'&&r.data.equipmentId===id&&r.data.thermalPoints).sort((a,b)=>(b.updated_at||'').localeCompare(a.updated_at||''))[0];
 const config=catalog.find(e=>e.id===id)?.thermalConfig;
 if(!data?.thermalPoints&&config!==undefined){points=JSON.parse(config).filter(p=>p.active).map(p=>({id:p.id,name:p.name,temperature:null,note:'',criteria:latest?.data.thermalPoints.find(old=>old.id===p.id)?.criteria||null,comparable:false,missing:false}));if(!points.length)points=[{id:crypto.randomUUID(),name:'Punto 1',temperature:null,note:'',criteria:null,comparable:false,missing:false}];draw();return;}
 const source=data?.thermalPoints||latest?.data.thermalPoints;points=source?structuredClone(source).map(p=>({...p,temperature:data?.thermalPoints?p.temperature:null,note:data?.thermalPoints?p.note:'',comparable:data?.thermalPoints?p.comparable:false,missing:data?.thermalPoints?p.temperature===null:false})):['Punto 1'].map(name=>({id:crypto.randomUUID(),name,temperature:null,note:'',criteria:null,comparable:false,missing:false}));draw();}
 loadEquipment(equipmentId);return {read:async()=>{const values=capture();if(values.some(p=>!p.missing&&p.temperature===null))throw new Error('Ingresa la temperatura o marca No medido en cada punto');const validated=validateThermal(values);await persistPoints();return validated;},loadEquipment};
}
