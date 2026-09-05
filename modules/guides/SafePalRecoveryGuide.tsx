"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { GuideHeader } from "./GuideHeader";
import "./guide-readability.css";

const instructions = [
  { title: "Prepara tu respaldo", text: "Busca papel y lápiz y un lugar privado antes de abrir SafePal.", detail: "La frase de recuperación permite recuperar tu wallet. Quien la tenga puede acceder a tus fondos.", warning: "Nunca la compartas con nadie, ni con tu líder, LAEX o soporte." },
  { title: "Crea tu wallet en SafePal", text: "Abre SafePal y sigue su configuración de seguridad. Elige crear una nueva wallet de software.", detail: "Si ya tienes una wallet, no crees otra para seguir esta guía: comprueba que guardaste su respaldo. Si la pantalla es diferente, consulta la guía oficial al pie.", warning: "La contraseña de la aplicación y la frase de recuperación son distintas. Guarda ambas con cuidado." },
  { title: "Anota las palabras en orden", text: "En SafePal, elige respaldar la frase de recuperación. Escribe en papel todas las palabras, respetando su orden.", detail: "Hazlo en privado. No tomes fotos, capturas ni envíes las palabras por mensajes. Nunca las escribas en esta página.", warning: "No uses una frase que otra persona te haya entregado." },
  { title: "Comprueba y guarda tu respaldo", text: "Revisa cada palabra y su orden. Completa la comprobación que te pide SafePal y guarda el papel en un lugar seguro.", detail: "No lo pierdas. Si pierdes el acceso a tu wallet y también la frase, no podrás recuperarla. Continúa solo cuando hayas comprobado y guardado tu respaldo.", warning: "Nadie de LAEX ni de SafePal necesita que le muestres tu frase." },
];

export function SafePalRecoveryGuide({ onComplete, onBack }: { onComplete?: () => void; onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const step = instructions[current];
  const go = (next: number) => { setCurrent(next); window.scrollTo({ top: 0, behavior: "instant" }); };
  return <main className="guide-readable min-h-dvh bg-[#03070d] text-white">
    <GuideHeader />
    <section className="mx-auto w-[min(100%-2rem,42rem)] py-7 sm:py-12">
      <p className="text-sm font-bold uppercase tracking-wider text-cyan-300">Capítulo 2 · Protege tu wallet</p>
      <p className="mt-3 text-base text-slate-300" aria-live="polite">Paso {current + 1} de {instructions.length}</p>
      <ShieldCheck className="mt-6 text-amber-300" size={40} aria-hidden="true" />
      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{step.title}</h1>
      <p className="guide-instruction mt-6 font-bold">{step.text}</p>
      <p className="guide-explanation mt-4">{step.detail}</p>
      <p className="guide-warning mt-6 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-5 font-semibold text-amber-100">{step.warning}</p>
      <div className="guide-navigation flex gap-3">
        <button aria-label="Paso anterior" onClick={() => current === 0 ? onBack() : go(current - 1)} className="grid w-14 shrink-0 place-items-center rounded-xl border border-white/20"><ChevronLeft /></button>
        {current < instructions.length - 1 ? <button onClick={() => go(current + 1)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-4 font-bold text-slate-950">{current === 0 ? "ESTOY LISTO" : "YA LO HICE"}<ArrowRight className="shrink-0" size={20} /></button> : onComplete ? <button onClick={onComplete} className="flex-1 rounded-xl bg-cyan-300 px-4 py-4 font-bold text-slate-950">YA GUARDÉ MI FRASE · CONTINUAR</button> : <Link href="/guias" className="flex min-h-14 flex-1 items-center justify-center rounded-xl bg-cyan-300 px-4 py-4 text-center font-bold text-slate-950">YA GUARDÉ MI FRASE · VOLVER A GUÍAS</Link>}
      </div>
      <a href="https://safepalsupport.zendesk.com/hc/en-us/articles/360052099891-How-To-Create-A-SafePal-Software-Wallet" target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center text-base text-cyan-300 underline underline-offset-4">Consultar la guía oficial de SafePal</a>
    </section>
  </main>;
}
