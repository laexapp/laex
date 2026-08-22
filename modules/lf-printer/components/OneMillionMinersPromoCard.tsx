"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ecosystemPromotions = [
  {
    id: "onemillionminers-launch",
    name: "OneMillionMiners",
    label: "Lanzamiento oficial",
    href: "/proyectos/onemillionminers",
    image: "/projects/onemillionminers/launch-official-2026.png",
    imageAlt: "El lanzamiento oficial de OneMillionMiners ha comenzado",
    accent: "text-amber-300",
    cta: "Explorar proyecto",
  },
  {
    id: "omd",
    name: "OMD Pool",
    label: "Ecosistema OMD",
    href: "/proyectos/omd",
    image: "/projects/omd/banner.png",
    imageAlt: "Presentación del proyecto OMD Pool",
    accent: "text-violet-200",
    cta: "Ver proyecto OMD",
  },
  {
    id: "omdb",
    name: "OMDB Blockchain",
    label: "Infraestructura OMDB",
    href: "/proyectos/omdb",
    image: "/projects/omdb/banner.png",
    imageAlt: "Presentación del proyecto OMDB Blockchain",
    accent: "text-cyan-200",
    cta: "Ver proyecto OMDB",
  },
  {
    id: "onemillionminers-laex-campaign",
    name: "Activa tu One Million Miners",
    label: "Patrocinado por LAEX + LF-PRINTER",
    href: "/proyectos/onemillionminers",
    image: "/projects/onemillionminers/laex-activation-campaign-2026.png",
    imageAlt: "Presentación tecnológica de OneMillionMiners patrocinada por LAEX y LF-PRINTER",
    accent: "text-emerald-300",
    cta: "Ver la presentación",
  },
] as const;

export function OneMillionMinersPromoCard() {
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setPosition((current) => (current + 1) % ecosystemPromotions.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  const orderedPromotions = useMemo(
    () => ecosystemPromotions.map((_, index) => ecosystemPromotions[(index + position) % ecosystemPromotions.length]),
    [position],
  );

  return (
    <section
      aria-label="Proyectos destacados del ecosistema LAEX"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="mx-4 mb-3 grid gap-2"
    >
      <div className="flex items-center justify-between px-1">
        <p className="text-[8px] font-black uppercase tracking-[.16em] text-slate-500">Ecosistema LAEX</p>
        <button
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? "Reanudar movimiento de proyectos" : "Pausar movimiento de proyectos"}
          className="grid size-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
        >
          {paused ? <Play size={11}/> : <Pause size={11}/>}
        </button>
      </div>

      {orderedPromotions.map((promotion, index) => (
        <article
          key={promotion.id}
          className="ecosystem-project-rotator overflow-hidden rounded-xl border border-slate-700 bg-[#08131d] shadow-[0_10px_25px_rgba(15,23,42,.14)]"
          style={{ order: index }}
        >
          <Link href={promotion.href} className="ecosystem-project-rotator__slide group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
            <div className="relative h-[4.75rem] overflow-hidden bg-black">
              <Image src={promotion.image} alt={promotion.imageAlt} fill sizes="180px" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071018]/80 via-transparent to-transparent" />
              <span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/65 px-2 py-1 text-[7px] font-black uppercase tracking-[.12em] text-white backdrop-blur-sm">{index + 1} / {ecosystemPromotions.length}</span>
            </div>
            <div className="p-2.5">
              <p className={`text-[7px] font-black uppercase tracking-[.13em] ${promotion.accent}`}>{promotion.label}</p>
              <strong className="mt-1 block text-[11px] leading-4 text-white">{promotion.name}</strong>
              <span className="mt-1.5 flex items-center justify-between text-[9px] font-extrabold text-cyan-200">{promotion.cta} <ArrowUpRight size={12}/></span>
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
}
