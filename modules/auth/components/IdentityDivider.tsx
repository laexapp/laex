export default function IdentityDivider({ label = "Continuar" }: { label?: string }) {
  return <div className="my-7 flex items-center gap-4" role="separator"><span className="h-px flex-1 bg-white/[0.07]" /><span className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-700">{label}</span><span className="h-px flex-1 bg-white/[0.07]" /></div>;
}
