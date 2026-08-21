# Frontera de Facturación Electrónica Dominicana

## Estado

Preparada arquitectónicamente y **deshabilitada para emisión real**. El Capítulo 2 puede crear borradores demostrativos vinculados a facturas internas, pero no firma XML, no solicita ni consume secuencias, no genera e-NCF oficiales y no transmite información a DGII.

## Contrato

`ElectronicInvoicingProvider` separa el Business Engine de cualquier proveedor o transporte fiscal. Expone firma, envío, consulta de estado y representación imprimible. La máquina de estados admite:

`draft → pending-signature → signed → pending-submission → accepted | rejected | contingency`

Los reintentos conservan la clave de idempotencia original. Rechazos y contingencias no se convierten silenciosamente en aceptación.

## Tipos preparados

- E31 — Factura de Crédito Fiscal Electrónica.
- E32 — Factura de Consumo Electrónica.
- E33 — Nota de Débito Electrónica.
- E34 — Nota de Crédito Electrónica.
- E41 — Comprobante Electrónico de Compras.
- E43 — Comprobante Electrónico para Gastos Menores.
- E44 — Comprobante Electrónico para Regímenes Especiales.
- E45 — Comprobante Electrónico Gubernamental.

Las notas E33/E34 deben referenciar un comprobante original del mismo tenant y empresa.

## Aislamiento fiscal

Cada configuración fiscal pertenece a `tenantId + companyId` y contiene solamente referencias a bóvedas separadas para certificado, credenciales y secuencias. El material criptográfico nunca se almacena en las entidades de factura, nunca se comparte entre empresas y nunca llega al navegador.

## Habilitación futura

La configuración permanece bloqueada hasta comprobar, como mínimo, RNC y obligaciones vigentes, autorización como emisor electrónico, software certificado, certificado digital tributario, credenciales y bóveda de secuencias propias. Producción requerirá además migraciones, rotación de secretos, sellado temporal, XML conforme a la versión oficial, pruebas de certificación, monitoreo, retención y recuperación de contingencias.

## Fuentes oficiales consultadas

- DGII, [Tipos y estructura de los e-CF](https://dgii.gov.do/cicloContribuyente/facturacion/comprobantesFiscalesElectronicosE-CF/Paginas/TipoyEstructurae-CF.aspx).
- DGII, [Facturación Electrónica](https://dgii.gov.do/cicloContribuyente/facturacion/comprobantesFiscalesElectronicosE-CF/Paginas/default.aspx?v=1.0).
- DGII, [Proceso de certificación para ser emisor electrónico](https://dgii.gov.do/cicloContribuyente/facturacion/comprobantesFiscalesElectronicosE-CF/Documentacin%20sobre%20eCF/Documentaciones%20Proceso%20de%20Certificaci%C3%B3n%20FE/Paso%20a%20paso%20proceso%20de%20Certificacion%20para%20ser%20Emisor%20Electronico.pdf).
