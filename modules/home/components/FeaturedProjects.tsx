import { projects } from "@/core/projects/projects";

import KnowledgeCard from "./KnowledgeCard";

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

        <div className="grid lg:grid-cols-3 gap-8 mt-12">

          {projects.map((project) => (

            <KnowledgeCard
              key={project.id}
              category={project.category}
              title={project.name}
              description={project.description}
              status={project.status}
            />

          ))}

        </div>

      </div>

    </section>
  );
}