export type MediaKind='logo'|'product'|'video'|'background'|'icon'|'spin-360'|'manual';
export type MediaStatus='uploaded'|'processing'|'review-required'|'approved'|'rejected'|'published'|'failed';
export type RenditionName='transparent-png'|'desktop-webp'|'tablet-webp'|'mobile-webp'|'thumbnail-webp';
export interface MediaProvenance{source:string;license:string;capturedAt?:string;uploadedAt:string;uploadedBy:string;checksum:string}
export interface MediaRendition{name:RenditionName;uri:string;width:number;height:number;format:'png'|'webp';checksum:string}
export interface MediaAsset{id:string;projectId:string;subjectId:string;kind:MediaKind;version:number;status:MediaStatus;originalUri:string;provenance:MediaProvenance;renditions:MediaRendition[];providerJobId?:string;review?:{reviewer:string;decision:'approved'|'rejected';at:string;notes?:string}}
export interface MediaProcessor{submit(asset:MediaAsset):Promise<{jobId:string}>;status(jobId:string):Promise<'queued'|'running'|'complete'|'failed'>;collect(jobId:string):Promise<MediaRendition[]>}
export interface MediaPublisher{publish(asset:MediaAsset):Promise<void>;rollback(assetId:string,version:number):Promise<void>}
