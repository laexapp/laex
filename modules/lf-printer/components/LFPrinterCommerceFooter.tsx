import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, PackageSearch, ShieldCheck, Wrench } from "lucide-react";
import { lfPrinterWhatsappUrl } from "../config/quick-actions";
import { OfficialBrandMark } from "./OfficialBrandMark";
import { orderWhatsappUrl, type PublicOrderForWhatsapp } from "../infrastructure/order-whatsapp";

export const LF_PRINTER_PAYMENT_OPTIONS = [
  { name: "Banco BHD", image: "/assets/lf-printer/official/payment-methods/banco-bhd-transparent.png", accent: "border-emerald-400/25 bg-emerald-400/[.07] text-emerald-200" },
  { name: "Banreservas", image: "/assets/lf-printer/official/payment-methods/banreservas-transparent.png", accent: "border-blue-400/25 bg-blue-400/[.07] text-blue-200" },
  { name: "OMD", image: "/assets/lf-printer/official/payment-methods/omd-transparent.png", logoOnly: true },
  { name: "OMDB", image: "/assets/lf-printer/official/payment-methods/omdb-transparent.png", logoOnly: true },
  { name: "USDT", image: "/assets/lf-printer/official/payment-methods/usdt-transparent.png", logoOnly: true, accent: "border-teal-400/25 bg-teal-400/[.07] text-teal-200" },
];
const linkClass = "flex items-center gap-2 text-sm text-slate-400 transition hover:text-white";

export function LFPrinterCommerceFooter({ order, onOrderRequired }: { order?: PublicOrderForWhatsapp; onOrderRequired?: () => void }) {
  return <footer className="border-t border-white/10 bg-[#071019] text-white">
    <div className="mx-auto grid w-[min(100%-2rem,110rem)] gap-10 py-12 md:grid-cols-2 xl:grid-cols-[1.1fr_1.55fr_1fr_1fr]">
      <section><div className="w-fit origin-left scale-125"><OfficialBrandMark/></div><p className="mt-6 max-w-xs text-sm leading-6 text-slate-400">Tecnología de impresión, respaldo técnico y atención coordinada por LF-PRINTER.</p><a href="#catalogo" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-300">Explorar productos <ArrowUpRight size={15}/></a></section>
      <section><h2 className="text-xs font-black uppercase tracking-[.18em] text-slate-300">Métodos de pago</h2><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">{LF_PRINTER_PAYMENT_OPTIONS.map(method => { const content=<>{method.image && <span className={`relative shrink-0 overflow-hidden ${method.logoOnly ? "h-11 w-20" : "h-9 w-14"}`}><Image src={method.image} alt={`Logo ${method.name}`} fill sizes={method.logoOnly ? "80px" : "56px"} className="object-contain"/></span>}{!method.logoOnly && <span>{method.name}</span>}</>; const className=`flex min-h-16 items-center justify-center gap-2 rounded-xl border px-3 text-center text-xs font-black transition hover:-translate-y-0.5 hover:border-emerald-300/50 hover:bg-white/[.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${method.accent ?? "border-white/10 bg-white/[.04]"}`; return order?<a key={method.name} href={orderWhatsappUrl(order,method.name)} target="_blank" rel="noreferrer" aria-label={`Pagar con ${method.name} por WhatsApp`} className={className}>{content}</a>:<button key={method.name} type="button" onClick={onOrderRequired} aria-label={`Seleccionar ${method.name}; primero crea el pedido`} className={className}>{content}</button>})}</div><p className="mt-4 flex gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-400"/>{order?`Selecciona el método y continúa el pedido ${order.publicId} por WhatsApp.`:"Agrega productos y crea la reserva; luego elige aquí cómo deseas pagar."}</p></section>
      <section><h2 className="text-xs font-black uppercase tracking-[.18em] text-slate-300">Soporte</h2><nav className="mt-5 grid gap-3"><a href={lfPrinterWhatsappUrl} target="_blank" rel="noreferrer" className={linkClass}><MessageCircle size={15}/> WhatsApp</a><Link href="/proyectos/lf-printer/seguimiento" className={linkClass}><PackageSearch size={15}/> Seguimiento</Link><a href="#taller" className={linkClass}><Wrench size={15}/> Taller LF-PRINTER</a><a href="#lia-aside" className={linkClass}>LÍA · Asesora comercial</a></nav></section>
      <section><h2 className="text-xs font-black uppercase tracking-[.18em] text-slate-300">Ecosistema</h2><nav className="mt-5 grid gap-3"><Link href="/" className={linkClass}>LAEX</Link><Link href="/proyectos" className={linkClass}>Proyectos LAEX</Link><Link href="/proyectos/onemillionminers" className={linkClass}>OneMillionMiners</Link></nav><Link href="/" aria-label="Conoce LAEX" className="relative mt-7 block h-14 w-44 opacity-85 transition hover:opacity-100"><Image src="/images/laex/logo-header.png" alt="LAEX" fill sizes="176px" className="object-contain object-left"/></Link></section>
    </div>
    <div className="border-t border-white/8"><div className="mx-auto flex w-[min(100%-2rem,110rem)] flex-col gap-2 py-5 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between"><span>LF-PRINTER Commerce · Powered by LAEX</span><span>Pagos sujetos a coordinación y verificación empresarial.</span></div></div>
  </footer>;
}
