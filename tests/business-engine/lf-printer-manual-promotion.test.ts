import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { CommerceEngine } from "../../modules/business-engine/commerce/CommerceEngine";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";
import type { ActorContext, CompanyId, TenantId, UserId } from "../../modules/business-engine/domain/types";

const root=mkdtempSync(join(tmpdir(),"laex-manual-promotion-")),tenant="tenant-promotion" as TenantId,company="company-promotion" as CompanyId,user="catalog-operator" as UserId;
let store:SqliteChapterTwoStore,commerce:CommerceEngine,actor:ActorContext;

describe("LF-PRINTER manually validated member promotion",()=>{
  before(async()=>{store=new SqliteChapterTwoStore(join(root,"state.sqlite"));commerce=new CommerceEngine(store,()=>new Date("2026-08-17T12:00:00Z"));actor={tenantId:tenant,companyId:company,userId:user,traceId:"manual-promotion",capabilities:["commerce.publish","commerce.order.manage"]};await store.transact(state=>{state.platformCompanies.push({id:company,tenantId:tenant,slug:"lf-printer",name:"LF-PRINTER",legalName:"LF-PRINTER",currency:"DOP",timezone:"America/Santo_Domingo",primaryColor:"#000",enabledModules:["commerce"],status:"active",createdAt:"2026-08-17T00:00:00Z"});state.products.push({id:"wf4830",tenantId:tenant,companyId:company,sku:"EP-WF-4830",name:"Epson WF-4830",brand:"Epson",model:"WF-4830",priceMinor:3_650_000,publicPriceMinor:3_650_000})})});
  after(()=>{store.close();rmSync(root,{recursive:true,force:true})});
  it("publishes an open-ended promotional price while preserving the prior price and manual eligibility",async()=>{await commerce.publish(actor,{productId:"wf4830",promotion:{priceMinor:2_550_000,startsAt:"2026-08-17T00:00:00Z",active:true,title:"Precio exclusivo LAEX + OneMillionMiners",description:"Elegibilidad sujeta a validación manual.",eligibilityMode:"manual"},deliveryPolicy:{mode:"confirm-availability",priceType:"fixed",paymentRequirement:"confirmation"}});const publicProduct=(await commerce.publicCatalog(company)).products[0];assert.equal(publicProduct.priceMinor,2_550_000);assert.equal(publicProduct.promotion?.basePriceMinor,3_650_000);assert.equal(publicProduct.promotion?.endsAt,undefined);assert.equal(publicProduct.promotion?.eligibilityMode,"manual");const order=await commerce.checkout(company,"manual-member-check",{customer:{name:"Cliente",phone:"8090000000"},fulfillment:"pickup",lines:[{slug:"epson-wf-4830",quantity:1}]}) as {status:string;termsConfirmationRequired?:boolean};assert.equal(order.status,"pending");assert.equal(order.termsConfirmationRequired,true)});
});
