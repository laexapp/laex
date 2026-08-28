"use client";

import { ArrowLeft, ArrowRight, Pause, Play, Radio } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/core/types/project";
import OneMillionMinersCountdown from "@/modules/projects/components/OneMillionMinersCountdown";
import HomeProjectLivePanel from "./HomeProjectLivePanel";

const presentation: Record<
  string,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    href: string;
    accent: string;
  }
> = {
  onemillionminers: {
    eyebrow: "Proyecto protagonista",
    title: "OneMillionMiners",
    subtitle: "Minería digital inteligente",
    href: "/proyectos/onemillionminers",
    accent: "#f6c65b",
  },
  omd: {
    eyebrow: "Staking · Pool",
    title: "OMD Pool",
    subtitle: "Participación con contexto verificable",
    href: "/proyectos/omd",
    accent: "#a78bfa",
  },
  omdb: {
    eyebrow: "Mercado · Blockchain · Evidencia",
    title: "Digital Asset Intelligence",
    subtitle: "Terminal multi-activo de LAEX",
    href: "/proyectos/omdb",
    accent: "#22d3ee",
  },
  "lf-printer": {
    eyebrow: "Empresa · Comercio",
    title: "LF-PRINTER",
    subtitle: "Tienda y servicios técnicos",
    href: "https://lfprinterapp.com",
    accent: "#00bbfc",
  },
};

export default function HomeProjectCarousel({
  projects,
}: {
  projects: Project[];
}) {
  const [active, setActive] = useState(0),
    [paused, setPaused] = useState(false);
  const touch = useRef<number | null>(null),
    project = projects[active],
    view = presentation[project.id];
  useEffect(() => {
    if (
      paused ||
      projects.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % projects.length),
      8000,
    );
    return () => window.clearInterval(timer);
  }, [paused, projects.length]);
  const move = (direction: number) =>
    setActive(
      (value) => (value + direction + projects.length) % projects.length,
    );
  return (
    <section
      aria-label="Proyectos protagonistas de LAEX"
      aria-roledescription="carrusel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
      onTouchStart={(event) => {
        touch.current = event.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        if (touch.current == null) return;
        const distance =
          (event.changedTouches[0]?.clientX ?? touch.current) - touch.current;
        if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
        touch.current = null;
      }}
      className="relative mx-auto w-[min(100%-2rem,92rem)] pt-8 sm:pt-12"
    >
      <div
        className="group relative min-h-[29rem] overflow-hidden rounded-[2rem] border border-white/[.055] bg-[#030911]/90 shadow-[0_42px_130px_rgba(0,0,0,.58),0_0_70px_rgba(34,211,238,.035),inset_0_1px_0_rgba(255,255,255,.035)] sm:min-h-[32rem]"
      >
        <div
          key={project.id}
          className="absolute inset-0 animate-[laex-page-enter_.65s_ease-out]"
        >
          <Image
            src={project.banner}
            alt={`Presentación de ${project.name}`}
            fill
            priority={active === 0}
            sizes="(max-width:768px) 100vw,92rem"
            className="object-cover opacity-55 transition duration-[1600ms] group-hover:scale-[1.025] group-hover:opacity-65"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#02070d_0%,rgba(2,7,13,.92)_30%,rgba(2,7,13,.28)_72%,#02070d_100%),linear-gradient(0deg,#02070d_0%,transparent_48%)]" />
        </div>
        <div className="relative z-10 grid min-h-[29rem] items-center gap-7 p-6 sm:min-h-[32rem] sm:p-10 lg:grid-cols-[.72fr_1.28fr] lg:p-14">
          <div className="flex min-w-0 flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-2 text-[9px] font-black uppercase tracking-[.17em] text-white backdrop-blur">
              <Radio size={11} style={{ color: view.accent }} />
              {view.eyebrow}
            </span>
            <div className="mt-5 flex items-center gap-4">
              <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-black/55 p-2 shadow-2xl backdrop-blur">
                <Image
                  src={project.logo}
                  alt={`Logo ${project.name}`}
                  width={78}
                  height={78}
                  className="size-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-[-.05em] text-white sm:text-5xl">
                  {view.title}
                </h1>
                <p className="mt-1 text-sm text-slate-300 sm:text-base">
                  {view.subtitle}
                </p>
              </div>
            </div>
            {project.id === "onemillionminers" && (
              <div className="mt-6 max-w-md">
                <p className="mb-2 text-[9px] font-black uppercase tracking-[.16em] text-amber-200">
                  Cuenta regresiva oficial
                </p>
                <OneMillionMinersCountdown compact />
              </div>
            )}
            <Link
              href={view.href}
              target={project.id === "lf-printer" ? "_blank" : undefined}
              rel={project.id === "lf-printer" ? "noreferrer" : undefined}
              className="mt-7 inline-flex w-fit items-center gap-3 rounded-xl border border-white/20 bg-white/[.07] px-5 py-3 text-[10px] font-black uppercase tracking-[.15em] text-white transition hover:bg-white hover:text-slate-950"
            >
              Explorar experiencia <ArrowRight size={15} />
            </Link>
          </div>
          {project.id === "onemillionminers" ? (
            <div className="hidden min-h-[22rem] lg:block" />
          ) : (
            <div className="min-h-[21rem]">
              <HomeProjectLivePanel projectId={project.id} />
            </div>
          )}
        </div>
        <button
          onClick={() => move(-1)}
          aria-label="Proyecto anterior"
          className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#02070d]/55 text-cyan-200 shadow-[0_12px_35px_rgba(0,0,0,.38)] backdrop-blur-xl transition hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:shadow-[0_0_24px_rgba(34,211,238,.12)] sm:left-6"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => move(1)}
          aria-label="Proyecto siguiente"
          className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#02070d]/55 text-cyan-200 shadow-[0_12px_35px_rgba(0,0,0,.38)] backdrop-blur-xl transition hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:shadow-[0_0_24px_rgba(34,211,238,.12)] sm:right-6"
        >
          <ArrowRight size={18} />
        </button>
      </div>
      <div className="mt-5 flex items-center justify-center gap-3">
        {projects.map((entry, index) => (
          <button
            key={entry.id}
            onClick={() => setActive(index)}
            aria-label={`Mostrar ${entry.name}`}
            aria-current={index === active ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all ${index === active ? "w-10 bg-cyan-300" : "w-5 bg-white/20 hover:bg-white/45"}`}
          />
        ))}
        <button
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Reanudar carrusel" : "Pausar carrusel"}
          className="ml-2 grid size-8 place-items-center rounded-full border border-white/10 text-slate-400 hover:text-white"
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>
    </section>
  );
}
