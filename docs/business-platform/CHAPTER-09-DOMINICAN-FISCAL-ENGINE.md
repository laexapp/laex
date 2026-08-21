# Capítulo 9 — Motor fiscal dominicano y preparación DGII

Estado: implementado para preparación local y auditoría. Emisión, firma y transmisión DGII real: deshabilitadas.

## Arquitectura resultante

La separación operativa es `operación empresarial → documento fiscal canónico → DGII Provider → representación/transmisión`. Facturas, compras y gastos continúan siendo registros del Business Engine; ninguna plantilla, XML o respuesta externa sustituye el documento empresarial.

Cada perfil, secuencia, documento y conciliación conserva `tenant_id` y `company_id`. PostgreSQL aplica RLS forzada y unicidad de e-NCF dentro de la empresa. Los roles Propietario y Administrador pueden administrar el perfil y secuencias; Contabilidad puede consultar, preparar y conciliar. La capacidad `fiscal.submit` no se entrega a roles empresariales normales mientras DGII esté deshabilitada.

## Referencias oficiales consultadas

- Portal oficial DGII, Documentación sobre e-CF: Formato e-CF v1.0 (30-10-2025), XSD E31/E32/E41/E43/E44/E45 v1.0 (16-10-2025), XSD E33/E34 v1.0 (01-04-2026), Informe Técnico e-CF v1.0 (06-04-2026) y descripción de servicios (29-05-2026).
- Portal oficial DGII, Tipos y estructura e-CF: estructura de 13 caracteres (`E`, tipo de dos dígitos y secuencial de diez dígitos) y clasificación E31, E32, E33, E34, E41, E43, E44, E45, E46 y E47.
- Portal oficial DGII, Formatos de envío de datos: instructivo 606 revisado 12-02-2026, instructivo 607 revisado 18-12-2025 y guía general revisada 12-05-2026.
- Instructivo oficial de contingencia e-CF, revisión publicada 25-02-2026.

Fuentes: https://dgii.gov.do/cicloContribuyente/facturacion/comprobantesFiscalesElectronicosE-CF/Paginas/documentacionSobreE-CF.aspx, https://dgii.gov.do/cicloContribuyente/facturacion/comprobantesFiscalesElectronicosE-CF/Paginas/TipoyEstructurae-CF.aspx y https://dgii.gov.do/publicacionesOficiales/bibliotecaVirtual/contribuyentes/formatoEnvioDatos/Paginas/default.aspx.

## Implementado

- Perfil fiscal por empresa: identidad fiscal, régimen tradicional/electrónico/transición, fecha efectiva, tipos habilitados, modo ITBIS y versión de reglas. El RNC sólo recibe validación formal; LAEX no afirma vigencia tributaria.
- Tipos E31, E32, E33, E34, E41, E43, E44, E45, E46 y E47 en el contrato.
- Rangos explícitamente autorizados, auditados, sin rangos paralelos activos del mismo tipo, sin reutilización y con agotamiento.
- Documento canónico idempotente, totales inmutables derivados de la operación, relación de notas con el documento original, hash SHA-256 y artefactos íntegros.
- Frontera `DgiiProvider` con envío, consulta, idempotencia, aceptación, rechazo y contingencia. Sólo existe un proveedor local de simulación.
- Reglas 606/607/IT-1 versionadas por modalidad; su salida oficial y transmisión permanecen bloqueadas.
- Conciliación que reporta diferencias sin corregir datos históricos.
- LIA puede preparar una vista fiscal únicamente mediante Reporting Engine y capacidades autorizadas; la ejecución queda auditada.
- Centro Fiscal dentro de LAEX Business para perfil, estado, documentos y evidencia de que DGII permanece desconectada.

## Fronteras deliberadamente pendientes

El XML generado hoy es un contenedor canónico interno marcado `pending-official-xsd`; no se presenta como XML e-CF oficial. Antes de certificación deben incorporarse y fijarse en el repositorio las versiones oficiales completas de XSD, catálogos, reglas de validación, representación impresa y QR aplicables, con pruebas de conformidad. No se inventaron campos ausentes.

Firma digital, certificado real, QR oficial, endpoints DGII, acuses reales, reintentos productivos y exportaciones oficiales 606/607/IT-1 están deshabilitados. Producción requerirá autorización DGII aplicable, software certificado, RNC y obligaciones vigentes, credenciales de ambiente, certificado digital y sus secretos en un gestor externo. La clave privada, contraseña del certificado y credenciales DGII nunca deben almacenarse en código, logs, chat, auditoría legible ni en campos de configuración; LAEX conserva únicamente referencias opacas al gestor de secretos.

## Migración

`0005_dominican_fiscal_engine.sql` crea perfiles, secuencias, documentos y conciliaciones fiscales, índices de unicidad y RLS forzada por tenant/company. La migración fue aplicada sobre PostgreSQL sin migrar datos demo ni activar DGII.

## Deuda antes de producción

Completar certificación formal, fijar artefactos oficiales versionados, validar cada XML contra su XSD, implementar firma con custodia externa de claves, representación/QR conforme al tipo, conectores de certificación y producción, política operacional de contingencia/reintentos, pruebas de aceptación DGII y revisión fiscal/legal de 606/607/IT-1 por régimen y período.
