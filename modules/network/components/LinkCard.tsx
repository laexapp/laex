"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { PUBLIC_ORIGINS } from "@/core/config/public-origins";

interface LinkCardProps { referralCode: string; }

export default function LinkCard({ referralCode }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const link = `${PUBLIC_ORIGINS.laex}/register?ref=${referralCode}`;

  async function copyLink() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="laex-surface-raised group relative flex min-h-full flex-col overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.06] blur-3xl transition duration-500 group-hover:bg-cyan-300/[0.09]" />
      <div className="relative flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-cyan-200/15 bg-cyan-300/[0.07] text-cyan-200"><Share2 size={19} aria-hidden="true" /></span>
        <div><span className="laex-eyebrow">Acceso personal</span><h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]">Comparte tu enlace</h2><p className="mt-2 text-sm leading-6 text-slate-500">Una conexión directa y segura para ampliar tu comunidad.</p></div>
      </div>
      <div className="laex-instrument relative mt-8 flex min-h-16 items-center rounded-2xl px-4 py-3 sm:px-5"><span className="break-all font-mono text-xs leading-6 text-cyan-100/90 sm:text-sm">{link}</span></div>
      <div className="relative mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center">
        <button type="button" onClick={copyLink} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-[#031014] shadow-[0_16px_40px_rgba(55,216,238,.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[0_20px_46px_rgba(55,216,238,.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">{copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copied ? "Enlace copiado" : "Copiar enlace"}</button>
        <p aria-live="polite" className={`text-xs font-medium text-emerald-300 transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0"}`}>Listo para compartir.</p>
      </div>
    </article>
  );
}
