type ProjectHighlightsProps = {
  highlights: string[];
};

export default function ProjectHighlights({
  highlights,
}: ProjectHighlightsProps) {
  return (
    <div
      className="
        mt-5
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-4
      "
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.30em] text-cyan-300">
        Highlights
      </p>

      <div className="space-y-2">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            <div className="mt-[7px] h-2 w-2 rounded-full bg-cyan-400" />

            <p className="text-sm leading-6 text-slate-300">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}