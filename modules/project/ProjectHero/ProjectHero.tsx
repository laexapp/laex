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
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden">

      <div className="relative h-[80vh] min-h-[700px]">

        <Image
          src={project.banner}
          alt={project.name}
          fill
          priority
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950/95" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-20">

          <div className="max-w-4xl">

            <Image
              src={project.logo}
              alt={project.name}
              width={150}
              height={150}
              className="rounded-[32px] border border-cyan-400/30 bg-slate-950/60 p-4 shadow-[0_0_60px_rgba(34,211,238,.35)]"
            />

            <span className="mt-8 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
              {project.category}
            </span>

            <h1 className="mt-6 text-5xl font-black text-white md:text-7xl">
              {project.name}
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
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
        rounded-xl
        border
        border-cyan-400/30
        bg-slate-950/40
        px-6
        py-3
        text-sm
        font-bold
        text-cyan-300
        backdrop-blur-md
        transition-all
        duration-300
        hover:border-cyan-300
        hover:bg-cyan-400
        hover:text-slate-950
      "
    >
      {label}
    </Link>
  );
}