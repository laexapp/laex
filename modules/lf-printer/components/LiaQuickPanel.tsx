"use client";

import Image from "next/image";
import Link from "next/link";
import { Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Product = { projectionId:string;slug:string;name:string;priceMinor:number;availability:string;url:string;images:Array<{url:string;alt:string}> };

export function LiaQuickPanel({ companySlug = "empresa-limpia-c7" }: { companySlug?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("Hola, soy Lía. Consulto el catálogo actualizado de LF-PRINTER para orientarte con precios y disponibilidad reales.");
  const [products, setProducts] = useState<Product[]>([]);
  const [lastProduct, setLastProduct] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { input.current?.focus(); }, []);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    try {
      const followUp=/^(¿?\s*)?(cu[aá]nto cuesta|est[aá] disponible|mu[eé]strame el producto)(\s*\?)?$/i.test(message.trim());
      const groundedMessage=followUp&&lastProduct?`${message} ${lastProduct.name}`:message;
      const response = await fetch(`/api/commerce/${companySlug}/lia`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message:groundedMessage }) });
      const body = await response.json() as { answer?: string; products?: Product[] };
      setReply(body.answer ?? "No pude consultar el catálogo en este momento.");
      setProducts(body.products ?? []);
      if(body.products?.[0])setLastProduct(body.products[0]);
      setMessage("");
    } catch { setReply("No pude consultar el catálogo en este momento. Inténtalo nuevamente."); }
    finally { setBusy(false); }
  }

  return <div className="p-7 sm:p-8">
    <span className="relative block size-16 overflow-hidden rounded-2xl border border-violet-300/30 bg-gradient-to-br from-cyan-300/20 to-violet-500/20"><Image src="/images/lia/lia-avatar-v1.png" alt="Lía, asesora comercial de LAEX" fill sizes="64px" className="object-cover object-top"/></span>
    <p className="mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-violet-300"><Sparkles size={12}/> Lía · Asesora comercial</p>
    <h2 className="mt-2 text-2xl font-black">¿Qué producto estás buscando?</h2>
    <div aria-live="polite" className="mt-5 rounded-2xl border border-white/10 bg-white/[.04] p-4 text-sm leading-6 text-slate-200">{reply}</div>
    {products.length > 0 && <div className="mt-3 grid gap-2">{products.slice(0, 3).map(product => <Link key={product.projectionId} href={product.url} className="rounded-xl border border-cyan-300/15 bg-cyan-300/5 p-3 text-xs"><b className="block text-white">{product.name}</b><span className="mt-1 block text-cyan-200">{product.availability}</span></Link>)}</div>}
    <form onSubmit={send} className="mt-4 flex gap-2"><input ref={input} value={message} onChange={event => setMessage(event.target.value)} aria-label="Mensaje para Lía" placeholder="Ej.: ¿Tienen Epson WF-4830?" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[.05] px-4 text-sm outline-none focus:border-violet-300/60"/><button disabled={busy} type="submit" aria-label="Enviar mensaje" className="grid size-12 place-items-center rounded-xl bg-violet-500 transition hover:bg-violet-400 disabled:opacity-50"><Send size={18}/></button></form>
    <p className="mt-4 text-[10px] leading-4 text-slate-500">Lía utiliza únicamente información pública actualizada de LF-PRINTER.</p>
  </div>;
}
