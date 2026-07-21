import Image from "next/image";

import { Project } from "@/core/types/project";
import {
  GlassCard,
  IntelligenceRibbon,
  ProjectActionButton,
  ProjectHighlights,
  ProjectQuickStats,
  TrustBadge,
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
          hover:-translate-y-4
          hover:scale-[1.02]
          hover:border-cyan-400/40
          hover:shadow-[0_25px_80px_rgba(6,182,212,.20)]
        "
      >
        {/* Glow de fondo */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[80px] opacity-0 transition duration-500 group-hover:opacity-100" />

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

          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-transparent to-transparent" />
        </div>

        {/* Logo */}
        <div className="absolute left-6 top-[182px] z-20">
          <div
            className="
              rounded-2xl
              border
              border-white/20
              bg-white/10
              p-2
              backdrop-blur-xl
              shadow-[0_10px_30px_rgba(0,0,0,.35)]
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

          <h3 className="mt-3 text-2xl font-black leading-tight text-white">
            {project.name}
          </h3>

          <div className="mt-4">
            <TrustBadge score={project.trustIndex} />
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-400">
            {project.description}
          </p>

          <ProjectQuickStats
            launchDate={project.launchDate}
            lastUpdate={project.lastUpdate}
          />

          <ProjectHighlights
            highlights={project.highlights}
          />

          <IntelligenceRibbon
            trustIndex={project.trustIndex}
            aiScore={project.aiScore}
            communityScore={project.communityScore}
            riskLevel={project.riskLevel}
          />

          <div className="mt-8 flex items-center justify-between">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              ● {project.status}
            </span>

            <ProjectActionButton />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}