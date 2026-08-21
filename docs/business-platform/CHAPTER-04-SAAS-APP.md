# Capítulo 4 — LAEX Business App + Arquitectura SaaS

Estado: **COMPLETADO — listo para auditoría final**  
Fecha de cierre técnico: 2026-08-08

## Entradas oficiales

- Control Plane LAEX: `http://localhost:3000/laex/business`
- LF-PRINTER: `http://localhost:3000/business/lf-printer/login`
- Empresa Demo B: `http://localhost:3000/business/empresa-demo-b/login`
- Laboratorio conservado: `http://localhost:3000/laboratorio/business-engine`

En despliegue SaaS, la resolución se prepara por dominio registrado. Ejemplos objetivo: `sistema.lfprinter.com` o `sistema.empresa-cliente.com`. Las rutas con slug son el acceso de auditoría local y fallback operativo.

## Credenciales de auditoría local

- LF-PRINTER: `owner@lfprinter.local` / `LF-Owner-2026!`
- Empresa Demo B: `owner@demob.local` / `DemoB-Owner-2026!`
- Control Plane: variable `LAEX_CONTROL_PLANE_PASSWORD`; sólo en desarrollo existe fallback `LAEX-Control-2026!`.

Estas credenciales son exclusivamente de auditoría/desarrollo. Producción exige secretos externos, HTTPS y rotación.

## Separación lograda

### LAEX Control Plane

Administra tenants, empresas, dominio, estado, módulos y aprovisionamiento. Puede activar, suspender o cancelar una empresa sin borrar sus datos. No expone clientes, ventas, inventario, facturas ni caja de una compañía.

### LAEX Business App

Es el producto oficial empresarial. Resuelve empresa antes del acceso, exige credenciales y membresía concordantes, muestra únicamente módulos habilitados y reutiliza el mismo Business Engine aprobado. No ejecuta bootstrap automático de laboratorio.

### Laboratorio

Permanece disponible para auditoría y demostración. Su bootstrap y credenciales demo están aislados detrás de rutas `/api/laboratory/*`; no forman parte del runtime oficial.

## Modelo SaaS y despliegue dedicado

Una única base de código soporta:

1. SaaS multiempresa: dominio → resolución de compañía → login → membresía → contexto tenant/company.
2. Instancia dedicada: mismo código con dominio, base de datos y secretos independientes mediante configuración de despliegue.
3. Navegador como cliente: no requiere instalar software de escritorio.

LF-PRINTER y Empresa Demo B poseen tenant, company, usuario, almacén, producto, inventario, configuración y dominio separados. Un token emitido para LF-PRINTER recibe 401 al intentar consultar el contexto de Demo B.

## Persistencia

SQLite durable continúa activo para no destruir ni migrar prematuramente datos ya validados. Se incorporó la migración base PostgreSQL en `modules/business-engine/infrastructure/postgres/migrations/0001_saas_core.sql` y la decisión de transición, respaldos y recuperación en `CHAPTER-04-PERSISTENCE-DECISION.md`.

La migración a PostgreSQL se hará por etapas: esquema y restricciones, copia verificada, doble validación, corte controlado y rollback. Las copias deben cifrarse, probar restauración y conservarse por tenant/entorno.

## Seguridad e identidad

- Sesión firmada en servidor.
- Selección explícita cuando un usuario pertenece a varias empresas.
- Validación de membresía activa y estado de empresa en cada solicitud.
- Concordancia obligatoria entre compañía de la ruta y compañía de la sesión.
- Control Plane con identidad y cookie separadas.
- Dominio único por empresa.
- Capacidades y roles almacenados por tenant/company.
- Suspensión sin borrado ni pérdida de evidencia.
- Auditoría e idempotencia conservadas en el Business Engine.

La interfaz de Configuración expone identidad empresarial, almacén, módulos y alcance de roles. Invitaciones avanzadas, consola completa de asignación granular y revocación central de todas las sesiones quedan como endurecimiento productivo previo al onboarding externo; no se simulan como terminadas.

## Validaciones ejecutadas

- ESLint: aprobado sin errores ni advertencias.
- TypeScript: aprobado.
- Build productivo Next.js: aprobado; 75 páginas generadas y rutas dinámicas Business App/Control Plane reconocidas.
- Suite Business Engine: **28/28 aprobadas**.
- Pruebas nuevas SaaS:
  - selección multiempresa obligatoria;
  - aislamiento con SKU idéntico;
  - dominio único;
  - suspensión sin eliminación.
- HTTP local:
  - ambos logins oficiales: 200;
  - Control Plane: 200;
  - autenticación LF-PRINTER: 200;
  - autenticación Demo B: 200;
  - intento de usar sesión LF-PRINTER en Demo B: 401.
- Inspección visual automatizada: no ejecutada porque el navegador integrado no estuvo disponible en esta sesión; compilación y pruebas HTTP sí fueron ejecutadas sobre el servidor renderizado.

## Producto, demostración y deuda

Producto oficial: Business Engine, aplicación empresarial, resolución company/tenant, identidad, aislamiento, configuración modular, POS, flujos, auditoría, e-CF desacoplado y orquestador IA local ya aprobados.

Demostración/auditoría: datos iniciales LF-PRINTER, Empresa Demo B, credenciales locales, dominios `.localhost` y proveedor local de asistentes.

Pendiente antes de producción comercial externa: PostgreSQL administrado, secretos reales, correo de invitaciones, recuperación de contraseña, MFA opcional, revocación global de sesiones, observabilidad, política formal de retención/backup, dominio/TLS y pruebas visuales en navegadores/dispositivos objetivo.

## Límites respetados

No se conectó DGII real, proveedor externo de IA, Commerce Engine, Marketplace, Web3, pagos reales ni suscripciones. No se eliminó el laboratorio y no se hizo push.
