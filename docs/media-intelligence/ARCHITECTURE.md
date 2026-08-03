# LAEX Media Intelligence — Arquitectura v1

## Propósito

Media Intelligence es un producto multi-tenant del ecosistema LAEX para transformar una pieza de información en contenido estructurado, revisable, distribuible y medible. No depende de que el proyecto exista en el catálogo de LAEX.

## Límites de Fase 1

Esta fase implementa experiencia, navegación, contratos de dominio, permisos, aislamiento lógico, plugins, abstracción de IA, versionado y Centro de Aprendizaje. No implementa persistencia, OAuth, tokens, colas, proveedores de IA ni publicación externa.

## Dependencias

```text
UI / Casos de uso
       ↓
Media Intelligence Core v1
  ├── tenant context + permissions
  ├── content / campaign contracts
  ├── AIProvider port
  ├── TaskQueue port
  └── MediaConnector port
              ↑
        Plugins externos
```

El Core nunca importa implementaciones de YouTube, Meta, TikTok o proveedores de IA. Los adaptadores implementarán puertos estables del Core.

## Aislamiento multi-tenant

Toda entidad persistente futura debe incluir `tenantId` y, cuando corresponda, `workspaceId`. Ninguna operación de repositorio aceptará identificadores sueltos: recibirá un `TenantContext` autenticado y aplicará ambos filtros en el servidor.

Reglas obligatorias:

- La identidad determina el `tenantId`; nunca llega desde un campo editable del cliente.
- El acceso a un workspace se valida antes de construir repositorios o comandos.
- Índices y claves de idempotencia incluyen tenant y workspace.
- Tokens se cifran por conexión y jamás se entregan al navegador.
- Logs, colas, objetos y analytics conservan tenant, workspace y trace ID.
- Exportación, borrado y retención se ejecutan por tenant.
- Las pruebas de repositorio incluyen intentos explícitos de acceso cruzado.

## Roles y permisos

Roles v1: `owner`, `admin`, `editor`, `analyst`, `reviewer`, `viewer`. Las capacidades están definidas como permisos, no como condiciones dispersas en la UI. La autorización real deberá repetirse en el servidor; ocultar un botón no constituye seguridad.

## Flujo futuro

```text
Fuente autorizada
  → Ingestion command
  → Orquestador
  → Cola con idempotencia
  → Connector plugin
  → API oficial
  → Resultado normalizado
  → Analytics collector
  → Read models del workspace
```

Las tareas tendrán reintentos exponenciales, `dead-letter queue`, límites por tenant, cancelación, prioridad e idempotencia. Los resultados terminales nunca se reintentan automáticamente.

## IA como servicio

`AIProvider` separa capacidades (`transcribe`, `understand`, `generate`, `moderate`, `embed`) de marcas o modelos. Un router futuro seleccionará proveedor/modelo según política del tenant, idioma, coste, sensibilidad y disponibilidad. Cada salida conservará proveedor, modelo, versión de prompt, política y procedencia.

## Versionado

- Ruta de producto estable; contratos internos con versión explícita.
- `MediaIntelligenceVersion` inicia en `v1`.
- Eventos y tareas incluyen versión de esquema.
- Plugins declaran versión y matriz de compatibilidad.
- Lecturas pueden migrarse progresivamente; nunca se reescriben historiales sin auditoría.
- Cambios incompatibles se introducen detrás de adaptadores y migraciones.

## Escala objetivo

Para 10,000 usuarios activos, la arquitectura evita estado global por usuario, separa comandos de lecturas, usa trabajos asíncronos para medios y distribución, pagina todas las colecciones y permite cuotas por tenant. El dashboard deberá alimentarse de read models preagregados, no de consultas cruzadas en tiempo real.

## Extensiones futuras

Academy, Community Connect, Creator OS, Social, Analytics IA, Podcast Intelligence, News Intelligence, Event Intelligence, Course Intelligence y Document Intelligence deben consumir contratos públicos o eventos del Core. No se integran en v1.

