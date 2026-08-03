import type { CommunityDigest, EntityReference, KnowledgeItem } from "./types";
export interface CommunityRepository { listByEntity(entity:EntityReference):Promise<KnowledgeItem[]>; upsert(items:KnowledgeItem[]):Promise<void> }
export interface CommunityAIProvider { cluster(items:KnowledgeItem[]):Promise<KnowledgeItem[]>; summarize(items:KnowledgeItem[]):Promise<CommunityDigest>; relate(item:KnowledgeItem):Promise<EntityReference[]> }
export interface EcosystemContextProvider { resolve(reference:EntityReference):Promise<{label:string;facts:string[];disclaimer?:string}> }
export interface CommunityEventPublisher { publish(event:{type:string;version:1;occurredAt:string;payload:unknown}):Promise<void> }
