import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { ChapterFiveService } from "../../modules/business-engine/chapter-five/ChapterFiveService";
import type { ActorContext, CompanyId, TenantId, UserId } from "../../modules/business-engine/domain/types";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";
import { ProductMediaAutomation } from "../../modules/business-engine/media/ProductMediaAutomation";
import { BusinessIdentity } from "../../modules/business-engine/server/BusinessIdentity";

const root=mkdtempSync(path.join(tmpdir(),"laex-release-media-"));
const tenant="tenant-media-release" as TenantId,company="company-media-release" as CompanyId;
const actor:ActorContext={tenantId:tenant,companyId:company,userId:"release-user" as UserId,traceId:"release-media-gate",capabilities:["product.manage"]};
let store:SqliteChapterTwoStore,service:ChapterFiveService;

describe("release gate: a genuinely new product without approved media",()=>{
  before(async()=>{
    const registry=JSON.parse(readFileSync(path.join(process.cwd(),"assets","asset-intelligence","global-asset-registry.json"),"utf8")) as {assets:Array<{manufacturer:string;model:string;status:string}>};
    assert.equal(registry.assets.some(asset=>asset.manufacturer.toLowerCase()==="epson"&&asset.model.toUpperCase()==="WF-4833"&&asset.status==="published"),false);
    store=new SqliteChapterTwoStore(path.join(root,"media.sqlite"));
    await store.transact(state=>state.platformCompanies.push({id:company,tenantId:tenant,slug:"release-media",name:"LF-PRINTER",legalName:"LF-PRINTER",currency:"DOP",timezone:"America/Santo_Domingo",primaryColor:"#00bbfc",enabledModules:["commerce"],status:"active",createdAt:"2026-08-13"}));
    service=new ChapterFiveService(store,new BusinessIdentity(store,"release-test-secret-that-is-at-least-32-characters"),()=>new Date("2026-08-13T22:00:00.000Z"),undefined,new ProductMediaAutomation(store));
  });
  after(()=>{store.close();rmSync(root,{recursive:true,force:true});rmSync(path.join(process.cwd(),"public","assets","lf-printer","commercial","products",company),{recursive:true,force:true})});
  it("uses the official Business creation flow and stops at Imagen pendiente",async()=>{
    const product=await service.createProduct(actor,{sku:"RELEASE-WF-4833",name:"Epson WorkForce Pro WF-4833",brand:"Epson",model:"WF-4833",costMinor:1900000,priceMinor:2900000});
    assert.equal(product.imageUrl,undefined);
    const state=await store.snapshot();
    const media=state.productMedia.find(item=>item.productId===product.id&&item.companyId===company);
    assert.equal(media?.status,"pending");
    assert.equal(media?.derivatives.length,0);
    assert.ok(state.audit.some(entry=>entry.action==="product.created"&&entry.entityId===product.id));
    assert.ok(state.audit.some(entry=>entry.action==="product.media.pending"&&entry.entityId===product.id));
  });
});
