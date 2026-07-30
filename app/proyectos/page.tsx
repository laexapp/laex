import { getProjects } from "@/core/projects";
import ProjectCard from "@/modules/projects/components/ProjectCard";
import Header from "@/modules/layout/components/Header";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main className="laex-canvas min-h-screen text-white">
      <Header />
      <section className="laex-section-inner py-20 md:py-28">

        <span className="laex-eyebrow">
          LAEX / Project intelligence
        </span>

        <h1 className="laex-display mt-5 text-5xl md:text-7xl">
          Catálogo de Proyectos
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Explora todos los proyectos disponibles dentro del ecosistema LAEX.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

      </section>
    </main>
  );
}
