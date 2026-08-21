import { PostgresChapterTwoStore } from "../../modules/business-engine/infrastructure/postgres/PostgresChapterTwoStore";
import { ChapterFiveService } from "../../modules/business-engine/chapter-five/ChapterFiveService";
import { BusinessIdentity } from "../../modules/business-engine/server/BusinessIdentity";
import { ProductMediaAutomation } from "../../modules/business-engine/media/ProductMediaAutomation";
import { CommerceEngine } from "../../modules/business-engine/commerce/CommerceEngine";
import type { ActorContext } from "../../modules/business-engine/domain/types";

const catalog=[
  ["Epson","EcoTank L121","Impresora de tanque compacta para documentos cotidianos"],
  ["Epson","EcoTank L1250","Impresora Wi-Fi de tanque para hogar y oficina"],
  ["Epson","EcoTank L3210","Multifuncional de tanque para impresión y escaneo"],
  ["Epson","EcoTank L3250","Multifuncional inalámbrica de tanque"],
  ["Epson","EcoTank L4260","Multifuncional dúplex con conectividad inalámbrica"],
  ["Epson","EcoTank L5290","Multifuncional con alimentador automático"],
  ["Epson","EcoTank L5590","Multifuncional empresarial con conectividad de red"],
  ["Epson","WorkForce Pro WF-3820","Multifuncional WorkForce para oficina"],
  ["Epson","WorkForce Pro WF-4833","Multifuncional WorkForce de alto rendimiento"],
  ["Epson","WorkForce Pro WF-7840","Multifuncional de formato amplio"],
  ["Canon","PIXMA G2170","Multifuncional MegaTank para documentos y fotografías"],
  ["Canon","PIXMA G3170","Multifuncional MegaTank inalámbrica"],
  ["Canon","PIXMA G4170","Multifuncional MegaTank con alimentador automático"],
  ["Canon","MAXIFY GX4010","Multifuncional MegaTank para oficina"],
  ["Canon","imageCLASS MF264dw II","Multifuncional láser monocromática"],
  ["HP","Smart Tank 580","Multifuncional inalámbrica de tanque"],
  ["HP","Smart Tank 720","Multifuncional dúplex de tanque"],
  ["HP","OfficeJet Pro 9125e","Multifuncional empresarial de inyección"],
  ["HP","LaserJet Pro MFP 4103fdw","Multifuncional láser monocromática"],
  ["HP","Color LaserJet Pro MFP 3303fdw","Multifuncional láser a color"],
  ["Brother","DCP-T420W","Multifuncional InkBenefit Tank inalámbrica"],
  ["Brother","DCP-T720DW","Multifuncional InkBenefit Tank dúplex"],
  ["Brother","MFC-T920DW","Multifuncional InkBenefit Tank con fax"],
  ["Brother","HL-L2405W","Impresora láser monocromática inalámbrica"],
  ["Brother","MFC-L3780CDW","Multifuncional láser a color"],
] as const;

