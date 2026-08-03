import Link from "next/link";
import Header from "@/modules/layout/components/Header";
import MediaBreadcrumbs from "@/modules/media-intelligence/components/MediaBreadcrumbs";
import "./media-intelligence.css";

export default function MediaIntelligenceLayout({ children }: { children: React.ReactNode }) {
  return <div className="laex-media min-h-screen text-white">
    <Header />
    <MediaBreadcrumbs />
    <div className="border-b border-white/[0.06] bg-[#07101b]/95 px-4 py-2 text-center text-[10px] font-semibold tracking-[.12em] text-amber-200">
      EXPERIENCIA DE REVISIÓN · INTELIGENCIA Y DISTRIBUCIÓN SIMULADAS · CONTROL HUMANO ACTIVO
    </div>
    <nav aria-label="Secciones de Media Intelligence" className="laex-media-premium-nav sticky top-[84px] z-40 mx-auto flex w-fit gap-1 rounded-b-2xl border border-t-0 border-white/10 p-1.5">
      <Link href="/media-intelligence" className="rounded-xl px-4 py-2 text-[10px] font-bold text-slate-300 hover:bg-white/5">Demo ejecutivo</Link>
      <Link href="/media-intelligence/operations" className="rounded-xl bg-cyan-300/10 px-4 py-2 text-[10px] font-bold text-cyan-200 hover:bg-cyan-300/15">Centro de operaciones</Link>
    </nav>
    {children}
  </div>;
}

