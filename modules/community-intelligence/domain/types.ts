export type CommunityEntityType="market"|"news"|"academy"|"media"|"project"|"network"|"ecosystem";
export type KnowledgeKind="question"|"synthesis"|"signal"|"resource";
export type EvidenceKind="market-data"|"official-source"|"news-source"|"academy"|"project-record";
export interface EntityReference { type:CommunityEntityType; id:string; label:string; href:string }
export interface EvidenceReference { id:string; kind:EvidenceKind; label:string; source:string; capturedAt:string }
export interface KnowledgeItem { id:string; title:string; summary:string; kind:KnowledgeKind; status:"verified"|"open"|"ai-organized"; entities:EntityReference[]; evidence:EvidenceReference[]; contributors:number; updatedAt:string; ai:{summary:string;confidence:number;duplicates:number;related:number} }
export interface CommunityDigest { generatedAt:string; topicsDetected:number; duplicatesGrouped:number; answersOrganized:number; connectionsCreated:number; highlights:string[] }
