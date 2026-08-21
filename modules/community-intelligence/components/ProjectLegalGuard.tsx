"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Info, Scale, X } from "lucide-react";

export function ProjectLegalGuard() {
  const path = usePathname();
  if (!/^\/proyectos\/[^/]+/.test(path)) return null;
  return <Notice key={path} compact={path.startsWith("/proyectos/lf-printer")}/>;
}

function Notice({ compact }: { compact: boolean }) {
  const [closed, setClosed] = useState(false), [expanded, setExpanded] = useState(!compact);
  if (closed) return null;
  if (compact && !expanded) return <aside className="fixed bottom-20 left-3 z-40 lg:bottom-4"><button onClick={() => setExpanded(true)} className="flex items-center gap-2 rounded-full border border-white/15 bg-[#100e0a]/90 px-3 py-2 text-[11px] text-amber-50 shadow-lg backdrop-blur"><Info size={14}/> Información del proyecto</button></aside>;
  return <aside className={`fixed z-40 rounded-2xl border border-amber-200/20 bg-[#100e0a]/95 p-4 pr-12 shadow-2xl backdrop-blur-xl ${compact ? "bottom-20 left-3 w-[min(calc(100%-1.5rem),28rem)] lg:bottom-4" : "bottom-28 left-1/2 w-[min(calc(100%-2rem),52rem)] -translate-x-1/2"}`} aria-label="Independencia del proyecto"><div className="flex gap-3"><Scale className="mt-0.5 shrink-0 text-amber-200" size={18}/><div><b className="text-[13px] text-amber-50">Proyecto empresarial independiente</b><p className="mt-1 text-[12px] leading-5 text-slate-300">LF-PRINTER es responsable de sus productos y servicios. LAEX provee la tecnología de la plataforma.</p></div></div><button onClick={() => compact ? setExpanded(false) : setClosed(true)} aria-label="Cerrar aviso" className="absolute right-3 top-3 grid size-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10"><X size={16}/></button>{compact && <button onClick={() => setClosed(true)} className="mt-3 text-[10px] text-slate-400 underline">No volver a mostrar durante esta visita</button>}</aside>;
}
