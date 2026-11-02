(function(root){
'use strict';
const E=typeof module!=='undefined'?require('./engine.js'):root.Invest;
const OWNER='local-demo-investor',ADMIN='operator-local-demo',SYSTEM='system-local-demo';
const uid=()=>Array.from(globalThis.crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');
const normalize=v=>String(v??'').normalize('NFKC').trim().toUpperCase();
function text(v,name,max=80){v=String(v??'').normalize('NFKC').trim();if(!v||v.length>max||/[\x00-\x1f\x7f]/.test(v))throw Error(name+' obligatorio, sin controles y de hasta '+max+' caracteres.');return v;}
function asset(s,id){const a=s.inventory.assets.find(a=>a.id===id);if(!a)throw Error('Activo no encontrado en este dispositivo.');return a;}
function binding(s,opId){return s.inventory.bindings.find(b=>b.investmentId===opId);}
function event(s,type,opId,assetId,actor,evidence,now=Date.now()){const e={id:uid(),type,investmentId:opId||null,assetId:assetId||null,actor,date:now,evidenceRef:uid(),evidence:text(evidence,'Evidencia',300)};s.inventory.events.push(e);return e;}
function register(s,opportunityId,code,serial,note,now=Date.now(),actor=ADMIN){
 note=text(note,'Evidencia',300);const p=s.opportunities.find(p=>p.id===opportunityId);if(!p||p.service)throw Error('Selecciona una impresora del catálogo DEMO.');
 code=text(code,'Código de inventario',40);serial=serial?text(serial,'Serie',60):null;
 if(s.inventory.assets.some(a=>normalize(a.code)===normalize(code)||a.opportunityId===p.id))throw Error('Código o unidad ya registrados.');
 if(serial&&s.inventory.assets.some(a=>a.serial&&normalize(a.serial)===normalize(serial)))throw Error('Número de serie ya registrado.');
 const a={id:uid(),token:uid(),opportunityId:p.id,brand:'Epson',model:p.title,code,serial,verifiedAt:null,createdAt:now};s.inventory.assets.push(a);
 event(s,'Equipo registrado',null,a.id,actor,note,now);return a;
}
function link(s,a,o,actor,note,now=Date.now()){note=text(note,'Evidencia',300);
 if(o.snapshot.service||a.opportunityId!==o.opportunity||a.model!==o.snapshot.title)throw Error('La unidad no corresponde al contrato.');
 if(binding(s,o.id)||s.inventory.bindings.some(b=>b.assetId===a.id))throw Error('Activo o inversión ya vinculados; no se permite doble asignación.');
 const b={assetId:a.id,investmentId:o.id,investorId:o.investorId||OWNER,investorCode:'USR-DEMO-LOCAL',capital:o.snapshot.capital,currency:'USD',start:o.start,contract:o.contract,assignedAt:now};s.inventory.bindings.push(b);
 event(s,'Impresora asignada',o.id,a.id,actor,note,now);return b;
}
function migrate(s,now=Date.now()){
 if(s.inventory){if(s.inventory.version!==1)throw Error('Inventario incompatible. No se modificaron los datos.');return false;}
 s.inventory={version:1,assets:[],bindings:[],events:[],labelJobs:[],readEvents:[]};
 for(const o of s.operations){
  let a=null;if(!o.snapshot.service){const p=s.opportunities.find(p=>p.id===o.opportunity);if(!p)throw Error('Contrato sin unidad; requiere revisión antes de migrar.');a=register(s,p.id,o.snapshot.unit,null,'Registro provisional migrado; serie y recepción física NO verificadas.',now,SYSTEM);link(s,a,o,SYSTEM,'Vínculo importado del contrato existente; no acredita recepción física.',now);}
  for(const h of o.history)event(s,'Histórico: '+E.stages[h.stage],o.id,a?.id,'legacy-actor-unknown','Referencia histórica '+o.id+' / etapa '+h.stage+': '+h.note,h.date);
 }
 return true;
}
function finance(s,id,accepted,now=Date.now(),actor=OWNER){
 const p=s.opportunities.find(p=>p.id===id);if(!p)throw Error('Oportunidad no encontrada.');
 if(s.operations.some(o=>normalize(o.snapshot.unit)===normalize(p.unit)))throw Error('Esta unidad ya está asociada a una inversión.');
 const o=E.finance(s,id,accepted,now),old=o.id;
 // New identifiers are random and never recycled; existing 0.1.1 identifiers stay unchanged.
 o.id='INV-'+uid();o.contract='CTR-'+uid();o.investorId=OWNER;
 for(const e of s.audit)if(e.operation===old)e.operation=o.id;
 let a;if(!p.service){a=s.inventory.assets.find(a=>a.opportunityId===id)||register(s,id,p.unit,null,'Ficha provisional creada desde el contrato DEMO.',now,SYSTEM);link(s,a,o,actor,'Contrato aceptado: '+o.contract,now);}
 event(s,'Capital confirmado · DEMO',o.id,a?.id,actor,'Aceptación del contrato '+o.contract,now);return o;
}
function serial(s,id,value,note,now=Date.now()){note=text(note,'Evidencia',220);
 const a=asset(s,id);if(a.verifiedAt)throw Error('La serie ya verificada no se cambia silenciosamente. Registra una incidencia.');
 value=text(value,'Serie',60);if(s.inventory.assets.some(x=>x.id!==id&&x.serial&&normalize(x.serial)===normalize(value)))throw Error('Número de serie ya registrado.');
 const old=a.serial;a.serial=value;event(s,'Serie registrada',s.inventory.bindings.find(b=>b.assetId===id)?.investmentId,id,ADMIN,note+' · Serie previa: '+(old||'sin registrar'),now);
}
function verify(s,id,note,now=Date.now()){note=text(note,'Evidencia',300);
 const a=asset(s,id),b=s.inventory.bindings.find(b=>b.assetId===id);if(!b||!a.serial)throw Error('Se requiere asignación y serie antes de verificar.');
 const o=E.get(s,b.investmentId);if(o.stage<1)throw Error('Registra primero la compra.');if(a.verifiedAt)throw Error('El equipo ya está verificado.');
 a.verifiedAt=now;event(s,'Equipo recibido y verificado',o.id,id,ADMIN,note,now);
}
function requireVerified(s,o){if(o.snapshot.service)return;const b=binding(s,o.id);if(!b||!asset(s,b.assetId).verifiedAt||!asset(s,b.assetId).serial)throw Error('Completa serie y verificación de recepción en Inventario antes de avanzar.');}
function transition(s,action,id,args,note,now=Date.now()){
 const o=E.get(s,id);note=text(note,'Evidencia administrativa',300);
 if(action==='advance'&&o.stage>=1||['collect','pay'].includes(action))requireVerified(s,o);
 if(action==='advance')E.advance(s,id,now);else if(action==='collect')E.collect(s,id,args.sale,args.expenses,args.confirmed,now);else if(action==='pay')E.pay(s,id,args.confirmed,now);else if(action==='hold')E.hold(s,id,args.reason,now);else throw Error('Transición no autorizada.');
 const types={0:'Capital confirmado',1:'Compra registrada',2:'Equipo recibido',3:'Equipo publicado para venta',4:'En proceso de venta',5:'Venta confirmada',6:'Liquidación en revisión',7:'Liquidación pagada · DEMO'};
 event(s,action==='hold'?'Incidencia de liquidación':types[o.stage],id,binding(s,id)?.assetId,ADMIN,note,now);
}
function incident(s,id,note,now=Date.now()){const a=asset(s,id);event(s,'Incidencia de equipo',s.inventory.bindings.find(b=>b.assetId===id)?.investmentId,id,ADMIN,note,now);a.incident=true;}
function days(o,now=Date.now()){return Math.max(0,Math.floor((now-o.start)/E.DAY));}
function review90(s,now=Date.now()){let changed=false;for(const o of s.operations)if(o.stage<5&&now>=o.due&&!s.inventory.events.some(e=>e.investmentId===o.id&&e.type==='Día 90 alcanzado')){event(s,'Día 90 alcanzado',o.id,binding(s,o.id)?.assetId,SYSTEM,'Revisión ordinaria; no genera ganancias ni devolución automática.',now);changed=true;}return changed;}
function token(value){const match=/^(?:laexinvest-demo:\/\/asset\/)?([a-f0-9]{32})$/.exec(String(value).trim());if(!match)throw Error('QR ajeno o formato no válido.');return match[1];}
function resolve(s,value,owner,admin=false){const a=s.inventory.assets.find(a=>a.token===token(value));const b=a&&s.inventory.bindings.find(b=>b.assetId===a.id);if(!a||(!admin&&(!b||b.investorId!==owner)))throw Error('Ficha no disponible para este perfil en este dispositivo.');return a;}
function label(s,id){const a=asset(s,id),b=s.inventory.bindings.find(b=>b.assetId===id);if(!b)throw Error('Asigna una inversión antes de generar la etiqueta.');return {...b,model:a.model,code:a.code,serial:a.serial,provisional:!a.serial||!a.verifiedAt,qr:'laexinvest-demo://asset/'+a.token};}
function job(s,id,mode,width,height,now=Date.now()){
 if(!['pdf','print'].includes(mode)||!Number.isFinite(width)||!Number.isFinite(height)||width<100||width>150||height<75||height>200)throw Error('Etiqueta entre 100–150 mm de ancho y 75–200 mm de alto.');
 const data=label(s,id),j={id:uid(),assetId:id,mode,width,height,date:now,status:'requested',snapshot:data};const prior=s.inventory.labelJobs.filter(j=>j.assetId===id).length;s.inventory.labelJobs.push(j);
 event(s,prior?'Reimpresión / copia solicitada':'Etiqueta solicitada',data.investmentId,id,ADMIN,'Solicitud '+j.id+' · '+mode+' · '+width+' x '+height+' mm. No acredita impresión física.',now);return j;
}
function jobResult(s,id,status,now=Date.now()){const j=s.inventory.labelJobs.find(j=>j.id===id);if(!j||j.status===status||!['requested','spooled'].includes(j.status)||!['saved','spooled','completed','canceled','failed'].includes(status))return false;j.status=status;event(s,'Etiqueta: '+status,j.snapshot.investmentId,j.assetId,SYSTEM,'Resultado del sistema para solicitud '+id+'. Completed indica sistema de impresión, no inspección del papel.',now);return true;}
const api={OWNER,ADMIN,SYSTEM,uid,normalize,asset,binding,event,migrate,register,link,finance,serial,verify,transition,incident,days,review90,token,resolve,label,job,jobResult};if(typeof module!=='undefined')module.exports=api;else root.InvestInventory=api;
})(typeof window!=='undefined'?window:globalThis);
