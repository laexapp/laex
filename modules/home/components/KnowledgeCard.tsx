import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Project } from "@/core/types/project";

type Props = { project: Project; index: number };
const accents: Record<string, string> = { onemillionminers: "#F6C65B", omdb: "#37D8EE", omd: "#A78BFA" };

export default function KnowledgeCard({ project, index }: Props) {
  const style = { "--project-accent": accents[project.id] ?? "#37D8EE" } as CSSProperties;
  return (
    <article style={style} className="group relative min-h-[480px] w-[min(82vw,340px)] shrink-0 snap-start overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#071018]/78 p-5 shadow-[0_20px_55px_rgba(2,4,10,.32)] transition duration-500 ease-laex-emphasized hover:-translate-y-2 hover:border-cyan-300/30 hover:shadow-[0_30px_75px_rgba(2,4,10,.5)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,color-mix(in_srgb,var(--project-accent)_11%,transparent),transparent_15rem)]" />
      <div className="relative z-10 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
        <span>{String(index + 1).padStart(2, "0")}</span><span className="text-[color:var(--project-accent)]">{project.status}</span>
      </div>
      <div className="relative z-10 mx-auto mt-5 grid h-48 place-items-center overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20">
        <Image src={project.banner} alt="" fill sizes="340px" className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-transparent to-transparent" />
        <div className="relative grid h-20 w-20 rotate-45 place-items-center rounded-[22px] border border-white/15 bg-[#071018]/70 p-3 backdrop-blur-xl">
          <Image src={project.logo} alt={project.name} width={58} height={58} className="-rotate-45 rounded-xl" />
        </div>
      </div>
      <div className="relative z-10 mt-7">
        <span className="text-[9px] font-bold uppercase tracking-[0.19em] text-[color:var(--project-accent)]">{project.category}</span>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{project.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{project.description}</p>
      </div>
      <Link href={`/proyectos/${project.id}`} className="absolute inset-x-5 bottom-5 z-10 flex items-center justify-between border-t border-white/[0.07] pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 transition group-hover:text-white">
        Explorar <ArrowRight size={16} className="text-[color:var(--project-accent)] transition group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
