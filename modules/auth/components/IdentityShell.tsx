import Image from "next/image";
import Link from "next/link";

type Props = { eyebrow: string; title: React.ReactNode; description: string; children: React.ReactNode; asideTitle: string; asideText: string; };

export default function IdentityShell({ eyebrow, title, description, children, asideTitle, asideText }: Props) {
  return (
    <main className="laex-canvas relative grid min-h-screen place-items-center overflow-hidden px-4 py-8 text-white sm:px-6 lg:py-12">
      <div className="pointer-events-none absolute left-[12%] top-[20%] h-80 w-80 rounded-full bg-cyan-300/[0.07] blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[8%] h-96 w-96 rounded-full bg-violet-500/[0.07] blur-[150px]" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/[0.09] bg-[#071018]/68 shadow-[0_45px_130px_rgba(0,0,0,.65),inset_0_1px_0_rgba(255,255,255,.055)] backdrop-blur-2xl lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative hidden min-h-[680px] overflow-hidden border-r border-white/[0.07] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(55,216,238,.12),transparent_34%),linear-gradient(rgba(125,222,238,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(125,222,238,.035)_1px,transparent_1px)] bg-[size:auto,48px_48px,48px_48px]" />
          <Link href="/platform" className="relative w-fit rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70" aria-label="Volver a LAEX">
            <Image src="/brand/logo/logo-header.png" alt="LAEX" width={200} height={80} className="h-auto w-44" priority />
          </Link>
          <div className="relative">
            <span className="laex-eyebrow">Identity layer / secure</span>
            <h2 className="laex-display mt-5 text-4xl text-white">{asideTitle}</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">{asideText}</p>
            <div className="mt-8 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600"><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.65)]" /> LAEX network online</div>
          </div>
        </aside>

        <section className="p-6 sm:p-10 lg:p-14">
          <Link href="/platform" className="mb-10 inline-flex rounded-xl lg:hidden" aria-label="Volver a LAEX"><Image src="/brand/logo/logo-header.png" alt="LAEX" width={160} height={64} className="h-auto w-36" priority /></Link>
          <span className="laex-eyebrow">{eyebrow}</span>
          <h1 className="laex-display mt-5 text-4xl text-white sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500">{description}</p>
          <div className="mt-9">{children}</div>
        </section>
      </div>
    </main>
  );
}
