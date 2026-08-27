export const demoAssetOptions = [
  { slug: "bitcoin", symbol: "BTC", name: "Bitcoin", group: "market", logo: "/assets/market-intelligence/icons/btc.svg" },
  { slug: "ethereum", symbol: "ETH", name: "Ethereum", group: "market", logo: "/assets/market-intelligence/icons/eth.svg" },
  { slug: "tether", symbol: "USDT", name: "Tether", group: "market", logo: "/assets/market-intelligence/icons/usdt.svg" },
  { slug: "omdb", symbol: "OMDB", name: "OMDBlockchain", group: "project", logo: "/projects/omdb/coin.png" },
  { slug: "omd", symbol: "OMD", name: "OneMillionDollars", group: "project", logo: "/projects/omd/coin.png" },
] as const;

export type DemoAssetSlug = (typeof demoAssetOptions)[number]["slug"];
export type PublicMarketSlug = Extract<
  DemoAssetSlug,
  "bitcoin" | "ethereum" | "tether"
>;

export function isPublicMarketSlug(
  slug: DemoAssetSlug,
): slug is PublicMarketSlug {
  return slug === "bitcoin" || slug === "ethereum" || slug === "tether";
}
