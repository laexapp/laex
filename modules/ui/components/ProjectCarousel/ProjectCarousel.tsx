"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { ReactNode, useRef } from "react";

type Props = { children: ReactNode };

export default function ProjectCarousel({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (direction: "left" | "right") => containerRef.current?.scrollBy({ left: direction === "right" ? 380 : -380, behavior: "smooth" });
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = event.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    event.preventDefault();
    const x = event.pageX - containerRef.current.offsetLeft;
    containerRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.3;
  };

  const controlClass = "absolute top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#071018]/85 text-slate-300 shadow-xl backdrop-blur-xl transition hover:border-cyan-300/35 hover:text-cyan-200";

  return (
    <div className="group relative -mx-3 px-3">
      <button type="button" aria-label="Ver proyectos anteriores" onClick={() => scroll("left")} className={`${controlClass} left-2`}><ArrowLeft size={18} /></button>
      <div ref={containerRef} onMouseDown={handleMouseDown} onMouseLeave={() => { isDragging.current = false; }} onMouseUp={() => { isDragging.current = false; }} onMouseMove={handleMouseMove} className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-12 pb-7 pt-3 active:cursor-grabbing md:px-14">
        {children}
      </div>
      <button type="button" aria-label="Ver proyectos siguientes" onClick={() => scroll("right")} className={`${controlClass} right-2`}><ArrowRight size={18} /></button>
    </div>
  );
}
