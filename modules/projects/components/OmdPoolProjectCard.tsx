"use client";

import { ArrowUpRight, Layers3, Radio, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/core/types/project";
import type { BlockchainIntelligenceSnapshot } from "@/modules/project/pages/OMDB/types";

type Props = { project: Project; index: number };

function NetworkPulse() {
  const nodes = [
    [8, 66], [18, 44], [29, 61], [39, 31], [49, 53],
    [60, 37], [71, 59], [81, 29], [92, 48],
  ];
  return (
    <svg viewBox="0 0 100 78" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="omd-pulse" x1="0" x2="1"><stop stopColor="#22d3ee" /><stop offset="1" stopColor="#a78bfa" /></linearGradient>
        <radialGradient id="omd-core"><stop stopColor="#fff" /><stop offset=".25" stopColor="#22d3ee" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0" /></radialGradient>
      </defs>
      <g stroke="url(#omd-pulse)" strokeWidth=".45" opacity=".55">
        {nodes.slice(0, -1).map((node, index) => <line key={index} x1={node[0]} y1={node[1]} x2={nodes[index + 1][0]} y2={nodes[index + 1][1]} />)}
        <line x1="8" y1="66" x2="39" y2="31" /><line x1="18" y1="44" x2="49" y2="53" /><line x1="39" y1="31" x2="71" y2="59" /><line x1="60" y1="37" x2="92" y2="48" />
      </g>
      {nodes.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="1.45" fill={index % 2 ? "#a78bfa" : "#22d3ee"} />)}
      <circle cx="50" cy="49" r="18" fill="url(#omd-core)" opacity=".24" className="animate-pulse" />
      <circle cx="50" cy="49" r="3" fill="#67e8f9" /><circle cx="50" cy="49" r="8" fill="none" stroke="#22d3ee" strokeWidth=".65" opacity=".7" />
      <path d="M5 50 H34 L39 46 L43 54 L48 32 L53 59 L58 46 L63 50 H95" fill="none" stroke="#67e8f9" strokeWidth=".8" opacity=".85" />
    </svg>
  );
}

export default function OmdPoolProjectCard({ project, index }: Props) {
  const [snapshot, setSnapshot] = useState<BlockchainIntelligenceSnapshot | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/projects/omdb/intelligence?asset=omd", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setSnapshot(data as BlockchainIntelligenceSnapshot | null))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const onChainLive = snapshot?.state === "LIVE";
  const chainId = snapshot?.metrics.find((metric) => metric.key === "chain")?.value;

  return (
    <article className="group relative flex min-h-[470px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-cyan-200/20 bg-[linear-gradient(155deg,#071522,#030812_68%)] p-4 shadow-[0_24px_70px_rgba(0,0,0,.42)] transition duration-500 hover:-translate-y-1.5 hover:border-violet-300/45 hover:shadow-[0_32px_90px_rgba(0,0,0,.56),0_0_34px_rgba(167,139,250,.11)] sm:p-5">
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_4%,rgba(214,168,68,.18),transparent_32%),radial-gradient(circle_at_100%_35%,rgba(167,139,250,.14),transparent_34%),radial-gradient(circle_at_0%_35%,rgba(34,211,238,.12),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-px rounded-[27px] border border-white/[.045]" />

      <header className="relative text-center">
        <span className="absolute left-0 top-0 font-mono text-[9px] tracking-[.18em] text-cyan-300/70">PRJ-{String(index + 1).padStart(2, "0")}</span>
        <div className="mx-auto grid h-[92px] w-[92px] place-items-center rounded-full bg-[radial-gradient(circle,rgba(214,168,68,.22),transparent_67%)] transition duration-500 group-hover:scale-[1.04] group-hover:drop-shadow-[0_0_18px_rgba(214,168,68,.52)]">
          <Image src={project.logo} alt="Isotipo oficial OMD" width={88} height={88} className="h-[86px] w-[86px] object-contain" priority={false} />
        </div>
        <h2 className="-mt-1 text-[1.38rem] font-black tracking-[.1em] text-white drop-shadow-[0_4px_14px_rgba(255,255,255,.18)]">OMD POOL</h2>
        <span className="mt-2 inline-flex rounded-full border border-violet-300/65 bg-violet-300/[.07] px-4 py-1 text-[8px] font-black uppercase tracking-[.18em] text-violet-200 shadow-[0_0_18px_rgba(167,139,250,.11)]">Pre-lanzamiento</span>
      </header>

      <section className="relative mt-3 overflow-hidden rounded-2xl border border-cyan-200/25 bg-[#06111e]/88 p-3 shadow-[inset_0_0_24px_rgba(34,211,238,.035)]">
        <NetworkPulse />
        <div className="relative flex items-start justify-between gap-3">
          <div><p className="text-[10px] font-black tracking-[.12em] text-cyan-300">OMD MARKET</p><p className="mt-1 max-w-[13rem] text-[9px] leading-4 text-slate-300">Mercado pendiente de fuente verificada</p></div>
          <ShieldCheck size={18} className="shrink-0 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,.6)]" />
        </div>
        <div className="relative mt-8 flex items-end justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[7px] font-black tracking-[.11em] ${onChainLive ? "border-cyan-200/35 bg-cyan-300/[.08] text-cyan-200" : "border-white/10 bg-black/25 text-slate-500"}`}><Radio size={9} className={onChainLive ? "animate-pulse" : ""} />{onChainLive ? "ON-CHAIN · LIVE" : "VERIFICANDO ON-CHAIN"}</span>
          {onChainLive && chainId != null && <span className="font-mono text-[7px] text-slate-500">CHAIN {String(chainId)}</span>}
        </div>
      </section>

      <section className="relative mt-3 overflow-hidden rounded-2xl border border-violet-300/20 bg-violet-300/[.025] p-3">
        <div className="pointer-events-none absolute -bottom-8 right-1 h-20 w-20 rounded-full border border-violet-300/20 shadow-[0_0_30px_rgba(124,58,237,.28)]" />
        <div className="flex items-center gap-2 text-violet-300"><Layers3 size={13} /><span className="text-[9px] font-black uppercase tracking-[.14em]">Staking · Pool</span></div>
        <h3 className="mt-2 text-xl font-semibold tracking-[-.04em] text-white">OMD Pool</h3>
        <p className="mt-1.5 max-w-[15rem] text-[10px] leading-[1.1rem] text-slate-400">Participación en el ecosistema OMD con contexto verificable del activo.</p>
      </section>

      <Link href="/proyectos/omd" className="relative mt-auto flex min-h-12 items-center justify-center gap-4 rounded-2xl border border-amber-300/65 bg-amber-300/[.075] px-4 text-[10px] font-black uppercase tracking-[.14em] text-amber-200 shadow-[0_0_22px_rgba(214,168,68,.09)] transition hover:bg-amber-300/[.13] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70" aria-label="Explorar proyecto OMD Pool">
        Explorar proyecto
        <span className="grid h-8 w-8 place-items-center rounded-full border border-amber-200/60 bg-amber-300/[.08]"><ArrowUpRight size={14} /></span>
      </Link>
    </article>
  );
}
