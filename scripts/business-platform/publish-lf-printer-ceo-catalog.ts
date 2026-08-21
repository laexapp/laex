import { PostgresChapterTwoStore } from "../../modules/business-engine/infrastructure/postgres/PostgresChapterTwoStore";
import { ChapterFiveService } from "../../modules/business-engine/chapter-five/ChapterFiveService";
import { CommerceEngine } from "../../modules/business-engine/commerce/CommerceEngine";
import { ProductMediaAutomation } from "../../modules/business-engine/media/ProductMediaAutomation";
import type { ActorContext, UserId } from "../../modules/business-engine/domain/types";

const catalog = [
  { sku:"EP-L1250", model:"L1250", name:"Epson EcoTank L1250", priceMinor:1_350_000, basePriceMinor:1_650_000 },
  { sku:"EP-WF-4830", model:"WF-4830", name:"Epson WorkForce Pro WF-4830", priceMinor:2_550_000, basePriceMinor:3_650_000 },
  { sku:"EP-WF-4834", model:"WF-4834", name:"Epson WorkForce Pro WF-4834", priceMinor:2_550_000, basePriceMinor:3_650_000 },
  { sku:"EP-WF-C4810", model:"WF-C4810", name:"Epson WorkForce Pro WF-C4810", priceMinor:2_550_000, basePriceMinor:3_650_000 },
  { sku:"EP-WF-7820", model:"WF-7820", name:"Epson WorkForce WF-7820", priceMinor:5_550_000, basePriceMinor:6_850_000 },
  { sku:"EP-WF-7840", model:"WF-7840", name:"Epson WorkForce WF-7840", priceMinor:6_850_000, basePriceMinor:7_550_000 },
  { sku:"EP-XP-4105", model:"XP-4105", name:"Epson Expression Home XP-4105", priceMinor:1_350_000, basePriceMinor:1_850_000 },
  { sku:"EP-XP-4205", model:"XP-4205", name:"Epson Expression Home XP-4205", priceMinor:1_350_000, basePriceMinor:1_850_000 },
] as const;

const databaseUrl=process.env.BUSINESS_DATABASE_URL;
if(!databaseUrl)throw new Error("BUSINESS_DATABASE_URL is required");
async function main(){
 const store=PostgresChapterTwoStore.fromUrl(databaseUrl!),media=new ProductMediaAutomation(store),business=new ChapterFiveService(store,null as never,undefined,undefined,media),commerce=new CommerceEngine(store,undefined,undefined,media);
 try{
  let state=await store.snapshot();
  const company=state.platformCompanies.find(item=>item.slug==="empresa-limpia-c7"&&item.status!=="cancelled");
  if(!company)throw new Error("LF-PRINTER reference company is not available");
  const actor:ActorContext={tenantId:company.tenantId,companyId:company.id,userId:"user-laex-catalog-operator" as UserId,traceId:`ceo-catalog-${Date.now()}`,capabilities:["settings.manage","product.manage","commerce.publish"]};
  const modules=Array.from(new Set([...company.enabledModules,"commerce","inventory"]));
  await business.updateCompany(actor,{name:"LF-PRINTER",enabledModules:modules});
  state=await store.snapshot();
  if(!state.warehouses.some(item=>item.companyId===company.id))await business.createLocation(actor,{branchName:"Sucursal principal",warehouseName:"Almacén principal"});
  const results=[];
  for(const item of catalog){
    state=await store.snapshot();
    let product=state.products.find(candidate=>candidate.companyId===company.id&&(candidate.sku===item.sku||candidate.name.trim().toLowerCase()===item.name.toLowerCase()||(candidate.brand?.toLowerCase()==="epson"&&candidate.model?.toUpperCase().endsWith(item.model))));
    if(!product)product=await business.createProduct(actor,{sku:item.sku,name:item.name,description:`${item.name} publicado por LF-PRINTER.`,category:"Impresoras",brand:"Epson",model:item.model,priceMinor:item.basePriceMinor,taxIncluded:true});
    else product=await business.updateProduct(actor,{productId:product.id,changes:{name:item.name,description:`${item.name} publicado por LF-PRINTER.`,category:"Impresoras",brand:"Epson",model:item.model,priceMinor:item.basePriceMinor,publicPriceMinor:item.basePriceMinor,status:"active"}});
    const association=await media.associate(actor,product.id);
    if(association.status!=="associated")throw new Error(`${item.model}: exact approved media association failed`);
    const projection=await commerce.publish(actor,{productId:product.id,publicName:item.name,description:`${item.name} disponible mediante solicitud y validación de LF-PRINTER.`,category:"Impresoras",features:[],featured:true,promotion:{priceMinor:item.priceMinor,startsAt:new Date().toISOString(),active:true,title:"Precio exclusivo LAEX + OneMillionMiners",description:"Beneficio promocional para miembros activos de OneMillionMiners. Elegibilidad sujeta a validación manual de LF-PRINTER antes de confirmar el pedido.",eligibilityMode:"manual"},deliveryPolicy:{mode:"confirm-availability",priceType:"fixed",paymentRequirement:"confirmation",customerNote:"Disponibilidad y elegibilidad se confirman manualmente antes de cualquier pago."}});
    results.push({model:item.model,productId:product.id,projectionId:projection.id,slug:projection.slug,images:projection.images.length,basePriceMinor:projection.publicPriceMinor,promotionalPriceMinor:projection.promotion?.priceMinor,status:projection.publicationStatus});
  }
  console.log(JSON.stringify({companyId:company.id,tenantId:company.tenantId,products:results},null,2));
 }finally{await store.close();}
}
void main().catch(error=>{console.error(error instanceof Error?error.message:"catalog_publication_failed");process.exitCode=1;});
