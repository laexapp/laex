import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { getResetModel, resetModels } from "@/modules/tu-reset-gratis/catalog";
import { PUBLIC_ORIGINS, publicIndexingEnabled } from "@/core/config/public-origins";

export function generateStaticParams() { return resetModels.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params, model = getResetModel(slug);
  return { title: model ? `${model.model} · Tu Reset Gratis` : "Modelo no encontrado · Tu Reset Gratis", description: model?.summary, alternates: { canonical: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis/${slug}` }, robots: { index: publicIndexingEnabled, follow: publicIndexingEnabled } };
}

export default async function ResetModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params, model = getResetModel(slug);
  if (!model) notFound();
  return <main className="min-h-screen bg-[#0b1016] px-4 py-5 text-white sm:px-7"><div className="mx-auto max-w-5xl">
    <header className="flex items-center justify-between border-b border-white/10 pb-4"><Link href="/tu-reset-gratis" className="inline-flex items-center gap-2 text-xs font-bold text-white/75 hover:text-white"><ArrowLeft size={15}/> Resets Gratis</Link><Link href="/tu-reset-gratis/firmwares" className="text-xs font-bold text-[#73d9ff]">Firmwares LF-PRINTER</Link></header>
    <section className="grid gap-8 py-9 md:grid-cols-[1fr_1fr] md:items-center"><div className="relative flex min-h-60 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#111a23]">{model.image ? <Image src={model.image} alt={`Impresora ${model.model}`} fill sizes="(max-width: 768px) 90vw, 50vw" quality={82} className="object-contain p-7 drop-shadow-[0_16px_16px_rgba(0,187,252,0.18)]"/> : <span className="text-5xl font-black text-white/10">{model.brand}</span>}<span className="absolute left-4 top-4 rounded-full bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200">{model.demoOnly ? "DEMO · En revisión" : "En revisión técnica"}</span></div><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#00bbfc]">{model.family} · {model.brand}</p><h1 className="mt-2 text-4xl font-black tracking-tight">{model.model}</h1><p className="mt-4 text-sm leading-7 text-slate-300">{model.summary}</p><div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-300/15 bg-emerald-300/[.06] p-4"><ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={18}/><p className="text-xs leading-5 text-slate-300">Esta foto identifica el modelo, pero no certifica compatibilidad de una herramienta. El archivo y cada procedimiento se revisarán antes de habilitar una descarga.</p></div></div></section>
    <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl border border-white/10 bg-[#111a23] p-5"><h2 className="font-extrabold">Herramienta de servicio</h2>{model.publicDownload ? <div className="mt-3 text-sm text-slate-300"><p>Versión {model.publicDownload.version} · {model.publicDownload.size} · actualización {model.publicDownload.updatedAt}</p><a className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#00bbfc] px-4 py-3 text-xs font-black text-slate-950" href={model.publicDownload.url} target="_blank" rel="noreferrer">Descargar herramienta <Download size={14}/></a>{model.publicDownload.passwordRequired && <p className="mt-3 text-xs">Contraseña del paquete: LF-PRINTER</p>}</div> : <><p className="mt-3 text-sm leading-6 text-slate-400">Aún no hay una descarga gratuita verificada para este modelo.</p><button type="button" disabled className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-xs font-bold text-slate-500"><Download size={14}/> Descarga no configurada</button></>}</section>
      <section className="rounded-2xl border border-white/10 bg-[#111a23] p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-extrabold">Guía paso a paso</h2>{model.guide?.demoOnly && <span className="rounded-full border border-amber-300/30 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-200">Ejemplo DEMO</span>}</div>{model.guide ? <><h3 className="mt-3 text-sm font-bold text-[#73d9ff]">{model.guide.title}</h3><ol className="mt-3 space-y-3">{model.guide.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#00bbfc]/15 text-xs font-black text-[#73d9ff]">{index + 1}</span><span>{step}</span></li>)}</ol></> : <p className="mt-3 text-sm leading-6 text-slate-400">La guía específica de este modelo está pendiente de revisión técnica.</p>}<p className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-slate-500">Reiniciar un contador no repara componentes físicos. Si la impresora indica que una almohadilla llegó al fin de su vida útil, consulta servicio técnico.</p></section>
    </div>
  </div></main>;
}
