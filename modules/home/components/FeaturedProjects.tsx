import { Project } from "@/core/types/project";
import { ProjectCarousel } from "@/modules/ui";
import KnowledgeCard from "./KnowledgeCard";

type Props = { projects: Project[] };

export default function FeaturedProjects({ projects }: Props) {
  return (
    <section className="pb-16 pt-10 md:pb-24">
      <div className="laex-section-inner">
        <div className="mb-8">
          <span className="laex-eyebrow">02 / Ecosystem</span>
          <h2 className="laex-display mt-4 text-4xl text-white md:text-6xl">Intelligence objects.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">Explora los primeros ecosistemas disponibles dentro de LAEX.</p>
        </div>
        <ProjectCarousel>
          {projects.map((project, index) => <KnowledgeCard key={project.id} project={project} index={index} />)}
        </ProjectCarousel>
      </div>
    </section>
  );
}
