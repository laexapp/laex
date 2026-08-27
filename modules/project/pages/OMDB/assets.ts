import type { OmdbAssetDefinition, OmdbAssetSlug } from "./types";

export const omdbAssets: readonly OmdbAssetDefinition[] = [
  {
    slug: "omdb",
    name: "OMDBlockchain",
    symbol: "OMDB",
    kind: "native",
    networkName: "OMDB Mainnet",
    chainId: 9580,
    networkId: 9580,
    decimals: 18,
    contractAddress: null,
    rpcUrl: "https://rpc.omdbscan.com",
    explorerUrl: "https://omdbscan.com",
    description: "Moneda nativa de OMDB Mainnet, una red EVM independiente observada mediante RPC y explorador propios.",
    accent: "#23e5ff",
    evidence: "technically-verified",
    officialConfirmed: true,
    resources: [
      { label: "Explorer", href: "https://omdbscan.com", evidence: "technically-verified" },
      { label: "Sitio oficial", href: "https://omdblockchain.com", evidence: "official-confirmed" },
      { label: "Whitepaper", href: "https://omdblockchain.com/whitepaper/", evidence: "official-confirmed" },
      { label: "Documentación", evidence: "pending" },
      { label: "DEX", evidence: "pending" },
      { label: "CEX", evidence: "pending" },
    ],
  },
  {
    slug: "omd",
    name: "OneMillionDollars",
    symbol: "OMD",
    kind: "token",
    networkName: "BNB Smart Chain",
    chainId: 56,
    networkId: 56,
    decimals: 8,
    contractAddress: "0xA7670e2e6742a18029436E262b01F7C50A863C40",
    rpcUrl: "https://bsc-dataseed.bnbchain.org",
    explorerUrl: "https://bscscan.com/token/0xA7670e2e6742a18029436E262b01F7C50A863C40",
    description: "Contrato BEP-20 proporcionado por el proyecto y verificado técnicamente en BNB Smart Chain. Su confirmación oficial permanece separada.",
    accent: "#9d7cff",
    evidence: "technically-verified",
    officialConfirmed: false,
    resources: [
      { label: "Contrato", href: "https://bscscan.com/token/0xA7670e2e6742a18029436E262b01F7C50A863C40", evidence: "technically-verified" },
      { label: "Sitio oficial", evidence: "pending" },
      { label: "Whitepaper", evidence: "pending" },
      { label: "Wallet", evidence: "pending" },
      { label: "DEX", evidence: "pending" },
      { label: "CEX", evidence: "pending" },
    ],
  },
] as const;

export function findOmdbAsset(slug: string): OmdbAssetDefinition | undefined {
  return omdbAssets.find((asset) => asset.slug === slug);
}

export function isOmdbAssetSlug(value: string): value is OmdbAssetSlug {
  return omdbAssets.some((asset) => asset.slug === value);
}
