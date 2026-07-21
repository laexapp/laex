import Image from "next/image";
import Link from "next/link";

import { Project } from "@/core/types/project";
import {
  GlassCard,
} from "@/modules/ui";

type KnowledgeCardProps = {
  project: Project;
};

export default function KnowledgeCard({
  project,
}: KnowledgeCardProps) {
  return (
    <div className="w-[320px] shrink-0 py-5">
      <GlassCard
        className="
          group
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-white/10
          bg-gradient-to-b
          from-slate-900/80
          to-[#05070D]
          transition-all
          duration-500
          hover:-translate-y-3
          hover:border-cyan-400/40
          hover:shadow-[0_20px_70px_rgba(6,182,212,.18)]
        "
      >
        {/* Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px] opacity-0 transition duration-500 group-hover:opacity-100" />

        {/* Banner */}
        <div className="relative h-[220px] overflow-hidden">
          <Image
            src={project.banner}
            alt={project.name}
            fill
            className="
              object-cover
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />

          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-transparent" />
        </div>

        {/* Logo */}
        <div className="absolute left-6 top-[175px] z-20">
          <div
            className="
              rounded-2xl
              border
              border-white/20
              bg-white/10
              p-2
              backdrop-blur-xl
            "
          >
            <Image
              src={project.logo}
              alt={project.name}
              width={56}
              height={56}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 pb-6 pt-12">

          <span className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
            {project.category}
          </span>

          <h3 className="mt-3 text-2xl font-black text-white">
            {project.name}
          </h3>

          <div className="mt-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
            {project.status}
          </div>

          <p className="mt-5 line-clamp-3 text-sm leading-7 text-slate-400">
            {project.description}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">

            <div className="flex justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  Lanzamiento
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {project.launchDate}
                </p>

              </div>

              <div className="text-right">

                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  Actualización
                </p>

                <p className="mt-2 text-sm font-semibold text-cyan-400">
                  {project.lastUpdate}
                </p>

              </div>

            </div>

          </div>

          <Link
            href={`/proyectos/${project.id}`}
            className="
              mt-6
              flex
              h-12
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-500/40
              bg-cyan-500/10
              font-semibold
              text-cyan-300
              transition-all
              duration-300
              hover:bg-cyan-500
              hover:text-slate-950
            "
          >
            Ver análisis →
          </Link>

        </div>

      </GlassCard>
    </div>
  );
}