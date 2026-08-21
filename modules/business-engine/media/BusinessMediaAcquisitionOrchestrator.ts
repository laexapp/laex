import type { AcquisitionRecord, AssetSearchRequest, OfficialAssetCandidate } from "../../asset-intelligence/domain/types";
import type { ChapterTwoStore } from "../chapter-two/types";
import type { ActorContext } from "../domain/types";

export interface BusinessAssetIntelligenceGateway {
  discover(request:AssetSearchRequest):Promise<OfficialAssetCandidate[]>;
  registerCandidate(input:{request:AssetSearchRequest;logicalAssetId:string;candidate:OfficialAssetCandidate}):Promise<AcquisitionRecord>;
  acquire(recordId:string,minimumLongestSide:number):Promise<AcquisitionRecord>;
  submitForProcessing(recordId:string,minimumLongestSide:number,processingProvider?:string):Promise<AcquisitionRecord>;
}

const normalize=(value:string)=>value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"").trim();
const logicalId=(value:string)=>value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const longest=(candidate:OfficialAssetCandidate)=>Math.max(candidate.dimensions?.width??0,candidate.dimensions?.height??0);

/** Consumes Business media requests through Asset Intelligence without bypassing rights or human review. */
export class BusinessMediaAcquisitionOrchestrator {
  constructor(private readonly store:ChapterTwoStore,private readonly assets:BusinessAssetIntelligenceGateway,private readonly now=()=>new Date(),private readonly minimumLongestSide=2000){}

  async processQueued(actor:ActorContext){
    const state=await this.store.snapshot(),ids=state.mediaAcquisitionRequests.filter(item=>item.tenantId===actor.tenantId&&item.companyId===actor.companyId&&["queued","official-source-required"].includes(item.status)).map(item=>item.id);
    const results=[];for(const id of ids)results.push(await this.processOne(actor,id));return results;
  }

  async processOne(actor:ActorContext,requestId:string){
    const state=await this.store.snapshot(),request=state.mediaAcquisitionRequests.find(item=>item.id===requestId&&item.tenantId===actor.tenantId&&item.companyId===actor.companyId);
    if(!request)throw new Error("media_acquisition_request_not_found");
    const product=state.products.find(item=>item.id===request.productId&&item.tenantId===actor.tenantId&&item.companyId===actor.companyId);
    if(!product)throw new Error("product_not_found");
    if(!product.brand?.trim()||!product.model?.trim())return this.update(actor,requestId,"official-source-required","structured-product-identity-required");
    if(normalize(product.brand)!==normalize(request.manufacturer)||normalize(product.model)!==normalize(request.model))return this.update(actor,requestId,"failed","product-identity-mismatch");
    const search:AssetSearchRequest={projectId:"lf-printer",manufacturer:product.brand.trim(),model:product.model.trim(),assetKind:"product-image",minimumLongestSide:this.minimumLongestSide};
    const candidates=(await this.assets.discover(search)).filter(candidate=>normalize(candidate.manufacturer)===normalize(search.manufacturer)&&normalize(candidate.model)===normalize(search.model)).sort((left,right)=>longest(right)-longest(left));
    if(!candidates.length)return this.update(actor,requestId,"official-source-required","exact-official-source-not-found");
    const candidate=candidates[0],record=await this.assets.registerCandidate({request:search,logicalAssetId:logicalId(product.model),candidate});
    const requestStatus=record.status==="acquisition-authorized"?"queued":record.status==="rights-review"?"rights-review":"official-source-required";
    await this.update(actor,requestId,requestStatus,record.status,record.providerId,record.id,record.sourcePageUrl,record.legalStatus);
    if(record.status!=="acquisition-authorized")return record;
    const acquired=await this.assets.acquire(record.id,this.minimumLongestSide),review=await this.assets.submitForProcessing(acquired.id,this.minimumLongestSide);
    await this.update(actor,requestId,"review-required",review.status,review.providerId,review.id,review.sourcePageUrl,review.legalStatus);return review;
  }

  private async update(actor:ActorContext,requestId:string,status:"queued"|"official-source-required"|"rights-review"|"review-required"|"approved"|"failed",reason:string,providerId?:string,candidateReference?:string,sourcePageUrl?:string,licenseStatus?:string){
    return this.store.transact(state=>{const request=state.mediaAcquisitionRequests.find(item=>item.id===requestId&&item.tenantId===actor.tenantId&&item.companyId===actor.companyId);if(!request)throw new Error("media_acquisition_request_not_found");Object.assign(request,{status,reason,providerId,candidateReference,sourcePageUrl,licenseStatus,updatedAt:this.now().toISOString()});state.audit.push({id:crypto.randomUUID(),tenantId:actor.tenantId,companyId:actor.companyId,userId:actor.userId,action:`asset-intelligence.request.${status}`,entityId:request.productId,traceId:actor.traceId,at:this.now().toISOString()});return structuredClone(request);});
  }
}
