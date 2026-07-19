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
    <div className="group relative aspect-[16/10] overflow-hidden rounded-[34px]">

      <Image
        src={banner}
        alt={name}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 700px"
        className="
          object-cover
          transition-transform
          duration-1000
          ease-out
          group-hover:scale-[1.04]
        "
      />

      {/* Oscurece ligeramente la imagen */}
      <div className="pointer-events-none absolute inset-0 bg-black/15" />

      {/* Luz superior */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent" />

      {/* Glow inferior */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyan-500/15 via-transparent to-transparent" />

      {/* Viñeta lateral */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/10" />

      {/* Reflejo de cristal */}
      <div
        className="
          pointer-events-none
          absolute
          -left-1/2
          top-0
          h-full
          w-1/3
          -skew-x-12
          bg-white/10
          opacity-0
          blur-xl
          transition-all
          duration-1000
          group-hover:left-[130%]
          group-hover:opacity-100
        "
      />

    </div>
  );
}