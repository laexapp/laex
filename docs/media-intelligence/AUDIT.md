# Auditoría

Se registran éxitos y rechazos con actor, tenant, workspace, acción, recurso, timestamp, resultado, origen, cambios, error y trace ID.

Eventos implementados: autorización denegada, creación de workspace, invitación, cambio de rol, remoción de miembro, archivado y recuperación.

## Privacidad

La sanitización excluye campos cuyos nombres indiquen token, secreto, contraseña, credencial, autorización o cookie. Los documentos no guardan valores de credenciales ni secretos.

## Retención futura

El almacenamiento durable deberá ser append-only, paginado y exportable por tenant. La retención y acceso mediante `audit.read` se definirán antes de producción. El adaptador en memoria actual sirve exclusivamente para verificar contratos.

