import type {
  AssetIdentity,
  MarketDataBundle,
  MarketDataProvider,
  MarketInterval,
  OhlcvCandle,
  QuoteSnapshot,
  VenueSnapshot,
} from "../../domain";
const ROOT = "https://data-api.binance.vision/api/v3";
async function json<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`binance_http_${response.status}`);
  return response.json() as Promise<T>;
}
export class BinanceMarketDataProvider implements MarketDataProvider {
  readonly id = "binance-market-data-only";
  supports(asset: AssetIdentity) {
    return Boolean(asset.binanceSymbol && asset.status === "active");
  }
  async fetchBundle(
    asset: AssetIdentity,
    interval: MarketInterval,
    signal: AbortSignal,
  ): Promise<Omit<MarketDataBundle, "cache" | "fallbackUsed" | "errors">> {
    if (!asset.binanceSymbol) throw new Error("binance_symbol_missing");
    const symbol = encodeURIComponent(asset.binanceSymbol);
    const rangeConfig: Record<MarketInterval, { interval: string; limit: number }> = {
      "1h": { interval: "1m", limit: 60 },
      "24h": { interval: "30m", limit: 48 },
      "7d": { interval: "4h", limit: 42 },
      "30d": { interval: "4h", limit: 180 },
      "90d": { interval: "1d", limit: 90 },
      "365d": { interval: "1d", limit: 365 },
      max: { interval: "1w", limit: 1000 },
    };
    const selectedRange = rangeConfig[interval];
    const [ticker, klines] = await Promise.all([
      json<Record<string, string>>(
        `${ROOT}/ticker/24hr?symbol=${symbol}`,
        signal,
      ),
      json<Array<Array<string | number>>>(
        `${ROOT}/klines?symbol=${symbol}&interval=${selectedRange.interval}&limit=${selectedRange.limit}`,
        signal,
      ),
    ]);
    const observedAt = new Date().toISOString();
    const quote: QuoteSnapshot = {
      assetId: asset.assetId,
      price: Number(ticker.lastPrice),
      change24h: Number(ticker.priceChangePercent),
      volume24h: Number(ticker.quoteVolume),
      marketCap: null,
      high24h: Number(ticker.highPrice),
      low24h: Number(ticker.lowPrice),
      circulatingSupply: null,
      totalSupply: null,
      observedAt,
      provider: this.id,
      state: "live",
      staleAfterSeconds: 45,
    };
    const candles: OhlcvCandle[] = klines.map((row) => ({
      timestamp: Number(row[0]),
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5]),
    }));
    const venues: VenueSnapshot[] = [
      {
        name: "Binance",
        pair: asset.binanceSymbol.replace("USDT", "/USDT"),
        price: quote.price,
        volume: quote.volume24h,
        spread: quote.price
          ? ((Number(ticker.askPrice) - Number(ticker.bidPrice)) /
              quote.price) *
            100
          : null,
        observedAt,
        quality: "high",
        provider: this.id,
      },
    ];
    return {
      identity: asset,
      quote,
      candles,
      venues,
      provenance: [`${this.id}:ticker/24hr`, `${this.id}:klines`],
      generatedAt: observedAt,
    };
  }
}
