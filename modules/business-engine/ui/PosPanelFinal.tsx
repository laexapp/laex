"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Barcode, Banknote, CreditCard, Minus, Plus, Printer, Search, ShoppingCart, Trash2, X } from "lucide-react";
import { announceCommerceChange } from "@/modules/lf-printer/infrastructure/commerce-events";
import "./pos.css";
import "./pos-final.css";
import "./pos-desktop.css";

type Product = { id: string; name: string; sku: string; barcode?: string; priceMinor: number };
type Customer = { id: string; name: string; phone?: string };
type CartLine = Product & { quantity: number };
type Snapshot = { products: Product[]; customers: Customer[]; inventory: Array<{ productId: string; delta: number }> };
type PaymentMode = "cash" | "card" | "transfer" | "mixed";
type CustomerType = "consumer_final" | "fiscal_credit" | "government" | "special_regime";
type Receipt = { invoiceId: string; customerName: string; customerType: string; subtotalMinor: number; discountMinor: number; taxableBaseMinor: number; taxMinor: number; totalMinor: number; changeMinor: number; paymentLabels: string[]; lines: CartLine[]; electronicInvoice: { id: string; type: string; status: string; eNcf: string | null }; at: string };

const pesos = (minor: number) => new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(minor / 100);
const customerTypes: Array<[CustomerType, string]> = [["consumer_final", "Consumidor Final"], ["fiscal_credit", "Crédito Fiscal"], ["government", "Gubernamental"], ["special_regime", "Régimen Especial / otros futuros"]];

