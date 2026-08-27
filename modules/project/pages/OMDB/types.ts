export type EvidenceLevel = "technically-verified" | "provided-by-project" | "official-confirmed" | "pending";
export type IntelligenceState = "LIVE" | "DELAYED" | "UNAVAILABLE";
export type OmdbAssetSlug = "omdb" | "omd";

export interface OmdbAssetDefinition {
  slug: OmdbAssetSlug;
  name: string;
  symbol: string;
  kind: "native" | "token";
  networkName: string;
  chainId: number;
  networkId: number;
  decimals: number;
  contractAddress: string | null;
  rpcUrl: string;
  explorerUrl: string;
  description: string;
  accent: string;
  evidence: EvidenceLevel;
  officialConfirmed: boolean;
  resources: Array<{ label: string; href?: string; evidence: EvidenceLevel }>;
}

export interface BlockchainMetric {
  key: string;
  label: string;
  value: string | number | null;
  detail: string;
  evidence: EvidenceLevel;
}

export interface BlockchainIntelligenceSnapshot {
  asset: OmdbAssetSlug;
  state: IntelligenceState;
  observedAt: string;
  source: string;
  sourceUrl: string;
  metrics: BlockchainMetric[];
  latestBlock: { number: number; hash: string; timestamp: string; transactions: number } | null;
  provenance: string[];
  limitations: string[];
}
