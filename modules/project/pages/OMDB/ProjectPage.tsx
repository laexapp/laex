"use client";

import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowUpRight, Blocks, Box, CircleDollarSign, Code2, Database, ExternalLink, Gauge, GraduationCap, Layers3, Link2, Network, RefreshCw, ShieldCheck, TriangleAlert, WalletCards, Waypoints } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/modules/layout/components/Header";
import DigitalAssetTerminal, { AssetSelector } from "./DigitalAssetTerminal";
import { omdbAssets } from "./assets";
import { isPublicMarketSlug, type DemoAssetSlug } from "./demo-assets";
import type { BlockchainIntelligenceSnapshot, EvidenceLevel } from "./types";

const chartModes = ["Velas", "Línea", "Área"] as const;
const ranges = ["24H", "7D", "1M", "3M", "1A", "TODO"] as const;
const evidenceLabels: Record<EvidenceLevel, string> = {
  "technically-verified": "Verificado por LAEX",
  "provided-by-project": "Proporcionado por el proyecto",
  "official-confirmed": "Fuente oficial",
  pending: "Pendiente de confirmación",
};
const explainers = [
  ["Precio", "Último valor observado en una fuente de mercado. Sin un mercado verificado, LAEX no presenta una cifra."],
  ["Volumen", "Valor negociado durante un período. Más volumen puede facilitar operaciones, pero no garantiza demanda sostenible."],
  ["Market Cap", "Precio multiplicado por suministro circulante verificable. Si la circulación es autorreportada, debe indicarse."],
  ["Supply", "Cantidad emitida, máxima o circulante. Son conceptos diferentes y afectan cómo se interpreta la oferta."],
  ["Liquidez y spread", "La liquidez mide facilidad de intercambio; el spread es la distancia entre mejor compra y venta."],
  ["Actividad blockchain", "Bloques, transacciones, direcciones y uso de gas ayudan a observar el uso técnico de una red."],
  ["Holders", "Direcciones que mantienen un token. No equivalen necesariamente a personas ni prueban adopción real."],
  ["Factores de demanda", "Utilidad, adopción, actividad, integraciones y acceso a mercados pueden aumentar o reducir el interés."],
  ["Riesgos", "Baja liquidez, concentración, cambios técnicos, contratos sin verificar y falta de evidencia elevan el riesgo."],
] as const;

