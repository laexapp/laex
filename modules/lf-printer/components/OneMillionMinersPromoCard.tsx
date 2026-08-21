"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const ecosystemProjects = [
  {
    name: "OMD Pool",
    label: "Ecosistema OMD",
    href: "/proyectos/omd",
    image: "/projects/omd/banner.png",
    accent: "text-violet-200",
  },
  {
    name: "OMDB Blockchain",
    label: "Infraestructura OMDB",
    href: "/proyectos/omdb",
    image: "/projects/omdb/banner.png",
    accent: "text-cyan-200",
  },
] as const;

export function OneMillionMinersPromoCard() {
  const [activeProject, setActiveProject] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveProject((current) => (current + 1) % ecosystemProjects.length),
      4200,
    );
    return () => window.clearInterval(timer);
  }, []);

  const project = ecosystemProjects[activeProject];

  return (
    <section aria-label="Proyectos destacados del ecosistema LAEX" className="mx-4 mb-3 grid gap-2">
      <article className="overflow-hidden rounded-xl border border-amber-300/35 bg-[#0a1119] shadow-[0_14px_32px_rgba(15,23,42,.14)]">
        <Link href="/proyectos/onemillionminers" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
          <div className="relative h-20 overflow-hidden bg-black">
            <Image src="/projects/onemillionminers/launch-official-2026.png" alt="El lanzamiento oficial de OneMillionMiners ha comenzado" fill sizes="180px" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-transparent to-transparent" />
          </div>
          <div className="p-2.5">
            <p className="text-[8px] font-black uppercase tracking-[.16em] text-amber-300">Proyecto destacado LAEX</p>
            <strong className="mt-1 block text-xs leading-4 text-white">OneMillionMiners</strong>
            <span className="mt-1.5 flex items-center justify-between text-[10px] font-extrabold text-cyan-200">Explorar proyecto <ArrowUpRight size={13} /></span>
          </div>
        </Link>
      </article>

      <article className="ecosystem-project-rotator overflow-hidden rounded-xl border border-slate-700 bg-[#08131d] shadow-[0_10px_26px_rgba(15,23,42,.12)]">
        <Link key={project.href} href={project.href} className="ecosystem-project-rotator__slide group grid min-h-[5.25rem] grid-cols-[4.5rem_1fr] items-stretch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
          <div className="relative overflow-hidden bg-black">
            <Image src={project.image} alt={project.name} fill sizes="72px" className="object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#08131d]/40" />
          </div>
          <div className="flex min-w-0 flex-col justify-center p-2.5">
            <p className={`text-[7px] font-black uppercase tracking-[.14em] ${project.accent}`}>{project.label}</p>
            <strong className="mt-1 truncate text-[11px] text-white">{project.name}</strong>
            <span className="mt-1 flex items-center justify-between text-[9px] font-bold text-slate-300">Conocer proyecto <ArrowUpRight size={12}/></span>
          </div>
        </Link>
        <div className="flex justify-center gap-1.5 pb-2" aria-label="Selector de proyectos">
          {ecosystemProjects.map((item, index) => <button key={item.href} type="button" onClick={() => setActiveProject(index)} aria-label={`Mostrar ${item.name}`} aria-current={index === activeProject ? "true" : undefined} className={`h-1 rounded-full transition-all ${index === activeProject ? "w-5 bg-cyan-300" : "w-2 bg-slate-600 hover:bg-slate-400"}`}/>)}
        </div>
      </article>
    </section>
  );
}
