# Capítulo 5 — Operación empresarial y control avanzado

Estado: **implementado para operación controlada y listo para auditoría funcional**  
Fecha: 2026-08-09

## URLs

- Control Plane: `http://localhost:3000/laex/business`
- LF-PRINTER: `http://localhost:3000/business/lf-printer/login`
- Demo B: `http://localhost:3000/business/empresa-demo-b/login`
- Laboratorio, sólo pruebas: `http://localhost:3000/laboratorio/business-engine`

## Usuarios de auditoría Demo B

| Rol | Usuario | Contraseña local |
|---|---|---|
| Propietario | `owner@demob.local` | `DemoB-Owner-2026!` |
| Cajero | `cashier@demob.local` | `DemoB-Cashier-2026!` |
| Inventario | `inventory@demob.local` | `DemoB-Inventory-2026!` |
| Taller | `workshop@demob.local` | `DemoB-Workshop-2026!` |

Son credenciales de auditoría local, nunca secretos de producción.

## Alcance operativo

- La Business App oficial reutiliza las pantallas aprobadas; el laboratorio conserva únicamente su bootstrap de prueba.
- Roles iniciales y capacidades reales: Propietario, Administrador, Supervisor, Cajero, Ventas, Inventario, Compras, Taller, Contabilidad, Consulta y Auditor.
- Menú y datos filtrados por capacidades; cada comando vuelve a autorizarse en servidor.
- Sesiones empresariales registradas, expirables y revocables por propietario o Control Plane.
- Usuarios: creación, rol, activación/desactivación, sucursales y actividad/sesiones.
- Productos: alta, edición por API autorizada, atributos fiscales/comerciales, estado y campos preparados para Commerce.
- Inventario: balances exclusivamente derivados de movimientos; ajustes autorizados y entrada masiva con prevención de duplicados y confirmación de productos nuevos.
- Clientes: alta con prevención por nombre normalizado, teléfono o identificación.
- Compras/recepciones: reutilizan el flujo transaccional aprobado y aumentan inventario mediante movimientos.
- Taller: etapas de diagnóstico, autorización, reparación, control de calidad y finalización con capacidades separadas.
- POS: caja activa obligatoria en empresas oficiales, usuario visible, descuento máximo de 5% sin capacidad de override, pagos mixtos y metadata segura.
- Caja: apertura, fondo, venta, entradas/retiros/devoluciones contractuales, cierre, esperado, contado y diferencia.
- Configuración: identidad fiscal básica, dirección, zona horaria, sucursales y almacenes.
- Auditoría por tenant/company para operaciones administrativas, sesiones y soporte.

## Control Plane

Por empresa expone únicamente metadatos técnicos:

- estado, dominio, módulos, versión y último acceso;
- usuarios y sesiones activas;
- motor/estado de base de datos y aislamiento;
- migraciones;
- backups y su historial;
- integraciones con estados explícitos `disabled` o `not-configured`;
- errores registrados, salud de servicios y almacenamiento;
- revocación de sesiones de una empresa;
- soporte temporal restringido.

El soporte exige razón, dura entre 5 y 60 minutos, crea una sesión restringida a `dashboard.view` y `support.diagnose`, muestra banner permanente, no posee capacidades financieras/fiscales y puede revocarse. Emisión y revocación quedan auditadas.

## Persistencia, backup y migraciones

- SQLite durable sigue siendo el runtime controlado para evitar una migración destructiva.
- Migraciones PostgreSQL versionadas: `0001_saas_core.sql` y `0002_operational_control.sql`.
- Backup manual crea una copia separada, calcula SHA-256 y registra resultado; nunca sobrescribe la base activa.
- Programación automática y restauración productiva permanecen `not-configured` hasta disponer de política de retención, almacenamiento cifrado y entorno aislado. No se simulan.

## Validación ejecutada

- ESLint: aprobado.
- TypeScript: aprobado.
- Build Next.js productivo: aprobado; 78 rutas/páginas reconocidas.
- Suite automatizada: **35/35**.
- HTTP real:
  - propietario Demo B: login 200, rol Propietario, 4 usuarios;
  - cajero Demo B: login 200;
  - cajero intentando crear producto: 403;
  - apertura de caja y venta POS: aprobadas;
  - salud Control Plane: base `healthy`, versión `1.0.0`;
  - soporte restringido: emitido, validado y revocado;
  - backup manual: `completed`;
  - revocación general de sesiones y nuevo login: aprobados.

## Productivo en entorno controlado

Identidad, membresías, roles/capacidades, aislamiento, sesiones, productos, movimientos, clientes, compras, taller, POS, caja, facturas existentes, auditoría, configuración multi-sucursal, observabilidad y soporte restringido.

## Demostrativo o deliberadamente deshabilitado

- LIA, ALAN y ETHAN: orquestador local sin IA externa.
- e-CF: borrador desacoplado, sin firma ni transmisión DGII.
- Pagos con tarjeta: sólo metadata no sensible; no procesa dinero real.
- Commerce: sólo contrato de publicación; no existe storefront/engine.
- Backups programados y restauración: contrato visible, sin scheduler ni restauración sobre datos activos.
- Invitaciones por correo y recuperación externa de contraseña: no conectadas.
- Soporte sensible financiero/fiscal: deshabilitado hasta política legal y autorización explícita.

## Riesgos y deuda antes de producción abierta

- Migrar a PostgreSQL administrado con RLS probado y corte controlado.
- TLS, secretos gestionados, MFA/SSO opcional y política de contraseñas/recuperación.
- Almacenamiento cifrado externo, scheduler de backups y simulacros de restauración.
- Archivos/documentos de proveedores y comprobantes requieren almacenamiento de objetos.
- Contabilidad completa, cuentas por pagar/cobrar y notas operativas avanzadas requieren ampliación de dominio.
- Flujo formal de aprobación de supervisor para anulaciones/devoluciones debe incorporar doble firma; las capacidades están preparadas, pero la acción sensible no se habilita silenciosamente.
- Pruebas visuales automatizadas en navegadores/dispositivos objetivo: pendientes porque el navegador integrado no estuvo disponible en esta sesión.

## Límites respetados

No se conectó DGII, IA externa, Web3, criptomonedas, procesamiento real de tarjetas, Commerce Engine completo, Marketplace ni cobro SaaS. No se hizo push y no se inició el capítulo siguiente.
