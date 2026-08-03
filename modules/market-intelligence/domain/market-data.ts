export type MarketConnectionState = "live" | "delayed" | "reconnecting" | "paused" | "unavailable";
export type MarketInterval = "1h" | "4h" | "1d";
export interface AssetIdentity { assetId:string; slug:string; providerId:string|null; binanceSymbol:string|null; networkId:string; contractAddress:string|null; symbol:string; name:string; status:"active"|"identity-pending"|"conceptual"; }
export interface QuoteSnapshot { assetId:string; price:number|null; change24h:number|null; volume24h:number|null; marketCap:number|null; high24h:number|null; low24h:number|null; circulatingSupply:number|null; totalSupply:number|null; observedAt:string; provider:string; state:MarketConnectionState; staleAfterSeconds:number; }
export interface OhlcvCandle { timestamp:number; open:number; high:number; low:number; close:number; volume:number|null; }
export interface VenueSnapshot { name:string; pair:string; price:number|null; volume:number|null; spread:number|null; observedAt:string; quality:"high"|"medium"|"low"; provider:string; }
export interface MarketDataBundle { identity:AssetIdentity; quote:QuoteSnapshot; candles:OhlcvCandle[]; venues:VenueSnapshot[]; provenance:string[]; generatedAt:string; cache:"hit"|"miss"|"stale"; fallbackUsed:boolean; errors:string[]; }
export interface MarketDataProvider { readonly id:string; supports(asset:AssetIdentity):boolean; fetchBundle(asset:AssetIdentity,interval:MarketInterval,signal:AbortSignal):Promise<Omit<MarketDataBundle,"cache"|"fallbackUsed"|"errors">>; }
