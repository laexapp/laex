import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, ShieldAlert } from "lucide-react";
import { PUBLIC_ORIGINS, publicIndexingEnabled } from "@/core/config/public-origins";
import { commercialSolutions, getCommercialSolution } from "@/modules/tu-reset-gratis/commercial-solutions";
import { resetModels } from "@/modules/tu-reset-gratis/catalog";
import { CommercialInquiry } from "@/modules/tu-reset-gratis/CommercialInquiry";

export function generateStaticParams() { return commercialSolutions.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params, solution = getCommercialSolution(slug);
  return { title: solution ? `${solution.title} · Resets Comerciales LF-PRINTER` : "Solución no encontrada", description: solution?.providerClaim, alternates: { canonical: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis/resets-comerciales/${slug}` }, robots: { index: publicIndexingEnabled, follow: publicIndexingEnabled } };
}

export default async function CommercialSolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params, solution = getCommercialSolution(slug);
  if (!solution) notFound();
  const models = solution.modelCodes.map((code) => resetModels.find((model) => model.code === code)).filter((model): model is (typeof resetModels)[number] => Boolean(model));
  return <main className="min-h-screen bg-[#0b1016] px-4 py-5 text-white sm:px-7"><div className="mx-auto max-w-5xl">
    <header className="flex items-center justify-between border-b border-white/10 pb-4"><Link href="/tu-reset-gratis/resets-comerciales" className="inline-flex items-center gap-2 text-xs font-bold text-white/75 hover:text-white"><ArrowLeft size={15}/> Resets Comerciales</Link><Link href="/tu-reset-gratis" className="text-xs font-bold text-[#73d9ff]">Resets Gratis</Link></header>
    <section className="py-10"><span className="rounded-full border border-amber-300/25 bg-amber-300/[.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">Pendiente de validación LF-PRINTER</span><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-[#00bbfc]">{solution.provider} · {solution.kind.replaceAll("_", " ")}</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{solution.title}</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{solution.providerClaim}</p>
      <div className="mt-6 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[.05] p-4"><ShieldAlert className="mt-0.5 shrink-0 text-amber-200" size={18}/><div className="text-xs leading-5 text-slate-300"><p>La fuente anuncia estos modelos, pero eso no confirma compatibilidad de esta variante con LF-PRINTER. La autorización para distribuir también está pendiente. Esta ficha no acepta pagos ni ofrece descargas.</p><p className="mt-2 font-bold text-amber-100">Precio y disponibilidad: por confirmar con LF-PRINTER.</p></div></div>
      <CommercialInquiry solution={solution} models={models}/>
    </section>
    <section id="provider-models" className="rounded-2xl border border-white/10 bg-[#111a23] p-5 sm:p-6"><h2 className="text-xl font-extrabold">Modelos anunciados por el proveedor</h2><p className="mt-2 text-xs text-slate-400">La compatibilidad de LF-PRINTER sigue pendiente. Abre la ficha única del equipo para consultar las demás soluciones relacionadas.</p><ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{models.map((model)=><li key={model.slug}><Link href={`/tu-reset-gratis/${model.slug}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm font-bold hover:border-[#00bbfc]/40"><span>{model.model}</span><span className="text-[9px] font-semibold text-amber-200">Por validar</span></Link></li>)}</ul><a href={solution.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#73d9ff]">Consultar fuente pública <ExternalLink size={13}/></a></section>
  </div></main>;
}
