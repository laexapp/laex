"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ONE_MILLION_MINERS_LAUNCH } from "@/core/projects/onemillionminers/launch";

type Remaining = { days: number; hours: number; minutes: number; seconds: number; launched: boolean };
const target = Date.parse(ONE_MILLION_MINERS_LAUNCH.targetIso);
const units: [keyof Omit<Remaining, "launched">, string][] = [["days", "Días"], ["hours", "Horas"], ["minutes", "Min"], ["seconds", "Seg"]];

function remaining(now: number): Remaining {
  const distance = Math.max(0, target - now), total = Math.floor(distance / 1000);
  return { days: Math.floor(total / 86400), hours: Math.floor(total % 86400 / 3600), minutes: Math.floor(total % 3600 / 60), seconds: total % 60, launched: distance <= 0 };
}

export default function OneMillionMinersCountdown({ compact = false }: { compact?: boolean }) {
  const [countdown, setCountdown] = useState<Remaining | null>(null);
  useEffect(() => { const update = () => setCountdown(remaining(Date.now())), first = window.setTimeout(update, 0), timer = window.setInterval(update, 1000); return () => { window.clearTimeout(first); window.clearInterval(timer); }; }, []);
  if (countdown?.launched) return <div className="flex min-h-16 items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-300/[.08] text-emerald-200"><Sparkles size={17} /><b className="text-xs uppercase tracking-[.14em]">Lanzamiento en vivo</b></div>;
  return <div className="grid grid-cols-4 gap-1.5" aria-label="Cuenta regresiva oficial">{units.map(([key, label]) => <div key={key} className={`rounded-xl border border-amber-300/25 bg-[linear-gradient(180deg,rgba(251,191,36,.1),rgba(0,0,0,.2))] text-center ${compact ? "px-1 py-2" : "px-1 py-2.5"}`}><strong className={`block font-mono font-black tabular-nums text-amber-300 ${compact ? "text-base sm:text-xl" : "text-lg"}`}>{countdown ? String(countdown[key]).padStart(2, "0") : "--"}</strong><span className="mt-1 block text-[6px] font-black uppercase tracking-[.09em] text-slate-500">{label}</span></div>)}</div>;
}
