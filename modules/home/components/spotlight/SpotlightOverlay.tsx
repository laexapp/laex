type Props = {
  badge: string;
  name: string;
};

export default function SpotlightOverlay({
  badge,
  name,
}: Props) {
  return (
    <div className="absolute inset-x-0 bottom-0 rounded-b-[34px] bg-gradient-to-t from-[#02040A]/90 via-black/20 to-transparent p-8">

      <span className="text-sm font-bold uppercase tracking-[0.45em] text-cyan-400">
        {badge}
      </span>

      <h2 className="mt-3 max-w-xl text-3xl lg:text-4xl font-black leading-none text-white drop-shadow-lg">
        {name}
      </h2>

    </div>
  );
}