import type {
  AcquisitionRecord,
  AssetSearchRequest,
  DownloadedOfficialAsset,
  MediaPipelineHandoff,
  GlobalAsset,
  GlobalAssetEvent,
  GlobalAssetId,
  RegisterGlobalAssetInput,
  OfficialAssetCandidate,
} from './types';

export interface OfficialAssetProvider {
  readonly id:string;
  readonly manufacturers:readonly string[];
  search(request:AssetSearchRequest):Promise<OfficialAssetCandidate[]>;
  acquire(candidate:OfficialAssetCandidate):Promise<DownloadedOfficialAsset>;
}

export interface AcquisitionRegistry {
  save(record:AcquisitionRecord):Promise<void>;
  find(recordId:string):Promise<AcquisitionRecord|undefined>;
  findByLogicalAsset(projectId:string,logicalAssetId:string):Promise<AcquisitionRecord[]>;
  list():Promise<AcquisitionRecord[]>;
}

export interface OriginalAssetStore {
  preserve(input:{
    projectId:string;
    logicalAssetId:string;
    version:number;
    fileName:string;
    checksumSha256:string;
    bytes:Uint8Array;
  }):Promise<{uri:string}>;
}

export interface ChecksumService { sha256(bytes:Uint8Array):Promise<string> }
export interface AssetClock { now():string }

export interface MediaPipelineGateway {
  enqueueForReview(handoff:MediaPipelineHandoff):Promise<{
    status:'review-required'|'failed';
    candidateUri?:string;
    provider?:string;
    reason?:string;
  }>;
}

export interface GlobalAssetRegistry {
  registerOrReference(input:RegisterGlobalAssetInput):Promise<{asset:GlobalAsset;created:boolean}>;
  findById(assetId:GlobalAssetId):Promise<GlobalAsset|undefined>;
  findByChecksum(checksumSha256:string):Promise<GlobalAsset|undefined>;
  addUsage(assetId:GlobalAssetId,projectId:string,context:string,at:string):Promise<GlobalAsset>;
  appendEvent(assetId:GlobalAssetId,event:GlobalAssetEvent):Promise<GlobalAsset>;
  list():Promise<GlobalAsset[]>;
}
