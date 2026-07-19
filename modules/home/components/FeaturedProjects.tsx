import { projects } from "@/core/projects/projects";

import KnowledgeCard from "./KnowledgeCard";

import { ProjectCarousel } from "@/modules/ui";

export default function FeaturedProjects() {
  return (
    <section className="py-20">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold">
          Featured Intelligence
        </h2>

        <p className="mt-4 text-gray-400 max-w-2xl">
          Explore the first ecosystems available inside LAEX.
        </p>

        <div className="mt-12">

  <ProjectCarousel>

    {projects.map((project) => (

      <KnowledgeCard
  key={project.id}
  project={project}
/>

    ))}

  </ProjectCarousel>

</div>

      </div>

    </section>
  );
}