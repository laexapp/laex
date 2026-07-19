"use client";

import { useEffect, useState } from "react";

import { featuredProjects } from "@/core/data/featuredProjects";

import SpotlightBanner from "./spotlight/SpotlightBanner";
import SpotlightOverlay from "./spotlight/SpotlightOverlay";
import SpotlightButton from "./spotlight/SpotlightButton";
import SpotlightIndicators from "./spotlight/SpotlightIndicators";

import { GlassCard } from "@/modules/ui";

export default function HeroSpotlight() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % featuredProjects.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const project = featuredProjects[index];

  return (
    <div className="relative w-full overflow-visible transition-all duration-700 lg:translate-x-20">

      {/* Glow principal */}
      <div className="absolute left-1/2 top-1/2 -z-20 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[180px]" />

      {/* Glow secundario */}
      <div className="absolute right-10 top-16 -z-20 h-40 w-40 rounded-full bg-blue-500/20 blur-[100px]" />

      <GlassCard className="overflow-hidden rounded-[34px]">

        <SpotlightBanner
          banner={project.banner}
          name={project.name}
        />

        <SpotlightOverlay
          badge={project.badge}
          name={project.name}
        />

        <div className="absolute bottom-6 right-8 z-20">
          <SpotlightButton
            action={project.action}
            url={project.url}
          />
        </div>

        <SpotlightIndicators
          total={featuredProjects.length}
          current={index}
        />

      </GlassCard>

    </div>
  );
}