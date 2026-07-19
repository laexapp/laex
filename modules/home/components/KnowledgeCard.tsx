import Image from "next/image";

import { Project } from "@/core/types/project";
import { GlassCard } from "@/modules/ui";

type KnowledgeCardProps = {
  project: Project;
};

export default function KnowledgeCard({
  project,
}: KnowledgeCardProps) {
  return (
    <div className="w-[320px] shrink-0 py-3">

      <GlassCard
        className="
          group
          relative
          overflow-hidden
          rounded-[34px]
          transition-all
          duration-500
          hover:-translate-y-3
        "
      >

        {/* Banner */}

        <div className="relative h-[230px] overflow-hidden">

          <Image
            src={project.banner}
            alt={project.name}
            fill
            className="
              object-cover
              transition-transform
              duration-700
              group-hover:scale-110
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-transparent" />

        </div>

        {/* Logo */}

        <div className="absolute left-6 top-[185px]">

          <div className="rounded-2xl bg-white p-2 shadow-2xl">

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

          <span className="text-xs font-bold uppercase tracking-[0.30em] text-cyan-400">
            {project.category}
          </span>

          <h3 className="mt-3 text-2xl font-black text-white">
            {project.name}
          </h3>

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-400">
            {project.description}
          </p>

          <div className="mt-8 flex items-center justify-between">

            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              ● {project.status}
            </span>

            <button
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-cyan-500
                text-xl
                font-bold
                text-white
                transition-all
                duration-300
                hover:scale-110
                hover:shadow-[0_0_30px_rgba(6,182,212,.45)]
              "
            >
              →
            </button>

          </div>

        </div>

      </GlassCard>

    </div>
  );
}