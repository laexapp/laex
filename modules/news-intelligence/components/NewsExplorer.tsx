"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Zap, Layers3 } from "lucide-react";
import type { NewsEvent } from "../domain/types";
import { searchNews } from "../application/search";

const categories=["Todas","Última hora","Mercados","IA","Blockchain","Regulación","Seguridad","Ecosistema LAEX"];
const tone={cyan:"from-cyan-400/25",purple:"from-violet-400/25",orange:"from-orange-400/25",green:"from-emerald-400/25"};
export function NewsExplorer({events}:{events:NewsEvent[]}){
 const [query,setQuery]=useState(""); const [category,setCategory]=useState("Todas");
 const results=useMemo(()=>searchNews(events,query,category),[events,query,category]);
 return <>
  <div className="mt-9 flex flex-col gap-4 lg:flex-row lg:items-center">
   <label className="relative flex-1"><span className="sr-only">Buscar noticias</span><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-300" size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar activo, proyecto, empresa o palabra clave" className="w-full rounded-2xl border border-cyan-300/20 bg-black/30 py-4 pl-13 pr-5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none"/></label>
   <div className="scrollbar-hide flex gap-2 overflow-x-auto" aria-label="Filtrar por categoría">{categories.map(item=><button key={item} onClick={()=>setCategory(item)} aria-pressed={category===item} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${category===item?"border-cyan-300/50 bg-cyan-300/12 text-cyan-100":"border-white/10 text-slate-400 hover:text-white"}`}>{item}</button>)}</div>
  </div>
  <div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{results.length} eventos encontrados</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"/>Índice operativo</span></div>
  <section className="mt-6 grid gap-5 lg:grid-cols-12" aria-live="polite">
   {results.map((event,index)=><article key={event.id} className={`group laex-card relative overflow-hidden rounded-3xl p-6 ${index===0?"lg:col-span-7 lg:row-span-2":"lg:col-span-5"}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${tone[event.imageTone]} via-transparent to-transparent opacity-60`}/><div className="relative">
     <div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-cyan-100">{event.category}</span>{event.urgency!=="normal"&&<span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.16em] text-orange-300"><Zap size={11}/> {event.urgency==="critical"?"Alerta":"En desarrollo"}</span>}</div>
     <h2 className={`${index===0?"mt-7 text-3xl sm:text-4xl":"mt-5 text-xl"} font-semibold tracking-[-.04em] text-white`}>{event.title}</h2><p className="mt-4 text-sm leading-7 text-slate-300">{event.summary}</p>
     <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400"><span>{new Intl.DateTimeFormat("es-CL",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"}).format(new Date(event.publishedAt))}</span><span>·</span><span className="flex items-center gap-1.5"><Layers3 size={13}/>{event.sources.length} {event.sources.length===1?"fuente":"medios agrupados"}</span></div>
     <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/[.08] pt-5"><div><p className="text-[10px] uppercase tracking-[.2em] text-slate-500">Impacto LAEX</p><p className={`mt-1 text-sm font-bold ${event.intelligence.impact==="Crítico"?"text-red-300":"text-cyan-200"}`}>{event.intelligence.impact} · {event.intelligence.confidence}% confianza</p></div><Link href={`/noticias/${event.slug}`} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition group-hover:bg-cyan-200">Abrir inteligencia <ArrowUpRight size={14}/></Link></div>
    </div>
   </article>)}
   {!results.length&&<div className="laex-surface col-span-full rounded-3xl p-12 text-center"><Search className="mx-auto text-slate-600"/><h2 className="mt-4 text-xl font-semibold">No encontramos esa señal</h2><p className="mt-2 text-sm text-slate-500">Prueba con otro activo, proyecto o categoría.</p></div>}
  </section>
 </>;
}
