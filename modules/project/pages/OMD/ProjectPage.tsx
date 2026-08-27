"use client";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Fingerprint,
  Gauge,
  Gift,
  Link2,
  LockKeyhole,
  Network,
  Orbit,
  Radio,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Header from "@/modules/layout/components/Header";
import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";
import type { BlockchainIntelligenceSnapshot } from "@/modules/project/pages/OMDB/types";

const flow = [
  { label: "Usuario", detail: "Identidad LAEX", icon: UserRound },
  { label: "OMD Pool", detail: "Proyecto externo", icon: Orbit },
  { label: "Participación", detail: "Según reglas oficiales", icon: WalletCards },
  { label: "Actividad", detail: "Evidencia verificable", icon: Activity },
  { label: "Recompensas", detail: "Pendiente de fuente", icon: Gift },
] as const;

const pendingMarket = ["Precio", "Variación 24H", "Volumen", "Market Cap", "Liquidez", "Mercados"];

export default function OMDProjectPage() {
  const user = useCurrentUser();
  const [snapshot, setSnapshot] = useState<BlockchainIntelligenceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const load = () => {
      setLoading(true);
      void fetch("/api/projects/omdb/intelligence?asset=omd", { cache: "no-store", signal: controller.signal })
        .then((response) => response.ok ? response.json() : null)
        .then((value) => setSnapshot(value as BlockchainIntelligenceSnapshot | null))
        .catch(() => undefined)
        .finally(() => setLoading(false));
    };
    load();
    const timer = window.setInterval(load, 30_000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, []);

  const metrics = useMemo(() => {
    const wanted = ["chain", "name", "symbol", "decimals", "bytecode", "height"];
    return wanted.map((key) => snapshot?.metrics.find((metric) => metric.key === key)).filter(Boolean);
  }, [snapshot]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#020610] text-white">
      <Header />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(34,211,238,.13),transparent_27%),radial-gradient(circle_at_86%_18%,rgba(139,92,246,.13),transparent_30%),radial-gradient(circle_at_52%_62%,rgba(214,168,68,.08),transparent_30%),linear-gradient(rgba(80,220,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(80,220,255,.025)_1px,transparent_1px)] bg-[size:auto,auto,auto,64px_64px,64px_64px]" />

      <div className="relative mx-auto w-[min(100%-2rem,96rem)] pb-24 pt-7 sm:pt-10">
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.08] pb-5">
          <Link href="/proyectos" className="text-[10px] font-black uppercase tracking-[.22em] text-slate-500 transition hover:text-cyan-200">LAEX / PRJ-02</Link>
          <div className="flex items-center gap-2"><Evidence tone="cyan">Información del proyecto</Evidence><Evidence tone={snapshot?.state === "LIVE" ? "green" : "slate"}>{snapshot?.state ?? "VERIFICANDO"}</Evidence></div>
        </nav>

        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(5,20,34,.98),rgba(4,7,18,.98)_55%,rgba(18,10,34,.95))] px-6 py-10 shadow-[0_40px_120px_rgba(0,0,0,.5)] sm:px-10 lg:px-14 lg:py-14">
          <NetworkField />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3"><span className="text-[10px] font-black uppercase tracking-[.25em] text-cyan-300">OneMillionDollars Ecosystem</span><span className="rounded-full border border-violet-300/40 bg-violet-300/[.07] px-3 py-1 text-[9px] font-black uppercase tracking-[.16em] text-violet-200">Pre-lanzamiento</span></div>
              <h1 className="mt-5 text-5xl font-black tracking-[-.065em] sm:text-7xl">OMD <span className="bg-gradient-to-r from-amber-200 via-cyan-200 to-violet-300 bg-clip-text text-transparent">POOL</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">Una experiencia educativa para comprender el proyecto, su flujo de participación y la evidencia técnica disponible alrededor de OMD.</p>
              <div className="mt-8 flex flex-wrap gap-3"><a href="#intelligence" className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-xs font-black uppercase tracking-[.12em] text-[#02101b] shadow-[0_0_28px_rgba(34,211,238,.24)]">Conocer OMD Pool <ArrowRight size={15} /></a><a href="#conexion" className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/15 bg-white/[.04] px-5 text-xs font-black uppercase tracking-[.12em] text-white">Mi conexión <Link2 size={15} /></a></div>
            </div>
            <div className="relative mx-auto grid aspect-square w-full max-w-[28rem] place-items-center">
              <div className="absolute inset-[8%] animate-[spin_28s_linear_infinite] rounded-full border border-dashed border-cyan-300/30" />
              <div className="absolute inset-[20%] animate-[spin_20s_linear_infinite_reverse] rounded-full border border-violet-300/25" />
              <div className="absolute inset-[28%] rounded-full bg-amber-300/10 blur-3xl" />
              <Image src="/projects/omd/coin.png" alt="Moneda OMD" width={360} height={360} priority className="relative h-[68%] w-[68%] object-contain drop-shadow-[0_0_40px_rgba(214,168,68,.42)]" />
              <span className="absolute right-[4%] top-[16%] inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-[#06141b]/90 px-3 py-2 text-[9px] font-black uppercase tracking-[.14em] text-emerald-300"><Radio size={11} className="animate-pulse" /> On-chain · Live</span>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-white/[.09] bg-[#050d18]/94 p-5 sm:p-7">
          <div className="mb-6"><span className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-300">Cómo se relacionan las piezas</span><h2 className="mt-2 text-2xl font-bold tracking-[-.04em]">Flujo educativo del ecosistema</h2></div>
          <div className="grid gap-3 md:grid-cols-5">{flow.map(({ label, detail, icon: Icon }, index) => <div key={label} className="relative rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-200/15 bg-cyan-300/[.06] text-cyan-300"><Icon size={18} /></span><span className="font-mono text-[9px] text-slate-700">0{index + 1}</span></div><h3 className="mt-4 text-sm font-bold">{label}</h3><p className="mt-1 text-[10px] leading-5 text-slate-500">{detail}</p>{index < flow.length - 1 && <ArrowRight size={15} className="absolute -right-[15px] top-1/2 z-10 hidden text-cyan-300/50 md:block" />}</div>)}</div>
          <p className="mt-5 text-xs leading-6 text-slate-500">Este diagrama explica una relación conceptual. No representa rentabilidad, APY, recompensa garantizada ni una operación financiera ejecutada por LAEX.</p>
        </section>

        <section id="intelligence" className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
          <article className="overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-[linear-gradient(150deg,rgba(5,18,31,.97),rgba(3,8,16,.98))]">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[.07] p-6"><div><span className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">OMD Pool Intelligence</span><h2 className="mt-2 text-2xl font-bold">Evidencia técnica disponible</h2></div><Evidence tone={snapshot?.state === "LIVE" ? "green" : "slate"}>{loading ? "ACTUALIZANDO" : snapshot?.state ?? "NO DISPONIBLE"}</Evidence></header>
            <div className="grid gap-px bg-white/[.06] sm:grid-cols-2 lg:grid-cols-3">{metrics.map((metric, index) => metric && <Metric key={metric.key} label={metric.label} value={metric.value} detail={metric.detail} index={index} />)}{metrics.length === 0 && Array.from({ length: 6 }).map((_, index) => <div key={index} className="min-h-36 animate-pulse bg-[#06101d] p-5"><div className="h-3 w-20 rounded bg-white/5" /><div className="mt-6 h-7 w-28 rounded bg-white/5" /></div>)}</div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[.07] p-6"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-600">Procedencia</p><p className="mt-2 text-xs text-slate-400">{snapshot?.source ?? "Esperando respuesta verificable"}</p></div><a href="https://bscscan.com/token/0xA7670e2e6742a18029436E262b01F7C50A863C40" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-cyan-200">Abrir evidencia <ExternalLink size={13} /></a></div>
          </article>

          <article className="rounded-[2rem] border border-amber-200/15 bg-[linear-gradient(155deg,rgba(30,23,7,.7),rgba(5,9,17,.97))] p-6">
            <span className="text-[10px] font-black uppercase tracking-[.2em] text-amber-300">OMD Market · módulo independiente</span><h2 className="mt-3 text-2xl font-bold">Mercado pendiente de fuente verificada</h2><p className="mt-3 text-sm leading-7 text-slate-500">La arquitectura está preparada para reutilizar Market Intelligence. Hasta confirmar una fuente inequívoca, LAEX no dibuja precios, gráficas ni rendimientos.</p>
            <div className="mt-6 space-y-2">{pendingMarket.map((label) => <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-white/[.06] bg-black/15 px-4 py-3"><span className="text-xs text-slate-400">{label}</span><span className="text-right text-[9px] font-black uppercase tracking-[.1em] text-amber-200">Pendiente</span></div>)}</div>
          </article>
        </section>

        <ReferralPanel user={user} />

        <section className="mt-5 rounded-[2rem] border border-white/[.09] bg-[#050d18]/92 p-6 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><span className="text-[10px] font-black uppercase tracking-[.2em] text-violet-300">Ecosistema relacionado</span><h2 className="mt-3 text-3xl font-bold tracking-[-.04em]">Proyectos con identidad propia</h2></div><p className="max-w-xl text-sm leading-7 text-slate-500">LAEX presenta cada proyecto de forma separada. La relación visual no implica que sean un único producto.</p></div><div className="mt-7 grid gap-4 md:grid-cols-3"><EcosystemCard title="OneMillionMiners" eyebrow="Minería digital" href="/proyectos/onemillionminers" /><EcosystemCard title="OMD Pool" eyebrow="Staking · Pool" active /><EcosystemCard title="Digital Asset Intelligence" eyebrow="Mercado · Blockchain · Evidencia" href="/proyectos/omdb" /></div></section>

        <section className="mt-5 grid gap-4 md:grid-cols-3"><Policy icon={ShieldCheck} title="Dato verificado" copy="Observado directamente en RPC, contrato o explorer identificado." tone="text-emerald-300" /><Policy icon={Fingerprint} title="Información del proyecto" copy="Contenido atribuido al proyecto, separado de la verificación técnica." tone="text-violet-300" /><Policy icon={Clock3} title="Dato pendiente" copy="No se completa mediante estimaciones, simulaciones ni cifras de demostración." tone="text-amber-300" /></section>

        <footer className="mt-8 flex flex-col gap-3 border-t border-white/[.07] py-8 text-xs leading-6 text-slate-600 sm:flex-row sm:justify-between"><p>Contenido técnico y educativo. No constituye asesoría financiera ni promesa de rendimiento.</p><p>LAEX · Project Intelligence · PRJ-02</p></footer>
      </div>
    </main>
  );
}

function ReferralPanel({ user }: { user: ReturnType<typeof useCurrentUser> }) {
  return <section id="conexion" className="mt-5 overflow-hidden rounded-[2rem] border border-violet-300/18 bg-[linear-gradient(135deg,rgba(13,11,31,.96),rgba(4,12,22,.98))] p-6 sm:p-8"><div className="grid gap-8 lg:grid-cols-[1fr_.85fr] lg:items-center"><div><div className="flex items-center gap-3 text-violet-300"><LockKeyhole size={18} /><span className="text-[10px] font-black uppercase tracking-[.2em]">Conexión personal y aislada</span></div><h2 className="mt-4 text-3xl font-bold tracking-[-.04em]">Tu línea de referido pertenece a tu usuario.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">LAEX separa la configuración global del proveedor del identificador personal. Nunca utiliza el código de otra persona como alternativa.</p><div className="mt-5 flex flex-wrap gap-2"><Evidence tone="violet">Proveedor configurable</Evidence><Evidence tone="cyan">Código por usuario</Evidence><Evidence tone="green">Aislamiento por UID</Evidence></div></div><div className="rounded-2xl border border-white/[.08] bg-black/20 p-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-600">Sesión LAEX</p><div className="mt-3 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl border border-violet-300/20 bg-violet-300/[.07] text-violet-200"><UserRound size={19} /></span><div><strong className="block text-sm">{user?.fullName || "Usuario no autenticado"}</strong><span className="text-[10px] text-slate-500">{user ? "Integración OMD Pool no configurada" : "Inicia sesión para ver tu integración"}</span></div></div><button disabled className="mt-5 flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-4 text-[10px] font-black uppercase tracking-[.12em] text-slate-500"><LockKeyhole size={13} />{user ? "Configuración protegida · próxima activación" : "Iniciar sesión para configurar"}</button><p className="mt-3 text-[10px] leading-5 text-slate-600">La escritura permanece bloqueada hasta versionar y desplegar reglas Firestore por UID. No se expone ni se reutiliza ningún código personal ajeno.</p></div></div></section>;
}

function NetworkField() { return <div className="pointer-events-none absolute inset-0 opacity-55"><svg viewBox="0 0 1200 500" preserveAspectRatio="none" className="h-full w-full"><defs><linearGradient id="omd-network" x1="0" x2="1"><stop stopColor="#22d3ee" /><stop offset=".52" stopColor="#d6a844" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs>{[[40,400,270,270],[270,270,500,365],[500,365,700,180],[700,180,950,290],[950,290,1160,120],[220,80,500,365],[700,180,1060,440]].map((p,i)=><line key={i} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} stroke="url(#omd-network)" strokeWidth="1" opacity=".23" />)}{[[40,400],[270,270],[500,365],[700,180],[950,290],[1160,120],[220,80],[1060,440]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={i%3===0?4:2} fill={i%2?"#a78bfa":"#22d3ee"} opacity=".8" />)}</svg></div> }
function Evidence({ children, tone }: { children: React.ReactNode; tone: "cyan" | "green" | "violet" | "slate" }) { const styles = { cyan: "border-cyan-200/20 bg-cyan-300/[.06] text-cyan-200", green: "border-emerald-200/20 bg-emerald-300/[.06] text-emerald-300", violet: "border-violet-200/20 bg-violet-300/[.06] text-violet-200", slate: "border-white/10 bg-white/[.03] text-slate-400" }; return <span className={`inline-flex rounded-full border px-3 py-1.5 text-[8px] font-black uppercase tracking-[.14em] ${styles[tone]}`}>{children}</span>; }
function Metric({ label, value, detail, index }: { label: string; value: string | number | null; detail: string; index: number }) { const icons = [Network, Fingerprint, CircleDollarSign, Gauge, Blocks, Activity]; const Icon = icons[index % icons.length]; return <div className="min-h-36 bg-[#06101d] p-5"><Icon size={17} className="text-cyan-300" /><p className="mt-4 text-[9px] font-bold uppercase tracking-[.14em] text-slate-600">{label}</p><strong className="mt-2 block truncate text-lg text-white">{value ?? "No disponible"}</strong><p className="mt-2 text-[9px] leading-5 text-slate-600">{detail}</p></div>; }
function EcosystemCard({ title, eyebrow, href, active = false }: { title: string; eyebrow: string; href?: string; active?: boolean }) { const content = <><span className={`text-[9px] font-black uppercase tracking-[.16em] ${active ? "text-amber-300" : "text-cyan-300"}`}>{eyebrow}</span><h3 className="mt-3 text-xl font-bold">{title}</h3><div className="mt-7 flex items-center justify-between text-[10px] font-bold uppercase tracking-[.12em] text-slate-500"><span>{active ? "Proyecto actual" : "Explorar"}</span>{active ? <CheckCircle2 size={16} className="text-amber-300" /> : <ArrowUpRight size={15} className="text-cyan-300" />}</div></>; const cls=`rounded-2xl border p-5 transition ${active ? "border-amber-200/20 bg-amber-300/[.035]" : "border-white/[.08] bg-white/[.025] hover:-translate-y-1 hover:border-cyan-200/20"}`; return href ? <Link href={href} className={cls}>{content}</Link> : <div className={cls}>{content}</div>; }
function Policy({ icon: Icon, title, copy, tone }: { icon: typeof ShieldCheck; title: string; copy: string; tone: string }) { return <article className="rounded-2xl border border-white/[.08] bg-[#050d18]/88 p-5"><Icon size={18} className={tone} /><h3 className="mt-4 text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{copy}</p></article>; }
