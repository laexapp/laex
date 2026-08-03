# Autorización de servidor

`WorkspaceAccessService.authorize` es el punto central de decisión. La UI puede adaptar controles, pero nunca sustituye esta validación.

`authorizeWorkspaceRequest` vive en un módulo `server-only` y trata el identificador del cliente como no confiable. Exige un `MediaSessionResolver` que entregue un actor autenticado con tenant derivado de sesión.

## Decisiones de seguridad

- Ausencia de workspace o membresía produce el mismo rechazo.
- Un override `false` prevalece sobre el rol.
- Un override `true` permite excepciones explícitas administradas fuera del cliente.
- No existe endpoint para autoasignar capacidades.
- El propietario no puede reducir su propio rol.
- El último propietario no puede eliminarse.
- Miembros removidos pierden acceso inmediatamente.
- Archivo y recuperación son auditados; no existe borrado directo.

## Dependencia pendiente

No se modificó Auth. Para uso real, `MediaSessionResolver` debe adaptarse a la sesión LAEX y derivar `userId`/`tenantId` exclusivamente en servidor. Hasta entonces, no se expondrán mutaciones persistentes desde la ruta oficial.

