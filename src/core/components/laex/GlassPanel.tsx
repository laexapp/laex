import { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export default function GlassPanel({
  children,
  className = "",
  hover = true,
}: GlassPanelProps) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        laex-card
        transition-all
        duration-500
        ${
          hover
            ? "hover:-translate-y-1 hover:border-cyan-400/30"
            : ""
        }
        ${className}
      `}
    >
      {/* Glow superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      {/* Glow lateral */}
      <div className="pointer-events-none absolute -right-24 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
