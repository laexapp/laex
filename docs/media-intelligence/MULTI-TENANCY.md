# Multi-tenancy y aislamiento

## Frontera

`WorkspaceId` nunca se usa solo. Toda operación recibe `tenantId + workspaceId`; los repositorios construyen claves compuestas y filtran ambos valores.

## Secuencia obligatoria

1. Resolver identidad en servidor.
2. Derivar `tenantId` desde la sesión, nunca desde un campo del cliente.
3. Recibir el `workspaceId` como dato no confiable.
4. Buscar el workspace dentro del tenant autenticado.
5. Verificar estado del workspace.
6. Buscar membresía activa del usuario.
7. Evaluar capacidad y overrides.
8. Ejecutar operación con el mismo scope.
9. Auditar resultado.

## Prevención de acceso cruzado

El servicio devuelve `WorkspaceAccessDeniedError` tanto para recursos ajenos como inexistentes, reduciendo filtración de existencia. Un identificador válido de otro tenant no encuentra recurso dentro del scope autenticado.

## Estado actual

La política está implementada y probada en dominio. La ruta visual todavía usa datos demo porque Auth no ofrece un resolver de sesión multi-tenant aprobado y no existe almacenamiento durable seleccionado. No se afirma aislamiento productivo hasta integrar ambos componentes.

