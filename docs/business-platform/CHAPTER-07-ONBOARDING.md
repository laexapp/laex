# Capítulo 7 — Onboarding empresarial, identidad y puesta en marcha

Estado: completado técnicamente y listo para auditoría de preproducción local.

## Recorrido oficial

1. LAEX aprovisiona una empresa desde `/laex/business` con tenant, company, dominio, propietario, sucursal y almacén aislados.
2. El propietario inicia sesión en `/business/{empresa}/login`.
3. Si la configuración no está completada, el servidor dirige a `/business/{empresa}/onboarding`.
4. El propietario completa identidad, datos fiscales informativos, ubicaciones, usuarios, productos, inventario de apertura, caja, documentos y revisión.
5. Cada escritura pasa por identidad, capacidades, servicio empresarial, transacción PostgreSQL y auditoría.
6. Al completar la revisión se habilita `/business/{empresa}`.

## Reglas de datos

- PostgreSQL es la persistencia oficial; SQLite sólo pertenece al laboratorio.
- Una empresa nueva no recibe clientes, productos, inventario, facturas ni operaciones demo.
- El inventario inicial se registra como movimiento fechado, con motivo, referencia, costo y usuario; no se altera una existencia directamente.
- Productos, usuarios, ubicaciones y caja se crean mediante comandos autorizados del Business Engine.
- La marca configurada por la empresa se resuelve dinámicamente en su acceso. El logo maestro de LF-PRINTER identificado para su tenant es `assets/lf-printer/official-source/brand/LFPRINTER-LOGO-MASTER.png`.
- DGII/e-CF real, IA externa, Commerce, Web3 y pagos externos permanecen deshabilitados.

## Empresa de auditoría

- Nombre: Empresa Limpia C7
- Slug: `empresa-limpia-c7`
- Estado: trial
- Acceso: `/business/empresa-limpia-c7/login`
- Onboarding: `/business/empresa-limpia-c7/onboarding`
- Área empresarial: `/business/empresa-limpia-c7`

La prueba crea la empresa sin datos demo, completa el onboarding, registra un producto y cinco unidades mediante inventario de apertura, abre caja y ejecuta una venta auditada. La marca de LF-PRINTER no se comparte con este tenant.

## LF-PRINTER real

No se ha aprovisionado ni cargado con datos reales por código. La ruta prevista es `/business/lf-printer/login`; sólo debe activarse después de que CEO aporte y valide la información oficial y el propietario complete el onboarding.

## Datos requeridos del CEO

- razón social y nombre comercial definitivos;
- RNC y condición fiscal, sin habilitar todavía DGII real;
- dirección, teléfono, WhatsApp y correo empresarial;
- dominio/subdominio oficial;
- identidad y correo del propietario inicial;
- sucursal principal y almacenes;
- moneda, zona horaria, fecha real de inicio operativo y formato de impresión;
- usuarios iniciales y sus roles;
- catálogo inicial y conteo de inventario con fecha de corte, costo, motivo y referencia;
- monto autorizado para la primera apertura de caja.

## Validación

- TypeScript: aprobado.
- ESLint del alcance: aprobado.
- Suite Business Engine: 42/42 aprobadas en ejecución secuencial contra PostgreSQL cuando corresponde.
- Prueba específica de onboarding: 3/3 aprobadas.
- Build Next.js de producción: aprobado.
- No se realizó push.

Las suites PostgreSQL que reemplazan estados completos deben ejecutarse secuencialmente sobre una misma base de pruebas; ejecutarlas en paralelo puede generar interferencia entre fixtures independientes.
