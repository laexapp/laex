# Refinería general de LAEX — corte de auditoría y reparación

Fecha: 2026-08-13  
Estado: Puertas A–C ejecutadas en el alcance crítico Commerce/Business/PostgreSQL. Puertas D–E pendientes de auditoría visual asistida y prueba de media nueva con autorización verificable.

## Crítico

### Lectura Commerce acotada y RLS

- Evidencia inicial: la búsqueda pública reconstruía el estado PostgreSQL completo.
- Causa: `CommerceCatalogSearch` dependía de `snapshot()` y `CompanyResolver` cargaba todos los registros.
- Solución: resolución directa de empresa y `snapshotForCompany()` con buckets mínimos, transacción `READ ONLY`, contexto interno explícito y filtros tenant/company.
- Validación: prueba PostgreSQL de snapshot acotado; cero registros de Empresa B en Empresa A; endpoint público sin campos privados.

### Regresión detectada durante la refinería

- Evidencia: una primera versión de `snapshotForCompany()` devolvió cero productos porque RLS bloqueaba la lectura interna al no establecer `laex.platform_access` dentro de transacción.
- Solución: `BEGIN READ ONLY` + `SET LOCAL laex.platform_access='on'` + `COMMIT/ROLLBACK` y prueba de regresión específica.
- Resultado: catálogo oficial vuelve a entregar tres productos en el entorno local auditado.

## Alto

### Reserva no operable desde el catálogo principal

- Antes: “Agregar al pedido” acumulaba artículos, pero el catálogo principal no podía confirmar la reserva.
- Después: pedido visible, cantidades, contacto, total, confirmación y mensaje accesible desde la misma superficie.
- La mutación conserva el endpoint oficial, idempotencia y validación server-side de precio/disponibilidad.

### Estado visible sin F5

- Commerce publica `availableQuantity` calculada, nunca inventada por el cliente.
- Tras reservar se vuelve a consultar `commerce.catalog.search` y se actualizan catálogo y Showroom.
- Publicación, despublicación, inventario, compras, POS y confirmación/cancelación de pedidos anuncian el cambio con alcance por `companySlug`.
- La señal utiliza evento local y `BroadcastChannel`; no mezcla empresas ni sustituye la fuente de verdad.
- POS y Commerce notifican también al estado padre de Business para evitar un Dashboard obsoleto al cambiar de módulo.

### N+1 de escritura PostgreSQL

- Antes: `write()` ejecutaba un `INSERT` por registro genérico y otro por clave idempotente.
- Después: registros de plataforma, empresa e idempotencia se escriben por lotes JSONB.
- Deuda restante: la transacción histórica aún reescribe el estado completo bajo un bloqueo asesor global. Es consistente, pero no es el modelo final para gran volumen multi-tenant.

### Errores de reserva

- La API pública devuelve código estable, mensaje legible, referencia de diagnóstico y `cache-control: no-store`.
- La interfaz muestra el mensaje seguro y no detalles internos.

## Medio

### Derivados principales de producto

- Eliminadas franjas promocionales, texto incrustado y logos de carrusel/tarjeta/detalle.
- Derivados v3: producto auténtico, `contain`, fondo limpio, WebP; el maestro no se sobrescribe.
- Promociones y composiciones de marca continúan como activos separados.

### UTF-8

- Barrido de `app`, `modules`, `src`, `shared`, `scripts` y `tests`: cero secuencias mojibake o caracteres de reemplazo en fuente.
- HTML local verificado con “Recepción” y “diagnóstico” correctos.

## Rendimiento reproducible

Entorno local Next.js dev, PostgreSQL local, 10 solicitudes secuenciales:

- Showroom: cold 589.4 ms; warm avg 343.6 ms; p95 397.9 ms.
- `commerce.catalog.search`: cold 57.6 ms; warm avg 61.7 ms; p95 75.4 ms.
- Lía pública Commerce: cold 275.5 ms; warm avg 80.8 ms; p95 151.9 ms.

Estas cifras son línea base local, no Web Vitals de producción. La mejora estructural comprobada es menor volumen de datos/queries por catálogo y escrituras genéricas agrupadas; no se declara una ganancia global de latencia sin una corrida comparable en servidor productivo.

## Validación

- Business Engine: 80/80 pruebas aprobadas.
- PostgreSQL/RLS focalizado: 13/13 pruebas aprobadas después de la corrección RLS.
- TypeScript: aprobado.
- ESLint: 0 errores, 7 advertencias preexistentes.
- Build Next.js 16.2.9: aprobado; 69 páginas generadas.
- Endpoint Commerce: tres productos, `availableQuantity`, cero campos privados prohibidos.
- HTML Showroom: UTF-8 correcto, catálogo y reserva presentes.

## Bloqueos para cerrar Puertas D–E

1. El navegador integrado no estuvo disponible en la sesión; no se presenta como realizada una auditoría visual desktop/tablet/mobile ni teclado/foco mediante navegador real.
2. La prueba de producto nuevo sin activo previo no puede declararse completa: el pipeline reporta WF-4833/WF-4834/WF-7820/XP-4200/XP-4205/L3250 pendientes y WF-7840 en revisión humana. Una fuente pública oficial Epson exige revisión de derechos/autorización; LAEX debe mantener “Imagen pendiente” hasta tener aprobación verificable.
3. La persistencia PostgreSQL conserva el modelo de snapshot global para mutaciones. El batching elimina N+1, pero el siguiente paso de rendimiento debe sustituir gradualmente la reescritura global por repositorios normalizados y transacciones tenant/company, conservando RLS y contratos.

La refinería no se declara terminada mientras estos tres puntos sigan abiertos.
