"use client";

import Image from "next/image";
import { Activity, Blocks, Radio } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MarketDataBundle, OhlcvCandle } from "@/modules/market-intelligence/domain";
import type { BlockchainIntelligenceSnapshot } from "@/modules/project/pages/OMDB/types";
import { demoAssetOptions, type DemoAssetSlug } from "@/modules/project/pages/OMDB/demo-assets";

type Snapshot =
  | { kind: "market"; data: MarketDataBundle }
  | { kind: "blockchain"; data: BlockchainIntelligenceSnapshot };

const ROTATION_MS = 7_500;
const marketAssets = new Set<DemoAssetSlug>(["bitcoin", "ethereum", "tether"]);

const money = (value: number | null) => {
  if (value == null) return "Dato no disponible";
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
};

function MiniCandles({ candles }: { candles: OhlcvCandle[] }) {
  const visible = candles.slice(-22);
  if (visible.length < 2) {
    return <div className="h-16 rounded-xl border border-dashed border-white/10 bg-white/[.015]" />;
  }

  const low = Math.min(...visible.map((candle) => candle.low));
  const high = Math.max(...visible.map((candle) => candle.high));
  const range = Math.max(high - low, Math.abs(high) * 0.0001, 1e-8);
  const width = 220;
  const height = 64;
  const y = (value: number) => 4 + ((high - value) / range) * (height - 8);
  const step = width / visible.length;
  const bodyWidth = Math.max(2.5, Math.min(6, step * 0.58));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-16 w-full overflow-visible" role="img" aria-label="Últimas velas verificadas">
      <defs>
        <linearGradient id="mini-market-fade" x1="0" x2="1">
          <stop offset="0" stopColor="#22d3ee" stopOpacity=".03" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity=".14" />
        </linearGradient>
      </defs>
      <rect width={width} height={height} rx="10" fill="url(#mini-market-fade)" />
      {visible.map((candle, index) => {
        const positive = candle.close >= candle.open;
        const color = positive ? "#34d399" : "#fb7185";
        const x = index * step + step / 2;
        const bodyTop = y(Math.max(candle.open, candle.close));
        const bodyBottom = y(Math.min(candle.open, candle.close));
        return (
          <g key={`${candle.timestamp}-${index}`}>
            <line x1={x} x2={x} y1={y(candle.high)} y2={y(candle.low)} stroke={color} strokeWidth="1" opacity=".9" />
            <rect x={x - bodyWidth / 2} y={bodyTop} width={bodyWidth} height={Math.max(1.5, bodyBottom - bodyTop)} rx=".7" fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

function BlockchainPulse({ snapshot }: { snapshot: BlockchainIntelligenceSnapshot | null }) {
  const height = snapshot?.metrics.find((metric) => metric.key === "height")?.value;
  return (
    <div className="relative h-16 overflow-hidden rounded-xl border border-cyan-200/10 bg-cyan-300/[.025]">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-x-3 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent shadow-[0_0_14px_rgba(34,211,238,.75)]" />
      <div className="relative flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2 text-cyan-200"><Blocks size={16} /><span className="text-[9px] font-black uppercase tracking-[.16em]">Actividad on-chain</span></div>
        <div className="text-right"><span className="block text-[8px] uppercase tracking-[.12em] text-slate-600">Bloque observado</span><b className="font-mono text-xs text-white">{height ?? "Verificando…"}</b></div>
      </div>
    </div>
  );
}

export default function DigitalAssetProjectVisual() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [snapshots, setSnapshots] = useState<Partial<Record<DemoAssetSlug, Snapshot>>>({});
  const asset = demoAssetOptions[activeIndex];
  const snapshot = snapshots[asset.slug];

  const load = useCallback(async (slug: DemoAssetSlug) => {
    try {
      const isMarket = marketAssets.has(slug);
      const response = await fetch(
        isMarket
          ? `/api/market-intelligence?asset=${slug}&interval=24h`
          : `/api/projects/omdb/intelligence?asset=${slug}`,
        { cache: "no-store" },
      );
      if (!response.ok) return;
      const data = await response.json();
      setSnapshots((current) => ({
        ...current,
        [slug]: isMarket
          ? { kind: "market", data: data as MarketDataBundle }
          : { kind: "blockchain", data: data as BlockchainIntelligenceSnapshot },
      }));
    } catch {
      // The card keeps an explicit loading state; it never substitutes demo data.
    }
  }, []);

  useEffect(() => {
    if (!snapshot) void load(asset.slug);
  }, [asset.slug, load, snapshot]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % demoAssetOptions.length);
    }, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  const market = snapshot?.kind === "market" ? snapshot.data : null;
  const blockchain = snapshot?.kind === "blockchain" ? snapshot.data : null;
  const positive = (market?.quote.change24h ?? 0) >= 0;
  const state = market?.quote.state.toUpperCase() ?? blockchain?.state ?? "CONECTANDO";
  const chainId = blockchain?.metrics.find((metric) => metric.key === "chain")?.value;

  const dots = useMemo(() => demoAssetOptions.map((entry) => entry.slug), []);

  return (
    <div
      className="absolute inset-0 flex flex-col bg-[radial-gradient(circle_at_82%_10%,rgba(34,211,238,.15),transparent_45%),linear-gradient(145deg,#071523,#030914)] p-4 transition-shadow duration-500 group-hover:shadow-[inset_0_0_45px_rgba(34,211,238,.08)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.05] shadow-[0_0_20px_rgba(34,211,238,.08)]">
            <Image src={asset.logo} alt="" width={34} height={34} className="h-8 w-8 object-contain" />
          </div>
          <div className="min-w-0"><b className="block text-lg tracking-[-.03em] text-white">{asset.symbol}</b><span className="block truncate text-[9px] uppercase tracking-[.14em] text-slate-500">{asset.name}</span></div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[8px] font-black tracking-[.12em] ${state === "LIVE" ? "border-emerald-300/20 bg-emerald-300/[.07] text-emerald-300" : "border-cyan-200/15 bg-cyan-300/[.05] text-cyan-200"}`}><Radio size={9} />{state}</span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        {market ? (
          <><strong className="truncate text-xl tracking-[-.04em] text-white">{money(market.quote.price)}</strong><span className={`shrink-0 text-xs font-bold ${positive ? "text-emerald-300" : "text-rose-300"}`}>{market.quote.change24h == null ? "24H —" : `${positive ? "+" : ""}${market.quote.change24h.toFixed(2)}%`}</span></>
        ) : (
          <><div><span className="block text-[8px] uppercase tracking-[.14em] text-slate-600">Identidad de red</span><strong className="mt-1 block text-sm text-white">Chain ID {chainId ?? "verificando"}</strong></div><Activity size={18} className="text-cyan-300" /></>
        )}
      </div>

      <div className="mt-2">{market ? <MiniCandles candles={market.candles} /> : <BlockchainPulse snapshot={blockchain} />}</div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <span className="truncate text-[8px] uppercase tracking-[.12em] text-slate-600">{market?.quote.provider ?? blockchain?.source ?? "Fuente verificable"}</span>
        <div className="flex gap-1.5" aria-hidden="true">{dots.map((slug, index) => <span key={slug} className={`h-1 rounded-full transition-all duration-500 ${index === activeIndex ? "w-4 bg-cyan-300" : "w-1 bg-white/15"}`} />)}</div>
      </div>
    </div>
  );
}
