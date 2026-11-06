"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, BookOpen, ExternalLink, Printer, Search, ShieldCheck, Wrench } from "lucide-react";
import { buildResetModelHref, filterResetModels, resetBrands, resetFamilies } from "./catalog";
import { featuredPrintersByYear } from "./featured";

const featured2026 = featuredPrintersByYear[2026] ?? [];

export function TuResetCatalog() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("Todos");
  const [brand, setBrand] = useState("Todas las marcas");
  const models = useMemo(() => filterResetModels({ query, family, brand }), [brand, family, query]);

  return (
    <main className="min-h-screen bg-[#0b1016] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-7 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/proyectos/lf-printer" className="text-xs font-bold tracking-wide text-white/70 hover:text-white">← Volver a LF-PRINTER</Link>
          <span className="rounded-full border border-[#00bbfc]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#73d9ff]">Centro de soporte LF-PRINTER</span>
        </header>

        <nav aria-label="Secciones de Tu Reset Gratis" className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[.035] p-2">
          <Link aria-current="page" href="/tu-reset-gratis" className="rounded-xl bg-[#00bbfc] px-2 py-3 text-center text-[11px] font-black text-slate-950 sm:text-sm">Resets Gratis</Link>
          <Link href="/tu-reset-gratis/resets-comerciales" className="rounded-xl px-2 py-3 text-center text-[11px] font-bold text-white/75 transition hover:bg-white/10 hover:text-white sm:text-sm">Resets Comerciales</Link>
          <Link href="/tu-reset-gratis/firmwares" className="rounded-xl px-2 py-3 text-center text-[11px] font-bold text-white/75 transition hover:bg-white/10 hover:text-white sm:text-sm">Firmwares LF-PRINTER</Link>
        </nav>

        <section className="relative isolate overflow-hidden py-10 sm:py-12">
          <div className="pointer-events-none absolute -right-24 top-0 -z-10 size-80 rounded-full bg-[#00bbfc]/10 blur-3xl" />
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#00bbfc]"><Wrench size={15}/> Biblioteca de soluciones por modelo</p>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">Tu Reset Gratis <span className="text-[#00bbfc]">LF-PRINTER</span></h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Busca por marca, serie o modelo. Cada ficha separa los datos identificados de las soluciones que LF-PRINTER aún debe verificar.</p>

          <div className="mt-7 flex max-w-3xl items-center gap-3 rounded-2xl border border-white/15 bg-white/[.06] p-2 focus-within:border-[#00bbfc]/70">
            <Search className="ml-2 shrink-0 text-[#00bbfc]" size={20}/>
            <input aria-label="Buscar por marca o modelo" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar marca o modelo: Epson L3250, Canon G2160…" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-500"/>
            {query && <button type="button" onClick={() => setQuery("")} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">Limpiar</button>}
          </div>
          <div className="mt-3 grid max-w-3xl gap-3 sm:grid-cols-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fabricante
              <select aria-label="Filtrar por fabricante" value={brand} onChange={(event) => setBrand(event.target.value)} className="mt-1.5 block w-full rounded-xl border border-white/15 bg-[#111a23] px-3 py-3 text-sm font-semibold text-white outline-none focus:border-[#00bbfc]">
                {resetBrands.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Familia o serie
              <select aria-label="Filtrar por familia o serie" value={family} onChange={(event) => setFamily(event.target.value)} className="mt-1.5 block w-full rounded-xl border border-white/15 bg-[#111a23] px-3 py-3 text-sm font-semibold text-white outline-none focus:border-[#00bbfc]">
                {resetFamilies.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-slate-400"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400"/> Las descargas siguen bloqueadas hasta verificar el recurso</span><span className="inline-flex items-center gap-1.5"><BookOpen size={14} className="text-[#00bbfc]"/> Cada modelo conserva su propia ficha</span></div>
        </section>

        <section aria-labelledby="featured-title" className="mb-12 scroll-mt-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#00bbfc]">Selección anual · 2026</p><h2 id="featured-title" className="mt-1 text-2xl font-extrabold sm:text-3xl">Impresoras destacadas</h2></div>
            <span className="rounded-full border border-amber-300/25 bg-amber-300/[.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">Propuesta pendiente de aprobación CEO</span>
          </div>
          <p className="mb-4 max-w-3xl text-xs leading-5 text-slate-400">Candidatas elegidas porque Epson República Dominicana las presenta actualmente en sus líneas para hogar, emprendimiento y empresa. La selección no representa cifras de ventas. Las fotos no aparecen hasta confirmar procedencia y derechos de uso.</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {featured2026.map((item, index) => <article key={item.slug} className="group flex min-h-44 flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-[#111a23] to-[#0d141d] p-3 transition hover:border-[#00bbfc]/40">
              <div className="flex items-center justify-between"><span className="grid size-8 place-items-center rounded-lg border border-[#00bbfc]/20 bg-[#00bbfc]/[.08] text-[#73d9ff]"><Printer size={16}/></span><span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Candidata {String(index + 1).padStart(2, "0")}</span></div>
              <Link href={buildResetModelHref(item.slug)} className="mt-3 text-sm font-extrabold leading-snug group-hover:text-[#73d9ff]">{item.model}</Link>
              <p className="mt-1 text-[10px] leading-4 text-slate-400">{item.reason}</p>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex w-fit items-center gap-1 text-[9px] font-bold text-[#73d9ff] hover:text-white">Ver en Epson RD <ExternalLink size={10}/></a>
              <div className="mt-auto flex items-end justify-between gap-2 pt-3"><span className="text-[10px] text-slate-400">{item.segment}</span><span className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-200"><BadgeCheck size={12}/> Foto por validar</span></div>
            </article>)}
          </div>
        </section>

        <section aria-labelledby="catalog-title" className="scroll-mt-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#00bbfc]">Biblioteca completa</p><h2 id="catalog-title" className="mt-1 text-2xl font-extrabold">Modelos de impresora</h2></div><span aria-live="polite" className="text-xs text-slate-400">{models.length} modelos encontrados</span></div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101821]">
            <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(8rem,.8fr)_minmax(8rem,.8fr)_auto] gap-4 border-b border-white/10 bg-white/[.035] px-5 py-3 text-[9px] font-bold uppercase tracking-[.16em] text-slate-500 sm:grid"><span>Impresora</span><span>Serie</span><span>Estado</span><span>Ficha</span></div>
            {models.length ? <ul className="divide-y divide-white/[.07]">{models.map((entry) => <li key={entry.slug}>
              <Link href={buildResetModelHref(entry.slug)} className="grid gap-2 px-4 py-3 transition hover:bg-[#00bbfc]/[.045] sm:grid-cols-[minmax(0,1.5fr)_minmax(8rem,.8fr)_minmax(8rem,.8fr)_auto] sm:items-center sm:gap-4 sm:px-5">
                <span className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[.035] text-[9px] font-black uppercase text-slate-400">{entry.brand === "Epson" ? "EP" : "CN"}</span><span className="min-w-0"><span className="block truncate text-sm font-bold text-white">{entry.model}</span><span className="mt-0.5 block text-[10px] text-slate-500">{entry.brand} · {entry.modelStatus === "identified" ? "modelo identificado" : "identificación pendiente"}</span></span></span>
                <span className="pl-12 text-xs text-slate-400 sm:pl-0">{entry.family}</span>
                <span className="pl-12 text-[10px] font-semibold text-slate-400 sm:pl-0"><span className="rounded-full border border-amber-300/20 bg-amber-300/[.05] px-2.5 py-1 text-amber-200">{entry.resourceStatus === "available" ? "Recurso verificado" : "Soluciones por verificar"}</span></span>
                <span className="hidden items-center gap-1 text-xs font-bold text-[#00bbfc] sm:inline-flex">Abrir <ArrowRight size={13}/></span>
              </Link>
            </li>)}</ul> : <div className="p-8 text-center text-sm text-slate-400">No encontramos ese modelo. Ajusta los filtros o revisa el código.</div>}
          </div>
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11px] leading-5 text-slate-500 sm:flex-row sm:justify-between"><span>Tu Reset Gratis · LF-PRINTER</span><span>Los recursos pendientes no activan descargas. Reiniciar un contador tampoco repara el desgaste físico de una almohadilla.</span></footer>
      </div>
    </main>
  );
}
