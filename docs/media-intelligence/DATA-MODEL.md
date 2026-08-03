# Modelo de datos — Fase 2

## Workspace

Frontera principal de aislamiento. Campos base: `id`, `tenantId`, `ownerUserId`, nombre, tipo, identidad visual, estado, fechas de creación/actualización, archivado y solicitud de eliminación. La eliminación destructiva no está implementada.

Estados: `active`, `suspended`, `archived`, `pending_deletion`.

## Membership

Relaciona usuario y workspace: rol, overrides de capacidades, estado, fechas y remoción lógica. Un usuario eliminado deja de ser elegible para cualquier autorización.

Estados: `active`, `suspended`, `removed`.

## Invitation

Pertenece a tenant y workspace. Conserva hash de correo —no el correo completo en el dominio—, rol propuesto, invitador, expiración y estado. No permite invitar como propietario.

Estados: `pending`, `accepted`, `revoked`, `expired`.

## WorkspacePreferences

Locale, zona horaria, objetivos y etiquetado de datos simulados. `defaultApprovalRequired` es `true` por contrato en v1.

## AuditEvent

Actor, tenant, workspace, acción, recurso, fecha, resultado, origen, cambios sanitizados, error y trace ID. Claves relacionadas con tokens, secretos, contraseñas, credenciales, autorización o cookies se excluyen.

## Persistencia

Los puertos de repositorio son independientes del almacenamiento. El adaptador actual es `MemoryRepositories`, apto para pruebas y demostración del contrato, no durable ni productivo. La selección de almacenamiento definitivo requiere autorización de Arquitectura antes de implementar migraciones.

