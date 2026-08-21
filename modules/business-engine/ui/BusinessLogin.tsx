"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Building2, LockKeyhole } from "lucide-react";
import "./business-access.css";

export function BusinessLogin({ companySlug, companyLabel, logoUrl }: { companySlug: string; companyLabel: string; logoUrl?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setError(""); const response = await fetch(`/api/business-app/${companySlug}/session`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) }); const data = await response.json(); if (response.ok) router.push(`/business/${companySlug}`); else setError(data.error === "access_denied" ? "El usuario no pertenece a esta empresa." : "Credenciales inválidas."); setBusy(false); }
  return <main className="business-login-shell"><section><div className="business-login-brand">{logoUrl ? <span className="company-logo"><Image src={logoUrl} alt={`Logo de ${companyLabel}`} width={40} height={40} unoptimized /></span> : <span>LB</span>}<div><strong>LAEX Business Platform</strong><small>Acceso empresarial seguro</small></div></div><div className="business-login-icon"><Building2 /></div><p className="business-login-kicker">EMPRESA RESUELTA</p><h1>{companyLabel}</h1><p>Inicia sesión con una membresía autorizada para esta empresa.</p><form onSubmit={submit}><label>Correo empresarial<input type="email" required value={email} onChange={event => setEmail(event.target.value)} /></label><label>Contraseña<input type="password" required value={password} onChange={event => setPassword(event.target.value)} /></label>{error && <div className="business-login-error">{error}</div>}<button disabled={busy}><LockKeyhole size={17} />{busy ? "Verificando…" : "Entrar a mi empresa"}</button></form><small>El dominio, la identidad y la membresía deben concordar.</small></section></main>;
}