export default function OMDBProjectPage() {
  const [slug, setSlug] = useState<DemoAssetSlug>("omdb");
  const [snapshot, setSnapshot] = useState<BlockchainIntelligenceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<(typeof chartModes)[number]>("Velas");
  const [range, setRange] = useState<(typeof ranges)[number]>("24H");
  const asset = useMemo(() => omdbAssets.find((entry) => entry.slug === slug) ?? omdbAssets[0], [slug]);

  const load = useCallback(async () => {
    if (isPublicMarketSlug(slug)) { setSnapshot(null); setLoading(false); return; }
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/omdb/intelligence?asset=${slug}`, { cache: "no-store" });
      setSnapshot(await response.json() as BlockchainIntelligenceSnapshot);
    } catch {
      setSnapshot(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 30_000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [load]);

  if (isPublicMarketSlug(slug)) return <DigitalAssetTerminal slug={slug} onSelect={setSlug} />;

  return (
    <main className="min-h-screen overflow-hidden bg-[#020711] text-white">
      <Header />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(0,207,255,.14),transparent_28%),radial-gradient(circle_at_88%_28%,rgba(54,83,255,.12),transparent_32%),linear-gradient(rgba(55,216,238,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(55,216,238,.025)_1px,transparent_1px)] bg-[size:auto,auto,64px_64px,64px_64px]" />

      <div className="relative mx-auto w-[min(100%-2rem,96rem)] pb-24 pt-8 sm:pt-12">
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[.08] pb-5">
          <Link href="/proyectos" className="text-xs font-bold uppercase tracking-[.18em] text-slate-500 hover:text-cyan-200">LAEX / PRJ-03</Link>
          <AssetSelector selected={slug} onSelect={setSlug} />
        </nav>

        <section className="mt-7 grid gap-5 xl:grid-cols-[.72fr_1.28fr]">
          <article className="relative overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-[linear-gradient(145deg,rgba(6,20,38,.98),rgba(2,7,17,.98))] p-7 shadow-[0_35px_110px_rgba(0,0,0,.48)] sm:p-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/10 blur-[80px]" />
            <div className="relative flex items-center gap-5">
              <Image src={slug === "omdb" ? "/projects/omdb/coin.png" : "/projects/omd/coin.png"} alt={asset.symbol} width={112} height={112} className="h-20 w-20 object-contain drop-shadow-[0_0_24px_rgba(34,211,238,.45)] sm:h-24 sm:w-24" />
              <div><span className="text-[10px] font-black uppercase tracking-[.24em] text-cyan-300">Blockchain & Market Intelligence</span><h1 className="mt-2 text-4xl font-black tracking-[-.05em] sm:text-5xl">{asset.symbol}</h1><p className="mt-1 text-sm text-slate-500">{asset.name}</p></div>
            </div>
            <p className="relative mt-7 max-w-xl text-base leading-8 text-slate-300">{asset.description}</p>
            <div className="relative mt-7 flex flex-wrap gap-2"><Evidence kind={asset.evidence} />{!asset.officialConfirmed && <Evidence kind="provided-by-project" />}</div>
            <dl className="relative mt-8 grid grid-cols-2 gap-3 text-sm">
              {[['Red', asset.networkName], ['Chain ID', asset.chainId], ['Tipo', asset.kind === 'native' ? 'Moneda nativa' : 'Token BEP-20'], ['Decimales', asset.decimals]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><dt className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-600">{label}</dt><dd className="mt-2 font-semibold text-slate-200">{value}</dd></div>)}
            </dl>
          </article>

          <article className="rounded-[2rem] border border-white/[.09] bg-[linear-gradient(160deg,rgba(7,18,33,.96),rgba(3,8,16,.98))] shadow-[0_35px_110px_rgba(0,0,0,.4)]">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[.07] p-5 sm:p-6">
              <div><span className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500">Estado de la evidencia</span><div className="mt-2 flex items-center gap-3"><StateBadge state={loading ? "DELAYED" : snapshot?.state ?? "UNAVAILABLE"} /><span className="text-xs text-slate-600">{snapshot ? new Date(snapshot.observedAt).toLocaleString("es-DO") : "Esperando datos"}</span></div></div>
              <button onClick={() => void load()} className="flex h-10 items-center gap-2 rounded-xl border border-white/[.08] px-3 text-xs font-bold text-cyan-200"><RefreshCw size={14} className={loading ? "animate-spin" : ""} />Actualizar</button>
            </header>
            <div className="grid gap-px bg-white/[.06] sm:grid-cols-2 lg:grid-cols-4">
              {(snapshot?.metrics.slice(0, 8) ?? Array.from({ length: 8 })).map((metric, index) => metric ? <MetricCard key={metric.key} metric={metric} index={index} /> : <div key={index} className="min-h-32 animate-pulse bg-[#06101d] p-5"><div className="h-3 w-20 rounded bg-white/5" /><div className="mt-5 h-7 w-28 rounded bg-white/5" /></div>)}
            </div>
            <div className="grid gap-4 border-t border-white/[.07] p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><span className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-600">Procedencia</span><p className="mt-2 text-sm text-slate-400">{snapshot?.source ?? "RPC y explorer pendientes"}</p>{snapshot?.latestBlock && <p className="mt-2 break-all font-mono text-[11px] text-slate-600">Bloque {snapshot.latestBlock.number} · {snapshot.latestBlock.hash}</p>}</div>
              <a href={asset.explorerUrl} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-300/[.06] px-4 text-xs font-bold text-cyan-200">Abrir explorer <ExternalLink size={13} /></a>
            </div>
          </article>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
          <article className="overflow-hidden rounded-[2rem] border border-white/[.09] bg-[#050d18]/95">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[.07] p-5 sm:p-6"><div><span className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">Market Intelligence</span><h2 className="mt-2 text-2xl font-bold">Terminal preparada</h2></div><div className="flex gap-1">{chartModes.map(value => <button key={value} onClick={() => setMode(value)} className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === value ? "bg-cyan-300/10 text-cyan-200" : "text-slate-600"}`}>{value}</button>)}</div></header>
            <div className="flex flex-wrap gap-1 border-b border-white/[.06] px-5 py-3 sm:px-6">{ranges.map(value => <button key={value} onClick={() => setRange(value)} className={`rounded-lg px-3 py-2 text-[11px] font-bold ${range === value ? "bg-blue-400/10 text-blue-200" : "text-slate-600"}`}>{value}</button>)}</div>
            <div className="relative grid min-h-[360px] place-items-center overflow-hidden bg-[linear-gradient(rgba(148,163,184,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.06)_1px,transparent_1px)] bg-[size:72px_52px] p-8 text-center">
              <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" /><div className="relative max-w-md"><Activity className="mx-auto text-cyan-300" size={38} /><h3 className="mt-5 text-xl font-bold">Pendiente de fuente verificada</h3><p className="mt-3 text-sm leading-7 text-slate-500">{mode} · {range}. El renderer está preparado, pero LAEX no dibujará precio ni velas hasta validar un proveedor OHLCV inequívoco para {asset.symbol}.</p></div>
            </div>
          </article>
          <article className="rounded-[2rem] border border-amber-200/15 bg-[linear-gradient(160deg,rgba(27,23,8,.72),rgba(5,10,17,.96))] p-6 sm:p-7"><span className="text-[10px] font-black uppercase tracking-[.2em] text-amber-300">Mercado · sin inferencias</span><h2 className="mt-3 text-2xl font-bold">Datos financieros</h2><div className="mt-6 space-y-2">{["Precio actual", "Variación 24H", "Volumen 24H", "Market Cap", "Supply circulante", "Liquidez", "Mercados y pares"].map(label => <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-white/[.06] bg-black/15 px-4 py-3"><span className="text-xs text-slate-400">{label}</span><span className="text-right text-[10px] font-bold text-amber-200">Pendiente de fuente verificada</span></div>)}</div><div className="mt-6 flex gap-3 rounded-2xl border border-amber-200/10 p-4"><TriangleAlert size={17} className="shrink-0 text-amber-300" /><p className="text-xs leading-6 text-slate-500">LAEX no estima precio, capitalización ni liquidez a partir de supply, contratos o información histórica.</p></div></article>
        </section>

        <section className="mt-5 rounded-[2rem] border border-white/[.09] bg-[#050d18]/90 p-6 sm:p-8"><div className="flex items-center gap-3 text-cyan-300"><GraduationCap size={20} /><span className="text-[11px] font-black uppercase tracking-[.2em]">Entiende lo que estás viendo</span></div><h2 className="mt-4 text-3xl font-bold tracking-[-.04em]">Datos claros antes de decisiones.</h2><div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{explainers.map(([title, copy]) => <details key={title} className="group rounded-2xl border border-white/[.07] bg-white/[.025] p-5 open:border-cyan-200/15 open:bg-cyan-300/[.025]"><summary className="cursor-pointer list-none text-sm font-bold text-slate-200">{title}<span className="float-right text-cyan-300">+</span></summary><p className="mt-4 text-sm leading-7 text-slate-500">{copy}</p></details>)}</div></section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <EvidencePanel />
          <article className="rounded-[2rem] border border-white/[.09] bg-[#050d18]/90 p-6 sm:p-7"><div className="flex items-center gap-3 text-violet-300"><Waypoints size={19} /><span className="text-[10px] font-black uppercase tracking-[.2em]">Historial / Migración</span></div><h2 className="mt-4 text-2xl font-bold">Sin historia reconstruida</h2><p className="mt-4 text-sm leading-7 text-slate-500">OMD existe técnicamente en BNB Smart Chain y OMDB es nativo de Chain 9580. No existe evidencia suficiente para afirmar que uno migró al otro.</p><div className="mt-5 rounded-2xl border border-dashed border-violet-200/15 p-4 text-xs leading-6 text-violet-200">Contrato anterior → evidencia de migración → contrato/red nueva<br /><span className="text-slate-600">Pendiente de documentación oficial verificable.</span></div></article>
          <article className="rounded-[2rem] border border-white/[.09] bg-[#050d18]/90 p-6 sm:p-7"><div className="flex items-center gap-3 text-blue-300"><Link2 size={19} /><span className="text-[10px] font-black uppercase tracking-[.2em]">Recursos</span></div><div className="mt-5 grid grid-cols-2 gap-2">{asset.resources.map(resource => resource.href ? <a key={resource.label} href={resource.href} target="_blank" rel="noreferrer" className="flex min-h-20 flex-col justify-between rounded-xl border border-white/[.07] bg-white/[.025] p-3 text-xs font-bold text-slate-300 hover:border-cyan-200/20"><span>{resource.label}</span><ArrowUpRight size={13} className="self-end text-cyan-300" /></a> : <div key={resource.label} className="flex min-h-20 flex-col justify-between rounded-xl border border-dashed border-white/[.06] p-3 text-xs text-slate-600"><span>{resource.label}</span><small>Pendiente</small></div>)}</div></article>
        </section>

        <footer className="mt-8 flex flex-col gap-4 border-t border-white/[.07] py-8 text-xs leading-6 text-slate-600 sm:flex-row sm:items-center sm:justify-between"><p>Contenido técnico y educativo. No constituye asesoría financiera ni promesa de rendimiento.</p><p>LAEX · Project Intelligence · PRJ-03</p></footer>
      </div>
    </main>
  );
}

