type ProjectVideoPlayerProps = {
  videoUrl: string;
  title: string;
};

function getEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }

    const id = parsed.searchParams.get("v");

    if (id) {
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  } catch {
    return url;
  }
}

export default function ProjectVideoPlayer({
  videoUrl,
  title,
}: ProjectVideoPlayerProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800">
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src={getEmbedUrl(videoUrl)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}