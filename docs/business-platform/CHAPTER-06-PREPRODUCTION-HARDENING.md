# Capítulo 6 — Hardening de preproducción

Estado: compuerta técnica local aprobada. Capítulo 7 no iniciado.

## Persistencia oficial

La aplicación oficial selecciona PostgreSQL cuando `BUSINESS_DATABASE_URL` está configurada. En producción PostgreSQL es obligatorio. SQLite permanece reservado al laboratorio mediante un runtime y ruta de datos independientes; ninguna ruta oficial ejecuta fixtures ni aprovisionamiento piloto.

El adaptador `PostgresChapterTwoStore` conserva el contrato único del Business Engine, utiliza transacciones `SERIALIZABLE`, advisory lock, rollback y registros por entidad/dominio. Las filas empresariales contienen `tenant_id` y `company_id`; RLS forzada y un trigger impiden escribir fuera del contexto. El acceso global sólo se habilita dentro de transacciones internas de plataforma.

## Migraciones

`business:migrate` aplica archivos ordenados, registra checksum y duración, ignora repeticiones exactas y detiene el despliegue si cambia una migración aplicada. Versiones iniciales: `0001_saas_core`, `0002_operational_control`, `0003_security_invariants`.

## Backup y restauración

`business:backup` crea un snapshot lógico consistente, checksum SHA-256, historial y retención. `business:backup:scheduled` expone el mismo procedimiento para un scheduler externo. `business:restore-test` restaura en un esquema temporal, verifica conteos, elimina el esquema aislado y marca la prueba como aprobada. Nunca restaura sobre las tablas activas.

Antes de Internet, el directorio de backups debe montarse en almacenamiento cifrado externo y el scheduler debe administrarse fuera del proceso web.

## Secretos y sesiones

Con PostgreSQL activo no se aceptan fallbacks conocidos. `BUSINESS_SESSION_SECRET`, `LAEX_CONTROL_PLANE_SECRET` y `LAEX_CONTROL_PLANE_PASSWORD` son externos al repositorio y faltantes provocan fallo seguro. Los fallbacks sólo pueden habilitarse explícitamente en desarrollo sin PostgreSQL. Las cookies de negocio y Control Plane continúan separadas, HttpOnly, Secure en producción y SameSite estricto en el acceso empresarial.

## Validación

- PostgreSQL 18 con usuario no-superusuario.
- Migraciones repetibles por checksum.
- Persistencia, rollback y RLS cruzada sobre PostgreSQL real.
- Backup poblado y restauración aislada aprobada.
- SQLite piloto conservado sin migración.
- 39 pruebas aprobadas, TypeScript, ESLint y build productivo aprobados.

## Deuda aceptada de preproducción

- El adaptador serializa escrituras globales para preservar la semántica transaccional del motor actual; antes de alta concurrencia debe evolucionar a repositorios por agregado sin cambiar las reglas de dominio.
- El almacenamiento cifrado/remoto y el scheduler dependen del entorno de despliegue y no se conectaron en local.
- No se migraron datos piloto ni se aprovisionó una empresa real.
