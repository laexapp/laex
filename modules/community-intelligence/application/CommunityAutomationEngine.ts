import type { CommunityAIProvider,CommunityEventPublisher,CommunityRepository } from "../domain/ports";
import type { KnowledgeItem } from "../domain/types";
export class CommunityAutomationEngine{
 constructor(private repository:CommunityRepository,private ai:CommunityAIProvider,private events:CommunityEventPublisher){}
 async organize(items:KnowledgeItem[]){const clustered=await this.ai.cluster(items);for(const item of clustered)item.entities=[...item.entities,...await this.ai.relate(item)];await this.repository.upsert(clustered);const digest=await this.ai.summarize(clustered);await this.events.publish({type:"community.knowledge.organized",version:1,occurredAt:new Date().toISOString(),payload:{itemIds:clustered.map(i=>i.id),digest}});return digest;}
}
