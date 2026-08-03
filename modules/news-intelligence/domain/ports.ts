import type { NewsEvent } from "./types";
export interface RawNewsItem { externalId:string; title:string; body:string; url:string; source:string; publishedAt:string; tags:string[] }
export interface NewsProvider { readonly id:string; fetchSince(cursor?:string):Promise<{items:RawNewsItem[];cursor?:string}> }
export interface EventEnricher { enrich(items:RawNewsItem[]):Promise<NewsEvent[]> }
export interface EventRepository { list():Promise<NewsEvent[]>; findBySlug(slug:string):Promise<NewsEvent|undefined>; upsert(events:NewsEvent[]):Promise<void> }
export interface PublicationBridge { createBrief(event:NewsEvent):Promise<{briefId:string}> }
