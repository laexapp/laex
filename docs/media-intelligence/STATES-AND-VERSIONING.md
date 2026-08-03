# Estados y versionado editorial

El grafo de estados vive en `domain/editorial.ts`. Sólo permite transiciones declaradas y rechaza saltos arbitrarios. La aprobación exige actor humano; el proveedor simulado no puede aprobar.

Estados cubiertos: borrador, cola, análisis, analizado, errores de análisis, generación, generado, errores de generación, revisión, cambios solicitados, aprobado, rechazado, programado, publicación simulada, éxito, parcial, error, cancelado y archivado.

Cada edición crea una versión incremental. Si el contenido ya estaba aprobado, editarlo elimina `approvedVersion` y devuelve la pieza a borrador. El historial anterior permanece intacto. La versión aprobada se identifica expresamente.

La cola simulada usa `idempotencyKey`: repetir una creación devuelve el mismo trabajo. Los fallos pueden reintentarse y aumentan `attempts` sin duplicar el trabajo.

