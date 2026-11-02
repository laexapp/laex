(function(){
 'use strict';
 window.InvestCloudReady=(async function(){
  const appSdk=window.FirebaseAppSDK,authSdk=window.FirebaseAuthSDK,dbSdk=window.FirebaseFirestoreSDK;
  if(!appSdk||!authSdk||!dbSdk)throw Error('No se pudo cargar el SDK seguro de Firebase.');
  const config={
   apiKey:'AIzaSyAocwP2y0L100ms2Rh8KXhIo6L8Lt4QqiLE',
   authDomain:'ojo-de-halcon-investoptnd.firebaseapp.com',
   projectId:'ojo-de-halcon-investoptnd',
   storageBucket:'ojo-de-halcon-investoptnd.firebasestorage.app',
   messagingSenderId:'735844328714',
   appId:'1:735844328714:web:68ee756abac8a42f9e86f3'
  };
  const app=appSdk.initializeApp(config),auth=authSdk.getAuth(app),db=dbSdk.getFirestore(app);
  const CEO_UID='zxyongJgodTkynatmkuDPQpNjhv1';
  let user=auth.currentUser;
  const offerCallbacks=new Set(),myRequestCallbacks=new Set(),adminCallbacks=new Set();
  const emit=(set,value)=>set.forEach(fn=>{try{fn(value);}catch(err){console.error(err);}});
  let offersUnsub=null,catalogUnsub=null,myRequestsUnsub=null,adminUnsubs=[];let publishedOfferRecords=[],declaredInventoryRecords=[];
  const authReady=new Promise(resolve=>authSdk.onAuthStateChanged(auth,next=>{
   user=next;
   if(!next&&adminUnsubs.length){adminUnsubs.forEach(stop=>stop());adminUnsubs=[];adminCallbacks.clear();}
   if(myRequestsUnsub){myRequestsUnsub();myRequestsUnsub=null;}
   if(next){
    myRequestsUnsub=dbSdk.onSnapshot(dbSdk.query(dbSdk.collection(db,'investmentRequests'),dbSdk.where('investorUid','==',next.uid)),snap=>emit(myRequestCallbacks,snap.docs.map(d=>({id:d.id,...d.data()}))),err=>emit(myRequestCallbacks,{error:err}));
   }else emit(myRequestCallbacks,[]);
   resolve(next);emit(adminCallbacks,{auth:user});
  }));
  function records(snap){return snap.docs.map(d=>({id:d.id,...d.data()}));}
  const api={
   enabled:true,db,auth,CEO_UID,get user(){return user;},
   get isCEO(){return !!user&&user.uid===CEO_UID;},
   async authReady(){await authReady;return user;},
   onAuth(fn){return authSdk.onAuthStateChanged(auth,fn);},
   async register(email,password,phone,name){const normalizedPhone=String(phone||'').trim().replaceAll(' ','').replaceAll('(','').replaceAll(')','').replaceAll('-','');const phoneDigits=normalizedPhone.startsWith('+')?normalizedPhone.slice(1):'';if(phoneDigits.length<8||phoneDigits.length>15||!/^[0-9]+$/.test(phoneDigits))throw Error('Escribe el teléfono con código de país, por ejemplo +18493581111.');const cred=await authSdk.createUserWithEmailAndPassword(auth,email.trim(),password);try{await dbSdk.setDoc(dbSdk.doc(db,'investors',cred.user.uid),{uid:cred.user.uid,email:email.trim().toLowerCase(),phone:normalizedPhone,name:String(name||'').trim().slice(0,80),createdAt:dbSdk.serverTimestamp(),emailVerified:false});await authSdk.sendEmailVerification(cred.user);}catch(err){try{await authSdk.deleteUser(cred.user);}catch{}throw err;}return cred.user;},
   async signIn(email,password){return (await authSdk.signInWithEmailAndPassword(auth,email.trim(),password)).user;},
   async signOut(){return authSdk.signOut(auth);},
   async resetPassword(email){return authSdk.sendPasswordResetEmail(auth,email.trim());},
   async resendVerification(){if(user&&!user.emailVerified)await authSdk.sendEmailVerification(user);},
   async refreshVerification(){if(user)await authSdk.reload(user);user=auth.currentUser;if(user?.emailVerified){const ref=dbSdk.doc(db,'investors',user.uid);if((await dbSdk.getDoc(ref)).exists())await dbSdk.updateDoc(ref,{emailVerified:true,updatedAt:dbSdk.serverTimestamp()});}return !!user?.emailVerified;},
   subscribeOffers(fn){offerCallbacks.add(fn);if(!offersUnsub){const q=dbSdk.query(dbSdk.collection(db,'opportunities'),dbSdk.where('status','==','available'),dbSdk.where('verified','==',true));offersUnsub=dbSdk.onSnapshot(q,s=>{publishedOfferRecords=records(s);emit(offerCallbacks,[...new Map([...declaredInventoryRecords,...publishedOfferRecords].map(x=>[x.id,x])).values()]);},e=>emit(offerCallbacks,{error:e}));catalogUnsub=dbSdk.onSnapshot(dbSdk.query(dbSdk.collection(db,'opportunities'),dbSdk.where('inventoryDeclared','==',true)),s=>{declaredInventoryRecords=records(s);emit(offerCallbacks,[...new Map([...declaredInventoryRecords,...publishedOfferRecords].map(x=>[x.id,x])).values()]);},e=>emit(offerCallbacks,{error:e}));}return()=>offerCallbacks.delete(fn);},
   subscribeMine(fn){myRequestCallbacks.add(fn);if(user&&!myRequestsUnsub){myRequestsUnsub=dbSdk.onSnapshot(dbSdk.query(dbSdk.collection(db,'investmentRequests'),dbSdk.where('investorUid','==',user.uid)),s=>emit(myRequestCallbacks,records(s)),e=>emit(myRequestCallbacks,{error:e}));}else if(!user)fn([]);return()=>myRequestCallbacks.delete(fn);},
   subscribeCEO(fn){if(!user||user.uid!==CEO_UID)throw Error('Acceso reservado a la cuenta CEO.');adminCallbacks.add(fn);if(!adminUnsubs.length){const a=dbSdk.onSnapshot(dbSdk.collection(db,'opportunities'),s=>emit(adminCallbacks,{type:'opportunities',items:records(s)}),e=>emit(adminCallbacks,{type:'error',error:e}));const b=dbSdk.onSnapshot(dbSdk.collection(db,'investmentRequests'),s=>emit(adminCallbacks,{type:'requests',items:records(s)}),e=>emit(adminCallbacks,{type:'error',error:e}));const c=dbSdk.onSnapshot(dbSdk.collection(db,'investors'),s=>emit(adminCallbacks,{type:'investors',items:records(s)}),e=>emit(adminCallbacks,{type:'error',error:e}));adminUnsubs=[a,b,c];}return()=>adminCallbacks.delete(fn);},
   async seedStockCatalog(){if(!this.isCEO)throw Error('Acceso reservado a la cuenta CEO.');const catalog=[['wf-3823','Epson WF-3823',10],['wf-4830','Epson WF-4830',10],['wf-7840','Epson WF-7840',5],['wf-7820','Epson WF-7820',5]],batch=dbSdk.writeBatch(db),stamp=dbSdk.serverTimestamp();for(const [id,title,units] of catalog){const ref=dbSdk.doc(db,'opportunities',id),existing=await dbSdk.getDoc(ref);if(!existing.exists())batch.set(ref,{title,unitCode:id.toUpperCase(),status:'unavailable',verified:false,stockAvailable:units,stockReserved:0,inventoryDeclared:true,inventoryVerified:false,createdAt:stamp,updatedAt:stamp});}await batch.commit();},
   async restock(id,units){if(!this.isCEO)throw Error('Acceso reservado a la cuenta CEO.');if(!Number.isInteger(units)||units<1||units>500)throw Error('Escribe una cantidad entre 1 y 500.');const ref=dbSdk.doc(db,'opportunities',id);await dbSdk.runTransaction(db,async tx=>{const s=await tx.get(ref);if(!s.exists())throw Error('Modelo no encontrado.');const p=s.data();tx.update(ref,{stockAvailable:(p.stockAvailable||0)+units,inventoryDeclared:true,inventoryVerified:false,status:p.verified===true&&Number(p.capitalCents)>0?'available':p.status,updatedAt:dbSdk.serverTimestamp()});});},
   async requestInvestment(offerId){
    if(!user)throw Error('Inicia sesión para solicitar esta inversión.');
    if(!user.emailVerified)throw Error('Verifica tu correo antes de enviar la solicitud.');
    const offerRef=dbSdk.doc(db,'opportunities',offerId),requestRef=dbSdk.doc(dbSdk.collection(db,'investmentRequests'));
    await dbSdk.runTransaction(db,async tx=>{
     const snap=await tx.get(offerRef);if(!snap.exists())throw Error('El equipo ya no está publicado.');const p=snap.data();
     if(p.status!=='available'||p.verified!==true)throw Error('El equipo ya no está disponible.');
     const createdAt=dbSdk.serverTimestamp();
     tx.set(requestRef,{requestId:requestRef.id,investorUid:user.uid,investorEmail:user.email||'',investorName:investor.name||'',investorPhone:investor.phone,opportunityId:offerId,opportunityTitle:p.title,unitCode:p.unitCode,capitalCents:p.capitalCents,status:'pending_demo',createdAt,updatedAt:createdAt,realPayment:false});
     const available=Number(p.stockAvailable??1);if(available<1)throw Error('No quedan unidades disponibles.');
     tx.update(offerRef,{stockAvailable:available-1,stockReserved:Number(p.stockReserved||0)+1,reservedRequestId:requestRef.id,reservedBy:user.uid,lastReservedAt:createdAt,updatedAt:createdAt});
    });
    return requestRef.id;
   },
   async createOffer(data){
    if(!user||user.uid!==CEO_UID)throw Error('Acceso reservado a la cuenta CEO.');
    if(!data.verified||!data.serial?.trim()||!data.proofRef?.trim()||!data.photoData||!data.title?.trim()||!data.unitCode?.trim()||!data.category||!Number.isInteger(data.capitalCents)||data.capitalCents<=0||!Number.isInteger(data.exampleSaleCents)||!Number.isInteger(data.exampleExpensesCents)||!Number.isFinite(data.sharePercent)||data.sharePercent<0||data.sharePercent>100)throw Error('Completa los datos, inspecciona el equipo y registra foto, serie y evidencia.');
    const offerRef=dbSdk.doc(dbSdk.collection(db,'opportunities')),evidenceRef=dbSdk.doc(db,'privateEquipment',offerRef.id),batch=dbSdk.writeBatch(db),stamp=dbSdk.serverTimestamp();
    const publicData={title:data.title,category:data.category,capitalCents:data.capitalCents,exampleSaleCents:data.exampleSaleCents,exampleExpensesCents:data.exampleExpensesCents,sharePercent:data.sharePercent,unitCode:data.unitCode,photoData:data.photoData,verified:true,serialLast4:data.serial.slice(-4),verifiedAt:stamp,status:'available',stockAvailable:1,stockReserved:0,inventoryDeclared:true,inventoryVerified:true,createdAt:stamp,updatedAt:stamp};
    batch.set(offerRef,publicData);batch.set(evidenceRef,{opportunityId:offerRef.id,serial:data.serial,proofRef:data.proofRef,verifiedBy:user.uid,verifiedAt:stamp});await batch.commit();return offerRef.id;
   },
   async setOfferStatus(id,status){if(!this.isCEO)throw Error('Acceso reservado a la cuenta CEO.');if(!['available','unavailable','sold'].includes(status))throw Error('Estado no válido.');const ref=dbSdk.doc(db,'opportunities',id),snap=await dbSdk.getDoc(ref);if(!snap.exists())throw Error('Oportunidad no encontrada.');const p=snap.data();if(status==='available'&&p.verified!==true)throw Error('Verifica el equipo antes de publicarlo.');if(p.status==='reserved'&&status==='available')throw Error('Hay una solicitud pendiente; revísala antes de republicar el equipo.');await dbSdk.updateDoc(ref,{status,updatedAt:dbSdk.serverTimestamp()});},
   async recordSale(requestId,saleCents,expensesCents,saleEvidenceRef){if(!this.isCEO)throw Error('Acceso reservado a la cuenta CEO.');if(!saleEvidenceRef?.trim()||saleEvidenceRef.length>160)throw Error('Agrega una referencia breve del comprobante de venta.');if(!Number.isInteger(saleCents)||saleCents<=0||!Number.isInteger(expensesCents)||expensesCents<0)throw Error('Importes de venta o gastos no validos.');const ref=dbSdk.doc(db,'investmentRequests',requestId),snap=await dbSdk.getDoc(ref);if(!snap.exists())throw Error('Solicitud no encontrada.');const r=snap.data();if(r.status!=='on_sale_demo')throw Error('El equipo debe estar marcado en venta antes de registrar el cierre.');const oppRef=dbSdk.doc(db,'opportunities',r.opportunityId),q=await dbSdk.getDoc(oppRef);if(!q.exists())throw Error('Equipo no encontrado.');const o=q.data(),net=saleCents-o.capitalCents-expensesCents,recovered=Math.min(o.capitalCents,Math.max(0,saleCents-expensesCents)),profit=Math.max(0,Math.floor(net*o.sharePercent/100)),payout=recovered+profit,stamp=dbSdk.serverTimestamp(),batch=dbSdk.writeBatch(db);batch.update(ref,{status:'payment_due_demo',saleCents,expensesCents,netCents:net,recoveredCents:recovered,profitCents:profit,payoutCents:payout,soldAt:stamp,updatedAt:stamp,realPayment:false});batch.update(oppRef,{stockReserved:Math.max(0,Number(o.stockReserved||0)-1),status:Number(o.stockAvailable||0)>0?'available':'unavailable',updatedAt:stamp});batch.set(dbSdk.doc(db,'privateSales',requestId),{requestId,opportunityId:r.opportunityId,saleEvidenceRef:saleEvidenceRef.trim(),recordedBy:user.uid,recordedAt:stamp});await batch.commit();},
   async updateRequestStatus(id,status){if(!this.isCEO)throw Error('Acceso reservado a la cuenta CEO.');if(!['purchase_recorded_demo','on_sale_demo','cancelled_demo','paid_demo'].includes(status))throw Error('Estado no permitido.');const ref=dbSdk.doc(db,'investmentRequests',id),snap=await dbSdk.getDoc(ref);if(!snap.exists())throw Error('Solicitud no encontrada.');const r=snap.data();if(status==='purchase_recorded_demo'&&r.status!=='pending_demo')throw Error('La solicitud no está pendiente.');if(status==='on_sale_demo'&&r.status!=='purchase_recorded_demo')throw Error('Registra primero la compra.');if(status==='paid_demo'&&r.status!=='payment_due_demo')throw Error('Primero registra la venta y el cálculo.');await dbSdk.updateDoc(ref,{status,updatedAt:dbSdk.serverTimestamp(),...(status==='paid_demo'?{paidDemoAt:dbSdk.serverTimestamp(),realPayment:false}:{})});},
   async cancelMyRequest(id){if(!user)throw Error('Inicia sesion.');const ref=dbSdk.doc(db,'investmentRequests',id),snap=await dbSdk.getDoc(ref);if(!snap.exists()||snap.data().investorUid!==user.uid||snap.data().status!=='pending_demo')throw Error('Solo se puede cancelar una solicitud DEMO pendiente.');const r=snap.data();await dbSdk.runTransaction(db,async tx=>{const opp=dbSdk.doc(db,'opportunities',r.opportunityId),os=await tx.get(opp);if(os.exists())tx.update(opp,{stockAvailable:Number(os.data().stockAvailable||0)+1,stockReserved:Math.max(0,Number(os.data().stockReserved||0)-1),releasedRequestId:id,reservedRequestId:dbSdk.deleteField(),reservedBy:dbSdk.deleteField(),updatedAt:dbSdk.serverTimestamp()});tx.update(ref,{status:'cancelled_demo',updatedAt:dbSdk.serverTimestamp()});});}
  };
  await authReady;
  window.InvestCloud=api;
  return api;
 })().catch(err=>{console.error('InvestOPTND Firebase init:',err);window.InvestCloudError=String(err?.message||err);return null;});
})();
