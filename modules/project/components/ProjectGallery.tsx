import Image from "next/image";
import { getProjectGallery } from "@/core/projects/gallery";

type Props = {
  projectId: string;
};

export default function ProjectGallery({ projectId }: Props) {
  const gallery = getProjectGallery(projectId);

  if (gallery.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">

      <span className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-400">
        Galería
      </span>

      <h2 className="mt-3 text-4xl font-black text-white">
        Imágenes del Proyecto
      </h2>

      <p className="mt-4 max-w-3xl text-slate-400">
        Explora imágenes oficiales del proyecto dentro del ecosistema LAEX.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        {gallery.map((item) => (

          <div
            key={item.id}
            className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0D1422] transition-all duration-300 hover:border-cyan-500/40"
          >

            <div className="relative aspect-video">

              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />

            </div>

            <div className="p-5">

              <h3 className="text-lg font-bold text-white">
                {item.title}
              </h3>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}