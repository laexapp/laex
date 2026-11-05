"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CircleHelp, Download, Search, ShieldCheck, Wrench } from "lucide-react";
import { resetFamilies, resetModels } from "./catalog";

export function TuResetCatalog() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [family, setFamily] = useState("Todos");
  const models = useMemo(
    () => resetModels.filter((entry) => (family === "Todos" || entry.family === family) && `${entry.model} ${entry.brand} ${entry.family} ${entry.issue}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [family, searchTerm],
  );

  return (
    <main className="min-h-screen bg-[#0b1016] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-7 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/proyectos/lf-printer" className="text-xs font-bold tracking-wide text-white/70 hover:text-white">← Volver a LF-PRINTER</Link>
          <span className="rounded-full border border-[#00bbfc]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#73d9ff]">Centro de soporte</span>
        </header>

        <nav aria-label="Secciones de Tu Reset Gratis" className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[.035] p-2">
          <Link aria-current="page" href="/tu-reset-gratis" className="rounded-xl bg-[#00bbfc] px-3 py-3 text-center text-xs font-black text-slate-950 sm:text-sm">Resets Gratis</Link>
          <Link href="/tu-reset-gratis/firmwares" className="rounded-xl px-3 py-3 text-center text-xs font-bold text-white/75 transition hover:bg-white/10 hover:text-white sm:text-sm">Firmwares LF-PRINTER</Link>
        </nav>

        <section className="relative isolate overflow-hidden py-12 sm:py-16">
          <div className="pointer-events-none absolute -right-24 top-4 -z-10 size-80 rounded-full bg-[#00bbfc]/10 blur-3xl" />
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#00bbfc]"><Wrench size={15}/> Herramientas y mantenimiento</p>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">Tu Reset Gratis <span className="text-[#00bbfc]">LF-PRINTER</span></h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Encuentra tu impresora y consulta guías de mantenimiento. Las fichas marcadas DEMO ilustran la experiencia; las herramientas se publicarán cuando su procedencia y compatibilidad estén revisadas.</p>
          <form className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-white/[.06] p-2 focus-within:border-[#00bbfc]/70" onSubmit={(event) => { event.preventDefault(); setSearchTerm(query.trim().toLowerCase()); }}>
            <Search className="ml-2 shrink-0 text-[#00bbfc]" size={20}/>
            <input aria-label="Buscar modelo de impresora" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca un modelo, por ejemplo L3210 o WF-4830" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-500"/>
            <button type="submit" className="rounded-xl bg-[#00bbfc] px-4 py-3 text-xs font-extrabold text-slate-950">Buscar</button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">{resetFamilies.map((item) => <button key={item} type="button" aria-pressed={family === item} onClick={() => setFamily(item)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${family === item ? "border-[#00bbfc] bg-[#00bbfc]/15 text-[#7addff]" : "border-white/10 text-slate-300 hover:border-white/30"}`}>{item}</button>)}</div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-400"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400"/> Las descargas se activan tras verificar el recurso</span><span className="inline-flex items-center gap-1.5"><BookOpen size={14} className="text-[#00bbfc]"/> Fichas y guías por modelo</span></div>
        </section>

        <section aria-labelledby="catalog-title" className="scroll-mt-5">
          <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#00bbfc]">Biblioteca de modelos</p><h2 id="catalog-title" className="mt-1 text-2xl font-extrabold">Encuentra tu impresora</h2></div><span className="text-xs text-slate-400">{models.length} modelos de demostración</span></div>
          {models.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{models.map((entry) => <Link key={entry.slug} href={`/tu-reset-gratis/${entry.slug}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111a23] transition hover:-translate-y-0.5 hover:border-[#00bbfc]/50">
            <div className="relative flex h-40 items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(0,187,252,.12),transparent_70%)]">{entry.image ? <Image src={entry.image} alt={`Impresora ${entry.model}`} fill sizes="(max-width: 768px) 90vw, 30vw" className="object-contain p-4"/> : <div className="text-5xl font-black tracking-tight text-white/10">{entry.brand}</div>}<span className="absolute right-3 top-3 rounded-full border border-amber-300/30 bg-amber-200/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-200">DEMO · En revisión</span></div>
            <div className="p-5"><div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400"><span>{entry.family}</span><span>{entry.brand}</span></div><h3 className="mt-2 text-lg font-extrabold group-hover:text-[#73d9ff]">{entry.model}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{entry.issue}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#00bbfc]">Ver ficha y guía <ArrowRight size={14}/></span></div>
          </Link>)}</div> : <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-400">No encontramos ese modelo. Revisa el código o solicita que lo agreguemos.</div>}
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <InfoCard icon={<BookOpen/>} title="Tutoriales" text="Estamos preparando guías por modelo. Entra en una ficha para revisar el formato de ejemplo."/>
          <InfoCard icon={<Download/>} title="Descargas gratuitas" text="La descarga está desactivada en los ejemplos. Se habilitará solo para recursos revisados y autorizados."/>
          <InfoCard icon={<CircleHelp/>} title="¿No ves tu modelo?" text="Pide orientación al equipo LF-PRINTER y comparte el nombre completo que aparece en tu impresora." action="Solicitar asistencia" href="https://wa.me/18493581132"/>
        </section>
        <footer className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11px] leading-5 text-slate-500 sm:flex-row sm:justify-between"><span>Tu Reset Gratis · LF-PRINTER</span><span>En algunos modelos, reiniciar un contador no resuelve el desgaste físico del componente. Consulta servicio técnico si el equipo reporta fin de vida útil.</span></footer>
      </div>
    </main>
  );
}

function InfoCard({ icon, title, text, action, href }: { icon: React.ReactNode; title: string; text: string; action?: string; href?: string }) {
  return <article className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><div className="mb-3 text-[#00bbfc]">{icon}</div><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>{action && href && <a href={href} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#00bbfc] px-3 py-2 text-xs font-bold text-slate-950">{action}<ArrowRight size={13}/></a>}</article>;
}
