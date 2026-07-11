import { projects } from "@/core/projects/projects";

import ProjectBanner from "../ProjectBanner/ProjectBanner";
import ProjectHeader from "../ProjectHeader/ProjectHeader";
import ProjectOverview from "../ProjectOverview/ProjectOverview";
import ProjectStats from "../ProjectStats/ProjectStats";
import ProjectAI from "../ProjectAI";
import ProjectGallery from "../components/ProjectGallery";
import ProjectTimeline from "../ProjectTimeline/ProjectTimeline";

type Props = {
  projectId?: string;
};

export default function ProjectPage({ projectId }: Props) {
  const project =
    projects.find((p) => p.id === projectId) ??
    projects[0];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">

      <ProjectBanner
        banner={project.banner}
        logo={project.logo}
        name={project.name}
        category={project.category}
      />

      <ProjectHeader
        name={project.name}
        category={project.category}
        status={project.status}
        launch={project.launchDate}
      />

      <ProjectOverview
        name={project.name}
        category={project.category}
        status={project.status}
        launchDate={project.launchDate}
        description={project.description}
      />

      <ProjectStats
        trustIndex={project.trustIndex}
        communityScore={project.communityScore}
        aiScore={project.aiScore}
        riskLevel={project.riskLevel}
      />

      {/* NUEVO MÓDULO DE IA */}
      <ProjectAI
        projectId={project.id}
      />

      <ProjectTimeline
        timeline={project.timeline}
      />

      <ProjectGallery
        projectId={project.id}
      />

    </section>
  );
}