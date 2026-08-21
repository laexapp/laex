"use client";
import { useState } from "react";

export function BusinessEngineLab() {
  const [output, setOutput] = useState<unknown>({ status: "ready" }); const [busy, setBusy] = useState(false);
  async function call(path: string, init?: RequestInit) { setBusy(true); try { const response = await fetch(path, { ...init, headers: { "content-type": "application/json", ...init?.headers } }); const data = await response.json(); setOutput(data); return response.ok; } finally { setBusy(false); } }
  async function login() { await call("/api/laboratory/business-engine/session", { method: "POST", body: JSON.stringify({ email: "owner@lf-printer.demo", password: "LAEX-Demo-2026!" }) }); }
  async function workshop() { await call("/api/laboratory/business-engine", { method: "POST", body: JSON.stringify({ action: "workshop", idempotencyKey: crypto.randomUUID(), input: { customer: { name: "Juan Martínez", phone: "849-526-1212" }, equipment: { type: "printer", brand: "Epson", model: "L3250", serial: `PILOT-${Date.now()}` }, diagnosis: "Servicio básico y sustitución de tinta", warehouseId: "warehouse-lf-main", parts: [{ productId: "product-t544-black", quantity: 1 }], serviceTotalMinor: 150000, paymentMethod: "cash" } }) }); }
  async function snapshot() { await call("/api/laboratory/business-engine"); }
  return <main className="min-h-screen bg-slate-950 px-6 py-16 text-white"><div className="mx-auto max-w-5xl"><p className="text-sm font-semibold uppercase tracking-[.25em] text-cyan-300">LAEX · Capítulo 2</p><h1 className="mt-4 text-4xl font-semibold">Business Engine Lab</h1><p className="mt-4 max-w-3xl text-slate-300">Laboratorio local con persistencia SQLite, sesión HttpOnly, autorización server-side, transacciones, idempotencia y auditoría. No conecta DGII ni Commerce Engine.</p><div className="mt-8 flex flex-wrap gap-3"><button disabled={busy} onClick={login} className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950">1. Iniciar sesión demo</button><button disabled={busy} onClick={workshop} className="rounded-xl border border-cyan-300/50 px-5 py-3">2. Ejecutar flujo de taller</button><button disabled={busy} onClick={snapshot} className="rounded-xl border border-white/20 px-5 py-3">3. Consultar estado y auditoría</button></div><pre className="mt-8 max-h-[60vh] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-6 text-cyan-100">{JSON.stringify(output, null, 2)}</pre></div></main>;
}



