import type { MediaItem } from "@/src/core/media/types";
import { youtubeMediaService } from "@/src/core/media/services/youtube";
import { projectMedia } from "@/src/core/projects/media/projectMedia";

type ProjectMediaProps = {
  items?: MediaItem[];
};

const configuredItems: MediaItem[] = [
  youtubeMediaService.mapVideo({
    title: `${projectMedia.oneMillionMiners.name} - Video destacado`,
    url: projectMedia.oneMillionMiners.youtube.featuredVideo,
    description:
      "Contenido oficial sincronizado desde la configuración multimedia del proyecto.",
  }),
].filter((item): item is MediaItem => item !== null);

export default function ProjectMedia({
  items = configuredItems,
}: ProjectMediaProps) {
  return (
    <section className="mt-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
            Multimedia
          </span>

          <h2 className="mt-2 text-3xl font-black text-white">
            Videos oficiales
          </h2>

          <p className="mt-2 max-w-3xl text-slate-400">
            Este contenido proviene de la configuración oficial registrada para
            el proyecto dentro de LAEX.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0D1422] transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(0,212,255,.12)]"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="aspect-video w-full object-cover"
            />

            <div className="p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                {item.source.provider}
              </span>

              <h3 className="mt-3 text-xl font-black text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.description}
              </p>

              <a
                href={item.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex text-cyan-400 hover:text-cyan-300"
              >
                Ver en YouTube →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}