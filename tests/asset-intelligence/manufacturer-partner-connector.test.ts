import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ManufacturerPartnerConnector, priorityManufacturerConnectorConfigs } from "../../modules/asset-intelligence/providers/manufacturer/ManufacturerPartnerConnector";
import type { OfficialAssetCandidate } from "../../modules/asset-intelligence/domain/types";

const request={projectId:"lf-printer",manufacturer:"Canon",model:"PIXMA G3170",assetKind:"product-image" as const,minimumLongestSide:2000};
const candidate:OfficialAssetCandidate={id:"canon-g3170",providerId:"raw",manufacturer:"Canon",model:"PIXMA G3170",assetKind:"product-image",owner:"Canon",sourceKind:"partner-portal",sourcePageUrl:"https://media.canon.example/g3170",originalUrl:"https://media.canon.example/g3170.png",format:"image/png",dimensions:{width:2400,height:2400},license:{name:"Canon partner",summary:"authorized",legalStatus:"manufacturer-authorized",allowsCommercialUse:true,allowsModification:true,requiresWrittenAuthorization:false},access:"authorized-account",discoveredAt:"2026",metadata:{}};

describe("manufacturer partner connector boundary",()=>{
  it("keeps Epson, Canon, HP and Brother as independent configurable connectors",()=>{assert.deepEqual(priorityManufacturerConnectorConfigs({}).map(item=>item.id),["epson-partner-authorized","canon-partner-authorized","hp-partner-authorized","brother-partner-authorized"])});
  it("returns only exact model assets from the authorized host",async()=>{const connector=new ManufacturerPartnerConnector({id:"canon-partner",manufacturer:"Canon",enabled:true,authorizationReference:"agreement-1",allowedHosts:["media.canon.example"]},{async search(){return[candidate,{...candidate,id:"wrong",model:"PIXMA G4170"}]},async download(){return{bytes:new Uint8Array([1]),contentType:"image/png",fileName:"g3170.png",dimensions:{width:2400,height:2400},acquiredAt:"2026"}}});const results=await connector.search(request);assert.equal(results.length,1);assert.equal(results[0].model,"PIXMA G3170");assert.equal(results[0].metadata.authorizationReference,"agreement-1");assert.equal((await connector.acquire(results[0])).fileName,"g3170.png")});
  it("cannot run when access or transformation rights are missing",async()=>{const connector=new ManufacturerPartnerConnector({id:"canon-partner",manufacturer:"Canon",enabled:false,allowedHosts:["media.canon.example"]},{async search(){return[candidate]},async download(){throw new Error("not called")}});assert.deepEqual(await connector.search(request),[]);await assert.rejects(()=>connector.acquire(candidate),/no autorizado/) });
});
