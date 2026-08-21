import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, ShieldCheck } from "lucide-react";
import { ONE_MILLION_MINERS_OFFICIAL_LANDING } from "./official-landing";

export default function OfficialLandingExperience() {
  const landing = ONE_MILLION_MINERS_OFFICIAL_LANDING;

  return (
    <main className="min-h-dvh bg-[#050b14] text-white">
      <header className="flex min-h-16 flex-wrap items-center gap-3 border-b border-cyan-300/15 bg-[#07111d]/95 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,.28)] backdrop-blur-xl sm:px-6">
        <Link href="/proyectos" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 transition hover:text-white">
          <ArrowLeft size={16} /> Proyectos LAEX
        </Link>
        <span className="hidden h-6 w-px bg-white/15 sm:block" />
        <Link href="/" aria-label="Inicio LAEX" className="relative h-8 w-24 shrink-0">
          <Image src="/images/laex/logo-header.png" alt="LAEX" fill sizes="96px" className="object-contain object-left" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black tracking-tight">OneMillionMiners</p>
          <p className="hidden text-[10px] text-slate-400 sm:block">Presentación oficial integrada en el ecosistema LAEX</p>
        </div>
        <div className="hidden items-center gap-2 text-[10px] text-slate-400 lg:flex">
          <ShieldCheck size={14} className="text-cyan-300" /> Contenido operado por OneMillionMiners
        </div>
        <a href={landing.landingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-100 transition hover:bg-cyan-300/20">
          Abrir sitio oficial <ArrowUpRight size={14} />
        </a>
      </header>

      <section aria-label="Presentación oficial de OneMillionMiners" className="relative h-[calc(100dvh-4rem)] min-h-[38rem] w-full bg-[#02060c]">
        <iframe
          src={landing.landingUrl}
          title="Landing oficial de OneMillionMiners"
          className="h-full w-full border-0 bg-[#02060c]"
          loading="eager"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <noscript>
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div><ExternalLink className="mx-auto text-cyan-300" /><p className="mt-3 text-sm text-slate-300">Activa JavaScript para visualizar la presentación integrada.</p><a href={landing.landingUrl} className="mt-4 inline-flex rounded-lg bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950">Explorar OneMillionMiners</a></div>
          </div>
        </noscript>
      </section>
    </main>
  );
}

