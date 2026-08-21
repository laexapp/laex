'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type Derivative = {
  id: string; outputPath: string; status: 'pending-human-review' | 'approved' | 'rejected'; createdAt: string; designId: string;
  commerceSnapshot?: { name: string; basePriceMinor: number; promotionalPriceMinor: number; promotionTitle: string; targetUrl: string };
  automation?: string[];
};
const statusLabel = { 'pending-human-review': 'Pendiente de aprobación humana', approved: 'Aprobado', rejected: 'Rechazado' };
const money = (minor: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(minor / 100);

export default function CanvaLabPage() {
  const [items, setItems] = useState<Derivative[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const refresh = useCallback(async () => {
    const response = await fetch('/api/commercial-composition/canva/lab/wf-4830', { cache: 'no-store' });
    if (response.ok) setItems(((await response.json()) as { derivatives: Derivative[] }).derivatives.toReversed());
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void refresh(); }, [refresh]);
  async function run() {
    setBusy(true); setMessage('Consultando Commerce, renovando OAuth, ejecutando Autofill y exportando…');
    const response = await fetch('/api/commercial-composition/canva/lab/wf-4830', { method: 'POST' });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? 'Ciclo completado. La promoción espera revisión humana.' : (result.error ?? 'No fue posible completar el ciclo.'));
    await refresh(); setBusy(false);
  }
  async function review(id: string, decision: 'approved' | 'rejected') {
    await fetch(`/api/commercial-composition/canva/derivatives/${encodeURIComponent(id)}/review`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ decision }) });
    await refresh();
  }
  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-12 text-slate-950">
    <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl md:p-12">
      <p className="text-sm font-semibold uppercase tracking-[.22em] text-cyan-300">LAEX · Commerce → Canva</p>
      <h1 className="mt-3 text-3xl font-bold md:text-5xl">Promoción comercial automatizada</h1>
      <p className="mt-4 max-w-3xl text-slate-300">La prueba toma la WF-4830 y su promoción directamente de Commerce, usa el activo oficial exacto y genera un derivado Canva independiente. Nunca publica sin revisión del CEO.</p>
      <button onClick={run} disabled={busy} className="mt-7 rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60">{busy ? 'Procesando…' : 'Generar promoción real WF-4830'}</button>
      {message && <p role="status" className="mt-4 rounded-xl bg-white/10 p-4 text-sm">{message}</p>}
    </div>
    <section className="mt-10">
      <h2 className="text-2xl font-bold">Propuestas y revisión humana</h2>
      {items.length === 0 && <p className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">Aún no hay derivados. Canva necesita una Brand Template con los campos PRODUCT_IMAGE, PRODUCT_NAME, PRICE, BENEFITS y CTA.</p>}
      <div className="mt-5 grid gap-6 md:grid-cols-2">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="relative aspect-video w-full bg-slate-100"><Image src={item.outputPath} alt="Promoción comercial WF-4830 generada por Canva" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" /></div>
        <div className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{statusLabel[item.status]}</p>
          {item.commerceSnapshot && <div className="mt-3 rounded-2xl bg-slate-50 p-4"><p className="font-bold">{item.commerceSnapshot.name}</p><p className="mt-1 text-sm"><s className="text-slate-500">{money(item.commerceSnapshot.basePriceMinor)}</s><strong className="ml-2 text-emerald-700">{money(item.commerceSnapshot.promotionalPriceMinor)}</strong></p><p className="mt-1 text-xs text-slate-600">{item.commerceSnapshot.promotionTitle}</p></div>}
          {item.automation && <p className="mt-3 text-xs leading-5 text-slate-500">Automatización: {item.automation.join(' → ')}</p>}
          <p className="mt-3 break-all text-xs text-slate-500">{item.id}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString('es')}</p>
          {item.status === 'pending-human-review' && <div className="mt-5 flex gap-3"><button onClick={() => review(item.id, 'approved')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Aprobar</button><button onClick={() => review(item.id, 'rejected')} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Rechazar</button></div>}
        </div>
      </article>)}</div>
    </section>
  </main>;
}
