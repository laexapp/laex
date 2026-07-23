import { projects } from "@/core/projects/projects";

import ProjectHero from "../ProjectHero/ProjectHero";
import ProjectExecutiveSummary from "../ProjectExecutiveSummary/ProjectExecutiveSummary";
import ProjectStats from "../ProjectStats/ProjectStats";
import ProjectAI from "../ProjectAI";
import ProjectMedia from "../ProjectMedia";
import ProjectGallery from "../components/ProjectGallery";
import ProjectTimeline from "../ProjectTimeline/ProjectTimeline";

type Props = {
  projectId?: string;
};

export default function ProjectPage({
  projectId,
}: Props) {
  const project =
    projects.find((p) => p.id === projectId) ??
    projects[0];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">

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

      <ProjectMedia />

      <ProjectTimeline
        timeline={project.timeline}
      />

      <ProjectGallery
        projectId={project.id}
      />

    </section>
  );
}