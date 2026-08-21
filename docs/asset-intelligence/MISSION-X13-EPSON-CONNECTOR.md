# Misión X-13 — Conector Autorizado Epson

Fecha: 2026-08-05

## Resultado

Asset Intelligence conserva el rol de motor. `EpsonPublicConnector` consulta
por modelo un catálogo de páginas oficiales, extrae recursos declarados por la
página, inspecciona formato y resolución, ordena por calidad y entrega
candidatos al servicio existente. Solo acepta HTTPS y una lista cerrada de
dominios Epson; también valida el destino final después de redirecciones.

`NodeEpsonPublicTransport` descarga en servidor con timeout, límites de tamaño,
validación MIME y lectura real de dimensiones. La procedencia, URL, licencia y
resolución se incorporan al candidato; el SHA-256 continúa calculándose en
`AssetIntelligenceService` antes de preservar el original.

## Política temporal

`EpsonAcquisitionCoordinator` aplica la excepción únicamente al flujo X-13.
Mantiene 2000 px como objetivo y etiqueta una fuente inferior como
`temporary-pending-replacement` / **Temporal - Pendiente de sustitución**. El
servicio y el Media Pipeline no cambian. Una versión premium posterior usa la
misma identidad fabricante/modelo/tipo: el Global Asset Registry existente
conserva el Asset ID, agrega una versión y registra el reemplazo.

La excepción permite adquisición y preparación para revisión, nunca aprobación
o publicación automática. Las reglas legales y la aprobación humana continúan
vigentes.

## Catálogo LF-PRINTER consultable

El catálogo público inicial contiene WF-4830, WF-4833, WF-4834, WF-7820,
WF-7840, XP-4200, XP-4205 y L3250. Las páginas pertenecen a `epson.com`; los
recursos pueden provenir también de `support.epson.com`, `news.epson.com`,
`mediaserver.goepson.com` o `files.support.epson.com`.

## Epson Partner Portal

`EpsonPartnerPortalConnector` y su contrato de transporte están preparados,
pero permanecen bloqueados. Para habilitarlos se necesitan:

1. Cuenta comercial LF-PRINTER aprobada por Epson.
2. Autorización escrita y alcance de uso/transformación.
3. Endpoint o API/documentación técnica proporcionada por Epson.
4. Token server-side en `EPSON_PARTNER_PORTAL_ACCESS_TOKEN`.
5. Referencia en `EPSON_PARTNER_PORTAL_AUTHORIZATION_REFERENCE`.
6. Activación explícita con `EPSON_PARTNER_PORTAL_ENABLED=true`.

Ningún secreto usa `NEXT_PUBLIC_`; no se automatiza login ni scraping de áreas
protegidas.
