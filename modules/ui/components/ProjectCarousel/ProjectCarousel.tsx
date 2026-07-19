"use client";

import { ReactNode, useRef } from "react";

type ProjectCarouselProps = {
  children: ReactNode;
};

export default function ProjectCarousel({
  children,
}: ProjectCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      left: direction === "right" ? 420 : -420,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">

      <button
        onClick={() => scroll("left")}
        className="
          absolute
          left-0
          top-1/2
          z-20
          -translate-y-1/2
          rounded-full
          border
          border-white/10
          bg-black/40
          p-3
          text-white
          backdrop-blur-xl
          transition
          hover:border-cyan-400
        "
      >
        ←
      </button>

      <div
        ref={containerRef}
        className="
          flex
          gap-6
          overflow-x-auto
          scroll-smooth
          px-14
          pb-4
          scrollbar-hide
        "
      >
        {children}
      </div>

      <button
        onClick={() => scroll("right")}
        className="
          absolute
          right-0
          top-1/2
          z-20
          -translate-y-1/2
          rounded-full
          border
          border-white/10
          bg-black/40
          p-3
          text-white
          backdrop-blur-xl
          transition
          hover:border-cyan-400
        "
      >
        →
      </button>

    </div>
  );
}