export function PosPanelFinal({ apiBase, companyName, companyLogoUrl, warehouseId, actorName, capabilities, onBusinessChange }: { apiBase: string; companyName: string; companyLogoUrl?: string; warehouseId: string; actorName?: string; capabilities?: string[]; onBusinessChange?: () => void }) {
  const [data, setData] = useState<Snapshot>({ products: [], customers: [], inventory: [] });
  const [query, setQuery] = useState(""); const [cart, setCart] = useState<CartLine[]>([]);
  const [customerId, setCustomerId] = useState(""); const [customerType, setCustomerType] = useState<CustomerType>("consumer_final");
  const [discountPercent, setDiscountPercent] = useState(0); const [discountInput, setDiscountInput] = useState("0"); const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash"); const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(true);
  const [cashAppliedMinor, setCashAppliedMinor] = useState(0); const [cashReceivedMinor, setCashReceivedMinor] = useState(0); const [cashReceivedInput, setCashReceivedInput] = useState("0"); const [mixedSecondary, setMixedSecondary] = useState<"card" | "transfer">("card");
  const [card, setCard] = useState({ cardType: "debit", last4: "", authorizationReference: "", processor: "" });
  const [transfer, setTransfer] = useState({ channel: "", reference: "", date: new Date().toISOString().slice(0, 10), verificationStatus: "pending" });
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState("Caja lista para vender"); const [receipt, setReceipt] = useState<Receipt | null>(null); const searchRef = useRef<HTMLInputElement>(null);
  const [cashOpen,setCashOpen]=useState<boolean|null>(null);

  const refresh = useCallback(async () => { const response = await fetch(apiBase); if (!response.ok) throw new Error("Sesión no disponible"); setData(await response.json());const operations=await fetch(`${apiBase}/operations`);if(operations.ok){const overview=await operations.json();setCashOpen(overview.cashSessions?.some((session:{status:string;userId:string})=>session.status==="open"&&session.userId===overview.actor.userId)??false)} }, [apiBase]);
  useEffect(() => { const timer = window.setTimeout(() => void refresh(), 0); const onKey = (event: KeyboardEvent) => { if (event.key === "F2") { event.preventDefault(); searchRef.current?.focus(); } if (event.key === "F9") { event.preventDefault(); document.getElementById("pos-confirm")?.click(); } }; window.addEventListener("keydown", onKey); return () => { window.clearTimeout(timer); window.removeEventListener("keydown", onKey); }; }, [refresh]);

  const stock = (productId: string) => data.inventory.filter((item) => item.productId === productId).reduce((sum, item) => sum + item.delta, 0);
  const exactCode = useMemo(() => { const term = query.trim().toLowerCase(); return term ? data.products.find((item) => item.sku.toLowerCase() === term || item.barcode === query.trim()) : undefined; }, [data.products, query]);
  const filtered = useMemo(() => { const term = query.trim().toLowerCase(); if (!term || exactCode) return []; return data.products.filter((item) => item.name.toLowerCase().includes(term) || item.sku.toLowerCase().includes(term) || item.barcode?.includes(term)).slice(0, 8); }, [data.products, query, exactCode]);
  const subtotalMinor = cart.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);
  const discountMinor = Math.round(subtotalMinor * discountPercent / 100);
  const totalMinor = subtotalMinor - discountMinor;
  const taxableBaseMinor = Math.round(totalMinor / 1.18);
  const taxMinor = totalMinor - taxableBaseMinor;
  const activeCashApplied = paymentMode === "cash" ? totalMinor : cashAppliedMinor;
  const changeMinor = Math.max(0, cashReceivedMinor - activeCashApplied);

  function normalizeNumericInput(raw: string) {
    if (!/^\d*(?:\.\d{0,2})?$/.test(raw)) return null;
    if (!raw) return "";
    return raw.replace(/^0+(?=\d)/, "");
  }
  function updateDiscountInput(raw: string) { const normalized = normalizeNumericInput(raw); if (normalized === null) return; if (!normalized) { setDiscountInput(""); setDiscountPercent(0); return; } const limit=capabilities?.includes("pos.discount.override")?100:capabilities?.includes("pos.discount")?5:0;const value = Math.min(limit, Number(normalized)); setDiscountInput(String(value)); setDiscountPercent(value); }
  function updateCashReceivedInput(raw: string) { const normalized = normalizeNumericInput(raw); if (normalized === null) return; setCashReceivedInput(normalized); setCashReceivedMinor(normalized ? Math.round(Number(normalized) * 100) : 0); }
  function restoreZero(value: string, setter: (value: string) => void) { if (!value) setter("0"); }
  function add(product: Product) { if (stock(product.id) <= 0) return setMessage("Producto sin existencia disponible"); setCart((current) => { const existing = current.find((item) => item.id === product.id); return existing ? current.map((item) => item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, stock(item.id)) } : item) : [...current, { ...product, quantity: 1 }]; }); setQuery(""); searchRef.current?.focus(); }
  function quantity(id: string, value: number) { setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(value, stock(id))) } : item)); }
  function scanEnter() { if (exactCode) add(exactCode); }
  function cardMetadata() { return { cardType: card.cardType, last4: card.last4, authorizationReference: card.authorizationReference, ...(card.processor ? { processor: card.processor } : {}) }; }
  function transferMetadata() { return { channel: transfer.channel, reference: transfer.reference, date: transfer.date, verificationStatus: transfer.verificationStatus }; }
  function paymentInput() {
    if (paymentMode === "cash") return [{ method: "cash", amountMinor: totalMinor, receivedMinor: cashReceivedMinor }];
    if (paymentMode === "card") return [{ method: "card", amountMinor: totalMinor, metadata: cardMetadata() }];
    if (paymentMode === "transfer") return [{ method: "transfer", amountMinor: totalMinor, metadata: transferMetadata() }];
    const remainder = totalMinor - cashAppliedMinor;
    return [{ method: "cash", amountMinor: cashAppliedMinor, receivedMinor: cashReceivedMinor }, { method: mixedSecondary, amountMinor: remainder, metadata: mixedSecondary === "card" ? cardMetadata() : transferMetadata() }];
  }
  const cardRequired = paymentMode === "card" || (paymentMode === "mixed" && mixedSecondary === "card");
  const transferRequired = paymentMode === "transfer" || (paymentMode === "mixed" && mixedSecondary === "transfer");
  const cashRequired = paymentMode === "cash" || paymentMode === "mixed";
  const invalidPayment = (cashRequired && cashReceivedMinor < activeCashApplied) || (paymentMode === "mixed" && (cashAppliedMinor <= 0 || cashAppliedMinor >= totalMinor)) || (cardRequired && (!/^\d{4}$/.test(card.last4) || !card.authorizationReference)) || (transferRequired && (!transfer.channel || !transfer.reference || !transfer.date));

  async function confirm() {
    if (!cart.length || totalMinor <= 0 || invalidPayment) return; setBusy(true);
    try {
      const payments = paymentInput();
      const response = await fetch(apiBase, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "pos", idempotencyKey: crypto.randomUUID(), input: { customerId: customerId || undefined, customerType, warehouseId, lines: cart.map((item) => ({ productId: item.id, quantity: item.quantity })), discountMinor, taxRate: .18, taxMode: "included", payments } }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error ?? "Venta rechazada");
      setReceipt({ ...result, paymentLabels: payments.map((item) => item.method === "card" ? `Tarjeta •••• ${(item.metadata as Record<string, string>).last4} · Auth ${(item.metadata as Record<string, string>).authorizationReference}: ${pesos(item.amountMinor)}` : item.method === "transfer" ? `Transferencia · ${(item.metadata as Record<string, string>).channel} · Ref ${(item.metadata as Record<string, string>).reference}: ${pesos(item.amountMinor)}` : `Efectivo recibido ${pesos(("receivedMinor" in item ? item.receivedMinor : undefined) ?? item.amountMinor)}: ${pesos(item.amountMinor)}`), lines: cart, at: new Date().toISOString() });
      setCart([]); setDiscountPercent(0); setDiscountInput("0"); setCashAppliedMinor(0); setCashReceivedMinor(0); setCashReceivedInput("0"); setMessage(`Venta confirmada · Factura LAEX-${result.invoiceId.slice(-6).toUpperCase()}`); await refresh(); onBusinessChange?.(); announceCommerceChange(apiBase.split("/").filter(Boolean).at(-1) ?? "");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No fue posible confirmar la venta"); } finally { setBusy(false); }
  }

  return <div className="pos-layout" data-company-brand={companyLogoUrl?"configured":"default"} style={{"--company-logo":companyLogoUrl?`url(${JSON.stringify(companyLogoUrl)})`:"none"} as React.CSSProperties}><div className={`pos-shift ${cashOpen?"open":"closed"}`}><strong>{actorName??"Cajero"}</strong><span>{cashOpen===null?"Verificando caja…":cashOpen?"Caja / turno activo":"Caja cerrada · abre un turno antes de vender"}</span></div>
    <section className="pos-catalog"><div className="pos-search-wrap"><div className="pos-search"><Search size={20}/><input ref={searchRef} autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); scanEnter(); } if (event.key === "Escape") setQuery(""); }} placeholder="Nombre, SKU o código de barras…"/><kbd>F2</kbd></div>{query.trim() && !exactCode && <div className="pos-products">{filtered.map((product) => <button key={product.id} onClick={() => add(product)}><div><span>{product.sku}</span><strong>{product.name}</strong><small>{product.barcode ?? "Sin código"}</small></div><div><strong>{pesos(product.priceMinor)}</strong><small className={stock(product.id) > 0 ? "stock-ok" : "stock-out"}>Existencia: {stock(product.id)}</small></div></button>)}{!filtered.length && <div className="pos-no-results">Sin coincidencias. Revisa el nombre o código.</div>}</div>}</div><div className="pos-hint"><Barcode size={15}/> Código exacto + Enter agrega directamente · Esc limpia</div><div className="pos-search-idle"><Barcode size={34}/><strong>Escanea o busca el siguiente artículo</strong><p>Las coincidencias aparecerán aquí sólo mientras escribes.</p></div></section>
    <section className="pos-cart"><header><div><ShoppingCart size={21}/><div><h2>Venta actual</h2><p>{cart.reduce((sum, item) => sum + item.quantity, 0)} artículos</p></div></div><span>{message}</span></header>
      <div className="pos-fiscal"><label><span>Tipo de operación / comprobante futuro</span><select value={customerType} onChange={(event) => setCustomerType(event.target.value as CustomerType)}>{customerTypes.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label><small>Selección informativa. No genera NCF ni e-NCF.</small></div>
      <label className="pos-customer"><span>Cliente</span><select value={customerId} onChange={(event) => setCustomerId(event.target.value)}><option value="">Consumidor final</option>{data.customers.map((item) => <option key={item.id} value={item.id}>{item.name}{item.phone ? ` · ${item.phone}` : ""}</option>)}</select></label>
      <div className="pos-lines">{cart.map((item) => <article key={item.id}><div><strong>{item.name}</strong><small>{item.sku} · Disponible {stock(item.id)}</small></div><div className="quantity-control"><button aria-label="Restar" onClick={() => quantity(item.id, item.quantity - 1)}><Minus size={14}/></button><input aria-label={`Cantidad de ${item.name}`} type="number" value={item.quantity} onChange={(event) => quantity(item.id, Number(event.target.value))}/><button aria-label="Sumar" onClick={() => quantity(item.id, item.quantity + 1)}><Plus size={14}/></button></div><strong>{pesos(item.priceMinor * item.quantity)}</strong><button className="remove-line" aria-label={`Eliminar ${item.name}`} onClick={() => setCart((current) => current.filter((line) => line.id !== item.id))}><Trash2 size={16}/></button></article>)}{!cart.length && <div className="pos-empty"><ShoppingCart size={34}/><strong>Carrito vacío</strong><p>Busca o escanea un producto para comenzar.</p></div>}</div>
      <div className="pos-totals"><label><span>Descuento</span><div><input type="text" inputMode="decimal" aria-label="Descuento en porcentaje" value={discountInput} onFocus={(event) => { if (discountInput === "0") event.currentTarget.select(); }} onChange={(event) => updateDiscountInput(event.target.value)} onBlur={() => restoreZero(discountInput, setDiscountInput)}/><em>%</em></div></label><dl><div><dt>Precio / subtotal</dt><dd>{pesos(subtotalMinor)}</dd></div><div><dt>Descuento</dt><dd>− {pesos(discountMinor)}</dd></div><div><dt>Base imponible</dt><dd>{pesos(taxableBaseMinor)}</dd></div><div><dt>ITBIS incluido (18%)</dt><dd>{pesos(taxMinor)}</dd></div><div className="grand-total"><dt>Total a pagar</dt><dd>{pesos(totalMinor)}</dd></div></dl></div>
      <div className="pos-payment"><span>Método de pago</span><div>{[["cash", Banknote, "Efectivo"], ["card", CreditCard, "Tarjeta"], ["transfer", CreditCard, "Transferencia"], ["mixed", WalletMix, "Mixto"]].map(([id, Icon, name]) => { const PaymentIcon = Icon as typeof Banknote; return <button key={id as string} className={paymentMode === id ? "active" : ""} onClick={() => { const mode = id as PaymentMode; setPaymentMode(mode); setPaymentDetailsOpen(mode === "card" || mode === "transfer" || mode === "mixed"); if (mode === "cash") { setCashReceivedMinor(totalMinor); setCashReceivedInput(String(totalMinor / 100)); } if (mode === "mixed") { setCashAppliedMinor(Math.floor(totalMinor / 2)); setCashReceivedMinor(Math.floor(totalMinor / 2)); setCashReceivedInput(String(Math.floor(totalMinor / 2) / 100)); } }}><PaymentIcon size={17}/>{name as string}</button>; })}</div>
        {paymentMode === "mixed" && <div className="mixed-payment"><label>Efectivo aplicado <input type="number" min="0" max={totalMinor / 100} value={cashAppliedMinor / 100} onChange={(event) => setCashAppliedMinor(Math.round(Number(event.target.value) * 100))}/></label><select value={mixedSecondary} onChange={(event) => setMixedSecondary(event.target.value as "card" | "transfer")}><option value="card">+ Tarjeta</option><option value="transfer">+ Transferencia</option></select><span>Segundo método {pesos(Math.max(0, totalMinor - cashAppliedMinor))}</span></div>}
        {cashRequired && <div className="cash-change"><label>Efectivo recibido <input type="text" inputMode="decimal" aria-label="Efectivo recibido" value={cashReceivedInput} onFocus={(event) => { if (cashReceivedInput === "0") event.currentTarget.select(); }} onChange={(event) => updateCashReceivedInput(event.target.value)} onBlur={() => restoreZero(cashReceivedInput, setCashReceivedInput)}/></label><div><span>Cambio a devolver</span><strong className={cashReceivedMinor < activeCashApplied ? "insufficient" : ""}>{pesos(changeMinor)}</strong></div></div>}
        {cardRequired && !paymentDetailsOpen && <button type="button" className="payment-details-toggle" onClick={() => setPaymentDetailsOpen(true)}>Completar datos de tarjeta</button>}
        {cardRequired && paymentDetailsOpen && <div className="payment-metadata"><button type="button" className="payment-metadata-close" aria-label="Cerrar datos de tarjeta" onClick={() => setPaymentDetailsOpen(false)}><X size={16}/></button><label>Tipo<select value={card.cardType} onChange={(event) => setCard({ ...card, cardType: event.target.value })}><option value="debit">Débito</option><option value="credit">Crédito</option></select></label><label>Últimos 4<input inputMode="numeric" maxLength={4} value={card.last4} onChange={(event) => setCard({ ...card, last4: event.target.value.replace(/\D/g, "").slice(0, 4) })}/></label><label>Autorización<input value={card.authorizationReference} onChange={(event) => setCard({ ...card, authorizationReference: event.target.value })}/></label><label>Procesador / banco<input value={card.processor} onChange={(event) => setCard({ ...card, processor: event.target.value })}/></label><small>Nunca se almacena número completo, CVV ni PIN.</small></div>}
        {transferRequired && !paymentDetailsOpen && <button type="button" className="payment-details-toggle" onClick={() => setPaymentDetailsOpen(true)}>Completar datos de transferencia</button>}
        {transferRequired && paymentDetailsOpen && <div className="payment-metadata"><button type="button" className="payment-metadata-close" aria-label="Cerrar datos de transferencia" onClick={() => setPaymentDetailsOpen(false)}><X size={16}/></button><label>Banco / canal<input value={transfer.channel} onChange={(event) => setTransfer({ ...transfer, channel: event.target.value })}/></label><label>Referencia<input value={transfer.reference} onChange={(event) => setTransfer({ ...transfer, reference: event.target.value })}/></label><label>Fecha<input type="date" value={transfer.date} onChange={(event) => setTransfer({ ...transfer, date: event.target.value })}/></label><label>Verificación<select value={transfer.verificationStatus} onChange={(event) => setTransfer({ ...transfer, verificationStatus: event.target.value })}><option value="pending">Pendiente</option><option value="verified">Verificada</option></select></label></div>}
        <details className="future-payments"><summary>Métodos preparados para fases futuras</summary><p>Token digital · OMD · OMDB · USDT · BNB · otras criptomonedas · Web3. Sin wallets ni blockchain conectados.</p></details>
      </div>
      <button id="pos-confirm" className="pos-confirm" disabled={busy || !cart.length || invalidPayment || cashOpen===false} onClick={() => void confirm()}>{busy ? "Procesando…" : <>Confirmar venta <kbd>F9</kbd></>}</button>
    </section>
    {receipt && <aside className="pos-receipt" data-print-format="thermal"><div className="receipt-paper"><header><strong>{companyName}</strong><span>RECIBO DE VENTA · NO FISCAL</span></header><p>Factura: LAEX-{receipt.invoiceId.slice(-6).toUpperCase()}<br/>Fecha: {new Date(receipt.at).toLocaleString("es-DO")}<br/>Cliente: {receipt.customerName}<br/>Operación: {customerTypes.find(([type]) => type === receipt.customerType)?.[1] ?? receipt.customerType}</p>{receipt.lines.map((line) => <div className="receipt-line" key={line.id}><span>{line.quantity} × {line.name}</span><strong>{pesos(line.quantity * line.priceMinor)}</strong></div>)}<dl><div><dt>Subtotal</dt><dd>{pesos(receipt.subtotalMinor)}</dd></div><div><dt>Descuento</dt><dd>{pesos(receipt.discountMinor)}</dd></div><div><dt>Base imponible</dt><dd>{pesos(receipt.taxableBaseMinor)}</dd></div><div><dt>ITBIS incluido</dt><dd>{pesos(receipt.taxMinor)}</dd></div><div><dt>TOTAL</dt><dd>{pesos(receipt.totalMinor)}</dd></div>{receipt.changeMinor > 0 && <div><dt>CAMBIO</dt><dd>{pesos(receipt.changeMinor)}</dd></div>}</dl><p>{receipt.paymentLabels.join(" · ")}</p><div className="ecf-placeholder"><strong>e-CF futuro: {receipt.electronicInvoice.type}</strong><span>Estado: borrador · e-NCF pendiente</span><small>Sin firma ni envío a DGII</small></div><footer>Documento demostrativo · No fiscal</footer></div><div className="receipt-change-banner"><span>Cambio entregado</span><strong>{pesos(receipt.changeMinor)}</strong></div><button onClick={() => window.print()}><Printer size={17}/> Imprimir recibo</button><button className="close-receipt" onClick={() => setReceipt(null)}>Cerrar</button></aside>}
  </div>;
}

function WalletMix({ size = 17 }: { size?: number }) { return <span style={{ fontSize: size }}>±</span>; }







