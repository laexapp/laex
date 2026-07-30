import ProjectSocialLinks from "../ProjectSocialLinks";
import ProjectVideoPlayer from "../ProjectVideoPlayer";

import type { Project } from "@/core/types/project";
import { mediaRepository } from "@/src/core/media";
import type { MediaItem } from "@/src/core/media";
import { projectRepository } from "@/src/core/projects/identity";

type ProjectMediaProps = {
  project: Project;
  items?: MediaItem[];
};

const projectIdentitySlugs: Record<string, string> = {
  onemillionminers: "one-million-miners",
  omdb: "omd-blockchain",
  omd: "one-million-dollar",
};

export default function ProjectMedia({
  project,
  items,
}: ProjectMediaProps) {
  const projectIdentity = projectIdentitySlugs[project.id]
    ? projectRepository.getBySlug(projectIdentitySlugs[project.id])
    : null;

  const configuredItems = projectIdentity
    ? mediaRepository.getFeaturedVideos(projectIdentity.identity.slug)
    : [];

  const mediaItems = items ?? configuredItems;
  const featuredVideo = mediaItems[0];

  if (!featuredVideo) {
    return null;
  }

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden">
      <div
        className="relative"
        style={{
          backgroundImage:
            "url('/images/projects/one-million-miners/laex-media-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />

        <div className="relative z-10 py-24">
          <div className="mx-auto max-w-[1400px] px-6 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.45em] text-cyan-400">
              Multimedia
            </span>

            <h2 className="mt-5 text-5xl font-black text-white md:text-6xl xl:text-7xl">
              Conoce {project.name}
            </h2>

            <p className="mx-auto mt-6 max-w-4xl text-xl leading-9 text-slate-300">
              Antes de invertir, descubre cómo funciona el proyecto y conoce su
              visión directamente desde sus creadores.
            </p>

            <div className="mx-auto mt-16 max-w-6xl rounded-[32px] border border-cyan-400/20 bg-slate-950/40 p-5 shadow-[0_0_100px_rgba(34,211,238,.25)]">
              <ProjectVideoPlayer
                videoUrl={featuredVideo.source.url}
                title={featuredVideo.title}
              />
            </div>

            <div className="mx-auto mt-12 max-w-5xl">
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
                {featuredVideo.source.provider}
              </span>

              <h3 className="mt-5 text-4xl font-black text-white">
                {featuredVideo.title}
              </h3>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                {featuredVideo.description}
              </p>

              <div className="mt-10">
                <a
                  href={featuredVideo.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl bg-cyan-500 px-8 py-4 text-base font-bold text-white transition hover:bg-cyan-400"
                >
                  ▶ Ver video
                </a>
              </div>

              <div className="mt-8 flex justify-center">
                {projectIdentity && (
                  <ProjectSocialLinks social={projectIdentity.social} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}