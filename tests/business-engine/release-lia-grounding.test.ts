import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { CommerceCatalogSearch } from "../../modules/business-engine/commerce/CommerceCatalogSearch";
import { PublicLiaCommerceAdvisor } from "../../modules/business-engine/commerce/PublicLiaCommerceAdvisor";
import type { CompanyId, TenantId } from "../../modules/business-engine/domain/types";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";

const root=mkdtempSync(path.join(tmpdir(),"laex-release-lia-"));
const tenant="tenant-release" as TenantId,company="company-release" as CompanyId;
let store:SqliteChapterTwoStore,lia:PublicLiaCommerceAdvisor;

describe("release gate: public Lía grounding",()=>{
  before(async()=>{
    store=new SqliteChapterTwoStore(path.join(root,"lia.sqlite"));
    lia=new PublicLiaCommerceAdvisor(new CommerceCatalogSearch(store));
    await store.transact(state=>{
      state.platformCompanies.push({id:company,tenantId:tenant,slug:"lf-printer",name:"LF-PRINTER",legalName:"LF-PRINTER",currency:"DOP",timezone:"America/Santo_Domingo",primaryColor:"#00bbfc",enabledModules:["commerce"],status:"active",createdAt:"2026-08-13"});
      state.products.push({id:"wf",tenantId:tenant,companyId:company,sku:"EP-WF-4830",name:"Epson WF-4830",brand:"Epson",model:"WF-4830",priceMinor:2850000,costMinor:1850000,status:"active"});
      state.inventory.push({id:"stock",tenantId:tenant,companyId:company,warehouseId:"warehouse" as never,productId:"wf",delta:1,kind:"opening",sourceId:"opening"});
      state.commerceProjections.push({id:"projection",tenantId:tenant,companyId:company,productId:"wf",slug:"epson-wf-4830",publicName:"Epson WF-4830",publicModel:"WF-4830",publicDescription:"Equipo empresarial",commercialCategory:"Impresoras",compatibility:[],images:[],publicPriceMinor:2850000,features:[],featured:true,publicationStatus:"published",seo:{title:"",description:""},version:1,synchronizedAt:"2026-08-13"});
    });
  });
  after(()=>{store.close();rmSync(root,{recursive:true,force:true})});
  it("understands the model inside natural questions and stays grounded",async()=>{
    for(const question of ["¿Tienen WF-4830?","¿Cuánto cuesta la WF-4830?","¿Está disponible la WF-4830?","Muéstrame el producto WF-4830"]){
      const answer=await lia.ask({tenantId:tenant,companyId:company},question);
      assert.equal(answer.products[0]?.projectionId,"projection");
      assert.equal(answer.grounded,true);
    }
  });
  it("does not invent missing products or answer a context-free follow-up",async()=>{
    assert.equal((await lia.ask({tenantId:tenant,companyId:company},"¿Tienen ZX-9999?")).products.length,0);
    const clarification=await lia.ask({tenantId:tenant,companyId:company},"¿Cuánto cuesta?");
    assert.equal(clarification.products.length,0);
    assert.match(clarification.answer,/nombre o modelo/i);
  });
});