function Evidence({ kind }: { kind: EvidenceLevel }) { return <span className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[.14em] ${kind === "technically-verified" ? "border-emerald-200/15 bg-emerald-300/[.06] text-emerald-300" : kind === "official-confirmed" ? "border-cyan-200/15 bg-cyan-300/[.06] text-cyan-200" : kind === "provided-by-project" ? "border-violet-200/15 bg-violet-300/[.06] text-violet-300" : "border-amber-200/15 bg-amber-300/[.06] text-amber-300"}`}>{evidenceLabels[kind]}</span>; }
function StateBadge({ state }: { state: "LIVE" | "DELAYED" | "UNAVAILABLE" }) { return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black ${state === "LIVE" ? "bg-emerald-300/10 text-emerald-300" : state === "DELAYED" ? "bg-amber-300/10 text-amber-300" : "bg-slate-500/10 text-slate-400"}`}><span className={`h-2 w-2 rounded-full ${state === "LIVE" ? "animate-pulse bg-emerald-300" : state === "DELAYED" ? "bg-amber-300" : "bg-slate-500"}`} />{state}</span>; }
function MetricCard({ metric, index }: { metric: NonNullable<BlockchainIntelligenceSnapshot["metrics"][number]>; index: number }) { const icons = [Network, Blocks, Activity, Gauge, WalletCards, CircleDollarSign, Box, Code2, Database, Layers3]; const Icon = icons[index % icons.length]; return <div className="min-h-32 bg-[#06101d] p-5"><Icon size={17} className="text-cyan-300" /><p className="mt-4 text-[10px] font-bold uppercase tracking-[.14em] text-slate-600">{metric.label}</p><strong className="mt-2 block truncate text-xl tracking-[-.03em] text-slate-100">{metric.value ?? "No disponible"}</strong><p className="mt-2 text-[10px] leading-5 text-slate-600">{metric.detail}</p></div>; }
function EvidencePanel() { return <article className="rounded-[2rem] border border-white/[.09] bg-[#050d18]/90 p-6 sm:p-7"><div className="flex items-center gap-3 text-emerald-300"><ShieldCheck size={19} /><span className="text-[10px] font-black uppercase tracking-[.2em]">Evidencia y procedencia</span></div><div className="mt-5 space-y-3"><Evidence kind="technically-verified" /><p className="text-xs leading-6 text-slate-500">Dato observado directamente en RPC, explorer o contrato.</p><Evidence kind="provided-by-project" /><p className="text-xs leading-6 text-slate-500">Dato recibido del proyecto que aún requiere confirmación independiente.</p><Evidence kind="official-confirmed" /><p className="text-xs leading-6 text-slate-500">Identidad o recurso confirmado por una fuente oficial.</p><Evidence kind="pending" /><p className="text-xs leading-6 text-slate-500">LAEX no dispone de evidencia suficiente.</p></div></article>; }
