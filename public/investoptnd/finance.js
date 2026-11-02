(function(root){
'use strict';
const E=typeof module!=='undefined'?require('./engine.js'):root.Invest,I=typeof module!=='undefined'?require('./inventory.js'):root.InvestInventory;
const RATE=100000000n,OWNER=I.OWNER,ADMIN=I.ADMIN;
// These identifiers are deliberately NOT addresses, contracts or real networks.
const catalog=['USDT','OMD','OMDB'].map(symbol=>Object.freeze({id:symbol+'-DEMO',symbol,network:'SIM-'+symbol+'-01',chainId:null,contract:'DEMO-CONTRACT-'+symbol,decimals:symbol==='USDT'?6:18,realVerified:false,simulationOnly:true}));
function asset(id){const a=catalog.find(a=>a.id===id);if(!a)throw Error('Activo o red fuera del catálogo simulado.');return a;}
function admin(actor){if(actor!==ADMIN)throw Error('Operación reservada al administrador.');}
function note(v){v=String(v||'').trim();if(!v||v.length>300)throw Error('Evidencia obligatoria de hasta 300 caracteres.');return v;}
function units(v,decimals){v=String(v).trim();if(!/^\d{1,12}(\.\d+)?$/.test(v))throw Error('Cantidad decimal positiva, sin exponentes ni comas.');const [whole,fraction='']=v.split('.');if(fraction.length>decimals)throw Error('Demasiados decimales para el activo DEMO.');return BigInt(whole)*10n**BigInt(decimals)+BigInt(fraction.padEnd(decimals,'0')||'0');}
function amount(value,decimals){const n=BigInt(value),scale=10n**BigInt(decimals),fraction=(n%scale).toString().padStart(decimals,'0').replace(/0+$/,'');return (n/scale).toString()+(fraction?'.'+fraction:'');}
function rate(value){const r=units(value,8);if(r<=0n)throw Error('Cotización DEMO mayor que cero.');return r;}
function rounded(a,b){return (a+b/2n)/b;}
function cents(value,decimals,q){const n=rounded(BigInt(value)*BigInt(q)*100n,10n**BigInt(decimals)*RATE);if(n>100000000n)throw Error('Valor de referencia fuera del límite DEMO.');return Number(n);}
function fromCents(value,decimals,q){return rounded(BigInt(value)*10n**BigInt(decimals)*RATE,100n*BigInt(q));}
function audit(s,type,opId,actor,evidence,now=Date.now()){const e={id:I.uid(),type,investmentId:opId,actor,evidence:note(evidence),date:now};s.finance.audit.push(e);I.event(s,type,opId,I.binding(s,opId)?.assetId,actor,evidence,now);return e;}
function migrate(s){if(s.finance){if(s.finance.version!==1)throw Error('Registro financiero incompatible.');return false;}s.finance={version:1,orders:[],credits:[],settlements:[],adjustments:[],audit:[],exports:[]};return true;}
function order(s,id){const x=s.finance.orders.find(x=>x.id===id);if(!x)throw Error('Orden no encontrada.');return x;}
function investmentOrder(s,id){return s.finance.orders.find(x=>x.investmentId===id&&x.status==='confirmed');}
function configure(s,id,capital,share,actor,now=Date.now()){admin(actor);const p=s.opportunities.find(x=>x.id===id);if(!p)throw Error('Oportunidad no encontrada.');const before={capital:p.capital,share:p.share};E.configure(s,id,capital,share,now);s.finance.termVersions??=[];s.finance.termVersions.push({id:I.uid(),opportunity:id,version:s.finance.termVersions.filter(x=>x.opportunity===id).length+1,before,after:{capital,share},actor,date:now});}
function createOrder(s,opId,terms,accepted,actor=OWNER,now=Date.now()){
 const o=E.get(s,opId);if((o.investorId||OWNER)!==actor||!accepted)throw Error('Solo el perfil titular puede aceptar los términos simulados.');
 if(s.finance.orders.some(x=>x.investmentId===opId&&x.status!=='canceled'))throw Error('La inversión ya tiene una orden activa o conciliada.');
 const a=asset(terms.assetId),payout=asset(terms.settlementAssetId),qty=units(terms.quantity,a.decimals),q=rate(terms.rate);
 if(qty<=0n||cents(qty,a.decimals,q)!==o.snapshot.capital)throw Error('La cantidad y cotización deben corresponder al capital contractual en USD.');
 if(!['company','investor'].includes(terms.feePayer))throw Error('Define quién asume la comisión DEMO.');
 const id='ORD-'+I.uid(),r={id,reference:'REF-'+I.uid(),investmentId:opId,investorId:actor,assetId:a.id,network:a.network,chainId:null,contract:a.contract,contractVerification:'SIMULATION_ONLY_NOT_REAL',quantityUnits:qty.toString(),referenceCents:o.snapshot.capital,rate:q.toString(),quotedAt:now,reception:'DEMO-RECEIVE:'+id,status:'pending',createdAt:now,terms:{version:1,accountCurrency:'USD',settlementAssetId:payout.id,feePayer:terms.feePayer,share:o.snapshot.share,contract:o.contract,capital:o.snapshot.capital,valuation:'Cotización ficticia registrada al aporte y nueva cotización ficticia al calcular liquidación.',volatility:'La cantidad del token de salida puede variar. Sin precio fijo, liquidez ni rentabilidad garantizada.',rounding:'Átomo más cercano; equivalente USD redondeado al centavo. Diferencias conservadas.',acceptedAt:now,acceptedBy:actor}};
 s.finance.orders.push(r);audit(s,'Orden de aporte DEMO creada',opId,actor,'Aceptación de anexo v1; '+r.reference,now);return r;
}
function cancelOrder(s,id,actor,reason,now=Date.now()){const r=order(s,id);if(actor!==ADMIN&&actor!==r.investorId)throw Error('Perfil no autorizado.');if(r.status!=='pending')throw Error('No se cancela capital ya conciliado.');reason=note(reason);r.status='canceled';audit(s,'Orden DEMO cancelada',r.investmentId,actor,reason,now);}
function reconcile(s,id,proof,actor,now=Date.now()){
 admin(actor);const r=order(s,id);if(r.status==='confirmed')throw Error('Orden ya conciliada; no se registra una segunda entrada.');if(r.status!=='pending')throw Error('Orden inactiva.');const evidence=note(proof.evidence),a=asset(r.assetId);
 const fail=reason=>{audit(s,'Conciliación rechazada',r.investmentId,actor,reason+' · '+evidence,now);return {ok:false,reason};};
 if(proof.reference!==r.reference||proof.investorId!==r.investorId||proof.assetId!==r.assetId||proof.network!==r.network||proof.contract!==r.contract||proof.reception!==r.reception)return fail('La identidad completa no coincide con la orden.');
 if(!/^DEMO-TX-IN-[a-f0-9]{32}$/.test(proof.hash))return fail('Solo se aceptan hashes ficticios DEMO-TX-IN.');
 if(s.finance.orders.some(o=>o.hash===proof.hash))return fail('Hash ficticio ya utilizado.');
 let qty;try{qty=units(proof.quantity,a.decimals);}catch{return fail('Cantidad no válida.');}if(qty.toString()!==r.quantityUnits)return fail('Cantidad distinta de la solicitada.');if(!proof.confirmed)return fail('Confirma explícitamente la evidencia ficticia.');
 r.hash=proof.hash;r.status='confirmed';r.confirmedAt=now;r.allocatedUnits=r.quantityUnits;r.allocatedTo=I.binding(s,r.investmentId)?.assetId||E.get(s,r.investmentId).snapshot.unit;
 audit(s,'Entrada conciliada y asignada · DEMO',r.investmentId,actor,evidence,now);return {ok:true};
}
function compute(s,opId){const o=E.get(s,opId),changes=s.finance.adjustments.filter(a=>a.investmentId===opId);let refunds=0,extra=0,canceled=false;for(const a of changes){if(a.type==='refund')refunds+=a.cents;if(a.type==='expense')extra+=a.cents;if(a.type==='cancel-sale')canceled=true;if(a.type==='restore-sale')canceled=false;}const known=o.stage>=5&&!canceled;const sale=Math.max(0,(o.actualSale||0)-refunds),expenses=(o.actualExpenses||0)+extra;return {known,canceled,refunds,extra,sale,expenses,revision:changes.length,pendingReview:changes.some(a=>!a.reviewed),result:known?E.estimate(o.snapshot.capital,sale,expenses,o.snapshot.share):null,netProceeds:known?Math.max(0,sale-expenses):0};}
function adjust(s,opId,type,value,evidence,actor,now=Date.now()){
 admin(actor);const o=E.get(s,opId),c=compute(s,opId);evidence=note(evidence);if(o.stage<5||!['refund','expense','cancel-sale','restore-sale'].includes(type))throw Error('Ajuste permitido solo tras registrar un cobro.');
 const n=['refund','expense'].includes(type)?E.cents(value):0;if(['refund','expense'].includes(type)&&n<=0)throw Error('Importe del ajuste mayor que cero.');if(type==='refund'&&c.refunds+n>o.actualSale)throw Error('La devolución supera el cobro registrado.');if(type==='restore-sale'&&!c.canceled)throw Error('No hay venta anulada que restablecer.');if(type==='cancel-sale'&&c.canceled)throw Error('Venta ya anulada.');if(c.expenses+(type==='expense'?n:0)>100000000)throw Error('Gastos fuera de límite.');
 s.finance.adjustments.push({id:I.uid(),investmentId:opId,type,cents:n,evidence,actor,date:now,reviewed:false});
 for(const p of s.finance.settlements)if(p.investmentId===opId&&['calculated','reviewed','approved'].includes(p.status))p.status='invalidated';
 audit(s,'Ajuste financiero: '+type,opId,actor,evidence,now);
}
function reviewChanges(s,opId,evidence,actor,now=Date.now()){admin(actor);evidence=note(evidence);for(const a of s.finance.adjustments)if(a.investmentId===opId)a.reviewed=true;audit(s,'Ajustes revisados; sin alterar contrato',opId,actor,evidence,now);}
function credit(s,opId,data,actor,now=Date.now()){
 admin(actor);const o=E.get(s,opId),c=compute(s,opId),a=asset(data.assetId),q=rate(data.rate),qty=units(data.quantity,a.decimals),evidence=note(data.evidence);if(!c.known||!o.liquidable||c.pendingReview)throw Error('Cobro e incidencias deben estar revisados.');if(qty<=0n)throw Error('Liquidez mayor que cero.');
 const ref=cents(qty,a.decimals,q),prior=s.finance.credits.filter(x=>x.investmentId===opId&&!x.voided).reduce((n,x)=>n+x.referenceCents,0);if(ref<=0||prior+ref>c.netProceeds)throw Error('La liquidez registrada supera la venta neta de ESTA inversión.');
 if(!/^DEMO-SALE-[a-f0-9]{32}$/.test(data.reference)||s.finance.credits.some(x=>x.reference===data.reference))throw Error('Comprobante de venta ficticio inválido o repetido.');
 const x={id:I.uid(),investmentId:opId,assetId:a.id,quantityUnits:qty.toString(),rate:q.toString(),referenceCents:ref,reference:data.reference,evidence,date:now,source:'sale-proceeds-only'};s.finance.credits.push(x);audit(s,'Liquidez de venta propia · DEMO',opId,actor,evidence,now);return x;
}
function voidCredit(s,id,evidence,actor,now=Date.now()){admin(actor);const x=s.finance.credits.find(x=>x.id===id);evidence=note(evidence);if(!x||x.voided)throw Error('Crédito no disponible.');if(s.finance.settlements.some(p=>p.investmentId===x.investmentId&&['sent','confirmed'].includes(p.status)))throw Error('Hay un pago enviado/confirmado; requiere conciliación posterior, no borrado de liquidez.');x.voided=true;audit(s,'Crédito de venta anulado con historial',x.investmentId,actor,evidence,now);}
function available(s,opId,assetId){const credits=s.finance.credits.filter(x=>x.investmentId===opId&&x.assetId===assetId&&!x.voided).reduce((n,x)=>n+BigInt(x.quantityUnits),0n);const used=s.finance.settlements.filter(p=>p.investmentId===opId&&p.assetId===assetId&&['sent','confirmed'].includes(p.status)).reduce((n,p)=>n+BigInt(p.requiredUnits),0n);return credits-used;}
function calculate(s,opId,data,actor,now=Date.now()){
 admin(actor);const o=E.get(s,opId),r=investmentOrder(s,opId),c=compute(s,opId),evidence=note(data.evidence);if(!r)throw Error('Primero concilia el aporte de esta inversión.');if(!c.known||!o.liquidable||c.pendingReview||o.stage===7)throw Error('La operación no está disponible para una nueva liquidación.');if(s.finance.settlements.some(p=>p.investmentId===opId&&!['invalidated','failed'].includes(p.status)))throw Error('Ya existe una liquidación activa o pagada.');
 if(!o.snapshot.service){const b=I.binding(s,opId),a=b&&I.asset(s,b.assetId);if(!a||!a.serial||!a.verifiedAt)throw Error('Completa la serie y verifica la recepcion del equipo.');}const a=asset(r.terms.settlementAssetId),q=rate(data.rate),gross=fromCents(c.result.payout,a.decimals,q),fee=units(data.fee,a.decimals),net=r.terms.feePayer==='investor'?gross-fee:gross,required=r.terms.feePayer==='company'?gross+fee:gross;
 if(net<0n)throw Error('La comisión supera la liquidación.');const reference=cents(net,a.decimals,q);
 // Preserve the original engine and its receipt checks; only move 5 -> 6 here.
 if(o.stage===5)I.transition(s,'advance',opId,{},evidence,now);
 const p={id:'PAY-'+I.uid(),investmentId:opId,orderId:r.id,contract:o.contract,assetId:a.id,network:a.network,contractRef:a.contract,status:'calculated',revision:c.revision,result:{...c.result},grossUnits:gross.toString(),feeUnits:fee.toString(),netUnits:net.toString(),requiredUnits:required.toString(),referenceCents:c.result.payout,netReferenceCents:reference,rate:q.toString(),quotedAt:now,feePayer:r.terms.feePayer,roundingDifferenceCents:reference-c.result.payout+(r.terms.feePayer==='investor'?cents(fee,a.decimals,q):0),date:now,history:[{status:'calculated',date:now,actor,evidence}]};s.finance.settlements.push(p);audit(s,'Liquidación calculada · no exigible automáticamente',opId,actor,evidence,now);return p;
}
function payment(s,id,next,evidence,actor,now=Date.now()){
 admin(actor);const p=s.finance.settlements.find(p=>p.id===id);if(!p)throw Error('Liquidación no encontrada.');evidence=note(evidence);const o=E.get(s,p.investmentId),c=compute(s,o.id),allowed={calculated:'reviewed',reviewed:'approved',approved:'sent',sent:'confirmed'};
 if(next==='failed'){if(p.status!=='sent')throw Error('Solo una simulación enviada puede rechazarse.');p.status='failed';p.history.push({status:next,date:now,actor,evidence});audit(s,'Envío ficticio rechazado; reserva liberada',o.id,actor,evidence,now);return;}
 if(allowed[p.status]!==next)throw Error('Transición inválida o pago duplicado.');
 if(next!=='confirmed'&&(!c.known||!o.liquidable||c.pendingReview||c.revision!==p.revision))throw Error('Resultado cambiado o retenido; requiere nueva revisión.');
 if(next==='sent'){
  const credited=s.finance.credits.filter(x=>x.investmentId===o.id&&!x.voided).reduce((n,x)=>n+x.referenceCents,0);if(credited>c.netProceeds)throw Error('Liquidez incompatible con ajustes actuales; concilia sus créditos.');
  if(available(s,o.id,p.assetId)<BigInt(p.requiredUnits))throw Error('Falta liquidez de la venta de ESTA inversión. No se usa capital de otros inversionistas.');
  p.hash='DEMO-TX-OUT-'+I.uid();p.reception='DEMO-PAYOUT:'+o.id;
 }
 if(next==='confirmed'){
  // An in-flight simulated obligation stays frozen even if a later adjustment is reported.
  if(o.stage!==6)throw Error('Operación ya pagada o estado incompatible.');
  E.pay(s,o.id,true,now);I.event(s,'Liquidación pagada · DEMO',o.id,I.binding(s,o.id)?.assetId,actor,evidence,now);p.confirmedAt=now;
 }
 p.status=next;p.history.push({status:next,date:now,actor,evidence});audit(s,'Liquidación DEMO: '+next,o.id,actor,evidence,now);
}
function portfolio(s){const operations=s.operations.filter(o=>(o.investorId||OWNER)===OWNER);const t={committed:0,active:0,printers:0,gains:0,losses:0,pending:0,paid:0,returned:0,available:0,unpriced:0,operations};for(const o of operations){const c=compute(s,o.id);t.committed+=o.stage<7?o.snapshot.capital:0;t.active+=o.stage<7?1:0;t.printers+=o.snapshot.service?0:1;if(!c.known)t.unpriced++;else{t.gains+=c.result.profit;t.losses+=c.result.loss;if(o.stage<7)t.pending+=c.result.payout;}if(o.stage===7){const p=s.finance.settlements.find(p=>p.investmentId===o.id&&p.status==='confirmed'),old=E.estimate(o.snapshot.capital,o.actualSale,o.actualExpenses,o.snapshot.share);t.paid+=p?p.netReferenceCents:old.payout;t.returned+=p?p.result.recovered:old.recovered;}}return t;}
function totals(s){return catalog.map(a=>{const orders=s.finance.orders.filter(r=>r.assetId===a.id),sum=status=>orders.filter(r=>r.status===status).reduce((n,r)=>n+BigInt(r.quantityUnits),0n);return {asset:a,received:sum('confirmed').toString(),pending:sum('pending').toString(),allocated:orders.filter(r=>r.status==='confirmed').reduce((n,r)=>n+BigInt(r.allocatedUnits),0n).toString(),paid:s.finance.settlements.filter(p=>p.assetId===a.id&&p.status==='confirmed').reduce((n,p)=>n+BigInt(p.netUnits),0n).toString()};});}
function annex(s,opId){const orders=s.finance.orders.filter(r=>r.investmentId===opId);return orders.length?'\n\nANEXOS FINANCIEROS DEMO - SIN VALIDEZ CONTRACTUAL\n'+orders.map(r=>[r.id,'Estado: '+r.status,'Version aceptada: '+r.terms.version,'Contrato original: '+r.terms.contract,'Moneda de cuenta: USD','Aporte: '+amount(r.quantityUnits,asset(r.assetId).decimals)+' '+r.assetId,'Red: '+r.network,'Contrato: '+r.contract+' (NO REAL)','Referencia USD: '+E.money(r.referenceCents),'Cotizacion ficticia: '+amount(r.rate,8)+' USD/token a '+new Date(r.quotedAt).toISOString(),'Token de liquidacion: '+r.terms.settlementAssetId,'Comision DEMO a cargo de: '+r.terms.feePayer,r.terms.valuation,r.terms.volatility,r.terms.rounding,'Participacion congelada: '+r.terms.share+'%','Aceptado: '+new Date(r.terms.acceptedAt).toISOString()].join('\n')).join('\n\n'):'';}
function report(s,kind){const header=['DEMO - SIN MOVIMIENTOS REALES','tipo','inversion','contrato','activo_fisico','inversionista','token','red','cantidad_token','referencia_USD','estado','referencia','fecha','actor','evidencia'];let rows=[];
 const base=(id,kind)=>{const o=E.get(s,id),b=I.binding(s,id);return ['DEMO',kind,id,o.contract,b?I.asset(s,b.assetId).code:o.snapshot.unit,o.investorId||OWNER];};
 if(kind==='capital')rows=s.finance.orders.map(r=>[...base(r.investmentId,kind),r.assetId,r.network,amount(r.quantityUnits,asset(r.assetId).decimals),(r.referenceCents/100).toFixed(2),r.status,r.reference,new Date(r.createdAt).toISOString()]);
 else if(kind==='payments')rows=s.finance.settlements.filter(p=>p.status==='confirmed').map(p=>[...base(p.investmentId,kind),p.assetId,p.network,amount(p.netUnits,asset(p.assetId).decimals),(p.netReferenceCents/100).toFixed(2),p.status,p.hash||p.id,new Date(p.date).toISOString()]);
 else if(kind==='audit')rows=s.finance.audit.map(e=>[...base(e.investmentId,kind),'','','','',e.type,e.id,new Date(e.date).toISOString(),e.actor,e.evidence]);
 else {const ops=s.operations.filter(o=>kind==='overdue'?o.stage<5&&Date.now()>=o.due:kind==='active'||kind==='obligations'?o.stage<7:kind==='inventory'?!o.snapshot.service:true);rows=ops.map(o=>{const c=compute(s,o.id),r=investmentOrder(s,o.id);return [...base(o.id,kind),r?.assetId||'SIN CONCILIAR',r?.network||'',r?amount(r.quantityUnits,asset(r.assetId).decimals):'',(kind==='obligations'&&!c.known?'':((kind==='obligations'?c.result.payout:o.snapshot.capital)/100).toFixed(2)),c.canceled?'VENTA ANULADA':E.stages[o.stage],r?.reference||'Sin entrada conciliada',new Date(o.start).toISOString()];});}
 const cell=v=>{let t=String(v??'');if(/^[=+\-@\t\r]/.test(t))t="'"+t;return '"'+t.replace(/"/g,'""')+'"';};return '\uFEFF'+[header,...rows].map(r=>r.concat(Array(Math.max(0,header.length-r.length)).fill('')).map(cell).join(';')).join('\r\n');
}
const api={configure,catalog,asset,units,amount,rate,cents,fromCents,migrate,order,investmentOrder,createOrder,cancelOrder,reconcile,compute,adjust,reviewChanges,credit,voidCredit,available,calculate,payment,portfolio,totals,annex,report,audit};if(typeof module!=='undefined')module.exports=api;else root.InvestFinance=api;
})(typeof window!=='undefined'?window:globalThis);
