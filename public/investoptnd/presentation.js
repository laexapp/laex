(function(root){
 'use strict';
 const OWNER='local-demo-investor';
 const adminRoutes=new Set(['admin','manage','new','audit']);
 const adminActions=new Set(['advance','collect','pay','hold','configure','create','invoice']);
 function isAdmin(bridge){try{return bridge?.isAdmin()===true;}catch{return false;}}
 // 0.1.0 has one fictitious local investor. Missing identity denotes that same owner.
 function owns(op){return !!op&&(!op.investorId||op.investorId===OWNER);}
 function authorize(action,bridge,op){if(adminActions.has(action)||adminRoutes.has(action)){if(!isAdmin(bridge))throw Error('Acceso reservado al administrador. Autentícate primero.');return;}
  if(['read','exit','continue','download'].includes(action)&&!owns(op))throw Error('Esta operación no pertenece a tu perfil.');
 }
 function portfolio(engine,state){const operations=state.operations.filter(owns),t=engine.totals({...state,operations});return {...t,available:0,operations,paid:operations.filter(o=>o.stage===7).reduce((n,o)=>n+engine.estimate(o.snapshot.capital,o.actualSale,o.actualExpenses,o.snapshot.share).payout,0),unpriced:operations.filter(o=>o.stage<5).length};}
 function progress(op){return op.stage===7?4:op.stage>=5?3:op.stage>=3?2:op.stage>=1?1:0;}
 function status(op,engine){const loss=op.stage>=5&&engine.estimate(op.snapshot.capital,op.actualSale,op.actualExpenses,op.snapshot.share).loss>0;
  if(op.hold&&!op.liquidable)return {label:'Liquidación retenida',tone:'loss',text:'Hay una incidencia pendiente. No se ha habilitado el pago.'};
  if(op.exitRequested&&op.stage<5)return {label:'Salida solicitada',tone:'pending',text:'Tu solicitud está pendiente de acuerdo y liquidez. No es un retiro inmediato.'};
  const labels=op.snapshot.service?['Financiado','Preparado','En curso','Cobrado','Pagado']:['Financiada','Comprada','En venta','Vendida','Pagada'];
  const n=progress(op),texts=['El financiamiento ficticio está registrado. Todavía no hay ganancia confirmada.','LF-PRINTER prepara la operación. Puedes consultar sus fechas y documentos.','La operación sigue en curso. La ganancia se conoce cuando se completa y cobra.','Cobro confirmado en la simulación. Se calcula el resultado y se prepara la liquidación.','El pago simulado ya se completó; no vuelve a contarse como saldo disponible.'];
  return {label:labels[n]+(loss?' · Con pérdida':''),tone:loss?'loss':n>=3?'success':'info',text:texts[n]};
 }
 const photos={'Epson XP-5100':'xp-5100.jpg','Epson WF-3820':'wf-3820.jpg','Epson WF-4830':'wf-4830.webp','Epson WF-7840':'wf-7840.webp','Epson WF-7820':'wf-7820.webp'};
 const api={OWNER,adminRoutes,adminActions,isAdmin,owns,authorize,portfolio,progress,status,photos};if(typeof module!=='undefined')module.exports=api;else root.InvestPresentation=api;
})(typeof window!=='undefined'?window:globalThis);
