import assert from "node:assert/strict";
import { mkdtempSync,rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after,before,describe,it } from "node:test";
import { ChapterFiveService } from "../../modules/business-engine/chapter-five/ChapterFiveService";
import { ChapterTwoEngine } from "../../modules/business-engine/chapter-two/ChapterTwoEngine";
import { LocalAssistantOrchestrator } from "../../modules/business-engine/chapter-two/LocalAssistantOrchestrator";
import { ReceptionEngine } from "../../modules/business-engine/chapter-two/ReceptionEngine";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";
import type { ActorContext,CompanyId,TenantId,UserId,WarehouseId } from "../../modules/business-engine/domain/types";

const root=mkdtempSync(join(tmpdir(),"laex-c12-import-")),tenant="tenant-import" as TenantId,company="company-import" as CompanyId,user="user-import" as UserId,warehouse="warehouse-import" as WarehouseId;let store:SqliteChapterTwoStore,operations:ChapterFiveService,orchestrator:LocalAssistantOrchestrator;const actor:ActorContext={tenantId:tenant,companyId:company,userId:user,traceId:"catalog-import",capabilities:["dashboard.view","assistant.use","product.manage","inventory.receive","inventory.read"]},associated:string[]=[];
before(async()=>{store=new SqliteChapterTwoStore(join(root,"import.sqlite"));operations=new ChapterFiveService(store,null as never,undefined,undefined,{async associate(_,productId){associated.push(productId)}});orchestrator=new LocalAssistantOrchestrator(store,new ChapterTwoEngine(store),new ReceptionEngine(store),undefined,undefined,undefined,undefined,operations);await store.transact(state=>{state.platformCompanies.push({id:company,tenantId:tenant,slug:"import",name:"Import",legalName:"Import",currency:"DOP",timezone:"America/Santo_Domingo",primaryColor:"#000",enabledModules:["inventory","commerce"],status:"active",createdAt:"2026-08-14T00:00:00Z"});state.warehouses.push({id:warehouse,tenantId:tenant,companyId:company,branchId:"branch",name:"Principal",status:"active"})})});after(()=>{store.close();rmSync(root,{recursive:true,force:true})});

describe("Chapter 12 official catalog entry",()=>{
  it("validates before creating and records products through dated movements",async()=>{const rows=[{sku:"CSV-001",name:"Epson CSV 001",quantity:3,costMinor:1000000,priceMinor:1500000,brand:"Epson",model:"CSV 001",category:"Impresoras"}];const preview=await operations.bulkReceive(actor,{warehouseId:warehouse,confirmMissing:false,rows});assert.equal(preview.requiresConfirmation,true);assert.equal((await store.snapshot()).products.length,0);const result=await operations.bulkReceive(actor,{warehouseId:warehouse,confirmMissing:true,rows});assert.equal(result.requiresConfirmation,false);const state=await store.snapshot();assert.equal(state.products[0].brand,"Epson");assert.equal(state.inventory[0].delta,3);assert.ok(state.inventory[0].occurredAt);assert.equal(associated.length,1)});
  it("lets LIA prepare a CSV batch but changes nothing until confirmation",async()=>{const response=await orchestrator.ask(actor,"LIA","LIA, registra estas impresoras nuevas.\nCSV-002,Canon CSV 002,2,9000,14000,,Canon,CSV 002,Impresoras,Modelo de auditoría");assert.equal(response.proposal?.command,"catalog.bulk");assert.equal((await store.snapshot()).products.some(item=>item.sku==="CSV-002"),false);await orchestrator.confirm(actor,response.proposal!.id);const state=await store.snapshot();assert.equal(state.products.some(item=>item.sku==="CSV-002"),true);assert.ok(state.audit.some(item=>item.action==="inventory.bulk_received"))});
});
