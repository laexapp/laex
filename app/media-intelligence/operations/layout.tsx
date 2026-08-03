import Link from "next/link";

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  return <>
    <div className="mx-auto flex max-w-[1500px] gap-2 px-4 pt-16 md:pt-20">
      <Link href="/media-intelligence/operations" className="rounded-xl border border-white/10 px-4 py-2 text-[10px] font-bold text-slate-300 hover:border-cyan-300/30">Consola</Link>
      <Link href="/media-intelligence/operations/flow" className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-[10px] font-bold text-cyan-100">Recorrido completo</Link>
    </div>
    {children}
  </>;
}
