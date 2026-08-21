"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type FiscalData = {
  profile: null | { rnc: string; legalName?: string; taxRegime?: string; environment: string; ruleVersion?: string };
  sequences: Array<{ id: string; type: string; rangeStart: number; rangeEnd: number; nextNumber: number; status: string; environment: string }>;
  documents: Array<{ id: string; businessDocumentId: string; type: string; eNcf: string | null; status: string; totals: { totalMinor: number } }>;
  reconciliations: Array<{ id: string; periodFrom: string; periodTo: string; status: string; differences: unknown[] }>;
  dgiiConnection: "disabled";
};

export function FiscalCenter({ apiBase, capabilities }: { apiBase: string; capabilities: string[] }) {
  const [data, setData] = useState<FiscalData | null>(null);
  const [notice, setNotice] = useState("Cargando configuración fiscal…");
  const [profile, setProfile] = useState({ rnc: "", legalName: "", taxRegime: "traditional", environment: "disabled", ruleVersion: "DGII-eCF-1.0" });
  const canManage = capabilities.includes("fiscal.profile.manage");
  const load = useCallback(async () => { const response = await fetch(`${apiBase}/fiscal`); const body = await response.json(); if (!response.ok) throw new Error(body.error); setData(body); if (body.profile) setProfile((current) => ({ ...current, ...body.profile })); setNotice("DGII real deshabilitada · preparación local y auditable"); }, [apiBase]);
  useEffect(() => {
    let active = true;
    fetch(`${apiBase}/fiscal`).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); return body as FiscalData; }).then((body) => { if (!active) return; setData(body); if (body.profile) setProfile((current) => ({ ...current, ...body.profile })); setNotice("DGII real deshabilitada · preparación local y auditable"); }).catch((error) => { if (active) setNotice(error instanceof Error ? error.message : "No fue posible cargar el centro fiscal"); });
    return () => { active = false; };
  }, [apiBase]);
  async function save(event: FormEvent) { event.preventDefault(); const response = await fetch(`${apiBase}/fiscal`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "profile.update", input: { ...profile, enabled: false, obligationsCurrent: false, authorizedElectronicIssuer: false, softwareCertified: false, enabledDocumentTypes: ["E31","E32","E33","E34","E41","E43","E44","E45","E46","E47"], itbisMode: "mixed" } }) }); const body = await response.json(); if (!response.ok) { setNotice(body.error); return; } setNotice("Perfil fiscal guardado y auditado. No se transmitió información a DGII."); await load(); }
  return <div className="split-grid">
    <section className="audit-panel"><header><div><h2>Perfil fiscal dominicano</h2><p>{notice}</p></div><span className="status-pill">DGII desconectada</span></header><form className="audit-form" onSubmit={save}><label className="field"><span>RNC (validación formal, no consulta DGII)</span><input value={profile.rnc} onChange={(event) => setProfile({ ...profile, rnc: event.target.value.replace(/\D/g, "") })} required minLength={9} maxLength={11}/></label><label className="field"><span>Razón social</span><input value={profile.legalName} onChange={(event) => setProfile({ ...profile, legalName: event.target.value })}/></label><label className="field"><span>Régimen operativo</span><select value={profile.taxRegime} onChange={(event) => setProfile({ ...profile, taxRegime: event.target.value })}><option value="traditional">Tradicional</option><option value="electronic">Electrónico</option><option value="transition">Transición</option></select></label><button className="primary-action" disabled={!canManage}>Guardar perfil fiscal</button></form></section>
    <section className="audit-panel"><header><div><h2>Preparación e-CF / e-NCF</h2><p>Contrato canónico, secuencias autorizadas y conciliación.</p></div></header><div className="receipt-summary"><div><span>Conexión DGII</span><strong>Deshabilitada</strong></div><div><span>Secuencias registradas</span><strong>{data?.sequences.length ?? 0}</strong></div><div><span>Documentos fiscales</span><strong>{data?.documents.length ?? 0}</strong></div><div><span>Conciliaciones</span><strong>{data?.reconciliations.length ?? 0}</strong></div><p>LAEX no genera rangos ni e-NCF sin una autorización registrada. XML oficial, firma digital y transmisión permanecen bloqueados hasta certificación.</p></div></section>
    <section className="audit-panel" style={{gridColumn:"1 / -1"}}><header><div><h2>Documentos fiscales canónicos</h2><p>La factura empresarial continúa siendo la fuente; esta capa prepara su representación fiscal.</p></div></header><div className="table-wrap"><table><thead><tr><th>Documento</th><th>Tipo</th><th>e-NCF</th><th>Estado</th><th>Total</th></tr></thead><tbody>{data?.documents.map((document) => <tr key={document.id}><td>{document.businessDocumentId}</td><td>{document.type}</td><td>{document.eNcf ?? "Pendiente de secuencia autorizada"}</td><td>{document.status}</td><td>{new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" }).format(document.totals.totalMinor / 100)}</td></tr>)}</tbody></table></div></section>
  </div>;
}
