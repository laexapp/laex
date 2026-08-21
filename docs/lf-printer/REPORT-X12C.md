# X-12C — Configuración de pagos y catálogo visual

Fecha: 2026-08-05

## Configuración de pagos

El único punto de administración es el secreto server-side
`LF_PRINTER_PAYMENT_METHODS_JSON`. La plantilla sin secretos vive en
`modules/payment-center/config/lf-printer.payment-methods.example.json` y el
lector validado en `modules/payment-center/config/server-payment-config.ts`.
No existe ningún dato real de cuenta en el bundle público.

## Resultado del procesamiento oficial

| Modelo | Estado X-12C | Evidencia |
| --- | --- | --- |
| WF-4830 | Publicado | WebP RGBA 2000×2000; rendiciones oficiales generadas. |
| WF-4833 | Pendiente | Nombre no canónico y JPEG opaco 522×450. |
| WF-4834 | Pendiente | JPEG opaco 522×450 con extensión WebP. |
| WF-7820 | Pendiente | JPEG opaco 522×370 con extensión WebP. |
| WF-7840 | En revisión | Candidato PNG RGBA 4000×3500 validado; requiere aprobación humana y confirmación de derechos. |
| XP-4200 | Pendiente | JPEG opaco 522×324 con extensión WebP. |
| XP-4205 | Pendiente | JPEG opaco 522×405 con extensión WebP. |
| L3250 | Pendiente | JPEG opaco 447×447 con extensión WebP. |

También se detectó `xp-5200-transparent.webp`, que no pertenece al catálogo
autorizado y no fue publicado. El pipeline exige PNG/WebP real, transparencia
alfa y un lado mínimo de 2000 px. No se ampliaron ni reemplazaron fuentes.

## Auditoría del Showroom

El Showroom ya consume los alias estables `{asset-id}-hero.webp`, por lo que no
requiere cambios de componente. WF-4830 muestra el activo transparente nuevo.
Los demás alias conservan sus recursos anteriores hasta superar revisión; esto
evita regresiones o sustituciones con fondos blancos y residuos. La inspección
automatizada en navegador quedó bloqueada porque no había navegador conectado
en el entorno de ejecución; la auditoría del registro, formatos, dimensiones,
alfa y rutas públicas sí fue completada.
