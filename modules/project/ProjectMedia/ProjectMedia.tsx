import type { MediaItem } from "@/src/core/media/types";
import { youtubeMediaService } from "@/src/core/media/services/youtube";

type ProjectMediaProps = {
  items?: MediaItem[];
};

const demoItems: MediaItem[] = [
  youtubeMediaService.mapVideo({
    title: "Próximamente veremos aquí los videos del proyecto",
    url: "https://youtu.be/D-pDTrdxJUM",
    description:
      "Este contenido será reemplazado automáticamente cuando conectemos la API de YouTube.",
  }),
].filter((item): item is MediaItem => item !== null);

export default function ProjectMedia({
  items = demoItems,
}: ProjectMediaProps) {
  return (
    <section className="mt-12">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
          Multimedia
        </span>

        <h2 className="mt-2 text-3xl font-black text-white">
          Videos y contenido
        </h2>

        <p className="mt-2 max-w-2xl text-slate-400">
          Aquí se mostrarán automáticamente los videos, Shorts,
          transmisiones en vivo y listas de reproducción del proyecto.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0D1422]"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="aspect-video w-full object-cover"
            />

            <div className="p-5">
              <span className="text-xs uppercase tracking-widest text-cyan-400">
                {item.source.provider}
              </span>

              <h3 className="mt-2 text-lg font-bold text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm text-slate-400">
                {item.description}
              </p>

              <a
                href={item.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex text-cyan-400 hover:text-cyan-300"
              >
                Ver contenido →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}