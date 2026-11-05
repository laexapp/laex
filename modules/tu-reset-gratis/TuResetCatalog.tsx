"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, CircleHelp, Download, Search, ShieldCheck, Wrench } from "lucide-react";
import { buildResetModelHref, filterResetModels, resetBrands, resetFamilies } from "./catalog";

export function TuResetCatalog() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [family, setFamily] = useState("Todos");
  const [brand, setBrand] = useState("Todas las marcas");
  const models = useMemo(() => filterResetModels({ query: searchTerm, family, brand }), [brand, family, searchTerm]);

  return (
    <main className="min-h-screen bg-[#0b1016] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-7 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/proyectos/lf-printer" className="text-xs font-bold tracking-wide text-white/70 hover:text-white">← Volver a LF-PRINTER</Link>
          <span className="rounded-full border border-[#00bbfc]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#73d9ff]">Centro de soporte LF-PRINTER</span>
        </header>

        <nav aria-label="Secciones de Tu Reset Gratis" className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[.035] p-2">
          <Link aria-current="page" href="/tu-reset-gratis" className="rounded-xl bg-[#00bbfc] px-3 py-3 text-center text-xs font-black text-slate-950 sm:text-sm">Resets Gratis</Link>
          <Link href="/tu-reset-gratis/firmwares" className="rounded-xl px-3 py-3 text-center text-xs font-bold text-white/75 transition hover:bg-white/10 hover:text-white sm:text-sm">Firmwares LF-PRINTER</Link>
        </nav>

        <section className="relative isolate overflow-hidden py-12 sm:py-16">
          <div className="pointer-events-none absolute -right-24 top-4 -z-10 size-80 rounded-full bg-[#00bbfc]/10 blur-3xl" />
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#00bbfc]"><Wrench size={15}/> Herramientas y mantenimiento</p>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">Tu Reset Gratis <span className="text-[#00bbfc]">LF-PRINTER</span></h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Busca tu impresora para consultar su ficha. Los modelos identificados y los que requieren revision se muestran por separado; ningun reset se anuncia como compatible hasta que LF-PRINTER lo verifique.</p>
          <form className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-white/[.06] p-2 focus-within:border-[#00bbfc]/70" onSubmit={(event) => { event.preventDefault(); setSearchTerm(query.trim()); }}>
            <Search className="ml-2 shrink-0 text-[#00bbfc]" size={20}/>
            <input aria-label="Buscar modelo de impresora" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca un modelo, por ejemplo L3250 o WF-4830" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-500"/>
            <button type="submit" className="rounded-xl bg-[#00bbfc] px-4 py-3 text-xs font-extrabold text-slate-950">Buscar</button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Filtrar por familia">{resetFamilies.map((item) => <button key={item} type="button" aria-pressed={family === item} onClick={() => setFamily(item)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${family === item ? "border-[#00bbfc] bg-[#00bbfc]/15 text-[#7addff]" : "border-white/10 text-slate-300 hover:border-white/30"}`}>{item}</button>)}</div>
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Filtrar por marca">{resetBrands.map((item) => <button key={item} type="button" aria-pressed={brand === item} onClick={() => setBrand(item)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${brand === item ? "border-white/50 bg-white/10 text-white" : "border-white/10 text-slate-400 hover:border-white/30"}`}>{item}</button>)}</div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-400"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400"/> Descargas bloqueadas hasta verificar archivo y compatibilidad</span><span className="inline-flex items-center gap-1.5"><BookOpen size={14} className="text-[#00bbfc]"/> Identificacion de modelo separada de disponibilidad del reset</span></div>
        </section>

        <section aria-labelledby="catalog-title" className="scroll-mt-5">
          <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#00bbfc]">Biblioteca de modelos</p><h2 id="catalog-title" className="mt-1 text-2xl font-extrabold">Encuentra tu impresora</h2></div><span aria-live="polite" className="text-xs text-slate-400">{models.length} modelos en el catalogo</span></div>
          {models.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{models.map((entry) => <Link key={entry.slug} href={buildResetModelHref(entry.slug)} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111a23] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[#00bbfc]/50 hover:shadow-[#00bbfc]/10 motion-reduce:transform-none motion-reduce:transition-none">
            <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(0,187,252,.12),transparent_70%)] sm:h-52">{entry.image ? <Image src={entry.image} alt={`Impresora ${entry.model}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={78} className="object-contain p-5 drop-shadow-[0_12px_12px_rgba(0,187,252,0.18)] transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"/> : <div aria-hidden="true" className="text-5xl font-black tracking-tight text-white/10">{entry.brand}</div>}<div className="absolute right-3 top-3 flex flex-col items-end gap-1"><span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${entry.modelStatus === "identified" ? "border-emerald-300/30 bg-emerald-200/10 text-emerald-200" : "border-amber-300/30 bg-amber-200/10 text-amber-200"}`}>{entry.modelStatus === "identified" ? "Modelo identificado" : "Identificacion pendiente"}</span><span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300">{entry.resourceStatus === "available" ? "Recurso verificado" : "Reset por verificar"}</span></div></div>
            <div className="p-5"><div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400"><span>{entry.family}</span><span>{entry.brand}</span></div><h3 className="mt-2 text-lg font-extrabold group-hover:text-[#73d9ff]">{entry.model}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{entry.issue}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#00bbfc]">Ver ficha <ArrowRight size={14}/></span></div>
          </Link>)}</div> : <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-400">No encontramos ese modelo. Revisa el codigo o solicita que lo agreguemos.</div>}
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <InfoCard icon={<BookOpen/>} title="Guias paso a paso" text="Las fichas muestran una guia inicial segura. Cada procedimiento especifico requiere revision tecnica antes de publicarse."/>
          <InfoCard icon={<Download/>} title="Descargas gratuitas" text="No se publica ningun enlace hasta verificar archivo, compatibilidad y permiso de distribucion gratuita."/>
          <InfoCard icon={<CircleHelp/>} title="No ves tu modelo?" text="Pide orientacion al equipo LF-PRINTER e indica el nombre completo que aparece en tu impresora." action="Solicitar asistencia" href="https://wa.me/18493581132"/>
        </section>
        <footer className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11px] leading-5 text-slate-500 sm:flex-row sm:justify-between"><span>Tu Reset Gratis - LF-PRINTER</span><span>Reiniciar un contador no repara el desgaste fisico. Consulta servicio tecnico si el equipo indica que una almohadilla llego al fin de su vida util.</span></footer>
      </div>
    </main>
  );
}

function InfoCard({ icon, title, text, action, href }: { icon: ReactNode; title: string; text: string; action?: string; href?: string }) {
  return <article className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><div className="mb-3 text-[#00bbfc]">{icon}</div><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>{action && href && <a href={href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#00bbfc] px-3 py-2 text-xs font-bold text-slate-950">{action}<ArrowRight size={13}/></a>}</article>;
}
