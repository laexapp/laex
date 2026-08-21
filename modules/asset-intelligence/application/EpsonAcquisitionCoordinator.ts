import type { AssetIntelligenceService } from './AssetIntelligenceService';
import type { AssetSearchRequest, OfficialAssetCandidate } from '../domain/types';

export const EPSON_TEMPORARY_DEVELOPMENT_POLICY={definitiveMinimumLongestSide:2000,temporaryMinimumLongestSide:640,label:'Temporal manual LF-PRINTER - Pendiente de sustitución'} as const;
export type EpsonCandidateState='definitive'|'temporary-pending-replacement';
export interface EpsonDiscoveryResult { candidate:OfficialAssetCandidate; state:EpsonCandidateState; longestSide:number }

export class EpsonAcquisitionCoordinator {
  constructor(private readonly assets:AssetIntelligenceService){}
  async discover(request:AssetSearchRequest):Promise<EpsonDiscoveryResult[]>{const effective={...request,minimumLongestSide:EPSON_TEMPORARY_DEVELOPMENT_POLICY.temporaryMinimumLongestSide};const candidates=await this.assets.discover(effective);return candidates.map(candidate=>{const longestSide=Math.max(candidate.dimensions?.width??0,candidate.dimensions?.height??0);return{candidate,longestSide,state:longestSide>=request.minimumLongestSide?'definitive':'temporary-pending-replacement'}});}
  async registerBest(request:AssetSearchRequest,logicalAssetId:string){const [best]=await this.discover(request);if(!best)throw new Error(`No se encontró una fuente pública oficial Epson para ${request.model}.`);const candidate={...best.candidate,metadata:{...best.candidate.metadata,qualityState:best.state,qualityLabel:best.state==='definitive'?'Estándar definitivo':EPSON_TEMPORARY_DEVELOPMENT_POLICY.label,targetMinimumLongestSide:request.minimumLongestSide}};const record=await this.assets.registerCandidate({request:{...request,minimumLongestSide:EPSON_TEMPORARY_DEVELOPMENT_POLICY.temporaryMinimumLongestSide},logicalAssetId,candidate});return{record,state:best.state,candidate};}
  async acquire(recordId:string){return this.assets.acquire(recordId,EPSON_TEMPORARY_DEVELOPMENT_POLICY.temporaryMinimumLongestSide);}
  async submitForReview(recordId:string,processingProvider?:string){return this.assets.submitForProcessing(recordId,EPSON_TEMPORARY_DEVELOPMENT_POLICY.temporaryMinimumLongestSide,processingProvider);}
}
