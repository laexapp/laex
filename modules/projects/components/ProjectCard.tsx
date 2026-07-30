import Link from "next/link";
import { Project } from "@/core/types/project";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  return (
    <div className="laex-card group rounded-3xl p-6">

      <span className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
        {project.category}
      </span>

      <h2 className="mt-3 text-3xl font-black text-white">
        {project.name}
      </h2>

      <p className="mt-4 text-slate-400 leading-7">
        {project.description}
      </p>

      <div className="mt-8 flex items-center justify-between">

        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
          {project.status}
        </span>

        <Link
          href={`/proyectos/${project.id}`}
          className="rounded-xl border border-white/10 bg-white/[0.035] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-cyan-200 group-hover:translate-x-0.5"
        >
          Ver proyecto →
        </Link>

      </div>

    </div>
  );
}
