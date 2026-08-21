# X-12D — Limpieza del catálogo temporal

Fecha: 2026-08-05

## Eliminados de `official-source/printers`

- `l3250-transparent.webp`
- `wf-4830-transparent diseño compacto.png`
- `wf-4833-transparent0.1.webp`
- `wf-4834-transparent.webp`
- `wf-7820-transparent.webp`
- `wf-7840-transparent.webp`
- `xp-4200-transparent.webp`
- `xp-4205-transparent.webp`
- `xp-5200-transparent.webp`

Eran JPEG opacos, tenían resolución insuficiente, nombre no canónico o no
pertenecían al catálogo autorizado. La eliminación es directa del workspace;
las fuentes que ya habían sido archivadas permanecen recuperables desde el
archivo oficial por checksum.

## Conservados

- `wf-4830-transparent.png`: publicado.
- `wf-7840-transparent.png`: fuente de un candidato en revisión.
- `README.md`: instrucciones operativas de la carpeta.
- `official-archive/printers`: originales y versiones por checksum.
- `official-review/printers`: candidatos y salidas crudas de revisión.
- `official/media-registry.json`: estado y trazabilidad del Media Pipeline.
- `asset-intelligence/global-asset-registry.json`: historial global intacto.

## Validación posterior

`npm run media:sync` finalizó sin errores. Confirmó WF-4830 como `published`,
WF-7840 como `review-required` y reportó los otros seis modelos oficiales como
pendientes por ausencia de una fuente válida. El pipeline ya no detecta los
archivos rechazados ni el modelo XP-5200.
