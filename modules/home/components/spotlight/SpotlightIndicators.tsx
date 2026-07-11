type Props = {
  total: number;
  current: number;
};

export default function SpotlightIndicators({
  total,
  current,
}: Props) {
  return (
    <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`transition-all duration-500 ${
            i === current
              ? "h-2 w-8 rounded-full bg-cyan-400"
              : "h-2 w-2 rounded-full bg-white/30"
          }`}
        />
      ))}
    </div>
  );
}