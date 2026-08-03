# Seguridad — Estado de Fase 2

## Implementado

- Scope compuesto tenant/workspace.
- Autorización por capacidad en servicio central.
- Módulo de entrada marcado `server-only`.
- Remoción lógica y protección del último propietario.
- Auditoría sanitizada.
- Errores explícitos de autenticación, autorización, inexistencia e invariantes.
- Pruebas de acceso cruzado y roles.

## No implementado todavía

- Resolver real de sesión LAEX.
- Almacenamiento durable y transacciones reales.
- Rate limiting, CSRF y protección de Server Actions futuras.
- Cifrado por tenant, backups y retención.
- Alertas y almacenamiento append-only de auditoría.
- Invitaciones por correo y aceptación segura.

No debe habilitarse persistencia para usuarios reales hasta cerrar esas dependencias.

