import Image from "next/image";
import Link from "next/link";

import { Project } from "@/core/types/project";

type Props = {
  project: Project;
};

export default function ProjectHero({
  project,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#071018] shadow-[0_38px_100px_rgba(0,0,0,.55)]">

      <div className="relative min-h-[680px] md:min-h-[760px]">

        <Image
          src={project.banner}
          alt={project.name}
          fill
          priority
          className="object-cover object-center opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/35 to-[#03070B]" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#03070B]/80 via-[#03070B]/25 to-transparent" />

        <div className="relative z-10 flex min-h-[680px] items-end p-7 md:min-h-[760px] md:p-12">

          <div className="max-w-4xl">

            <Image
              src={project.logo}
              alt={project.name}
              width={150}
              height={150}
              className="rounded-[26px] border border-white/15 bg-[#071018]/75 p-4 shadow-[0_20px_55px_rgba(0,0,0,.4)] backdrop-blur-xl"
            />

            <span className="mt-8 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
              {project.category}
            </span>

            <h1 className="laex-display mt-6 text-5xl text-white md:text-7xl">
              {project.name}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl md:leading-9">
              {project.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <span className="rounded-full bg-emerald-500/20 px-5 py-2 text-sm font-bold text-emerald-300">
                🟢 {project.status}
              </span>

              <span className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm text-slate-200">
                🚀 {project.launchDate}
              </span>

            </div>

            <div className="mt-10 flex flex-wrap gap-3">

              <HeroButton
                href={project.website}
                label="🌐 Sitio Web"
              />

              <HeroButton
                href={project.whitepaper}
                label="📄 Whitepaper"
              />

              <HeroButton
                href={project.telegram}
                label="💬 Telegram"
              />

              <HeroButton
                href={project.twitter}
                label="✖ X"
              />

              <HeroButton
                href={project.youtube}
                label="▶ YouTube"
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

type HeroButtonProps = {
  href: string;
  label: string;
};

function HeroButton({
  href,
  label,
}: HeroButtonProps) {
  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        rounded-2xl
        border
        border-cyan-400/30
        bg-slate-950/55
        px-6
        py-3
        text-sm
        font-bold
        text-cyan-300
        backdrop-blur-md
        shadow-[inset_0_1px_0_rgba(255,255,255,.06)]
        transition-all
        duration-300
        hover:border-cyan-300
        hover:bg-cyan-400
        hover:text-slate-950
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-300
      "
    >
      {label}
    </Link>
  );
}
