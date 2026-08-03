# PROPUESTA PARA CIERRE DE FASE 2 — PERSISTENCIA Y SESIÓN

## Estado y criterio de cierre

El avance es sólido y honesto. La base de seguridad está bien orientada: el dominio multi-tenant, el control central de capacidades, el filtrado por `tenantId`/`workspaceId`, las invariantes de propietarios y la auditoría ya son comprobables. Hoy la fase no puede declararse cerrada porque `MemoryRepositories` no es durable y `MediaSessionResolver` todavía no está conectado a una identidad verificada en servidor.

Se propone cerrar la fase en dos compuertas. La primera implementa y verifica persistencia y sesión exclusivamente contra Firebase Emulator Suite. La segunda, separada y sujeta a aprobación, promueve la misma configuración al proyecto oficial. Ningún paso de la primera compuerta escribirá datos en la infraestructura oficial.

## Diagrama de datos

```text
Firebase Auth user (uid)
        │
        │ 1:N
        ▼
Membership ───────── N:1 ───────── Workspace
  tenantId                         tenantId
  workspaceId                      ownerUserId
  userId                           status
  role                             lifecycle dates
  capabilityOverrides                  │
  status                                ├── 1:1 WorkspacePreferences
                                        ├── 1:N Invitation
                                        └── 1:N AuditEvent (append-only)

Clave de aislamiento en toda lectura/escritura: tenantId + workspaceId
Identidad confiable: uid verificado en servidor → userId
Tenant activo: derivado de membresía válida; nunca aceptado desde el cliente
```

Colecciones propuestas:

- `mediaWorkspaces/{workspaceId}`
- `mediaMemberships/{membershipId}`
- `mediaInvitations/{invitationId}`
- `mediaWorkspacePreferences/{workspaceId}`
- `mediaAuditEvents/{eventId}`

Todos los documentos conservan `tenantId` y `workspaceId` cuando corresponda. Se crearán índices compuestos para membresías activas por usuario/workspace, propietarios activos, workspaces por tenant y auditoría ordenada por fecha. La unicidad lógica de una membresía activa por usuario y workspace se protegerá con identificador determinista o documento de guardia dentro de una transacción.

## Estrategia recomendada

Mantener Firebase Auth como proveedor de identidad existente y adoptar Firestore como adaptador durable del dominio, sin acoplar las interfaces de aplicación al SDK. La sesión de Media Intelligence debe resolverse en servidor mediante una cookie de sesión `HttpOnly`, `Secure` en producción y `SameSite=Lax`, emitida después de verificar el ID token de Firebase. El resolver obtiene exclusivamente el `uid` verificado; la pertenencia y el tenant activo se resuelven desde la persistencia.

El trabajo se ejecutará primero con Auth Emulator y Firestore Emulator. La aplicación fallará de forma cerrada si la configuración de servidor está ausente o si se intenta utilizar el adaptador durable sin un entorno permitido. `MemoryRepositories` permanecerá disponible sólo para pruebas unitarias y demos marcadas.

Las operaciones que afectan varias entidades pasarán por un puerto transaccional. Como mínimo: creación de workspace + membresía propietaria + auditoría; cambio/remoción de propietario + auditoría; aceptación de invitación + membresía + auditoría. La autorización permanecerá en `WorkspaceAccessService`; las reglas de Firestore serán una segunda barrera, no el motor principal de permisos.

## Alternativas evaluadas

### PostgreSQL

Es la opción más fuerte para constraints, transacciones y consultas de auditoría. Se descarta para este cierre porque introduce un proveedor, migraciones y operación nuevos antes de aprobar infraestructura, mientras la identidad y otros servicios LAEX ya usan Firebase. Debe reconsiderarse si auditoría analítica, joins complejos o retención regulatoria pasan a ser requisitos centrales.

### Firestore con acceso cliente directo

Reduce implementación, pero se descarta. Obliga a duplicar una parte importante de la autorización en reglas, expone una superficie mayor al navegador y dificulta asegurar que tenant y capacidades provengan sólo de contexto confiable.

### Continuar con memoria o persistencia local del navegador

Sirve para demostración, no para cierre. No ofrece durabilidad compartida, atomicidad real, revocación consistente ni auditoría confiable.

