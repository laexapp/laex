'use client';

import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { PublicCommerceProduct } from "../infrastructure/commerce-presentation";
import { announceCommerceChange } from "../infrastructure/commerce-events";
import { PrinterVisual } from "./PrinterVisual";
import { CommerceCatalog } from "./CommerceCatalog";

const money = new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" });

export function LFCommerceShop(props:{ companySlug:string;products:PublicCommerceProduct[];compact?:boolean;onCatalogChange?:(catalog:import("../infrastructure/commerce-presentation").PublicCommerceCatalog)=>void }){if(!props.compact)return <CommerceCatalog companySlug={props.companySlug} initial={{company:null,products:props.products,total:props.products.length,page:1,pageSize:24}} onCatalogChange={props.onCatalogChange}/>;return <CompactCommerceShop {...props}/>}
function CompactCommerceShop({ companySlug, products: initialProducts, compact = false }: { companySlug: string; products: PublicCommerceProduct[]; compact?: boolean }) {
  const [products, setLiveProducts] = useState(initialProducts);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const lines = useMemo(() => products.filter((product) => cart[product.slug]).map((product) => ({ ...product, quantity: cart[product.slug] })), [cart, products]);
  const total = lines.reduce((sum, line) => sum + line.priceMinor * line.quantity, 0);

  function change(slug: string, quantity: number) {
    setCart((current) => ({ ...current, [slug]: Math.max(0, quantity) }));
    setNotice("");
  }

  async function checkout() {
    if (!customer.name.trim() || !customer.phone.trim()) {
      setNotice("Indica el nombre y teléfono de contacto para reservar el pedido.");
      return;
    }
    setSubmitting(true);
    setNotice("");
    try {
      const response = await fetch(`/api/commerce/${companySlug}`, {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() },
        body: JSON.stringify({ customer, fulfillment: "pickup", lines: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })) }),
      });
      const body = await response.json() as { publicId?: string; error?: string; message?: string };
      if (!response.ok) throw new Error(body.message || "No fue posible reservar el pedido.");
      setNotice(`Pedido ${body.publicId} reservado correctamente. LF-PRINTER confirmará disponibilidad y pago.`);
      setCart({});
      const refreshed = await fetch(`/api/commerce/${companySlug}/search?q=${encodeURIComponent(lines[0]?.name ?? "")}`, { cache: "no-store" });
      if (refreshed.ok) setLiveProducts((await refreshed.json() as { products: PublicCommerceProduct[] }).products);
      announceCommerceChange(companySlug);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No fue posible reservar el pedido.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!products.length) return <section id="tienda" className="mx-auto w-[min(100%-2rem,88rem)] py-20"><div className="rounded-[2.5rem] border border-cyan-300/20 bg-[#07131f] p-12 text-center text-white"><ShoppingBag className="mx-auto text-cyan-300" size={36}/><h2 className="mt-5 text-3xl font-black">El showroom se está preparando.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">LF-PRINTER todavía no tiene productos publicados en Commerce. Cuando Business publique el primero, aparecerá aquí automáticamente.</p></div></section>;

  return <section id="tienda" className="mx-auto w-[min(100%-2rem,88rem)] py-20 text-white"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.22em] text-cyan-300">Commerce Projection · inventario sincronizado</p><h2 className="mt-4 text-4xl font-black tracking-tight">Equipos publicados por LF-PRINTER</h2></div><p className="max-w-md text-sm leading-6 text-slate-400">Precio y disponibilidad provienen directamente de LAEX Business.</p></div><div className={`mt-10 grid gap-7 ${compact ? "lg:grid-cols-[1fr_.8fr]" : "xl:grid-cols-[1fr_25rem]"}`}><div className={`grid gap-5 ${compact ? "" : "md:grid-cols-2"}`}>{products.map((product) => <article key={product.slug} className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#07131f]"><div className="relative h-64 bg-gradient-to-br from-white via-cyan-50 to-slate-200"><PrinterVisual src={product.images[0]?.url} alt={product.images[0]?.alt || product.name}/></div><div className="p-6"><div className="flex items-center justify-between gap-4"><span className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">{product.category}</span><span className={product.availability === "Agotado" ? "text-xs text-rose-300" : "text-xs text-emerald-300"}>{product.availability}</span></div><h3 className="mt-3 text-2xl font-black">{product.name}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{product.description}</p><div className="mt-5 space-y-2">{product.features.slice(0, 3).map((feature) => <p key={feature} className="flex gap-2 text-xs text-slate-300"><Check className="shrink-0 text-emerald-300" size={14}/>{feature}</p>)}</div><div className="mt-7 flex items-center justify-between"><strong className="text-xl">{money.format(product.priceMinor / 100)}</strong><Link href={`/proyectos/lf-printer/productos/${product.slug}`} className="text-xs font-bold text-cyan-300">Ver experiencia</Link></div><button disabled={product.availability === "Agotado"} onClick={() => change(product.slug, (cart[product.slug] ?? 0) + 1)} className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-xs font-black text-black disabled:cursor-not-allowed disabled:opacity-40">Agregar al pedido</button></div></article>)}</div><aside id="pedido" className="h-fit rounded-[2rem] border border-fuchsia-400/20 bg-[#0b0c14] p-6 xl:sticky xl:top-6"><div className="flex items-center gap-3"><ShoppingBag className="text-fuchsia-300"/><div><h3 className="font-black">Tu pedido</h3><p className="text-xs text-slate-400">Reserva segura por 15 minutos</p></div></div>{!lines.length ? <p className="mt-8 rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-slate-500">Agrega un equipo para comenzar.</p> : <div className="mt-6 space-y-4">{lines.map((line) => <div key={line.slug} className="border-t border-white/10 pt-4"><div className="flex gap-3"><strong className="min-w-0 flex-1 text-sm">{line.name}</strong><button aria-label={`Eliminar ${line.name}`} onClick={() => change(line.slug, 0)}><Trash2 size={15}/></button></div><div className="mt-3 flex items-center gap-3"><button aria-label="Restar unidad" onClick={() => change(line.slug, line.quantity - 1)}><Minus size={15}/></button><span className="min-w-6 text-center">{line.quantity}</span><button aria-label="Agregar unidad" onClick={() => change(line.slug, line.quantity + 1)}><Plus size={15}/></button><span className="ml-auto text-sm">{money.format(line.priceMinor * line.quantity / 100)}</span></div></div>)}</div>}<div className="mt-6 flex justify-between border-t border-white/10 pt-5 text-lg"><b>Total</b><b>{money.format(total / 100)}</b></div><div className="mt-5 grid gap-3"><label className="text-xs text-slate-400">Nombre de contacto<input value={customer.name} onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"/></label><label className="text-xs text-slate-400">Teléfono<input value={customer.phone} onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} inputMode="tel" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"/></label></div><button disabled={!lines.length || submitting} onClick={() => void checkout()} className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-fuchsia-400 px-4 py-3 text-sm font-black text-black disabled:opacity-40">{submitting ? "Reservando…" : "Reservar pedido"}</button>{notice && <p role="status" className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3 text-xs leading-5 text-cyan-100">{notice}</p>}</aside></div></section>;
}
