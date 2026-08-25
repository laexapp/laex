"use client";
import { useState, type FormEvent } from "react";
export function ReservationForm({ company, itemSlug, accent }: { company: string; itemSlug: string; accent: string }) {
  const [status, setStatus] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus(""); const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/company-experience/${company}/reservations`, { method: "POST", headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() }, body: JSON.stringify({ catalogItemSlug: itemSlug, startDate: form.get("startDate"), endDate: form.get("endDate"), name: form.get("name"), phone: form.get("phone"), notes: form.get("notes") }) });
    const body = await response.json(); setStatus(response.ok ? `Solicitud ${body.id.slice(0, 8)} recibida. Confirmaremos disponibilidad directamente contigo.` : body.error ?? "No fue posible enviar la solicitud."); setBusy(false); if (response.ok) event.currentTarget.reset();
  }
  return <form className="ce-reservation" onSubmit={submit}><div className="ce-field-grid"><label>Fecha de inicio<input name="startDate" type="date" required /></label><label>Fecha de devolución<input name="endDate" type="date" required /></label><label>Nombre<input name="name" minLength={2} maxLength={100} required /></label><label>Teléfono<input name="phone" type="tel" minLength={7} maxLength={30} required /></label></div><label>Notas opcionales<textarea name="notes" maxLength={500} rows={4} /></label><button disabled={busy} style={{ background: accent }}>{busy ? "ENVIANDO…" : "SOLICITAR RESERVA"}</button>{status && <p className="ce-form-status" role="status">{status}</p>}<small>Esta solicitud no confirma disponibilidad ni genera un cobro.</small></form>;
}