### Firestore server-side directo al proyecto oficial

Es técnicamente viable, pero no se recomienda como primer paso. Mezclaría validación funcional, permisos y datos reales. Los emuladores permiten producir evidencia antes de autorizar credenciales o escrituras oficiales.

## Cambios exactos propuestos

1. Extender el contrato de repositorios con una unidad transaccional y operaciones atómicas; evitar una secuencia de `save` independientes en invariantes críticas.
2. Implementar adaptadores Firestore server-side para las cinco entidades, con consultas siempre acotadas por tenant/workspace e índices declarados.
3. Mover la generación de IDs y timestamps al borde transaccional cuando sea necesario y usar timestamps de servidor en persistencia.
4. Implementar configuración separada de Firebase cliente y servidor; las credenciales administrativas nunca se importarán desde componentes cliente.
5. Crear intercambio de ID token por cookie de sesión, revocación de cookie y resolver de actor server-side.
6. Derivar `userId` del token verificado y `tenantId` de una membresía activa; rechazar tenant/workspace recibidos como autoridad desde headers, query o body.
7. Añadir guardas CSRF/origin a las mutaciones basadas en cookie y no registrar tokens ni cookies.
8. Declarar reglas e índices de Firestore. La escritura de las colecciones de Media Intelligence quedará reservada al backend; el cliente no tendrá escritura directa.
9. Mantener un selector explícito `memory | emulator | production`, con `production` deshabilitado hasta aprobación.
10. Añadir pruebas de contrato compartidas para memoria y Firestore Emulator, más pruebas de sesión, atomicidad y reglas.

## Archivos afectados

Archivos existentes a modificar:

- `modules/media-intelligence/domain/repositories.ts`: puerto transaccional y contratos requeridos por las operaciones atómicas.
- `modules/media-intelligence/application/WorkspaceAccessService.ts`: ejecutar mutaciones críticas dentro de la unidad transaccional.
- `modules/media-intelligence/server/authorization.ts`: integrar el resolver real y mantener el workspace del cliente como dato no confiable.
- `modules/media-intelligence/infrastructure/memory/MemoryRepositories.ts`: cumplir el contrato transaccional para las pruebas unitarias.
- `src/lib/firebase.ts`: limitarlo explícitamente al SDK cliente y configuración por variables de entorno.
- `modules/auth/services/auth.service.ts`: solicitar/retirar la cookie de sesión tras login/logout, sin reemplazar aún el flujo de identidad existente.
- `package.json` y `package-lock.json`: dependencias y scripts de emuladores/pruebas.
- `.gitignore`: artefactos locales de emulador, nunca credenciales.
- `docs/media-intelligence/DATA-MODEL.md`, `AUTHORIZATION.md`, `AUDIT.md` y `REPORT-X04-PHASE-2.md`: reflejar implementación durable y evidencia final.

Archivos nuevos previstos:

- `src/lib/firebase-admin.ts`: inicialización server-only y validación estricta de entorno.
- `modules/media-intelligence/infrastructure/firestore/FirestoreRepositories.ts`: adaptadores durables.
- `modules/media-intelligence/infrastructure/firestore/converters.ts`: conversión y validación de documentos.
- `modules/media-intelligence/infrastructure/repositories.ts`: composición por entorno.
- `modules/media-intelligence/server/FirebaseMediaSessionResolver.ts`: verificación de cookie y resolución de actor.
- `app/api/auth/session/route.ts`: creación y revocación de cookie.
- `firebase.json`, `firestore.rules` y `firestore.indexes.json`: emuladores, denegación de acceso cliente e índices.
- `tests/media-intelligence/repository-contract.test.ts`: contrato común memoria/emulador.
- `tests/media-intelligence/session.test.ts`: cookie válida, expirada, revocada y manipulada.
- `tests/media-intelligence/transactions.test.ts`: rollback ante fallos parciales y carreras sobre propietarios.
- `tests/media-intelligence/firestore-rules.test.ts`: rechazo de acceso directo y aislamiento.

La ubicación exacta del endpoint podrá ajustarse a las convenciones de Next.js 16 documentadas localmente antes de implementar; no se asumirá una API de versiones anteriores.

