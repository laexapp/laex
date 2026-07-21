"use client";

import { ReactNode, useRef } from "react";

type ProjectCarouselProps = {
  children: ReactNode;
};

export default function ProjectCarousel({
  children,
}: ProjectCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      left: direction === "right" ? 420 : -420,
      behavior: "smooth",
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    e.preventDefault();

    containerRef.current.scrollLeft += e.deltaY;
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!containerRef.current) return;

    isDragging.current = true;

    startX.current =
      e.pageX - containerRef.current.offsetLeft;

    scrollLeft.current =
      containerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!isDragging.current) return;

    if (!containerRef.current) return;

    e.preventDefault();

    const x =
      e.pageX - containerRef.current.offsetLeft;

    const walk = (x - startX.current) * 1.4;

    containerRef.current.scrollLeft =
      scrollLeft.current - walk;
  };

  return (
    <div className="group relative">

      <button
        onClick={() => scroll("left")}
        className="
          absolute
          left-0
          top-1/2
          z-30
          -translate-y-1/2
          rounded-full
          border
          border-cyan-400/20
          bg-[#0A101A]/70
          p-3
          text-white
          opacity-0
          backdrop-blur-xl
          transition-all
          duration-300
          group-hover:opacity-100
          hover:scale-110
          hover:border-cyan-400
          hover:shadow-[0_0_25px_rgba(6,182,212,.35)]
        "
      >
        ←
      </button>

      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="
          flex
          gap-6
          overflow-x-auto
          scroll-smooth
          px-14
          pb-4
          scrollbar-hide
          cursor-grab
          active:cursor-grabbing
          select-none
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
          z-30
          -translate-y-1/2
          rounded-full
          border
          border-cyan-400/20
          bg-[#0A101A]/70
          p-3
          text-white
          opacity-0
          backdrop-blur-xl
          transition-all
          duration-300
          group-hover:opacity-100
          hover:scale-110
          hover:border-cyan-400
          hover:shadow-[0_0_25px_rgba(6,182,212,.35)]
        "
      >
        →
      </button>

    </div>
  );
}