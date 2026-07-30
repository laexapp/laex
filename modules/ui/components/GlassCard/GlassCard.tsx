import { ReactNode } from "react";
import clsx from "clsx";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className,
}: GlassCardProps) {
  return (
    <div
      className={clsx(
        "laex-card group relative overflow-hidden rounded-3xl",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.055] via-transparent to-blue-500/[0.055] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-cyan-400/[0.075] blur-3xl transition-transform duration-700 group-hover:-translate-x-4 group-hover:translate-y-4" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
