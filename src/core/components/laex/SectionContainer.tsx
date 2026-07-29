import { ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionContainer({
  children,
  className = "",
}: SectionContainerProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-[40px]
      border border-cyan-500/15
      bg-[#050914]
      px-8 py-12 md:px-12 md:py-16
      ${className}`}
    >
      {/* Aurora superior */}
      <div className="pointer-events-none absolute -top-52 right-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Aurora inferior */}
      <div className="pointer-events-none absolute -bottom-56 left-[-120px] h-[380px] w-[380px] rounded-full bg-blue-600/10 blur-[140px]" />

      {/* Grid tecnológico */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow central */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.08),transparent_65%)]" />

      {/* Contenido */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}