type Props = {
  badge: string;
  name: string;
};

export default function SpotlightOverlay({
  badge,
  name,
}: Props) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 rounded-b-[34px] bg-gradient-to-t from-[#02040A]/95 via-[#02040A]/45 to-transparent p-8 lg:p-10">

      <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 backdrop-blur-xl">

        <span className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
          {badge}
        </span>

      </div>

      <h2
        className="
          mt-5
          max-w-2xl
          text-3xl
          font-black
          leading-tight
          text-white
          drop-shadow-xl
          lg:text-5xl
        "
      >
        {name}
      </h2>

    </div>
  );
}