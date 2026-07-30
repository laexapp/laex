import type { Project } from "@/core/types/project";

import ProjectHero from "../ProjectHero/ProjectHero";
import ProjectExecutiveSummary from "../ProjectExecutiveSummary/ProjectExecutiveSummary";
import ProjectStats from "../ProjectStats/ProjectStats";
import ProjectAI from "../ProjectAI";
import ProjectMedia from "../ProjectMedia";
import ProjectGallery from "../components/ProjectGallery";
import ProjectTimeline from "../ProjectTimeline/ProjectTimeline";
import Header from "@/modules/layout/components/Header";
import CommunityConnect from "@/modules/ui/components/CommunityConnect";
import { getProjectCommunityChannels } from "../communityChannels";

type Props = {
  project: Project;
};

export default function ProjectPage({
  project,
}: Props) {
  const communityChannels = getProjectCommunityChannels(project);

  return (
    <main className="laex-canvas relative overflow-hidden text-white">
      <Header />

      {/* Fondo global */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-0 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[220px]" />

        <div className="absolute -left-60 top-[900px] h-[700px] w-[700px] rounded-full bg-blue-600/10 blur-[220px]" />

        <div className="absolute -right-60 top-[1800px] h-[700px] w-[700px] rounded-full bg-cyan-400/10 blur-[220px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

      </div>

      <div className="relative z-10">

        <div className="mx-auto w-[min(100%-2rem,92rem)] space-y-8 py-12 md:py-16">

          <ProjectHero
            project={project}
          />

          <ProjectExecutiveSummary
            project={project}
          />

          <ProjectStats
            trustIndex={project.trustIndex}
            communityScore={project.communityScore}
            aiScore={project.aiScore}
            riskLevel={project.riskLevel}
          />

          <ProjectAI
            projectId={project.id}
          />

          <CommunityConnect
            channels={communityChannels}
            variant="panel"
            title={`Conecta con ${project.name}`}
            description="Continúa la experiencia en los espacios oficiales de este proyecto."
            routingContext={`project:${project.id}:analysis-end`}
          />

        </div>

        <div className="mt-8">
          <ProjectMedia project={project} />
        </div>

        <div className="mx-auto mt-10 w-[min(100%-2rem,92rem)] space-y-10 pb-24">

          <ProjectTimeline
            timeline={project.timeline}
          />

          <ProjectGallery
            projectId={project.id}
          />

        </div>

      </div>

    </main>
  );
}
