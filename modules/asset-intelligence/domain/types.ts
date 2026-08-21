export type ManufacturerId = string;
export type AssetSourceKind =
  | 'partner-portal'
  | 'manufacturer-newsroom'
  | 'manufacturer-product-page'
  | 'authorized-repository'
  | 'manufacturer-direct';

export type LegalStatus =
  | 'unknown'
  | 'public-reference-only'
  | 'internal-evaluation'
  | 'permission-required'
  | 'licensed'
  | 'manufacturer-authorized'
  | 'prohibited';

export type AcquisitionStatus =
  | 'discovered'
  | 'official-source-required'
  | 'rights-review'
  | 'acquisition-authorized'
  | 'acquired'
  | 'quality-rejected'
  | 'ready-for-processing'
  | 'processing'
  | 'review-required'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'superseded'
  | 'failed';

export interface AssetDimensions { width:number; height:number }

export interface AssetLicense {
  name:string;
  uri?:string;
  summary:string;
  legalStatus:LegalStatus;
  allowsCommercialUse:boolean|null;
  allowsModification:boolean|null;
  requiresWrittenAuthorization:boolean;
  authorizationReference?:string;
}

export interface AssetSearchRequest {
  projectId:string;
  manufacturer:ManufacturerId;
  model:string;
  assetKind:'product-image'|'logo'|'video'|'document'|'other';
  minimumLongestSide:number;
}

export interface OfficialAssetCandidate {
  id:string;
  providerId:string;
  manufacturer:ManufacturerId;
  model:string;
  assetKind:AssetSearchRequest['assetKind'];
  owner:string;
  sourceKind:AssetSourceKind;
  sourcePageUrl:string;
  originalUrl:string;
  format?:string;
  dimensions?:AssetDimensions;
  license:AssetLicense;
  access:'public'|'authorized-account'|'manufacturer-delivery';
  discoveredAt:string;
  metadata:Record<string,string|number|boolean|null>;
}

export interface AcquisitionAuthorization {
  grantedBy:string;
  grantedAt:string;
  scope:'internal-evaluation'|'commercial-use';
  writtenAuthorizationReference?:string;
}

export interface DownloadedOfficialAsset {
  bytes:Uint8Array;
  contentType:string;
  fileName:string;
  dimensions:AssetDimensions;
  acquiredAt:string;
}

export interface AcquisitionEvent {
  status:AcquisitionStatus;
  at:string;
  actor:string;
  note?:string;
}

export interface AcquisitionRecord {
  id:string;
  projectId:string;
  logicalAssetId:string;
  manufacturer:ManufacturerId;
  model:string;
  assetKind:AssetSearchRequest['assetKind'];
  owner:string;
  providerId:string;
  sourceKind:AssetSourceKind;
  sourcePageUrl:string;
  originalUrl:string;
  license:AssetLicense;
  legalStatus:LegalStatus;
  requiresWrittenAuthorization:boolean;
  dimensions?:AssetDimensions;
  format?:string;
  checksumSha256?:string;
  globalAssetId?:GlobalAssetId;
  originalUri?:string;
  acquiredAt?:string;
  status:AcquisitionStatus;
  version:number;
  supersedesRecordId?:string;
  authorization?:AcquisitionAuthorization;
  providerMetadata:Record<string,string|number|boolean|null>;
  history:AcquisitionEvent[];
}

export type GlobalAssetId=`LAEX-ASSET-${string}`;
export type GlobalAssetEventKind='processing'|'publication'|'replacement'|'approval';

export interface GlobalAssetUsage {
  projectId:string;
  contexts:string[];
  firstReferencedAt:string;
  lastReferencedAt:string;
}

export interface GlobalAssetVersion {
  version:number;
  checksumSha256:string;
  originalUri:string;
  sourceUrl:string;
  acquiredAt:string;
  format:string;
  dimensions:AssetDimensions;
  replacedVersion?:number;
}

export interface GlobalAssetEvent {
  id:string;
  kind:GlobalAssetEventKind;
  at:string;
  actor:string;
  projectId?:string;
  version?:number;
  status:string;
  provider?:string;
  reference?:string;
  notes?:string;
}

export interface GlobalAsset {
  assetId:GlobalAssetId;
  manufacturer:ManufacturerId;
  model:string;
  owner:string;
  assetKind:AssetSearchRequest['assetKind'];
  status:AcquisitionStatus;
  license:AssetLicense;
  legalStatus:LegalStatus;
  sourcePageUrl:string;
  currentVersion:number;
  currentChecksumSha256:string;
  usages:GlobalAssetUsage[];
  versions:GlobalAssetVersion[];
  processingHistory:GlobalAssetEvent[];
  publicationHistory:GlobalAssetEvent[];
  replacementHistory:GlobalAssetEvent[];
  approvalHistory:GlobalAssetEvent[];
  createdAt:string;
  updatedAt:string;
}

export interface RegisterGlobalAssetInput {
  manufacturer:ManufacturerId;
  model:string;
  owner:string;
  assetKind:AssetSearchRequest['assetKind'];
  status:AcquisitionStatus;
  license:AssetLicense;
  legalStatus:LegalStatus;
  sourcePageUrl:string;
  projectId:string;
  usageContext:string;
  version:GlobalAssetVersion;
}

export interface MediaPipelineHandoff {
  projectId:string;
  logicalAssetId:string;
  originalUri:string;
  checksumSha256:string;
  sourceFormat:string;
  minimumLongestSide:number;
  processingProvider?:string;
}

export interface DashboardAssetView {
  globalAssetId?:GlobalAssetId;
  recordId:string;
  projectId:string;
  logicalAssetId:string;
  manufacturer:string;
  model:string;
  provider:string;
  source:string;
  license:string;
  legalStatus:LegalStatus;
  requiresWrittenAuthorization:boolean;
  resolution:string|null;
  status:AcquisitionStatus;
  version:number;
  acquiredAt?:string;
}
