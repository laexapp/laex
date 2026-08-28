"use client";

import {
  Blocks,
  PackageCheck,
  Printer,
  Radio,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DigitalAssetProjectVisual from "@/modules/projects/components/DigitalAssetProjectVisual";
import type { BlockchainIntelligenceSnapshot } from "@/modules/project/pages/OMDB/types";
import type { PublicCommerceCatalog } from "@/modules/lf-printer/infrastructure/commerce-presentation";

function PoolPanel() {
  const [snapshot, setSnapshot] =
    useState<BlockchainIntelligenceSnapshot | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/projects/omdb/intelligence?asset=omd", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) =>
        setSnapshot(data as BlockchainIntelligenceSnapshot | null),
      )
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  const live = snapshot?.state === "LIVE",
    height = snapshot?.metrics.find((metric) => metric.key === "height")?.value,
    chain = snapshot?.metrics.find((metric) => metric.key === "chain")?.value;
  const xs = [3, 38, 72, 106, 141, 176, 211, 246, 281, 316, 352, 417],
    ys = [70, 58, 67, 30, 54, 42, 73, 37, 52, 20, 60, 35];
  return (
    <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-white/[.045] bg-[radial-gradient(circle_at_50%_5%,rgba(214,168,68,.2),transparent_34%),radial-gradient(circle_at_100%_90%,rgba(139,92,246,.2),transparent_40%),rgba(5,11,21,.82)] p-5 shadow-[0_28px_75px_rgba(0,0,0,.36),0_0_44px_rgba(139,92,246,.055),inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-sm sm:p-7">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/projects/omd/coin.png"
            alt="OMD"
            width={92}
            height={92}
            className="size-20 object-contain drop-shadow-[0_0_20px_rgba(214,168,68,.45)]"
          />
          <div>
            <span className="text-[9px] font-black uppercase tracking-[.18em] text-violet-300">
              Staking · Pool
            </span>
            <h3 className="mt-1 text-2xl font-black text-white">OMD POOL</h3>
            <span className="mt-2 inline-flex rounded-full border border-violet-300/30 px-2 py-1 text-[7px] font-black uppercase tracking-[.14em] text-violet-200">
              Pre-lanzamiento
            </span>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-black ${live ? "border-emerald-300/25 bg-emerald-300/[.08] text-emerald-300" : "border-white/10 text-slate-500"}`}
        >
          <Radio size={9} className={live ? "animate-pulse" : ""} />
          {snapshot?.state ?? "CONECTANDO"}
        </span>
      </div>
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/[.055] bg-[#06121f]/72 p-4 shadow-[0_18px_45px_rgba(0,0,0,.24),inset_0_1px_0_rgba(34,211,238,.06)] backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[.14em] text-cyan-300">
            OMD Pool Intelligence
          </span>
          <ShieldCheck size={16} className="text-cyan-300" />
        </div>
        <svg
          viewBox="0 0 420 92"
          className="mt-3 h-24 w-full"
          aria-label="Visualización tecnológica de actividad del Pool"
        >
          <defs>
            <linearGradient id="home-pool-line">
              <stop stopColor="#22d3ee" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path
            d="M3 70 L38 58 L72 67 L106 30 L141 54 L176 42 L211 73 L246 37 L281 52 L316 20 L352 60 L417 35"
            fill="none"
            stroke="url(#home-pool-line)"
            strokeWidth="2"
          />
          <path
            d="M3 70 L38 58 L72 67 L106 30 L141 54 L176 42 L211 73 L246 37 L281 52 L316 20 L352 60 L417 35"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="8"
            opacity=".08"
          />
          {xs.map((x, index) => (
            <circle
              key={x}
              cx={x}
              cy={ys[index]}
              r="3"
              fill={index % 2 ? "#a78bfa" : "#22d3ee"}
            />
          ))}
        </svg>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
          <span className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[.12em] text-slate-400">
            <Blocks size={12} className="text-cyan-300" /> Actividad on-chain{" "}
            {live ? "verificada" : "en verificación"}
          </span>
          {live && (
            <span className="font-mono text-[8px] text-slate-500">
              CHAIN {chain ?? "—"} · BLOQUE {height ?? "—"}
            </span>
          )}
        </div>
      </div>
      <p className="relative mt-4 text-[10px] leading-5 text-slate-400">
        Mercado, APY y recompensas permanecen pendientes de fuente verificable.
      </p>
    </div>
  );
}

function CommercePanel() {
  const [catalog, setCatalog] = useState<PublicCommerceCatalog | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/commerce/empresa-limpia-c7", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setCatalog(data as PublicCommerceCatalog | null))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  const products = catalog?.products?.slice(0, 2) ?? [];
  return (
    <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-white/[.045] bg-[radial-gradient(circle_at_90%_10%,rgba(0,187,252,.16),transparent_38%),radial-gradient(circle_at_10%_90%,rgba(255,196,0,.11),transparent_34%),rgba(6,16,26,.82)] p-5 shadow-[0_28px_75px_rgba(0,0,0,.36),0_0_44px_rgba(0,187,252,.055),inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-sm sm:p-7">
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-[.18em] text-cyan-300">
            Commerce Experience
          </span>
          <h3 className="mt-2 text-2xl font-black text-white">
            Productos y respaldo técnico
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-300/[.07] px-2.5 py-1 text-[8px] font-black text-emerald-300">
          <Radio size={9} className="animate-pulse" /> EMPRESA ACTIVA
        </span>
      </div>
      {products.length ? (
        <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <article
              key={product.slug}
              className="grid grid-cols-[5rem_1fr] items-center gap-3 rounded-2xl border border-white/[.045] bg-black/20 p-3 shadow-[0_14px_34px_rgba(0,0,0,.22),inset_0_1px_0_rgba(255,255,255,.025)] backdrop-blur"
            >
              <div className="relative h-20 overflow-hidden rounded-xl bg-white">
                <Image
                  src={
                    product.images[0]?.url ??
                    "/assets/lf-printer/official/printers/wf-4830-hero.webp"
                  }
                  alt={product.images[0]?.alt ?? product.name}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[7px] font-black uppercase tracking-[.12em] text-cyan-300">
                  {product.category}
                </span>
                <b className="mt-1 block truncate text-sm text-white">
                  {product.name}
                </b>
                <span className="mt-2 inline-flex items-center gap-1 text-[8px] text-emerald-300">
                  <PackageCheck size={11} />
                  {product.availability}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="relative mt-5 grid min-h-28 place-items-center rounded-2xl border border-dashed border-white/15 bg-black/20 text-center">
          <div>
            <Printer className="mx-auto text-cyan-300" />
            <b className="mt-2 block text-sm text-white">
              Catálogo Commerce conectado
            </b>
            <span className="mt-1 block text-[10px] text-slate-500">
              Consulta productos y disponibilidad en LF-PRINTER.
            </span>
          </div>
        </div>
      )}
      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {[
          ["Tienda", "Catálogo"],
          ["Taller", "Soporte"],
          ["Lía", "Orientación"],
        ].map(([title, label]) => (
          <div
            key={title}
            className="rounded-xl border border-white/10 bg-white/[.025] p-3 text-center"
          >
            <b className="block text-[10px] text-white">{title}</b>
            <span className="mt-1 block text-[7px] uppercase tracking-[.11em] text-slate-500">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeProjectLivePanel({
  projectId,
}: {
  projectId: string;
}) {
  if (projectId === "omd") return <PoolPanel />;
  if (projectId === "omdb")
    return (
      <div className="relative h-full min-h-[21rem] overflow-hidden rounded-[1.75rem] border border-white/[.04] shadow-[0_28px_75px_rgba(0,0,0,.36),0_0_48px_rgba(34,211,238,.06),inset_0_1px_0_rgba(255,255,255,.035)]">
        <DigitalAssetProjectVisual />
      </div>
    );
  if (projectId === "lf-printer") return <CommercePanel />;
  return null;
}
