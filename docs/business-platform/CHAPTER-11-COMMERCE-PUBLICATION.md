# Capítulo 11 — Commerce & Publication Engine

Estado: implementación local de referencia, sin dominio público ni pagos externos.

## Auditoría inicial y desacoplamiento

El Showroom de LF-PRINTER estaba alimentado por `demo-data.ts` y escenas generadas desde `catalog`; las fichas `/proyectos/lf-printer/productos/[slug]` también dependían de esa fuente estática. Se preservaron los componentes visuales, `Showroom`, `PrinterVisual`, asesor, filtros, fichas, manifiestos y todo el pipeline/activos en `assets/lf-printer/official-source` y `public/assets`. El catálogo estático permanece como material reutilizable, pero `/proyectos/lf-printer` dejó de usarlo como catálogo comercial activo y ahora consume Commerce mediante el slug local configurado.

## Arquitectura

`Business Product + movimientos → CommerceProjection → Publication Engine → Showroom → checkout → reserva → pedido WEB → Business Engine → movimiento → proyección de disponibilidad`.

Publicar es una acción explícita con permiso. La proyección referencia el producto interno, mantiene slug por empresa, contenido público, categoría comercial, galería/activo explícito, precio, promoción, características, SEO, versión y fecha de sincronización. Despublicar no borra producto, inventario, historia ni media.

El catálogo público sólo devuelve identidad pública, contenido de proyección, precio autorizado y disponibilidad derivada. No devuelve costo, margen, proveedor, almacenes, movimientos, auditoría, usuarios, clientes, fiscalidad ni secretos. Cantidades exactas no se exponen: Disponible, Pocas unidades o Agotado.

## Carrito, reserva y pedidos

El carrito vive en la interfaz, pero checkout vuelve a resolver producto, precio, ITBIS y disponibilidad en servidor. Rechaza precios manipulados, cantidades inválidas, empresas distintas y replay mediante idempotencia. La reserva dura 15 minutos y descuenta disponibilidad proyectada; confirmar crea un movimiento Business `sale` con origen del pedido WEB. Cancelar libera la reserva. Pedido y factura son entidades distintas; PaymentProvider permanece `not-configured` y nunca se almacena tarjeta.

## Multiempresa y branding

Slugs, proyecciones, pedidos y reservas están limitados por tenant/company. El storefront consume nombre, logo, color, teléfono y dirección de onboarding. La misma ruta `/store/[company]` sirve distintas empresas sin compartir catálogo o carrito. Commerce se habilita al realizar la primera publicación autorizada y puede permanecer deshabilitado en empresas sin tienda.

## PostgreSQL y seguridad

`0007_commerce_publication_engine.sql` crea proyecciones, pedidos y reservas con constraints, índices, idempotencia y RLS forzada. Las operaciones se serializan en la transacción del Business Store, por lo que dos compradores no reservan la última unidad. La superficie local no se indexa y no contiene dominio, transportista o proveedor de pagos.

## Auditoría local

- Business: `http://localhost:3000/business/empresa-limpia-c7` → **Commerce / Tienda**.
- Storefront directo: `http://localhost:3000/store/empresa-limpia-c7`.
- Showroom de referencia desacoplado: `http://localhost:3000/proyectos/lf-printer`.
- Control Plane: `http://localhost:3000/laex/business`.

Recorrido: crear producto en Inventario → registrar movimiento → comprobar storefront vacío → Commerce / Tienda → Publicar → abrir Showroom → reservar → volver a Commerce → confirmar → comprobar inventario, disponibilidad y auditoría.

## Pendiente

Expirador programado de reservas, persistencia normalizada dual completa desde el store genérico, edición visual avanzada de galería/promoción/SEO, ficha dinámica individual, rate limiter distribuido, caché/invalidation distribuida, PaymentProvider real, transportista, dominio/indexación, métricas de conversión y prueba formal de penetración. No se activaron Marketplace, WhatsApp, Web3, DGII, IA externa ni datos reales.