## Riesgos y mitigaciones

- **Doble fuente de sesión:** Firebase cliente y cookie servidor pueden desincronizarse. Mitigación: cookie corta, renovación controlada, revocación en logout y estado `loading/error` explícito.
- **Escalada por tenant manipulado:** mitigación: derivar usuario del token y tenant de membresía; jamás confiar en tenant enviado por navegador.
- **Carreras sobre el último propietario:** mitigación: lectura y escritura en la misma transacción, con precondición y prueba concurrente.
- **Fallo parcial de creación:** mitigación: workspace, owner y auditoría en una transacción; nada queda creado si una escritura falla.
- **Índices o reglas incompletos:** mitigación: configuración versionada y suite contra emulador en CI.
- **Auditoría no verdaderamente inmutable:** la cuenta de servicio podría modificarla. Mitigación inicial: interfaz append-only, reglas sin acceso cliente, monitoreo; exportación/WORM queda como decisión de producción.
- **Credenciales administrativas expuestas:** mitigación: módulo `server-only`, variables separadas y comprobación de que no entren al bundle cliente.
- **Migración de datos demo:** mitigación: no migrarlos automáticamente; usar fixtures identificados y un importador separado sólo si Arquitectura lo aprueba.
- **Dependencia del proveedor:** mitigación: conservar puertos y pruebas de contrato independientes de Firestore.

## Pruebas que se repetirán

Se repetirá la suite actual completa de 15 casos: cinco prohibiciones cruzadas, workspace manipulado, aislamiento de auditoría, restricciones de editor y viewer, miembro removido, último propietario, auto-reducción, override explícito, creación conjunta y archivo/recuperación. La línea base actual es **15/15 aprobadas** mediante `npm run test:media`.

Además se exigirán:

- La misma suite contra Firestore Emulator, sin cambiar expectativas.
- Persistencia después de reiniciar el proceso de aplicación/emulador con datos importados.
- Rollback total si falla cualquiera de las escrituras de una operación múltiple.
- Dos intentos concurrentes de retirar propietarios sin dejar el workspace sin owner.
- Cookie ausente, expirada, revocada, manipulada y perteneciente a usuario removido.
- Rechazo de `tenantId`, `userId` o `workspaceId` falsificados.
- Denegación de lectura/escritura directa desde el SDK cliente.
- Sanitización de token, cookie, password, credential, secret y authorization en auditoría.
- Build, lint y comprobación de que secretos de servidor no aparecen en bundles cliente.

## Plan de rollback

1. Mantener el adaptador en memoria y el selector de repositorio durante toda la validación; no borrar el camino actual en esta fase.
2. Desplegar el adaptador durable desactivado. La activación será por variable de entorno y por ambiente.
3. Ante fallos antes de producción, volver a `memory` y restaurar el snapshot/export del emulador; no habrá impacto oficial.
4. En una promoción aprobada, realizar export previo, activar primero en un ambiente controlado y conservar compatibilidad de lectura durante una ventana definida.
5. Si falla la sesión nueva, desactivar el endpoint/cookie y volver al flujo anterior de Firebase Auth; las rutas Media Intelligence permanecerán cerradas, no degradadas a autorización cliente.
6. Si falla una migración o índice, desactivar mutaciones, revertir la configuración/deploy y restaurar desde el export. No ejecutar migraciones destructivas en Fase 2.
7. Los eventos de auditoría ya escritos no se borrarán durante rollback; se marcará el incidente mediante un evento compensatorio.

## Recomendación de aprobación

Aprobar la implementación de la primera compuerta: adaptador Firestore, transacciones y sesión server-side contra emuladores, con suite de contrato y seguridad. No aprobar todavía credenciales, migraciones ni escrituras contra el proyecto Firebase oficial. La conexión oficial debe ocurrir sólo después de presentar evidencia reproducible y aceptar por separado reglas, índices, retención, observabilidad y ventana de rollback.

**Conclusión:** el avance es sólido y honesto. La base de seguridad está bien orientada. Ahora debemos convertir esa arquitectura comprobable en seguridad durable sin apresurar la conexión con la infraestructura oficial.