async function main(){
  const databaseUrl=process.env.BUSINESS_DATABASE_URL,sessionSecret=process.env.BUSINESS_SESSION_SECRET;
  if(!databaseUrl||!sessionSecret)throw new Error("Chapter 12 audit requires the configured Business runtime");
  const store=PostgresChapterTwoStore.fromUrl(databaseUrl);
  try{
    const state=await store.snapshot(),targetSlug=process.env.CHAPTER12_COMPANY_SLUG??"empresa-limpia-c7",company=state.platformCompanies.find(item=>item.slug===targetSlug&&item.status!=="cancelled"&&item.enabledModules.includes("commerce"));
    if(!company)throw new Error("Chapter 12 Commerce company not found");
    const membership=state.memberships.find(item=>item.tenantId===company.tenantId&&item.companyId===company.id&&item.status==="active"&&item.capabilities.includes("product.manage")&&item.capabilities.includes("inventory.receive")&&item.capabilities.includes("commerce.publish")),warehouse=state.warehouses.find(item=>item.tenantId===company.tenantId&&item.companyId===company.id&&item.status==="active");
    if(!membership||!warehouse)throw new Error("LF-PRINTER authorized catalog context is incomplete");
    const actor:ActorContext={tenantId:company.tenantId,companyId:company.id,userId:membership.userId,capabilities:membership.capabilities,traceId:`chapter-12-audit-${Date.now()}`};
    const media=new ProductMediaAutomation(store),operations=new ChapterFiveService(store,new BusinessIdentity(store,sessionSecret),undefined,undefined,media),commerce=new CommerceEngine(store,undefined,undefined,media);
    const rows=catalog.map(([brand,model,description],index)=>({sku:`AUD-C12-${String(index+1).padStart(3,"0")}`,name:`${brand} ${model}`,brand,model,description,category:"Impresoras",quantity:index%7===0?0:index%5===0?1:3+(index%6),costMinor:(9000+index*725)*100,priceMinor:(13900+index*975)*100}));
    const before=await store.snapshot(),newRows=rows.filter(row=>!before.products.some(product=>product.tenantId===company.tenantId&&product.companyId===company.id&&product.sku===row.sku));
    if(newRows.length)await operations.bulkReceive(actor,{warehouseId:warehouse.id,confirmMissing:true,rows:newRows});
    const current=await store.snapshot();
    for(const [index,row] of rows.entries()){
      const product=current.products.find(item=>item.tenantId===company.tenantId&&item.companyId===company.id&&item.sku===row.sku);
      if(!product)throw new Error(`Audit product missing: ${row.sku}`);
      const mode=index%6===3?"on-order":index%6===4?"confirm-availability":"in-stock",priceType=index%8===6?"tentative":"fixed";
      await commerce.publish(actor,{productId:product.id,publicName:product.name,publicSku:product.sku,description:product.description,category:product.category,features:[product.brand??"",product.model??"","Garantía y condiciones según publicación"].filter(Boolean),featured:index<6,deliveryPolicy:{mode,priceType,paymentRequirement:priceType==="tentative"||mode==="confirm-availability"?"confirmation":"full",estimatedDelivery:mode==="on-order"?"5–7 días después de confirmar":mode==="confirm-availability"?"Sujeto a confirmación":"1–2 días",customerNote:mode==="on-order"?"Producto adquirido después de confirmar el pedido":undefined,tentativePriceValidUntil:priceType==="tentative"?"2026-12-31T23:59:59.000Z":undefined}});
    }
    const final=await store.snapshot(),auditProducts=final.products.filter(item=>item.tenantId===company.tenantId&&item.companyId===company.id&&item.sku.startsWith("AUD-C12-")),published=final.commerceProjections.filter(item=>item.tenantId===company.tenantId&&item.companyId===company.id&&auditProducts.some(product=>product.id===item.productId)&&item.publicationStatus==="published"),pendingMedia=final.productMedia.filter(item=>item.tenantId===company.tenantId&&item.companyId===company.id&&auditProducts.some(product=>product.id===item.productId)&&item.status!=="associated"),mediaRequests=final.mediaAcquisitionRequests.filter(item=>item.tenantId===company.tenantId&&item.companyId===company.id&&auditProducts.some(product=>product.id===item.productId));
    process.stdout.write(JSON.stringify({company:company.slug,createdThisRun:newRows.length,auditProducts:auditProducts.length,published:published.length,pendingMedia:pendingMedia.length,mediaAcquisitionRequests:mediaRequests.length,warehouse:warehouse.name,tenantIsolated:auditProducts.every(item=>item.tenantId===company.tenantId&&item.companyId===company.id)&&mediaRequests.every(item=>item.tenantId===company.tenantId&&item.companyId===company.id)},null,2));
  }finally{await store.close()}
}
void main().catch(error=>{process.stderr.write(error instanceof Error?error.message:"Chapter 12 audit failed");process.exitCode=1});
