import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Cpu, LockKeyhole, ShieldCheck } from "lucide-react";
import { buildFirmwareWhatsAppUrl, firmwareListings, getFirmwareListing } from "@/modules/tu-reset-gratis/firmwares";
import { PUBLIC_ORIGINS, publicIndexingEnabled } from "@/core/config/public-origins";

export function generateStaticParams() { return firmwareListings.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params, item = getFirmwareListing(slug);
  return { title: item ? `${item.title} · Firmwares LF-PRINTER` : "Firmware no encontrado · LF-PRINTER", description: item?.description, alternates: { canonical: `${PUBLIC_ORIGINS.lfPrinter}/tu-reset-gratis/firmwares/${slug}` }, robots: { index: publicIndexingEnabled, follow: publicIndexingEnabled } };
}

export default async function FirmwareDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params, item = getFirmwareListing(slug);
  if (!item) notFound();
  return <main className="min-h-screen bg-[#0b1016] px-4 py-5 text-white sm:px-7"><div className="mx-auto max-w-5xl">
    <header className="flex items-center justify-between border-b border-white/10 pb-4"><Link href="/tu-reset-gratis/firmwares" className="inline-flex items-center gap-2 text-xs font-bold text-white/75 hover:text-white"><ArrowLeft size={15}/> Catálogo de firmwares</Link><div className="flex items-center gap-3"><Link href="/tu-reset-gratis" className="text-xs font-bold text-[#73d9ff]">Resets Gratis</Link><Link href="/tu-reset-gratis/resets-comerciales" className="text-xs font-bold text-[#73d9ff]">Resets Comerciales</Link></div></header>
    <section className="grid gap-8 py-9 md:grid-cols-[1fr_1fr] md:items-center"><div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#111a23]">{item.image && <Image src={item.image} alt={`Impresora ${item.brand} ${item.models.join(", ")}`} fill sizes="(max-width: 768px) 90vw, 50vw" quality={82} className="object-contain p-7 drop-shadow-[0_16px_16px_rgba(0,187,252,0.18)]"/>}<span className="absolute left-4 top-4 rounded-full bg-fuchsia-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fuchsia-100">{item.demoOnly ? "DEMO · Validación pendiente" : "Firmware comercial"}</span></div><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#ffd600]">{item.brand} · {item.category}</p><h1 className="mt-2 text-4xl font-black tracking-tight">{item.title}</h1><p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p><p className="mt-4 text-sm font-extrabold text-[#ffe76a]">{item.priceLabel}</p><p className="mt-2 text-xs text-slate-400">Disponibilidad: {item.availabilityLabel}</p><a href={buildFirmwareWhatsAppUrl(item)} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#ffd600] px-5 text-sm font-black text-slate-950">Consultar por WhatsApp</a></div></section>
    <div className="grid gap-5 md:grid-cols-2"><section className="rounded-2xl border border-white/10 bg-[#111a23] p-5"><div className="flex items-center gap-2"><Cpu className="text-[#00bbfc]" size={18}/><h2 className="font-extrabold">Información técnica</h2></div><p className="mt-2 text-xs text-slate-400">Compatibilidad indicada en el catálogo: {item.brand} {item.models.join(", ")}.</p><ul className="mt-4 space-y-3">{item.technicalNotes.map((note) => <li key={note} className="border-b border-white/10 pb-3 text-sm text-slate-300 last:border-0">{note}</li>)}</ul></section>
      <section className="rounded-2xl border border-[#00bbfc]/25 bg-[#00bbfc]/[.04] p-5"><div className="flex items-center gap-2 text-[#73d9ff]"><ShieldCheck size={18}/><h2 className="font-extrabold">Compra protegida</h2></div><p className="mt-3 text-sm leading-6 text-slate-300">Consulta precio y disponibilidad por WhatsApp. LF-PRINTER confirma los detalles y el pago; después coordina la entrega en privado.</p><div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-black/10 p-4"><LockKeyhole className="mt-0.5 shrink-0 text-[#00bbfc]" size={17}/><p className="text-xs leading-5 text-slate-400">Esta ficha DEMO no tiene archivo descargable. Los enlaces privados no se envían al navegador ni se publican en el catálogo.</p></div></section></div>
  </div></main>;
}
