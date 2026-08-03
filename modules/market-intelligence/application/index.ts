import { MarketDataOrchestrator } from "./MarketDataOrchestrator";
import { BinanceMarketDataProvider, CoinGeckoProvider } from "../infrastructure/providers";
export const marketDataOrchestrator=new MarketDataOrchestrator([new CoinGeckoProvider(),new BinanceMarketDataProvider()]);
export * from "./MarketDataOrchestrator";
export * from "./MarketNarrative";
