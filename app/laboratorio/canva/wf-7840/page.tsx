'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type Derivative = { id: string; sourceGlobalAssetId: string; outputPath: string; status: 'pending-human-review' | 'approved' | 'rejected'; createdAt: string; designId: string };
const labels = { 'pending-human-review': 'Pendiente de CEO y Arquitecta', approved: 'Aprobado', rejected: 'Rechazado' };

export default function Wf7840CanvaLabPage() {
  const [items, setItems] = useState<Derivative[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const refresh = useCallback(async () => {
    const response = await fetch('/api/commercial-composition/canva/lab/wf-4830', { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json() as { derivatives: Derivative[] };
      setItems(data.derivatives.filter((item) => item.sourceGlobalAssetId === 'LAEX-ASSET-0000002').toReversed());
    }
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void refresh(); }, [refresh]);

  async function generate() {
    setBusy(true); setMessage('Generando en Canva Negocios…');
    const response = await fetch('/api/commercial-composition/canva/business/wf-7840', { method: 'POST' });
    const data = await response.json() as { error?: string };
    setMessage(response.ok ? 'Promoción creada y enviada a revisión humana.' : (data.error ?? 'La generación falló.'));
    await refresh(); setBusy(false);
  }

  async function review(id: string, decision: 'approved' | 'rejected') {
    await fetch(`/api/commercial-composition/canva/derivatives/${encodeURIComponent(id)}/review`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ decision }) });
    await refresh();
  }

  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-12 text-slate-950">
    <header className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl md:p-12">
      <p className="text-sm font-bold uppercase tracking-[.22em] text-teal-300">Canva Negocios · WF-7840</p>
      <h1 className="mt-3 text-4xl font-bold md:text-5xl">Promoción comercial en revisión</h1>
      <p className="mt-4 max-w-3xl text-slate-300">Derivado de LAEX-ASSET-0000002. El recurso fuente continúa en revisión y no se publica ni se modifica desde este laboratorio.</p>
      <button disabled={busy} onClick={generate} className="mt-7 rounded-full bg-teal-300 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 disabled:opacity-60">{busy ? 'Procesando…' : 'Generar nueva versión'}</button>
      {message && <p role="status" className="mt-4 rounded-xl bg-white/10 p-4 text-sm">{message}</p>}
    </header>
    <section className="mt-9 grid gap-7 md:grid-cols-2">
      {items.map((item) => <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="relative aspect-video bg-slate-100"><Image src={item.outputPath} alt="Promoción WF-7840 generada mediante Canva Negocios" fill sizes="(min-width:768px) 50vw, 100vw" className="object-contain" /></div>
        <div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{labels[item.status]}</p><p className="mt-2 break-all text-sm">{item.id}</p>
          {item.status === 'pending-human-review' && <div className="mt-5 flex gap-3"><button onClick={() => review(item.id, 'approved')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Aprobar</button><button onClick={() => review(item.id, 'rejected')} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-bold text-white">Rechazar</button></div>}
        </div>
      </article>)}
    </section>
  </main>;
}
