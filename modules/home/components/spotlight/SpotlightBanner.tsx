import Image from "next/image";

type Props = {
  banner: string;
  name: string;
};

export default function SpotlightBanner({
  banner,
  name,
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-[34px]">

      <Image
        src={banner}
        alt={name}
        width={1400}
        height={850}
        priority
        className="
          w-full
          rounded-[34px]
          object-cover
          transition-all
          duration-1000
          ease-in-out
          scale-100
          group-hover:scale-[1.03]
          shadow-[0_40px_120px_rgba(0,212,255,.12)]
        "
      />

      {/* Halo superior */}
      <div className="absolute inset-0 rounded-[34px] bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-70 pointer-events-none" />

      {/* Halo inferior */}
      <div className="absolute inset-0 rounded-[34px] bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

    </div>
  );
}