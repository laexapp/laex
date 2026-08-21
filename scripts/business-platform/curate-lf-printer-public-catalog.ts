import { CommerceEngine } from "../../modules/business-engine/commerce/CommerceEngine";
import { PostgresChapterTwoStore } from "../../modules/business-engine/infrastructure/postgres/PostgresChapterTwoStore";
import type { ActorContext, UserId } from "../../modules/business-engine/domain/types";

const databaseUrl=process.env.BUSINESS_DATABASE_URL;
if(!databaseUrl)throw new Error("BUSINESS_DATABASE_URL is required");
const allowed=new Set(["L1250","WF-4830","WF-4834","WF-C4810","WF-7820","WF-7840","XP-4105","XP-4205"]);

async function main(){
  const store=PostgresChapterTwoStore.fromUrl(databaseUrl!),commerce=new CommerceEngine(store);
  try{
    const state=await store.snapshot(),company=state.platformCompanies.find(item=>item.slug==="empresa-limpia-c7"&&item.status!=="cancelled");
    if(!company)throw new Error("LF-PRINTER reference company is not available");
    const actor:ActorContext={tenantId:company.tenantId,companyId:company.id,userId:"user-laex-catalog-curator" as UserId,traceId:`ceo-catalog-curation-${Date.now()}`,capabilities:["commerce.publish"]};
    const unpublished=[];
    for(const projection of state.commerceProjections.filter(item=>item.tenantId===company.tenantId&&item.companyId===company.id&&item.publicationStatus==="published")){
      const product=state.products.find(item=>item.id===projection.productId&&item.companyId===company.id);
      if(!product||!product.model||!allowed.has(product.model.toUpperCase())){await commerce.unpublish(actor,projection.productId);unpublished.push({productId:projection.productId,slug:projection.slug,name:projection.publicName});}
    }
    const final=await store.snapshot(),published=final.commerceProjections.filter(item=>item.tenantId===company.tenantId&&item.companyId===company.id&&item.publicationStatus==="published");
    console.log(JSON.stringify({unpublished:unpublished.length,published:published.map(item=>item.publicModel)},null,2));
  }finally{await store.close();}
}
void main().catch(error=>{console.error(error instanceof Error?error.message:"catalog_curation_failed");process.exitCode=1;});
