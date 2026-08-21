"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { FloatingQuickActionsProps } from "./types";

export function FloatingQuickActions({ actions, ariaLabel = "Acciones rápidas" }: FloatingQuickActionsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeAction = actions.find((action) => action.id === activeId);

  useEffect(() => {
    if (!activeAction?.panel) return;
    const frame = requestAnimationFrame(() => panelRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setActiveId(null);
    window.addEventListener("keydown", onKeyDown);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("keydown", onKeyDown); };
  }, [activeAction]);

  return <>
    {activeAction?.panel && <div className="fixed inset-0 z-[89] bg-black/45 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none" onMouseDown={(event) => event.target === event.currentTarget && setActiveId(null)}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={activeAction.label} tabIndex={-1} className="absolute inset-x-3 bottom-24 max-h-[calc(100dvh-7rem)] overflow-auto rounded-[1.75rem] border border-white/15 bg-[#06101a]/98 text-white shadow-[0_28px_100px_rgba(0,0,0,.7)] outline-none backdrop-blur-2xl sm:inset-x-auto sm:bottom-5 sm:right-24 sm:w-[min(34rem,calc(100vw-8rem))]">
        <button type="button" onClick={() => setActiveId(null)} aria-label="Cerrar panel" className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"><X size={17}/></button>
        {activeAction.panel()}
      </div>
    </div>}
    <nav aria-label={ariaLabel} className="fixed bottom-4 right-3 z-[90] flex flex-row-reverse gap-2 sm:bottom-6 sm:right-5 sm:flex-col sm:gap-3">
      {actions.map((action) => {
        const Icon=action.icon; const active=action.id===activeId;
        const classes=`group relative grid size-12 place-items-center rounded-full border text-white shadow-[0_12px_35px_rgba(0,0,0,.45)] transition duration-300 hover:-translate-y-1 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-3 sm:size-14 ${active?"border-cyan-200 bg-cyan-500 text-black":action.accent==="green"?"border-emerald-300/40 bg-emerald-500":action.accent==="gold"?"border-amber-200/40 bg-amber-400 text-black":action.accent==="violet"?"border-violet-300/40 bg-violet-600":"border-cyan-200/40 bg-[#092238]"}`;
        const content=<>{action.visual?action.visual():<Icon size={22} strokeWidth={2.2}/>}<span className="pointer-events-none absolute right-[calc(100%+.7rem)] hidden whitespace-nowrap rounded-lg border border-white/10 bg-[#07111b]/95 px-3 py-2 text-[11px] font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">{action.label}</span></>;
        return action.href?<a key={action.id} href={action.href} target="_blank" rel="noreferrer" aria-label={action.label} className={classes}>{content}</a>:<button key={action.id} type="button" aria-label={action.label} aria-expanded={active} className={classes} onClick={()=>setActiveId(active?null:action.id)}>{content}</button>;
      })}
    </nav>
  </>;
}
