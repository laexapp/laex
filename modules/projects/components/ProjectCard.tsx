import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Project } from "@/core/types/project";
import DigitalAssetProjectVisual from "./DigitalAssetProjectVisual";

type Props = { project: Project; index?: number };
const accents: Record<string, string> = { onemillionminers: "#F6C65B", omdb: "#37D8EE", omd: "#A78BFA", "lf-printer": "#00BBFC" };

export default function ProjectCard({ project, index = 0 }: Props) {
  const style = { "--project-accent": accents[project.id] ?? "#37D8EE" } as CSSProperties;
  const href = project.cardExternal ? project.website : `/proyectos/${project.id}`;
  const cta = project.cardCta ?? "Explorar proyecto";

  return (
    <article style={style} className="group relative flex min-h-[470px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#071018]/80 p-5 shadow-[0_24px_65px_rgba(0,0,0,.34)] transition duration-500 hover:-translate-y-1.5 hover:border-cyan-300/25 hover:shadow-[0_34px_85px_rgba(0,0,0,.52)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,color-mix(in_srgb,var(--project-accent)_12%,transparent),transparent_16rem)]" />

      <div className="relative h-48 overflow-hidden rounded-[20px] border border-white/[0.07] bg-black/20">
        {project.id === "omdb" ? (
          <Link href={href} aria-label={`Abrir ${project.name}`}>
            <DigitalAssetProjectVisual />
          </Link>
        ) : (
          <>
            <Image src={project.banner} alt="" fill sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 50vw, 25vw" className="object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-transparent to-transparent" />
          </>
        )}
        <span className={`pointer-events-none absolute top-4 z-10 font-mono text-[9px] tracking-[0.18em] text-white/45 ${project.id === "omdb" ? "right-4" : "left-4"}`}>PRJ-{String(index + 1).padStart(2, "0")}</span>
        {project.id !== "omdb" && <div className="absolute bottom-4 left-4 grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-[#071018]/78 p-2 shadow-[0_12px_35px_rgba(0,0,0,.35)] backdrop-blur-xl">
          <Image src={project.logo} alt={`Logo de ${project.name}`} width={52} height={52} className="h-full w-full rounded-xl object-contain" />
        </div>}
      </div>

      <div className="relative z-10 mt-6 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[0.17em]">
          <span className="text-[color:var(--project-accent)]">{project.category}</span>
          <span className="text-slate-600">{project.status}</span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white">{project.name}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{project.description}</p>

        <Link href={href} prefetch={project.cardExternal ? false : undefined} className="mt-auto flex min-h-12 items-center justify-between border-t border-white/[0.07] pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70" aria-label={`${cta}: ${project.name}`}>
          {cta}
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[color:var(--project-accent)] transition group-hover:border-cyan-300/25 group-hover:bg-cyan-300/[0.08]"><ArrowUpRight size={15} /></span>
        </Link>
      </div>
    </article>
  );
}
