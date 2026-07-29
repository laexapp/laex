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
    <section className="py-20">

      <div className="mx-auto max-w-7xl space-y-12 px-6">

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

      </div>

      <ProjectMedia />

      <div className="mx-auto mt-12 max-w-7xl space-y-12 px-6">

        <ProjectTimeline
          timeline={project.timeline}
        />

        <ProjectGallery
          projectId={project.id}
        />

      </div>

    </section>
  );
}