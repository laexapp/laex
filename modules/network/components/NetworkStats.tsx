import { Hash, Layers3, Network, UserPlus } from "lucide-react";

interface NetworkStatsProps { referralCode: string; directReferrals: number; secondLevelReferrals: number; totalNetwork: number; }

export default function NetworkStats({ referralCode, directReferrals, secondLevelReferrals, totalNetwork }: NetworkStatsProps) {
  const metrics = [
    { label: "Código personal", value: referralCode, icon: Hash, accent: "text-cyan-200", valueClass: "text-xl font-semibold tracking-[-.02em]" },
    { label: "Invitados directos", value: directReferrals, icon: UserPlus, accent: "text-cyan-200", valueClass: "text-4xl font-semibold tracking-[-.055em]" },
    { label: "Segundo nivel", value: secondLevelReferrals, icon: Layers3, accent: "text-violet-300", valueClass: "text-4xl font-semibold tracking-[-.055em]" },
    { label: "Red total", value: totalNetwork, icon: Network, accent: "text-emerald-300", valueClass: "text-4xl font-semibold tracking-[-.055em]" },
  ];
  return <div className="grid h-full gap-3 sm:grid-cols-2">{metrics.map(({ label, value, icon: Icon, accent, valueClass }) => (
    <article key={label} className="laex-card group rounded-3xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4"><span className="text-[10px] font-bold uppercase tracking-[.17em] text-slate-500">{label}</span><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] ${accent}`}><Icon size={16} aria-hidden="true" /></span></div>
      <strong className={`mt-5 block break-all text-slate-100 ${valueClass}`}>{value}</strong><span className="mt-4 block h-px w-9 bg-gradient-to-r from-cyan-300/70 to-transparent transition-all duration-300 group-hover:w-16" />
    </article>
  ))}</div>;
}
