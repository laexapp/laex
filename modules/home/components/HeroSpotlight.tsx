"use client";

import { useEffect, useState } from "react";

import { featuredProjects } from "@/core/data/featuredProjects";

import SpotlightBanner from "./spotlight/SpotlightBanner";
import SpotlightOverlay from "./spotlight/SpotlightOverlay";
import SpotlightButton from "./spotlight/SpotlightButton";
import SpotlightIndicators from "./spotlight/SpotlightIndicators";

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
    <div className="relative w-full overflow-visible transition-all duration-700 lg:translate-x-24">

      {/* Glow de fondo */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Banner principal */}
      <SpotlightBanner
        banner={project.banner}
        name={project.name}
      />

      {/* Información */}
      <SpotlightOverlay
        badge={project.badge}
        name={project.name}
      />

      {/* Botón inteligente */}
      <div className="absolute bottom-6 right-8">
        <SpotlightButton
          action={project.action}
          url={project.url}
        />
      </div>

      {/* Indicadores */}
      <SpotlightIndicators
        total={featuredProjects.length}
        current={index}
      />

    </div>
  );
}