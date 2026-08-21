import { assertLifecycleTransition } from '../domain/lifecycle';
import type { AcquisitionRegistry, AssetClock, ChecksumService, GlobalAssetRegistry, MediaPipelineGateway, OfficialAssetProvider, OriginalAssetStore } from '../domain/ports';
import type { AcquisitionAuthorization, AcquisitionRecord, AssetSearchRequest, DashboardAssetView, GlobalAssetEvent, GlobalAssetId, OfficialAssetCandidate } from '../domain/types';

const longestSide=(candidate:OfficialAssetCandidate)=>candidate.dimensions?Math.max(candidate.dimensions.width,candidate.dimensions.height):0;

export class AssetIntelligenceService {
  constructor(private readonly dependencies:{
    providers:OfficialAssetProvider[];
    registry:AcquisitionRegistry;
    globalAssets:GlobalAssetRegistry;
    originals:OriginalAssetStore;
    checksum:ChecksumService;
    mediaPipeline:MediaPipelineGateway;
    clock:AssetClock;
  }){}

  async discover(request:AssetSearchRequest){
    const providers=this.dependencies.providers.filter(provider=>provider.manufacturers.includes(request.manufacturer.toLowerCase()));
    const results=(await Promise.all(providers.map(provider=>provider.search(request)))).flat();
    return results.sort((a,b)=>longestSide(b)-longestSide(a));
  }

  async registerCandidate(input:{request:AssetSearchRequest;logicalAssetId:string;candidate:OfficialAssetCandidate}){
    const {request,logicalAssetId,candidate}=input;
    if(candidate.manufacturer.toLowerCase()!==request.manufacturer.toLowerCase()||candidate.model.toLowerCase()!==request.model.toLowerCase())throw new Error('El candidato no corresponde exactamente al fabricante y modelo solicitados.');
    const existing=await this.dependencies.registry.findByLogicalAsset(request.projectId,logicalAssetId);
    const version=Math.max(0,...existing.map(record=>record.version))+1;
    const requiresWrittenAuthorization=candidate.license.requiresWrittenAuthorization||candidate.license.allowsModification!==true;
    const legalClearance=['licensed','manufacturer-authorized'].includes(candidate.license.legalStatus)&&candidate.license.allowsCommercialUse===true&&candidate.license.allowsModification===true;
    const status=candidate.dimensions&&longestSide(candidate)<request.minimumLongestSide?'quality-rejected':legalClearance&&!requiresWrittenAuthorization?'acquisition-authorized':'rights-review';
    const record:AcquisitionRecord={
      id:`${request.projectId}:${logicalAssetId}:v${version}`,
      projectId:request.projectId,logicalAssetId,manufacturer:candidate.manufacturer,model:candidate.model,assetKind:request.assetKind,
      owner:candidate.owner,providerId:candidate.providerId,sourceKind:candidate.sourceKind,
      sourcePageUrl:candidate.sourcePageUrl,originalUrl:candidate.originalUrl,license:candidate.license,
      legalStatus:candidate.license.legalStatus,requiresWrittenAuthorization,
      dimensions:candidate.dimensions,format:candidate.format,status,version,
      supersedesRecordId:existing.sort((a,b)=>b.version-a.version)[0]?.id,
      providerMetadata:candidate.metadata,
      history:[{status:'discovered',at:this.dependencies.clock.now(),actor:'laex-asset-intelligence'},{status,at:this.dependencies.clock.now(),actor:'laex-asset-intelligence'}],
    };
    await this.dependencies.registry.save(record);
    return record;
  }

  async authorize(recordId:string,authorization:AcquisitionAuthorization){
    const record=await this.requiredRecord(recordId);
    if(record.legalStatus==='prohibited')throw new Error('El activo est? jur?dicamente prohibido y no puede autorizarse.');
    if(record.requiresWrittenAuthorization&&!authorization.writtenAuthorizationReference)throw new Error('Este activo exige una referencia de autorizaci?n escrita.');
    assertLifecycleTransition(record.status,'acquisition-authorized');
    const updated={...record,status:'acquisition-authorized' as const,authorization,history:[...record.history,{status:'acquisition-authorized' as const,at:this.dependencies.clock.now(),actor:authorization.grantedBy}]};
    await this.dependencies.registry.save(updated);return updated;
  }

  async acquire(recordId:string,minimumLongestSide:number){
    const record=await this.requiredRecord(recordId);
    if(record.status!=='acquisition-authorized')throw new Error(`El activo no est? autorizado para adquisici?n: ${record.status}`);
    const provider=this.dependencies.providers.find(item=>item.id===record.providerId);
    if(!provider)throw new Error(`Proveedor no configurado: ${record.providerId}`);
    const candidate=this.toCandidate(record);
    const downloaded=await provider.acquire(candidate);
    if(Math.max(downloaded.dimensions.width,downloaded.dimensions.height)<minimumLongestSide)throw new Error(`Resoluci?n ${downloaded.dimensions.width}x${downloaded.dimensions.height}; se requieren ${minimumLongestSide} px.`);
    const checksumSha256=await this.dependencies.checksum.sha256(downloaded.bytes);
    const stored=await this.dependencies.originals.preserve({projectId:record.projectId,logicalAssetId:record.logicalAssetId,version:record.version,fileName:downloaded.fileName,checksumSha256,bytes:downloaded.bytes});
    const global=await this.dependencies.globalAssets.registerOrReference({manufacturer:record.manufacturer,model:record.model,owner:record.owner,assetKind:record.assetKind,status:'acquired',license:record.license,legalStatus:record.legalStatus,sourcePageUrl:record.sourcePageUrl,projectId:record.projectId,usageContext:'official-original',version:{version:record.version,checksumSha256,originalUri:stored.uri,sourceUrl:record.originalUrl,acquiredAt:downloaded.acquiredAt,format:downloaded.contentType,dimensions:downloaded.dimensions}});
    const acquired:AcquisitionRecord={...record,status:'acquired',dimensions:downloaded.dimensions,format:downloaded.contentType,checksumSha256,globalAssetId:global.asset.assetId,originalUri:stored.uri,acquiredAt:downloaded.acquiredAt,history:[...record.history,{status:'acquired',at:this.dependencies.clock.now(),actor:'laex-asset-intelligence',note:`Registrado como ${global.asset.assetId}.`}]};
    await this.dependencies.registry.save(acquired);return acquired;
  }

