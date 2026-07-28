import ProjectVideoPlayer from "../../ProjectVideoPlayer";

import type { MediaItem } from "@/src/core/media";

type FeaturedVideoProps = {
  item: MediaItem;
};

export default function FeaturedVideo({
  item,
}: FeaturedVideoProps) {
  return (
    <section className="mb-10">
      <ProjectVideoPlayer
        videoUrl={item.source.url}
        title={item.title}
      />

      <div className="mt-6">
        <span className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
          Video destacado
        </span>

        <h2 className="mt-2 text-4xl font-black text-white">
          {item.title}
        </h2>

        <p className="mt-4 max-w-4xl text-slate-400 leading-7">
          {item.description}
        </p>
      </div>
    </section>
  );
}