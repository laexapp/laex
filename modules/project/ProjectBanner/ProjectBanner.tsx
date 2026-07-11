import Image from "next/image";

type ProjectBannerProps = {
  banner: string;
  logo: string;
  name: string;
  category: string;
};

export default function ProjectBanner({
  banner,
  logo,
  name,
  category,
}: ProjectBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-900 bg-[#0d1523]">

      <Image
        src={banner}
        alt={name}
        width={1600}
        height={700}
        className="h-[520px] w-full object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#08111d]/95 via-[#08111d]/55 to-transparent" />

      <div className="absolute bottom-10 left-10 flex items-center gap-6">

        <Image
          src={logo}
          alt={name}
          width={110}
          height={110}
          className="rounded-2xl border border-cyan-700 bg-[#111827] p-3"
        />

        <div>

          <span className="text-cyan-400 uppercase tracking-widest text-sm">
            {category}
          </span>

          <h1 className="mt-2 text-5xl font-bold text-white">
            {name}
          </h1>

        </div>

      </div>

    </section>
  );
}