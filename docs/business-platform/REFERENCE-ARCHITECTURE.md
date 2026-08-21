# Arquitectura de referencia y plan de ejecución

## 1. Límites del sistema

La unidad comercial y de aislamiento es el **tenant**. Una empresa operativa pertenece a un tenant y puede contener sucursales. Un usuario solo actúa mediante una membresía vigente y un contexto resuelto en servidor. `tenantId`, `companyId`, `userId`, roles y capacidades nunca se aceptan como autoridad desde formularios, query strings o headers controlados por el cliente.

```text
Identidad verificada
  → membresía y empresa activa
    → autorización por capacidad
      → comando idempotente
        → transacción del dominio
          → eventos + auditoría + read models
```

Para evitar enumeración, un recurso ajeno y uno inexistente producen la misma respuesta externa. Toda clave, consulta, archivo, evento, métrica y registro de auditoría conserva el ámbito del tenant.

## 2. Núcleo y dominios

El núcleo compartido debe permanecer pequeño:

- identidad, tenants, empresas, sucursales, usuarios y capacidades;
- catálogo de módulos y configuración por empresa;
- contratos de comandos, eventos, idempotencia y auditoría;
- dinero, impuestos, numeración documental y períodos contables;
- archivos, notificaciones, trabajos y observabilidad.

Los dominios empresariales se implementan como módulos independientes: terceros (clientes/proveedores), catálogo e inventario, compras, ventas, cotizaciones, facturación, tesorería, cuentas por cobrar/pagar, taller, contabilidad, impuestos, reportes y agentes. Un módulo no escribe directamente en el almacenamiento privado de otro; solicita un comando o reacciona a un evento versionado.

## 3. Consistencia de procesos

Dentro de un dominio se usan transacciones ACID. Entre dominios se usa un flujo orquestado con outbox durable, consumidores idempotentes, reintentos acotados y compensaciones explícitas. La interfaz muestra un único `operationId`, aunque internamente existan varios pasos.

El cierre de una orden de taller es una saga, no una cadena de llamadas desde la UI:

1. validar orden, repuestos, servicios, impuestos y período;
2. reservar o consumir inventario;
3. emitir venta y documento fiscal conforme a la jurisdicción configurada;
4. registrar cuentas por cobrar o pago;
5. cerrar orden e historial;
6. publicar read models y documento imprimible.

Si un paso falla, la operación queda recuperable y visible; nunca se marca como finalizada anticipadamente.

## 4. Configuración multiempresa

La personalización se modela como datos versionados: marca, dominio, locales, monedas, zonas horarias, reglas fiscales, series documentales, módulos, límites del plan, flujos de aprobación y feature flags. Las extensiones permitidas son contratos o plugins versionados, no forks por cliente.

La modalidad de despliegue cambia adaptadores e infraestructura, no el dominio. SaaS e instalación independiente ejecutan el mismo artefacto versionado y las mismas migraciones.

## 5. Agentes y automatización

La entrada de lenguaje natural se traduce a un plan estructurado. El modelo nunca ejecuta SQL, elige un tenant ni evade autorización. El motor de acciones valida esquema, permisos, precondiciones, límites y política de confirmación antes de ejecutar comandos.

Cada acción de LIA, ALAN o ETHAN registra:

- actor humano, agente, tenant, empresa y trazabilidad;
- intención original y plan estructurado;
- herramientas/comandos autorizados y resultado;
- datos leídos o modificados, con secretos redactados;
- versión de reglas, prompt, modelo y nivel de confianza cuando intervenga IA.

Las reglas deterministas resuelven búsquedas exactas, cálculos, validación, permisos, impuestos, inventario y contabilización. La IA puede desambiguar lenguaje o analizar patrones, pero sus salidas se someten a las mismas reglas.

## 6. Seguridad y operación

Requisitos mínimos antes de datos reales:

- sesión `HttpOnly`, segura en producción y verificada en servidor;
- repositorios siempre acotados por tenant/empresa y defensa adicional en la base;
- cifrado en tránsito y reposo; secretos fuera del repositorio;
- auditoría append-only y exportable por tenant;
- respaldos con pruebas periódicas de restauración;
- límites por tenant, trazas distribuidas y alertas por operaciones fallidas;
- retención, exportación y eliminación conforme a contrato y jurisdicción;
- pruebas automáticas de acceso cruzado para cada repositorio y ruta.

## 7. Decisiones pendientes que sí requieren autoridad

Antes de facturación o contabilidad productiva deben aprobarse jurisdicciones, proveedor fiscal, reglas de numeración, conservación documental, monedas funcionales y tratamiento de impuestos. También requieren decisión contractual las regiones de datos, RPO/RTO, matriz de planes, soporte y alcance de instalaciones independientes.

## 8. Secuencia de entrega

### Fase 0 — Fundaciones

- identidad de servidor, tenant/empresa/sucursal y membresías;
- almacenamiento durable, migraciones y unidad transaccional;
- autorización central, auditoría, outbox e idempotencia;
- configuración de marca, locale, moneda, módulos y planes;
- pruebas negativas de aislamiento y recuperación.

**Salida:** dos tenants de prueba no pueden inferir ni modificar datos entre sí; reinicios y reintentos no duplican operaciones.

### Fase 1 — LF-PRINTER, flujo vertical

- terceros, equipos, catálogo, inventario y taller;
- recepción guiada y automática;
- cotización, venta, cobro y documento no fiscal de prueba;
- historial completo del equipo;
- primera capa de LIA sobre comandos autorizados.

**Salida:** la recepción y cierre de un equipo recorren el flujo completo sin recaptura y sobreviven fallos parciales.

### Fase 2 — Finanzas y cumplimiento

- compras, proveedores, cuentas por pagar/cobrar, caja y bancos;
- integración fiscal aprobada y contabilización por eventos;
- cierres, conciliación y reportes auditables.

**Salida:** totales reconciliables desde documento origen hasta mayor contable y banco.

### Fase 3 — Producto comercial

- aprovisionamiento, suscripciones/licencias, límites y soporte;
- portabilidad, respaldo/restauración e instalación independiente;
- telemetría respetuosa del tenant y operación a escala;
- ALAN y ETHAN sobre datos y acciones gobernados.

**Salida:** alta, operación, actualización, exportación y baja de un tenant con evidencia auditable.

## 9. Estado del repositorio al adoptar este capítulo

Media Intelligence ya contiene contratos de `TenantContext`, membresías, autorización y pruebas de acceso cruzado. Son una referencia útil, no todavía el núcleo empresarial común: usan repositorios en memoria y la documentación existente reconoce que falta conectar una identidad de servidor y persistencia durable. La primera tarea de Fase 0 es extraer y endurecer esos conceptos sin romper los módulos actuales.

No se recomienda comenzar por nuevas pantallas de ERP. El siguiente incremento debe ser el núcleo de identidad y aislamiento productivo; todas las pantallas posteriores dependerán de esa frontera.

