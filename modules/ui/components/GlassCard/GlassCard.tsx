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
        "relative overflow-hidden rounded-3xl",
        "border border-white/10",
        "bg-white/5",
        "backdrop-blur-2xl",
        "shadow-[0_0_60px_rgba(0,255,255,0.08)]",
        "transition-all duration-300",
        "hover:border-cyan-400/40",
        "hover:shadow-[0_0_80px_rgba(34,211,238,0.20)]",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-blue-500/5 pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}