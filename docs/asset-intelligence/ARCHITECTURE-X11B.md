# LAEX Asset Intelligence ? Arquitectura X-11B

## Prop?sito

LAEX Asset Intelligence localiza, clasifica, adquiere y registra activos oficiales antes de entregarlos al Media Pipeline. Es independiente de LF-PRINTER, del fabricante y del procesador visual.

Desde X-11C, cada adquisici?n se registra adem?s en el Registro Global de Activos. Los proyectos referencian un `LAEX-ASSET-XXXXXXX`; el original pertenece al ecosistema LAEX y se deduplica por SHA-256.

La Fase 1 no inicia sesi?n, no guarda credenciales, no evade controles de acceso y no extrae contenido de portales protegidos. Los conectores autenticados se incorporar?n ?nicamente mediante autorizaci?n y contratos oficiales del fabricante.

## Flujo

```text
Proyecto LAEX
  -> AssetIntelligenceService.discover
  -> OfficialAssetProvider
  -> registro de candidato y revisi?n jur?dica
  -> autorizaci?n escrita cuando corresponda
  -> adquisici?n y original inmutable
  -> SHA-256 + procedencia + licencia + versi?n
  -> MediaPipelineReviewBridge
  -> procesador configurado (hoy Photoroom)
  -> review-required
  -> aprobaci?n humana
  -> producci?n (fuera de Asset Intelligence)
```

`MediaPipelineReviewBridge` rechaza expl?citamente una respuesta `published`. Asset Intelligence no posee un m?todo de publicaci?n.

## Capas

```text
modules/asset-intelligence/
  application/
    AssetIntelligenceService.ts
  domain/
    lifecycle.ts
    ports.ts
    types.ts
  providers/
    epson/EpsonAssetProvider.ts
    official/AuthorizedRepositoryProvider.ts
  infrastructure/
    InMemoryAcquisitionRegistry.ts
    InMemoryGlobalAssetRegistry.ts
    MediaPipelineReviewBridge.ts
    node/NodeAcquisitionInfrastructure.ts
  index.ts       contratos y runtime universal
  node.ts        infraestructura exclusiva del servidor
```

## Contratos p?blicos

- `OfficialAssetProvider`: b?squeda y adquisici?n por fabricante.
- `AcquisitionRegistry`: historial y versiones consultables por proyecto/identificador.
- `GlobalAssetRegistry`: Single Source of Truth, deduplicaci?n, usos compartidos, versiones e historiales globales.
- `OriginalAssetStore`: preservaci?n inmutable del binario original.
- `ChecksumService`: checksum SHA-256.
- `MediaPipelineGateway`: entrega de un ?nico activo y retorno obligatorio `review-required`.
- `AssetIntelligenceService`: orquestaci?n sin conocer filesystem, HTTP, Photoroom ni LF-PRINTER.
- `DashboardAssetView`: proyecci?n preparada para activos, licencias, autorizaciones, resoluci?n, versiones, proveedor y estado jur?dico.

La infraestructura Node se importa desde `@/modules/asset-intelligence/node`; de este modo ning?n componente cliente arrastra `node:fs` o `node:crypto`.

## Estados

```text
discovered
  -> official-source-required
  -> rights-review
  -> acquisition-authorized
  -> acquired
  -> ready-for-processing
  -> processing
  -> review-required
  -> approved | rejected
  -> published (solo sistema de publicaci?n externo)
  -> superseded
```

Tambi?n existen `quality-rejected` y `failed`. `assertLifecycleTransition` impide saltos no autorizados. Una licencia ambigua, una modificaci?n no permitida o una exigencia de permiso escrito siempre produce `rights-review`. `prohibited` nunca puede autorizarse.

## Registro de adquisici?n

Cada `AcquisitionRecord` conserva:

- proyecto e identificador l?gico;
- fabricante, modelo, propietario y proveedor;
- p?gina fuente y URL original;
- clase de fuente;
- licencia y estado jur?dico;
- necesidad y referencia de autorizaci?n escrita;
- resoluci?n, formato, fecha y SHA-256;
- URI del original inmutable;
- versi?n y activo sustituido;
- historial completo de estados.

`JsonAcquisitionRegistry` escribe el registro de forma at?mica. `FileSystemOriginalAssetStore` utiliza rutas validadas y archivos con nombre basado en checksum; un original existente no se sobrescribe.

## Adaptador Epson

`EpsonAssetProvider` acepta un cat?logo expl?cito de recursos autorizados y valida HTTPS contra dominios oficiales conocidos de Epson. Rechaza tiendas, marketplaces y dominios no oficiales.

En Fase 1:

- Epson Newsroom, p?ginas p?blicas y repositorios expresamente autorizados pueden usar un descargador inyectado.
- Los candidatos de `partner-portal` se registran, pero su descarga autom?tica se bloquea.
- No existe automatizaci?n de login, cookies, credenciales o scraping protegido.
- La modificaci?n sin permiso expreso queda en `rights-review`.

Cuando Epson proporcione una API o conector permitido, se implementar? `AuthorizedAssetDownloader` sin cambiar el dominio, el dashboard ni el Media Pipeline.

## Integraci?n con el Media Pipeline existente

El proyecto implementar? `ExistingMediaPipelineAdapter` con dos operaciones:

1. `stageOfficialOriginal`: copia/normaliza el original hacia el repositorio oficial configurado para ese proyecto.
2. `processOne`: ejecuta el pipeline con un ?nico identificador y devuelve su estado.

La configuraci?n del proyecto se inyecta en ese adaptador. El dominio nunca conoce rutas de LF-PRINTER ni comandos npm. El puente acepta exclusivamente `review-required`; la aprobaci?n y publicaci?n contin?an siendo operaciones humanas separadas.

## Nuevos fabricantes

Para Canon, HP, Brother, Ricoh, Kyocera, Xerox, Konica Minolta o futuros fabricantes:

1. Crear `providers/<fabricante>/<Fabricante>AssetProvider.ts`.
2. Implementar `OfficialAssetProvider`.
3. Definir dominios, portales y repositorios autorizados.
4. Mapear sus licencias al contrato `AssetLicense`.
5. Inyectar el proveedor en `AssetIntelligenceService`.

No se modifica el servicio, el registro, el dashboard ni el Media Pipeline.

## Validaci?n

```powershell
npm run test:asset-intelligence
npx tsc --noEmit
```

Las pruebas cubren bloqueo jur?dico, autorizaci?n escrita, preservaci?n del original, entrega a revisi?n, rechazo de publicaci?n autom?tica y rechazo de dominios Epson no oficiales.
