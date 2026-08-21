import type { MediaPipelineGateway } from '../domain/ports';
import type { MediaPipelineHandoff } from '../domain/types';

export interface ExistingMediaPipelineAdapter {
  stageOfficialOriginal(handoff:MediaPipelineHandoff):Promise<void>;
  processOne(input:{projectId:string;logicalAssetId:string;processingProvider?:string}):Promise<{status:string;candidateUri?:string;provider?:string;reason?:string}>;
}

export class MediaPipelineReviewBridge implements MediaPipelineGateway {
  constructor(private readonly adapter:ExistingMediaPipelineAdapter){}
  async enqueueForReview(handoff:MediaPipelineHandoff){
    await this.adapter.stageOfficialOriginal(handoff);
    const result=await this.adapter.processOne({projectId:handoff.projectId,logicalAssetId:handoff.logicalAssetId,processingProvider:handoff.processingProvider});
    if(result.status==='published')throw new Error('Violaci?n de pol?tica: Asset Intelligence nunca permite publicaci?n autom?tica.');
    if(result.status!=='review-required')return{status:'failed' as const,reason:result.reason??`Estado inesperado del pipeline: ${result.status}`};
    return{status:'review-required' as const,candidateUri:result.candidateUri,provider:result.provider};
  }
}
