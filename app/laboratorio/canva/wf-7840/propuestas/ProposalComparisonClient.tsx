'use client';

import Image from 'next/image';
import { useState } from 'react';

export type ProposalItem = { id: string; sourceGlobalAssetId: string; templateId: string; outputPath: string; status: 'pending-human-review' | 'approved' | 'rejected'; createdAt: string };
const names: Record<string, string> = { 'executive-dark': 'Executive Dark', 'retail-impact': 'Retail Impact', 'editorial-light': 'Editorial Light' };

export function ProposalComparisonClient({ initialItems }: { initialItems: ProposalItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    const response = await fetch('/api/commercial-composition/canva/business/wf-7840/proposals', { cache: 'no-store' });
    if (!response.ok) throw new Error('No fue posible actualizar la comparación.');
    setItems(((await response.json()) as { derivatives: ProposalItem[] }).derivatives);
  }
  async function generate() {
    setBusy(true); setMessage('Creando tres diseños y exportándolos desde Canva…');
    const response = await fetch('/api/commercial-composition/canva/business/wf-7840/proposals', { method: 'POST' });
    const data = await response.json() as { error?: string };
    setMessage(response.ok ? 'Propuestas listas para comparación y revisión.' : (data.error ?? 'La generación falló.'));
    if (response.ok) await refresh();
    setBusy(false);
  }
  async function review(id: string, decision: 'approved' | 'rejected') {
    const response = await fetch(`/api/commercial-composition/canva/derivatives/${encodeURIComponent(id)}/review`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ decision }) });
    if (response.ok) await refresh();
  }

  return <>
    <header className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl md:p-11"><p className="text-sm font-bold uppercase tracking-[.22em] text-teal-300">Laboratorio visual · WF-7840</p><h1 className="mt-3 text-4xl font-bold md:text-5xl">Comparativa comercial</h1><p className="mt-4 max-w-4xl text-slate-300">Tres direcciones visuales con identidad oficial LF-PRINTER. Todas son borradores internos y requieren decisión humana.</p><button onClick={generate} disabled={busy} className="mt-7 rounded-full bg-teal-300 px-6 py-3 font-bold text-slate-950 disabled:opacity-60">{busy ? 'Generando…' : 'Regenerar propuestas'}</button>{message && <p role="status" className="mt-4 rounded-xl bg-white/10 p-4 text-sm">{message}</p>}</header>
    <section className="mt-8 grid gap-6 xl:grid-cols-3">{items.map((item) => { const slug = item.templateId.split(':').at(-1)!; return <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"><div className="relative aspect-video bg-slate-100"><Image src={item.outputPath} alt={`Propuesta ${names[slug] ?? slug} para WF-7840`} fill sizes="(min-width:1280px) 33vw, 100vw" className="object-contain" /></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-teal-700">{names[slug] ?? slug}</p><p className="mt-2 text-sm text-slate-500">{item.status === 'pending-human-review' ? 'Pendiente de CEO y Arquitecta' : item.status === 'approved' ? 'Aprobada' : 'Rechazada'}</p>{item.status === 'pending-human-review' && <div className="mt-5 flex gap-3"><button onClick={() => review(item.id, 'approved')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Aprobar</button><button onClick={() => review(item.id, 'rejected')} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-bold text-white">Rechazar</button></div>}</div></article>; })}</section>
  </>;
}
