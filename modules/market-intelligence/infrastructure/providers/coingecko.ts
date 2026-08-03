import type { AssetIdentity, MarketDataBundle, MarketDataProvider, MarketInterval, OhlcvCandle, QuoteSnapshot, VenueSnapshot } from "../../domain";

type CoinMarket={id:string;current_price:number|null;price_change_percentage_24h:number|null;total_volume:number|null;market_cap:number|null;high_24h:number|null;low_24h:number|null;circulating_supply:number|null;total_supply:number|null;last_updated:string};
type CoinTicker={market?:{name?:string};base?:string;target?:string;last?:number;volume?:number;bid_ask_spread_percentage?:number;last_traded_at?:string;is_stale?:boolean;is_anomaly?:boolean};
const PRO_KEY=process.env.COINGECKO_API_KEY;
const ROOT=PRO_KEY?"https://pro-api.coingecko.com/api/v3":"https://api.coingecko.com/api/v3";
async function json<T>(url:string,signal:AbortSignal):Promise<T>{const response=await fetch(url,{headers:{accept:"application/json","user-agent":"LAEX-Market-Intelligence/1.0",...(PRO_KEY?{"x-cg-pro-api-key":PRO_KEY}:{})},signal,cache:"no-store"});if(!response.ok)throw new Error(`coingecko_http_${response.status}`);return response.json() as Promise<T>}
export class CoinGeckoProvider implements MarketDataProvider{
 readonly id="coingecko-keyless-public";
 supports(asset:AssetIdentity){return Boolean(asset.providerId&&asset.status==="active")}
 async fetchBundle(asset:AssetIdentity,interval:MarketInterval,signal:AbortSignal):Promise<Omit<MarketDataBundle,"cache"|"fallbackUsed"|"errors">>{
  if(!asset.providerId)throw new Error("provider_identity_missing");
  const days=interval==="1d"?30:interval==="4h"?7:1;
  const[markets,ohlc,tickers]=await Promise.all([
   json<CoinMarket[]>(`${ROOT}/coins/markets?vs_currency=usd&ids=${encodeURIComponent(asset.providerId)}&price_change_percentage=24h&precision=full`,signal),
   json<number[][]>(`${ROOT}/coins/${encodeURIComponent(asset.providerId)}/ohlc?vs_currency=usd&days=${days}&precision=full`,signal),
   json<{tickers?:CoinTicker[]}>(`${ROOT}/coins/${encodeURIComponent(asset.providerId)}/tickers?include_exchange_logo=false&page=1&depth=true`,signal)
  ]);
  const market=markets[0];if(!market)throw new Error("coingecko_asset_missing");
  const observedAt=market.last_updated||new Date().toISOString();const age=(Date.now()-Date.parse(observedAt))/1000;
  const quote:QuoteSnapshot={assetId:asset.assetId,price:market.current_price,change24h:market.price_change_percentage_24h,volume24h:market.total_volume,marketCap:market.market_cap,high24h:market.high_24h,low24h:market.low_24h,circulatingSupply:market.circulating_supply,totalSupply:market.total_supply,observedAt,provider:this.id,state:age>90?"delayed":"live",staleAfterSeconds:90};
  const candles:OhlcvCandle[]=ohlc.map(row=>({timestamp:Number(row[0]),open:Number(row[1]),high:Number(row[2]),low:Number(row[3]),close:Number(row[4]),volume:null})).filter(c=>[c.timestamp,c.open,c.high,c.low,c.close].every(Number.isFinite));
  const venues:VenueSnapshot[]=(tickers.tickers??[]).filter(t=>!t.is_anomaly&&t.last!=null).slice(0,8).map(t=>({name:t.market?.name??"Mercado no identificado",pair:`${t.base??asset.symbol}/${t.target??"USD"}`,price:t.last??null,volume:t.volume??null,spread:t.bid_ask_spread_percentage??null,observedAt:t.last_traded_at??observedAt,quality:t.is_stale?"low":"high",provider:this.id}));
  return{identity:asset,quote,candles,venues,provenance:[`${this.id}:coins/markets`,`${this.id}:coins/{id}/ohlc`,`${this.id}:coins/{id}/tickers`],generatedAt:new Date().toISOString()};
 }
}

export async function fetchCoinGeckoOverview(assets:AssetIdentity[],signal:AbortSignal){const active=assets.filter(asset=>asset.providerId&&asset.status==="active"),ids=active.map(asset=>asset.providerId).join(","),markets=await json<CoinMarket[]>(`${ROOT}/coins/markets?vs_currency=usd&ids=${encodeURIComponent(ids)}&price_change_percentage=24h&precision=full`,signal),byId=new Map(markets.map(item=>[item.id,item]));return assets.map(asset=>{const market=asset.providerId?byId.get(asset.providerId):undefined;return{assetId:asset.assetId,slug:asset.slug,symbol:asset.symbol,name:asset.name,networkId:asset.networkId,status:asset.status,price:market?.current_price??null,change24h:market?.price_change_percentage_24h??null,provider:market?"CoinGecko":"No conectado",observedAt:market?.last_updated??null}})}
