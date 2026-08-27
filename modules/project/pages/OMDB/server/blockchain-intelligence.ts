import "server-only";

import { findOmdbAsset } from "../assets";
import type { BlockchainIntelligenceSnapshot, OmdbAssetSlug } from "../types";

type JsonRpcResponse<T> = { result?: T; error?: { code: number; message: string } };
type ExplorerStats = {
  average_block_time?: number;
  gas_prices?: { average?: number };
  gas_used_today?: string;
  network_utilization_percentage?: number;
  total_addresses?: string;
  total_blocks?: string;
  total_transactions?: string;
  transactions_today?: string;
};
type ExplorerBlock = { height: number; hash: string; timestamp: string; transactions_count: number };

const TIMEOUT_MS = 7_000;
const asDecimal = (hex: string) => Number.parseInt(hex, 16);
const compact = (value: string | number | null) => value == null ? null : new Intl.NumberFormat("es-DO", { notation: "compact", maximumFractionDigits: 2 }).format(Number(value));
const uint = (hex: string) => BigInt(hex || "0x0");
const addressFromWord = (hex: string) => `0x${hex.slice(-40)}`;
function abiString(hex: string) {
  const value = hex.slice(2);
  const offset = Number(BigInt(`0x${value.slice(0, 64)}`)) * 2;
  const length = Number(BigInt(`0x${value.slice(offset, offset + 64)}`));
  return Buffer.from(value.slice(offset + 64, offset + 64 + length * 2), "hex").toString("utf8");
}
function units(value: bigint, decimals: number) {
  const base = BigInt(10) ** BigInt(decimals), whole = value / base, remainder = value % base;
  return remainder === BigInt(0) ? whole.toString() : `${whole}.${remainder.toString().padStart(decimals, "0").replace(/0+$/, "")}`;
}

async function rpc<T>(url: string, method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`rpc_http_${response.status}`);
  const body = await response.json() as JsonRpcResponse<T>;
  if (body.error || body.result === undefined) throw new Error(body.error?.message ?? "rpc_invalid_response");
  return body.result;
}

