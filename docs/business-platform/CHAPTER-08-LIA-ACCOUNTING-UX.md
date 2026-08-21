# Capítulo 8 — LIA operativa, Contabilidad/Reportes y cierre UX

Estado: implementado hasta las fronteras autorizadas y listo para auditoría local.

## Recorrido

- Control Plane: `/laex/business`
- Empresa de auditoría: `/business/empresa-limpia-c7/login`
- Aplicación: `/business/empresa-limpia-c7`
- Reportes/Contabilidad: menú `Reportes / Contabilidad`
- LIA: menú `Centro de Asistentes`
- Seguridad: menú `Configuración` → `Identidad y acceso seguro`
- Activación de un solo uso: `/business/{empresa}/activate?token=...`

## Implementado

- Dashboard sin SKU demo: productos, unidades, taller pendiente y facturado.
- Diferenciación textual entre estado técnico y estado comercial administrado por Control Plane.
- Clientes ilimitados, búsqueda por varios atributos, prevención de duplicados, edición auditada y conteo de equipos/cotizaciones/facturas.
- Formularios de producto, inventario y entrada masiva con etiquetas, ayuda contextual, contraste y pasos visibles.
- Cierre de sesión visible del Control Plane que elimina sólo `laex_control_session`.
- Cambio de contraseña con scrypt, salt nuevo, incremento de versión, revocación de sesiones y auditoría.
- Enlaces de activación/recuperación de 30 minutos, hash SHA-256 almacenado, un solo uso y contraseña elegida por el usuario.
- Gastos canónicos auditables por fecha, categoría, monto, ITBIS identificado y referencia.
- Ventas por período, inventario reconstruido a una fecha y gastos por período.
- Exportación JSON canónica auditada.
- Preparación 606, 607 e IT-1 separada en datos canónicos y adaptador fiscal.
- Contrato `ConversationalProvider` intercambiable y catálogo de herramientas autorizadas para LIA.
- Reportes por conversación usando el motor oficial, con herencia estricta de permisos.

## Capacidades

- `report.sales`
- `report.inventory`
- `report.expenses`
- `report.fiscal.prepare`
- `expense.read`
- `expense.create`

Propietario y Administrador reciben capacidades operativas/contables; Contabilidad recibe reportes, preparación fiscal, gastos y LIA; Auditor recibe consulta de reportes sin modificación. LIA nunca amplía estas capacidades.

## Estado exacto de LIA

LIA utiliza `LocalRuleConversationalProvider` sin proveedor externo. La arquitectura completa es: usuario → proveedor de interpretación → intención estructurada → herramientas disponibles por capacidades → servicio oficial → confirmación cuando aplica → Business Engine/Reportes → auditoría.

Ejecución local actual:

- prepara y confirma recepciones;
- consulta taller pendiente;
- consulta ventas, inventario y gastos autorizados;
- mantiene historial por usuario/empresa/agente;
- rechaza consultas financieras o de costos sin permiso.

Preparado por contrato, pero pendiente de un proveedor NLP/LLM autorizado para comprensión flexible: búsqueda/actualización conversacional avanzada de clientes, productos, cotizaciones, facturas, caja, navegación contextual, desambiguación semántica y extracción robusta de períodos escritos libremente. El proveedor externo no está conectado.

## Frontera DGII

606, 607 e IT-1 devuelven datos canónicos y estado `adapter-awaiting-official-specification`. No transmiten, firman ni afirman cumplimiento. Faltan localmente las especificaciones oficiales vigentes, catálogos, layouts de exportación y casos de validación certificados; no se inventaron campos. La migración `0004_chapter_eight_accounting_identity` crea las fronteras PostgreSQL para gastos, ejecuciones de reportes y tokens con RLS tenant/company.

## Validación

- 46/46 pruebas funcionales, autorización, multiempresa, PostgreSQL y anti-escalamiento aprobadas.
- TypeScript aprobado.
- ESLint aprobado.
- Build productivo aprobado.
- Migraciones 0001–0004 aplicadas con checksum.
- No se realizó push.

## Deuda antes de LF-PRINTER real

- conseguir y versionar especificaciones oficiales vigentes de 606/607/IT-1;
- seleccionar y autorizar proveedor LLM/NLP con política de privacidad y evaluación;
- conectar proveedor de correo transaccional para entregar activación/recuperación sin intervención administrativa;
- exigir activación de un solo uso desde el aprovisionamiento final del propietario, sustituyendo el campo temporal heredado del Control Plane;
- normalizar fechas históricas de facturas/movimientos anteriores al Capítulo 8 para eliminar el indicador `legacy-fallback`;
- completar catálogo, inventario fechado, usuarios y datos fiscales reales de LF-PRINTER mediante flujos formales.

DGII real, firma fiscal, dominio público, Commerce, Web3 y pagos externos continúan deshabilitados.
