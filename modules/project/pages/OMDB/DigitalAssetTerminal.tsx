"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  BarChart3,
  BookOpen,
  Clock3,
  Database,
  Globe2,
  Layers3,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/modules/layout/components/Header";
import { MarketTerminal } from "@/modules/market-intelligence/components";
import {
  findMarketAsset,
  type MarketDataBundle,
} from "@/modules/market-intelligence/domain";
import {
  demoAssetOptions,
  type DemoAssetSlug,
  type PublicMarketSlug,
} from "./demo-assets";

const money = (value: number | null | undefined) =>
  value == null
    ? "Dato no disponible"
    : new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: value < 1 ? 6 : 2,
      }).format(value);
const compact = (value: number | null | undefined) =>
  value == null
    ? "Dato no disponible"
    : new Intl.NumberFormat("es-DO", {
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(value);

export default function DigitalAssetTerminal({
  slug,
  onSelect,
}: {
  slug: PublicMarketSlug;
  onSelect: (slug: DemoAssetSlug) => void;
}) {
  const identity = useMemo(() => findMarketAsset(slug), [slug]);
  const [bundle, setBundle] = useState<MarketDataBundle | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/market-intelligence?asset=${slug}&interval=1h`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error(`market_http_${response.status}`);
      setBundle((await response.json()) as MarketDataBundle);
    } catch {
      setBundle(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 30_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [load]);

  if (!identity) return null;
  const selectedAsset = demoAssetOptions.find((entry) => entry.slug === slug)!;
  const quote = bundle?.quote;
  const isLive = quote?.state === "live" || quote?.state === "delayed";
  const positive = (quote?.change24h ?? 0) >= 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#020711] text-white">
      <Header />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_16%,rgba(0,207,255,.13),transparent_27%),radial-gradient(circle_at_84%_22%,rgba(80,70,255,.11),transparent_30%),linear-gradient(rgba(55,216,238,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(55,216,238,.025)_1px,transparent_1px)] bg-[size:auto,auto,64px_64px,64px_64px]" />
      <div className="relative mx-auto w-[min(100%-2rem,96rem)] pb-24 pt-8 sm:pt-12">
        <nav className="flex flex-col gap-4 border-b border-white/[.08] pb-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <Link
              href="/proyectos"
              className="text-xs font-bold uppercase tracking-[.18em] text-slate-500 hover:text-cyan-200"
            >
              LAEX / PRJ-03
            </Link>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">
              Digital Asset Intelligence
            </p>
          </div>
          <AssetSelector selected={slug} onSelect={onSelect} />
        </nav>

        <section className="mt-7 grid gap-5 xl:grid-cols-[.72fr_1.28fr]">
          <article className="relative overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-[linear-gradient(145deg,rgba(6,20,38,.98),rgba(2,7,17,.98))] p-7 shadow-[0_35px_110px_rgba(0,0,0,.48)] sm:p-10">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-[70px]" />
            <div className="relative flex items-center gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[1.6rem] border border-cyan-200/20 bg-[radial-gradient(circle_at_35%_30%,rgba(103,232,249,.18),rgba(15,32,54,.9))] shadow-[0_0_38px_rgba(34,211,238,.16)] sm:h-24 sm:w-24">
                <Image src={selectedAsset.logo} alt={`Logo de ${identity.name}`} width={72} height={72} className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[.24em] text-cyan-300">
                  Dato de mercado verificable
                </span>
                <h1 className="mt-2 text-4xl font-black tracking-[-.05em] sm:text-5xl">
                  {identity.name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {identity.symbol} · {identity.networkId}
                </p>
              </div>
            </div>
            <div className="relative mt-8">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-600">
                Precio observado
              </p>
              <strong className="mt-2 block text-4xl tracking-[-.05em] sm:text-5xl">
                {loading ? "Actualizando…" : money(quote?.price)}
              </strong>
              <p
                className={`mt-3 text-sm font-bold ${positive ? "text-emerald-300" : "text-rose-300"}`}
              >
                {quote?.change24h == null
                  ? "Variación no disponible"
                  : `${positive ? "+" : ""}${quote.change24h.toFixed(2)}% en 24 h`}
              </p>
            </div>
            <div className="relative mt-7 flex flex-wrap gap-2">
              <EvidenceChip
                icon={Database}
                label="Dato de mercado"
                tone="cyan"
              />
              <EvidenceChip
                icon={ShieldCheck}
                label="Identidad verificada"
                tone="emerald"
              />
            </div>
          </article>

          <article className="overflow-hidden rounded-[2rem] border border-white/[.09] bg-[linear-gradient(160deg,rgba(7,18,33,.96),rgba(3,8,16,.98))] shadow-[0_35px_110px_rgba(0,0,0,.4)]">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[.07] p-5 sm:p-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500">
                  Resumen dinámico
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${isLive ? "animate-pulse bg-emerald-300" : "bg-amber-300"}`}
                  />
                  <b className={isLive ? "text-emerald-300" : "text-amber-300"}>
                    {quote?.state?.toUpperCase() ?? "CARGANDO"}
                  </b>
                </div>
              </div>
              <button
                onClick={() => void load()}
                className="rounded-xl border border-white/[.08] px-4 py-2.5 text-xs font-bold text-cyan-200"
              >
                Actualizar
              </button>
            </header>
            <div className="grid gap-px bg-white/[.06] sm:grid-cols-2 lg:grid-cols-4">
              <SummaryMetric
                icon={BarChart3}
                label="Market Cap"
                value={money(quote?.marketCap)}
              />
              <SummaryMetric
                icon={Activity}
                label="Volumen 24 h"
                value={money(quote?.volume24h)}
              />
              <SummaryMetric
                icon={Layers3}
                label="Supply circulante"
                value={compact(quote?.circulatingSupply)}
              />
              <SummaryMetric
                icon={Globe2}
                label="Mercados observados"
                value={bundle ? String(bundle.venues.length) : "—"}
              />
            </div>
            <div className="grid gap-4 border-t border-white/[.07] p-5 sm:p-6 lg:grid-cols-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-600">
                  Fuente y actualización
                </span>
                <p className="mt-2 text-sm text-slate-300">
                  {quote?.provider ?? "Esperando proveedor"}
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <Clock3 size={13} />
                  {quote?.observedAt
                    ? new Date(quote.observedAt).toLocaleString("es-DO")
                    : "Sin actualización"}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-600">
                  Procedencia
                </span>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {bundle?.provenance.join(" · ") ||
                    "La fuente se mostrará cuando responda el proveedor."}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-5">
          <MarketTerminal key={slug} initialSlug={slug} />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-white/[.09] bg-[#050d18]/90 p-6 sm:p-7">
            <BookOpen className="text-cyan-300" size={20} />
            <h2 className="mt-4 text-xl font-bold">Cómo leer esta terminal</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Precio, variación, volumen y gráfica describen actividad
              observada. No predicen rendimiento futuro ni constituyen
              recomendación de inversión.
            </p>
          </article>
          <article className="rounded-[2rem] border border-white/[.09] bg-[#050d18]/90 p-6 sm:p-7">
            <Database className="text-violet-300" size={20} />
            <h2 className="mt-4 text-xl font-bold">
              Clasificación de evidencia
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Esta vista usa datos de mercado dinámicos. La información
              on-chain, la proporcionada por proyectos y el análisis educativo
              permanecen identificados por separado.
            </p>
          </article>
          <article className="rounded-[2rem] border border-amber-200/15 bg-amber-300/[.035] p-6 sm:p-7">
            <TriangleAlert className="text-amber-300" size={20} />
            <h2 className="mt-4 text-xl font-bold">Comparación responsable</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              La presencia de OMDB en el mismo selector no implica equivalencia
              de liquidez, adopción, capitalización, riesgo ni acceso a mercados
              con {identity.symbol}.
            </p>
          </article>
        </section>
        <footer className="mt-8 flex flex-col gap-4 border-t border-white/[.07] py-8 text-xs leading-6 text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Datos informativos de solo lectura. No constituye asesoría
            financiera.
          </p>
          <p>LAEX · Digital Asset Intelligence · PRJ-03</p>
        </footer>
      </div>
    </main>
  );
}

export function AssetSelector({
  selected,
  onSelect,
}: {
  selected: DemoAssetSlug;
  onSelect: (slug: DemoAssetSlug) => void;
}) {
  return (
    <div className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/[.09] bg-black/25 p-1.5">
      {demoAssetOptions.map((entry) => (
        <button
          key={entry.slug}
          onClick={() => onSelect(entry.slug)}
          title={entry.name}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-black tracking-[.08em] transition sm:px-5 ${selected === entry.slug ? "bg-cyan-300/10 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,.12)]" : "text-slate-500 hover:text-slate-200"}`}
        >
          <Image src={entry.logo} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          {entry.symbol}
        </button>
      ))}
    </div>
  );
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-32 bg-[#06101d] p-5">
      <Icon size={17} className="text-cyan-300" />
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[.14em] text-slate-600">
        {label}
      </p>
      <strong
        className="mt-2 block truncate text-lg tracking-[-.03em] text-slate-100"
        title={value}
      >
        {value}
      </strong>
    </div>
  );
}
function EvidenceChip({
  icon: Icon,
  label,
  tone,
}: {
  icon: typeof Database;
  label: string;
  tone: "cyan" | "emerald";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[.14em] ${tone === "cyan" ? "border-cyan-200/15 bg-cyan-300/[.06] text-cyan-200" : "border-emerald-200/15 bg-emerald-300/[.06] text-emerald-300"}`}
    >
      <Icon size={12} />
      {label}
    </span>
  );
}
