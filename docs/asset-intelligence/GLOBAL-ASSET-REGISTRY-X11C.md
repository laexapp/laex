# Misi?n X-11C ? Registro Global de Activos

## Single Source of Truth

Los activos oficiales pertenecen a LAEX. Un proyecto no posee ni duplica el original: registra un uso contra un `Asset ID` permanente.

```text
LAEX-ASSET-0000001
  ?? versi?n 1 + SHA-256 + original inmutable
  ?? LF-PRINTER / showroom
  ?? Marketplace / ficha
  ?? Comparador / comparaci?n
  ?? Academia / contenido
  ?? IA / contexto autorizado
```

La misma suma SHA-256 nunca crea un segundo activo. Una fotograf?a superior del mismo fabricante, modelo y tipo crea una versi?n nueva bajo el mismo `Asset ID`. La versi?n anterior permanece en el historial.

## Identificador

Formato: `LAEX-ASSET-` seguido por una secuencia decimal m?nima de siete posiciones.

Ejemplos:

- `LAEX-ASSET-0000001`: Epson WF-4830.
- `LAEX-ASSET-0000002`: Epson WF-7840.

Los IDs no se reciclan. `JsonGlobalAssetRegistry` conserva `nextSequence` en el registro global y serializa las mutaciones del proceso para evitar asignaciones simult?neas duplicadas.

## Registro can?nico

Ubicaci?n inicial:

```text
assets/asset-intelligence/global-asset-registry.json
```

La infraestructura se crea con `createLaexGlobalAssetRegistry(workspaceRoot)`. M?s adelante el mismo contrato `GlobalAssetRegistry` puede implementarse sobre PostgreSQL u otro almac?n transaccional sin cambiar Asset Intelligence.

## Informaci?n almacenada

Cada activo contiene:

- Asset ID permanente;
- fabricante, propietario, modelo y tipo;
- licencia y estado jur?dico;
- fuente oficial;
- estado actual;
- proyectos y contextos consumidores;
- versi?n actual y checksum vigente;
- originales inmutables de todas las versiones;
- historial de procesamiento;
- historial de publicaci?n;
- historial de reemplazos;
- historial de aprobaciones.

## Reglas de identidad

1. Coincidencia SHA-256: reutilizar el activo y agregar la referencia del proyecto.
2. Mismo fabricante + modelo + tipo, checksum nuevo: crear una nueva versi?n del mismo Asset ID.
3. Identidad de producto nueva: asignar el siguiente Asset ID.
4. Nunca borrar versiones anteriores ni reutilizar IDs.

## Revisi?n y publicaci?n

El procesamiento registra eventos autom?ticamente al entrar en `processing` y `review-required`.

Las aprobaciones se registran con `recordApproval`. `recordPublication` rechaza una publicaci?n si esa versi?n no tiene previamente una aprobaci?n humana con estado `approved`. Asset Intelligence contin?a sin publicar archivos por s? mismo; solo conserva el historial enviado por el sistema de publicaci?n autorizado.

## Contrato para el dashboard

`GlobalAsset`, `GlobalAssetUsage`, `GlobalAssetVersion` y `GlobalAssetEvent` permiten construir vistas de:

- activos compartidos y proyectos consumidores;
- licencias y autorizaciones;
- versiones y reemplazos;
- trabajos de procesamiento y proveedores;
- aprobaciones y responsables;
- destinos e historial de publicaci?n.

## Migraci?n futura

Cuando el volumen o la concurrencia requieran una base de datos, se implementar? otro `GlobalAssetRegistry`. Los Asset IDs, checksums, versiones e historiales se migrar?n sin cambiar los proyectos consumidores.
