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
    <section className="overflow-hidden rounded-3xl border border-cyan-900 bg-[#0d1523]">

      <div className="relative">

        <Image
          src={project.banner}
          alt={project.name}
          width={1600}
          height={700}
          priority
          className="h-[520px] w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#08111d]/95 via-[#08111d]/70 to-[#08111d]/35" />

        <div className="absolute inset-0 flex items-end">

          <div className="w-full p-8 md:p-12">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

                <Image
                  src={project.logo}
                  alt={project.name}
                  width={120}
                  height={120}
                  className="rounded-3xl border border-cyan-700 bg-slate-900 p-3 shadow-2xl"
                />

                <div>

                  <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    {project.category}
                  </span>

                  <h1 className="mt-4 text-4xl font-black text-white md:text-6xl">
                    {project.name}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-3">

                    <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
                      🟢 {project.status}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                      🚀 {project.launchDate}
                    </span>

                  </div>

                  <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                    {project.description}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-white/10 bg-slate-950/60 p-6">

        <div className="flex flex-wrap gap-3">

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
        border-cyan-500/20
        bg-cyan-500/10
        px-5
        py-3
        text-sm
        font-semibold
        text-cyan-300
        transition-all
        duration-300
        hover:border-cyan-400
        hover:bg-cyan-500
        hover:text-slate-950
      "
    >
      {label}
    </Link>
  );
}