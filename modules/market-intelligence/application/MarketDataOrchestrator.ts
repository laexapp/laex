import type { AssetIdentity, MarketDataBundle, MarketDataProvider, MarketInterval } from "../domain";

type CacheEntry={bundle:MarketDataBundle;expiresAt:number;staleUntil:number};
type Circuit={failures:number;openUntil:number};
const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
export class MarketDataOrchestrator{
 private cache=new Map<string,CacheEntry>();private inflight=new Map<string,Promise<MarketDataBundle>>();private circuits=new Map<string,Circuit>();
 constructor(private providers:MarketDataProvider[],private ttlMs=25_000,private staleMs=5*60_000){}
 async get(asset:AssetIdentity,interval:MarketInterval):Promise<MarketDataBundle>{const key=`${asset.assetId}:${interval}`,now=Date.now(),cached=this.cache.get(key);if(cached&&cached.expiresAt>now)return{...cached.bundle,cache:"hit"};const running=this.inflight.get(key);if(running)return running;const request=this.load(asset,interval,cached).finally(()=>this.inflight.delete(key));this.inflight.set(key,request);return request}
 private async load(asset:AssetIdentity,interval:MarketInterval,cached?:CacheEntry):Promise<MarketDataBundle>{const errors:string[]=[];for(let index=0;index<this.providers.length;index++){const provider=this.providers[index];if(!provider.supports(asset))continue;const circuit=this.circuits.get(provider.id)??{failures:0,openUntil:0};if(circuit.openUntil>Date.now()){errors.push(`${provider.id}:circuit_open`);continue}for(let attempt=0;attempt<2;attempt++){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),7_500);try{const data=await provider.fetchBundle(asset,interval,controller.signal);clearTimeout(timeout);this.circuits.set(provider.id,{failures:0,openUntil:0});const bundle:MarketDataBundle={...data,cache:"miss",fallbackUsed:index>0,errors};this.cache.set(`${asset.assetId}:${interval}`,{bundle,expiresAt:Date.now()+this.ttlMs,staleUntil:Date.now()+this.staleMs});return bundle}catch(error){clearTimeout(timeout);const message=error instanceof Error?error.message:"provider_error";errors.push(`${provider.id}:${message}`);if(attempt===0)await wait(180)} }const failures=circuit.failures+1;this.circuits.set(provider.id,{failures,openUntil:failures>=3?Date.now()+60_000:0})}
 if(cached&&cached.staleUntil>Date.now())return{...cached.bundle,cache:"stale",fallbackUsed:true,errors,quote:{...cached.bundle.quote,state:"delayed"}};
 return unavailableBundle(asset,errors)}
 clear(){this.cache.clear();this.inflight.clear();this.circuits.clear()}
}
export function unavailableBundle(asset:AssetIdentity,errors:string[]=[]):MarketDataBundle{return{identity:asset,quote:{assetId:asset.assetId,price:null,change24h:null,volume24h:null,marketCap:null,high24h:null,low24h:null,circulatingSupply:null,totalSupply:null,observedAt:new Date().toISOString(),provider:"none",state:"unavailable",staleAfterSeconds:0},candles:[],venues:[],provenance:[],generatedAt:new Date().toISOString(),cache:"miss",fallbackUsed:false,errors}}

let windowStarted=Date.now(),requests=0;
export function allowMarketRequest(limit=60){const now=Date.now();if(now-windowStarted>=60_000){windowStarted=now;requests=0}requests+=1;return requests<=limit}
