# Capítulo 3 — Promoción del Business Engine al núcleo de LAEX

**Estado:** Implementado — listo para auditoría de CEO y Arquitectura  
**Fecha:** 2026-08-08  
**Push:** No realizado  
**Siguiente capítulo:** No iniciado

## Ubicación definitiva

El único Business Engine oficial se encuentra en:

`modules/business-engine/`

Esta ubicación no depende de rutas de laboratorio ni de LF-PRINTER. El módulo publica contratos de dominio, servicios de aplicación, persistencia, identidad de servidor, POS, políticas de pago y frontera de facturación electrónica.

## Arquitectura resultante

```text
LAEX / futuras aplicaciones
  → /api/business-engine
  → adaptadores HTTP oficiales
  → identidad + autorización en servidor
  → servicios del Business Engine
  → SQLite durable / transacciones / auditoría

Laboratorio LF-PRINTER
  → /api/laboratory/business-engine
  → bootstrap piloto LF-PRINTER
  → mismos adaptadores HTTP oficiales
  → mismo Business Engine

Centro de Asistentes
  → orquestador local demostrativo
  → autorización
  → mismo Business Engine
  → auditoría
```

No existe una copia productiva del motor dentro del laboratorio.

## Componentes promovidos

- Contexto `tenantId + companyId` y aislamiento empresarial.
- Identidad, sesiones firmadas, usuarios y membresías.
- Contrato oficial de capacidades.
- Clientes, recepción, equipos y taller.
- Inventario por movimientos.
- Compras y recepciones.
- Cotizaciones, facturación, pagos y caja.
- Entrega, historial, eventos y auditoría.
- Idempotencia, transacciones y rollback.
- Persistencia durable SQLite.
- POS y políticas de pagos.
- Preparación `ElectronicInvoicingProvider` para e-CF/e-NCF.
- Orquestador local de LIA, ALAN y ETHAN, todavía sin IA externa.

## Separación oficial y piloto

El runtime oficial ya no crea usuarios, productos, almacenes ni inventario de LF-PRINTER. Tampoco contiene acciones demostrativas.

LF-PRINTER se configura exclusivamente en:

`modules/business-engine/pilots/lf-printer/runtime.ts`

El adaptador piloto define sus identificadores, credenciales de laboratorio, producto inicial y almacén. Su migración reconoce el movimiento inicial histórico y evita duplicar existencia.

## Rutas funcionales

### Oficiales

- `GET|POST /api/business-engine`
- `POST|DELETE /api/business-engine/session`
- `GET|POST /api/business-engine/assistants`

Estas rutas no aprovisionan datos demostrativos. Operan únicamente con identidades y membresías existentes.

### Laboratorio

- `GET|POST /api/laboratory/business-engine`
- `POST|DELETE /api/laboratory/business-engine/session`
- `GET|POST /api/laboratory/business-engine/assistants`
- `/laboratorio/business-engine`

Las rutas del laboratorio aprovisionan el piloto y después delegan en los mismos manejadores oficiales.

## Componentes que permanecen exclusivos del laboratorio

- UI de auditoría en `/laboratorio/business-engine`.
- Inicio automático con credenciales demostrativas.
- Formularios y datos de ejemplo de LF-PRINTER.
- Identidad visual del laboratorio y representación no fiscal de prueba.
- Bootstrap piloto con producto, almacén y existencia inicial.

## Límites conservados

- IA/NLP externa: desconectada.
- DGII real, certificados, firma y transmisión: desconectados.
- Blockchain/Web3: desconectado.
- Pagos externos reales: desconectados.
- Commerce Engine: no iniciado.

## Riesgos encontrados

1. La persistencia durable conserva el agregado en JSON dentro de SQLite; antes de alta concurrencia debe normalizarse y versionarse con migraciones formales.
2. Un usuario con múltiples membresías obtiene actualmente la primera membresía activa al iniciar sesión; falta selección explícita de empresa.
3. Las capacidades están formalizadas, pero falta una consola administrativa para roles, asignaciones y revocaciones.
4. El secreto local de sesión es sólo para desarrollo; producción exige secreto gestionado externamente.
5. Los servicios internos conservan nombres históricos de `chapter-two`; son una deuda nominal, no una segunda implementación ni dependencia del laboratorio.
6. El laboratorio usa credenciales conocidas y nunca debe exponerse como acceso productivo.

## Deuda técnica pendiente

- Esquema relacional normalizado e índices por tenant/empresa.
- Migraciones de base versionadas y pruebas de restauración.
- Selector de empresa y administración de roles.
- Backups, rotación de secretos y observabilidad operativa.
- Proveedor de identidad productivo/federado.
- Certificación fiscal y proveedor DGII real en su capítulo.
- AI Engine con comprensión natural, evaluación y gobernanza en su capítulo.

## Validación obligatoria

- Pruebas heredadas del Capítulo 2: 22/22 aprobadas.
- Pruebas nuevas de frontera de promoción: 3/3 aprobadas.
- Suite total: 25/25 aprobadas.
- TypeScript: aprobado.
- ESLint: aprobado.
- Build Next.js 16.2.9: aprobado, 72 rutas/páginas generadas.
- Contrato en ejecución: ruta oficial sin identidad responde 401; laboratorio autentica al piloto y expone su estado aislado.
- Rutas de taller, compras, cotizaciones, POS, asistentes y e-CF preparado permanecen compiladas y cubiertas.

## Confirmación arquitectónica

- LAEX es el producto.
- LF-PRINTER continúa funcionando como primer cliente piloto.
- El laboratorio continúa siendo el entorno de validación.
- Business Engine es infraestructura oficial reutilizable y no depende de LF-PRINTER.

