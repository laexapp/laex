import type { EventEnricher, EventRepository, NewsProvider, RawNewsItem } from "../domain/ports";
export class NewsIngestionPipeline {
 constructor(private providers:NewsProvider[],private enricher:EventEnricher,private repository:EventRepository){}
 async run(cursors:Record<string,string|undefined>={}){
  const batches=await Promise.all(this.providers.map(async provider=>({provider:provider.id,...await provider.fetchSince(cursors[provider.id])})));
  const unique=new Map<string,RawNewsItem>();
  for(const {items} of batches) for(const item of items) unique.set(`${item.source}:${item.externalId}`,item);
  const events=await this.enricher.enrich([...unique.values()]);
  await this.repository.upsert(events);
  return {received:batches.reduce((n,b)=>n+b.items.length,0),unique:unique.size,events:events.length,cursors:Object.fromEntries(batches.map(b=>[b.provider,b.cursor]))};
 }
}
