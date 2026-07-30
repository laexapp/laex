"use client";

import { ArrowRight, Radio } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

import { featuredProjects } from "@/core/data/featuredProjects";

export default function HeroSpotlight() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % featuredProjects.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const project = featuredProjects[index];
  const accentStyle = { "--spotlight-accent": project.color } as CSSProperties;

  return (
    <article
      className="group relative min-h-[560px] overflow-hidden rounded-[32px] border border-white/[0.11] bg-[#071018]/85 shadow-[0_42px_110px_rgba(2,4,10,.62)] backdrop-blur-2xl sm:min-h-[640px]"
      style={accentStyle}
    >
      <Image
        key={project.banner}
        src={project.banner}
        alt=""
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 54vw"
        className="object-cover opacity-70 transition duration-1000 ease-laex-emphasized group-hover:scale-[1.018] group-hover:opacity-80"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,11,.04),rgba(3,7,11,.08)_42%,#03070B_96%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_20%,color-mix(in_srgb,var(--spotlight-accent)_18%,transparent),transparent_20rem)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(125,222,238,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(125,222,238,.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

      <div className="absolute left-7 top-7 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 backdrop-blur-xl">
        <Radio size={13} className="text-cyan-300" aria-hidden="true" />
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">Featured signal</span>
      </div>

      <div className="absolute right-7 top-7 z-10 text-right">
        <span className="block text-[9px] uppercase tracking-[0.16em] text-slate-500">Ecosystem</span>
        <strong className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-cyan-200">Online</strong>
      </div>

      <span className="pointer-events-none absolute bottom-7 left-7 z-10 h-7 w-7 border-b border-l border-white/20" />
      <span className="pointer-events-none absolute bottom-7 right-7 z-10 h-7 w-7 border-b border-r border-white/20" />

      <div className="absolute inset-x-7 bottom-12 z-10 sm:inset-x-12 sm:bottom-12">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">{project.badge}</span>
        <h2 className="laex-display mt-4 text-4xl text-white sm:text-6xl">{project.name}</h2>
        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">{project.slogan}</p>

        <div className="mt-7 flex items-end justify-between gap-5 border-t border-white/[0.08] pt-6">
          <div className="flex gap-2" aria-label={`Proyecto ${index + 1} de ${featuredProjects.length}`}>
            {featuredProjects.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(itemIndex)}
                className={`h-0.5 transition-all duration-300 ${itemIndex === index ? "w-9 bg-cyan-300" : "w-4 bg-white/20 hover:bg-white/40"}`}
                aria-label={`Mostrar ${item.name}`}
                aria-current={itemIndex === index}
              />
            ))}
          </div>

          <Link
            href={project.url}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-cyan-300/30 bg-[#071018]/70 text-cyan-200 shadow-[0_12px_34px_rgba(0,0,0,.35)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-cyan-300 hover:text-[#031016] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            aria-label={`${project.action}: ${project.name}`}
          >
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}