  async submitForProcessing(recordId:string,minimumLongestSide:number,processingProvider?:string){
    const record=await this.requiredRecord(recordId);
    if(record.status!=='acquired'||!record.originalUri||!record.checksumSha256)throw new Error('El original debe estar adquirido y preservado antes del procesamiento.');
    const ready={...record,status:'ready-for-processing' as const,history:[...record.history,{status:'ready-for-processing' as const,at:this.dependencies.clock.now(),actor:'laex-asset-intelligence'}]};
    await this.dependencies.registry.save(ready);
    const processing={...ready,status:'processing' as const,history:[...ready.history,{status:'processing' as const,at:this.dependencies.clock.now(),actor:'media-pipeline'}]};
    await this.dependencies.registry.save(processing);
    await this.appendGlobal(record.globalAssetId,{kind:'processing',status:'processing',actor:'media-pipeline',projectId:record.projectId,version:record.version,provider:processingProvider});
    const result=await this.dependencies.mediaPipeline.enqueueForReview({projectId:record.projectId,logicalAssetId:record.logicalAssetId,originalUri:record.originalUri,checksumSha256:record.checksumSha256,sourceFormat:record.format??'application/octet-stream',minimumLongestSide,processingProvider});
    if(result.status!=='review-required')throw new Error(result.reason??'El Media Pipeline no devolvi? un recurso en revisi?n.');
    const review={...processing,status:'review-required' as const,providerMetadata:{...processing.providerMetadata,mediaCandidateUri:result.candidateUri??null,processingProvider:result.provider??processingProvider??null},history:[...processing.history,{status:'review-required' as const,at:this.dependencies.clock.now(),actor:'media-pipeline',note:'Publicaci?n bloqueada hasta revisi?n humana.'}]};
    await this.appendGlobal(record.globalAssetId,{kind:'processing',status:'review-required',actor:'media-pipeline',projectId:record.projectId,version:record.version,provider:result.provider??processingProvider,reference:result.candidateUri});
    await this.dependencies.registry.save(review);return review;
  }

  async referenceGlobalAsset(assetId:GlobalAssetId,projectId:string,context:string){return this.dependencies.globalAssets.addUsage(assetId,projectId,context,this.dependencies.clock.now());}

  async recordApproval(assetId:GlobalAssetId,input:{actor:string;projectId?:string;version?:number;decision:'approved'|'rejected';reference?:string;notes?:string}){return this.appendGlobal(assetId,{kind:'approval',status:input.decision,actor:input.actor,projectId:input.projectId,version:input.version,reference:input.reference,notes:input.notes});}

  async recordPublication(assetId:GlobalAssetId,input:{actor:string;projectId:string;version:number;status:'published'|'withdrawn';reference:string;notes?:string}){
    if(input.status==='published'){
      const asset=await this.dependencies.globalAssets.findById(assetId);
      if(!asset?.approvalHistory.some(event=>event.version===input.version&&event.status==='approved'))throw new Error('La publicaci?n exige una aprobaci?n humana registrada para esta versi?n.');
    }
    return this.appendGlobal(assetId,{kind:'publication',status:input.status,actor:input.actor,projectId:input.projectId,version:input.version,reference:input.reference,notes:input.notes});
  }

  async dashboard():Promise<DashboardAssetView[]>{
    return (await this.dependencies.registry.list()).map(record=>({recordId:record.id,globalAssetId:record.globalAssetId,projectId:record.projectId,logicalAssetId:record.logicalAssetId,manufacturer:record.manufacturer,model:record.model,provider:record.providerId,source:record.sourcePageUrl,license:record.license.name,legalStatus:record.legalStatus,requiresWrittenAuthorization:record.requiresWrittenAuthorization,resolution:record.dimensions?`${record.dimensions.width}x${record.dimensions.height}`:null,status:record.status,version:record.version,acquiredAt:record.acquiredAt}));
  }

  private async requiredRecord(id:string){const record=await this.dependencies.registry.find(id);if(!record)throw new Error(`Registro de adquisici?n inexistente: ${id}`);return record;}
  private async appendGlobal(assetId:GlobalAssetId|undefined,event:Omit<GlobalAssetEvent,'id'|'at'>){if(!assetId)throw new Error('El activo no posee Asset ID global.');return this.dependencies.globalAssets.appendEvent(assetId,{...event,id:`${assetId}:${event.kind}:${crypto.randomUUID()}`,at:this.dependencies.clock.now()});}
  private toCandidate(record:AcquisitionRecord):OfficialAssetCandidate{return{id:record.id,providerId:record.providerId,manufacturer:record.manufacturer,model:record.model,assetKind:record.assetKind,owner:record.owner,sourceKind:record.sourceKind,sourcePageUrl:record.sourcePageUrl,originalUrl:record.originalUrl,format:record.format,dimensions:record.dimensions,license:record.license,access:record.sourceKind==='partner-portal'?'authorized-account':'public',discoveredAt:record.history[0]?.at??this.dependencies.clock.now(),metadata:record.providerMetadata};}
}