async function explorer<T>(path: string): Promise<T> {
  const response = await fetch(`https://omdbscan.com${path}`, { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`explorer_http_${response.status}`);
  return response.json() as Promise<T>;
}

async function omdbSnapshot(): Promise<BlockchainIntelligenceSnapshot> {
  const observedAt = new Date().toISOString();
  try {
    const [chainHex, networkId, clientVersion, blockHex, stats, blocks, tokens, contracts] = await Promise.all([
      rpc<string>("https://rpc.omdbscan.com", "eth_chainId"),
      rpc<string>("https://rpc.omdbscan.com", "net_version"),
      rpc<string>("https://rpc.omdbscan.com", "web3_clientVersion"),
      rpc<string>("https://rpc.omdbscan.com", "eth_blockNumber"),
      explorer<ExplorerStats>("/api/v2/stats"),
      explorer<{ items: ExplorerBlock[] }>("/api/v2/blocks?type=block"),
      explorer<{ items: unknown[] }>("/api/v2/tokens"),
      explorer<{ items: unknown[] }>("/api/v2/smart-contracts?filter=verified"),
    ]);
    const chainId = asDecimal(chainHex);
    if (chainId !== 9580 || Number(networkId) !== 9580) throw new Error("omdb_identity_mismatch");
    const latest = blocks.items[0] ?? null;
    return {
      asset: "omdb",
      state: "LIVE",
      observedAt,
      source: "OMDB RPC + OMDB Mainnet Explorer",
      sourceUrl: "https://omdbscan.com",
      latestBlock: latest ? { number: latest.height, hash: latest.hash, timestamp: latest.timestamp, transactions: latest.transactions_count } : null,
      metrics: [
        { key: "chain", label: "Chain ID", value: chainId, detail: "Identidad devuelta por eth_chainId.", evidence: "technically-verified" },
        { key: "height", label: "Altura de cadena", value: asDecimal(blockHex), detail: "Último bloque observado por RPC.", evidence: "technically-verified" },
        { key: "transactions", label: "Transacciones", value: compact(stats.total_transactions ?? null), detail: "Total indexado por el explorer.", evidence: "technically-verified" },
        { key: "today", label: "Actividad hoy", value: compact(stats.transactions_today ?? null), detail: "Transacciones indexadas durante el día.", evidence: "technically-verified" },
        { key: "addresses", label: "Direcciones", value: compact(stats.total_addresses ?? null), detail: "Direcciones observadas por el explorer.", evidence: "technically-verified" },
        { key: "gas", label: "Gas promedio", value: stats.gas_prices?.average == null ? null : `${stats.gas_prices.average} Gwei`, detail: "Estimación actual del explorer.", evidence: "technically-verified" },
        { key: "block-time", label: "Tiempo de bloque", value: stats.average_block_time == null ? null : `${stats.average_block_time / 1000} s`, detail: "Promedio calculado por el explorer.", evidence: "technically-verified" },
        { key: "utilization", label: "Utilización", value: stats.network_utilization_percentage == null ? null : `${stats.network_utilization_percentage.toFixed(4)} %`, detail: "Capacidad de red utilizada.", evidence: "technically-verified" },
        { key: "tokens", label: "Tokens indexados", value: tokens.items.length, detail: "Contratos token visibles en la API.", evidence: "technically-verified" },
        { key: "contracts", label: "Contratos verificados", value: contracts.items.length, detail: "Código fuente verificado en el explorer.", evidence: "technically-verified" },
      ],
      provenance: ["RPC eth_chainId", "RPC net_version", "RPC eth_blockNumber", "Explorer API v2/stats", "Explorer API v2/blocks", clientVersion],
      limitations: ["Las cifras dependen del estado de indexación del explorer.", "Precio, suministro circulante, liquidez y mercados no forman parte de esta consulta."],
    };
  } catch (error) {
    return unavailable("omdb", observedAt, error);
  }
}

async function omdSnapshot(): Promise<BlockchainIntelligenceSnapshot> {
  const observedAt = new Date().toISOString();
  const asset = findOmdbAsset("omd");
  if (!asset?.contractAddress) return unavailable("omd", observedAt, new Error("contract_missing"));
  try {
    const [chainHex, code, blockHex, nameHex, symbolHex, decimalsHex, supplyHex, ownerHex] = await Promise.all([
      rpc<string>(asset.rpcUrl, "eth_chainId"),
      rpc<string>(asset.rpcUrl, "eth_getCode", [asset.contractAddress, "latest"]),
      rpc<string>(asset.rpcUrl, "eth_blockNumber"),
      rpc<string>(asset.rpcUrl, "eth_call", [{ to: asset.contractAddress, data: "0x06fdde03" }, "latest"]),
      rpc<string>(asset.rpcUrl, "eth_call", [{ to: asset.contractAddress, data: "0x95d89b41" }, "latest"]),
      rpc<string>(asset.rpcUrl, "eth_call", [{ to: asset.contractAddress, data: "0x313ce567" }, "latest"]),
      rpc<string>(asset.rpcUrl, "eth_call", [{ to: asset.contractAddress, data: "0x18160ddd" }, "latest"]),
      rpc<string>(asset.rpcUrl, "eth_call", [{ to: asset.contractAddress, data: "0x8da5cb5b" }, "latest"]),
    ]);
    const chainId = asDecimal(chainHex);
    if (chainId !== 56 || code === "0x") throw new Error("omd_contract_identity_mismatch");
    const name = abiString(nameHex), symbol = abiString(symbolHex), decimals = Number(uint(decimalsHex)), totalSupply = units(uint(supplyHex), decimals), owner = addressFromWord(ownerHex);
    if (name !== "OneMillionDollars" || symbol !== "OMD") throw new Error("omd_metadata_mismatch");
    return {
      asset: "omd",
      state: "LIVE",
      observedAt,
      source: "BNB Smart Chain RPC",
      sourceUrl: asset.explorerUrl,
      latestBlock: null,
      metrics: [
        { key: "chain", label: "Chain ID", value: chainId, detail: "Red donde existe el bytecode proporcionado.", evidence: "technically-verified" },
        { key: "contract", label: "Contrato", value: `${asset.contractAddress.slice(0, 8)}…${asset.contractAddress.slice(-6)}`, detail: asset.contractAddress, evidence: "provided-by-project" },
        { key: "name", label: "Nombre on-chain", value: name, detail: "Respuesta dinámica del contrato.", evidence: "technically-verified" },
        { key: "symbol", label: "Símbolo", value: symbol, detail: "Respuesta dinámica del contrato.", evidence: "technically-verified" },
        { key: "decimals", label: "Decimales", value: decimals, detail: "Respuesta dinámica del contrato.", evidence: "technically-verified" },
        { key: "supply", label: "Total supply", value: `${new Intl.NumberFormat("en-US").format(Number(totalSupply))} OMD`, detail: "totalSupply on-chain; no equivale a circulación.", evidence: "technically-verified" },
        { key: "bytecode", label: "Bytecode", value: `${(code.length - 2) / 2} bytes`, detail: "Código presente en el estado actual de BSC.", evidence: "technically-verified" },
        { key: "owner", label: "Owner", value: `${owner.slice(0, 8)}…${owner.slice(-6)}`, detail: owner, evidence: "technically-verified" },
        { key: "height", label: "Bloque BSC", value: asDecimal(blockHex), detail: "Altura de la red, no actividad específica del token.", evidence: "technically-verified" },
      ],
      provenance: ["BSC RPC eth_chainId", "BSC RPC eth_getCode", "Contrato ERC-20 name/symbol/decimals/totalSupply auditado el 2026-08-26"],
      limitations: ["Official-confirmed continúa pendiente.", "Holders, transferencias y bloque de despliegue requieren una fuente de explorer autorizada.", "No existe evidencia técnica de migración hacia OMDB Mainnet."],
    };
  } catch (error) {
    return unavailable("omd", observedAt, error);
  }
}

function unavailable(asset: OmdbAssetSlug, observedAt: string, error: unknown): BlockchainIntelligenceSnapshot {
  return { asset, state: "UNAVAILABLE", observedAt, source: "Sin conexión", sourceUrl: findOmdbAsset(asset)?.explorerUrl ?? "", metrics: [], latestBlock: null, provenance: [], limitations: [error instanceof Error ? error.message : "unknown_error"] };
}

export function getBlockchainIntelligence(asset: OmdbAssetSlug) {
  return asset === "omdb" ? omdbSnapshot() : omdSnapshot();
}
