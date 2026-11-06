"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildCommercialWhatsAppUrl, type CommercialSolution } from "./commercial-solutions";
import type { ResetModel } from "./catalog";

export function CommercialInquiry({ solution, models }: { solution: CommercialSolution; models: ResetModel[] }) {
  const [modelCode, setModelCode] = useState("");
  return <div className="mt-5 grid max-w-2xl gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modelo exacto de impresora<select aria-label="Seleccionar impresora para consultar" value={modelCode} onChange={(event)=>setModelCode(event.target.value)} className="mt-1 block w-full rounded-xl border border-white/15 bg-[#111a23] px-3 py-3 text-sm font-semibold normal-case text-white"><option value="">Selecciona tu impresora</option>{models.map((model)=><option key={model.slug} value={model.code}>{model.model}</option>)}</select></label>{modelCode && <a href={buildCommercialWhatsAppUrl(solution, modelCode)} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 self-end rounded-xl bg-[#00bbfc] px-5 text-sm font-black text-slate-950"><MessageCircle size={16}/> Consultar por WhatsApp</a>}</div>;
}
