import Link from "next/link";
import { Project } from "@/core/types/project";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0D1422] p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(0,212,255,.12)]">

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
          className="rounded-xl border border-slate-700 px-5 py-2 text-sm font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-300"
        >
          Ver proyecto →
        </Link>

      </div>

    </div>
  );
}