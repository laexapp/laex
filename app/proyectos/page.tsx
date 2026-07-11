import { getProjects } from "@/core/projects";
import ProjectCard from "@/modules/projects/components/ProjectCard";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">

        <span className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-400">
          LAEX
        </span>

        <h1 className="mt-4 text-5xl font-black">
          Catálogo de Proyectos
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explora todos los proyectos disponibles dentro del ecosistema LAEX.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>

      </section>
    </main>
  );
}