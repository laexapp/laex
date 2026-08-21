import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";
import { ProductMediaAutomation } from "../../modules/business-engine/media/ProductMediaAutomation";
import { CommerceEngine } from "../../modules/business-engine/commerce/CommerceEngine";
import type { ActorContext, CompanyId, TenantId, UserId } from "../../modules/business-engine/domain/types";

const tenant="tenant-media-test" as TenantId,company="company-media-test" as CompanyId,user="user-media-test" as UserId;
const actor:ActorContext={tenantId:tenant,companyId:company,userId:user,traceId:"media-automation-test",capabilities:["commerce.publish","product.manage"]};
const databaseRoot=mkdtempSync(path.join(tmpdir(),"laex-product-media-"));
const outputRoot=path.join(process.cwd(),"public","assets","lf-printer","commercial","products",company);
const registeredWf4830=(JSON.parse(readFileSync(path.join(process.cwd(),"assets","asset-intelligence","global-asset-registry.json"),"utf8")) as {assets:Array<{assetId:string;manufacturer:string;model:string;currentVersion:number}>}).assets.find(asset=>asset.manufacturer.toLowerCase()==="epson"&&asset.model.toUpperCase()==="WF-4830");
let store:SqliteChapterTwoStore,media:ProductMediaAutomation,commerce:CommerceEngine;

describe("Business product media automation",()=>{
  before(async()=>{store=new SqliteChapterTwoStore(path.join(databaseRoot,"state.sqlite"));media=new ProductMediaAutomation(store);commerce=new CommerceEngine(store,()=>new Date("2026-08-13T20:00:00.000Z"),undefined,media);await store.transact(state=>{state.platformCompanies.push({id:company,tenantId:tenant,slug:"media-test",name:"LF-PRINTER",legalName:"LF-PRINTER",currency:"DOP",timezone:"America/Santo_Domingo",primaryColor:"#00bbfc",enabledModules:["commerce"],status:"active",createdAt:"2026-08-13T00:00:00.000Z"});state.products.push({id:"wf-product",tenantId:tenant,companyId:company,sku:"WF",name:"Epson WorkForce Pro WF-4830 Wireless All-in-One Printer",brand:"Epson",model:"WF-4830",priceMinor:2850000,costMinor:1850000,status:"active"},{id:"unknown-product",tenantId:tenant,companyId:company,sku:"UNKNOWN",name:"Equipo desconocido",brand:"Otra",model:"X1",priceMinor:10000,status:"active"})})});
  after(()=>{store.close();rmSync(databaseRoot,{recursive:true,force:true});rmSync(outputRoot,{recursive:true,force:true})});
  it("associates only the exact approved model and creates traceable purpose-specific derivatives",async()=>{const association=await media.associate(actor,"wf-product");assert.equal(association.status,"associated");assert.equal(association.assetId,"LAEX-ASSET-0000001");assert.equal(association.master.checksum?.length,64);assert.deepEqual(association.derivatives.map(item=>item.purpose),["carousel","card","detail"]);for(const derivative of association.derivatives){assert.equal(derivative.tool,"laex-sharp-product-derivative");assert.match(derivative.transformation,/authentic-product-only;contain;clean-background/);assert.doesNotMatch(derivative.transformation,/brand|logo|footer/);assert.equal(derivative.checksum.length,64);assert.ok(existsSync(path.join(process.cwd(),"public",...derivative.url.split("/").filter(Boolean))))}});
  it("uses explicit pending state and an audited Asset Intelligence request instead of borrowing another image",async()=>{const association=await media.associate(actor,"unknown-product");assert.equal(association.status,"pending");assert.equal(association.derivatives.length,0);const state=await store.snapshot();assert.equal(state.products.find(item=>item.id==="unknown-product")?.imageUrl,undefined);assert.deepEqual(state.mediaAcquisitionRequests.map(item=>[item.productId,item.manufacturer,item.model,item.status]),[["unknown-product","Otra","X1","queued"]]);assert.ok(state.audit.some(item=>item.action==="asset-intelligence.acquisition-requested"))});
  it("propagates the current registered asset version, checksums and renditions into Commerce",async()=>{assert.ok(registeredWf4830);const projection=await commerce.publish(actor,{productId:"wf-product"});assert.equal(projection.images.length,3);assert.deepEqual(projection.images.map(image=>image.purpose),["carousel","card","detail"]);assert.ok(projection.images.every(image=>image.assetReference===`${registeredWf4830.assetId}:v${registeredWf4830.currentVersion}`&&image.checksum?.length===64));assert.ok((await store.snapshot()).audit.some(entry=>entry.action==="product.media.associated"&&entry.companyId===company))});
});
