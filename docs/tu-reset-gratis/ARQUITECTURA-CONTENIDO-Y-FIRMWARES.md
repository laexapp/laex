# Tu Reset Gratis LF-PRINTER — clasificación y flujo comercial

Estado: la propuesta visual fue aprobada por el CEO y la primera versión navegable está en desarrollo. Este documento no activa pagos, descargas ni acceso a MEGA. Los registros actuales son solo ejemplos; todavía no representan un catálogo comercial confirmado.

## Áreas del producto

El apartado conserva una sola identidad y navegación, con dos secciones visibles y separadas:

1. **Resets Gratis:** catálogo público por marca y modelo, guías e instrucciones. Cada descarga solo se publica cuando se haya comprobado el origen, la compatibilidad y el permiso de redistribución del archivo. La contraseña `LF-PRINTER` se muestra únicamente para paquetes propios o que podamos redistribuir legítimamente y que realmente la requieran.
2. **Firmwares LF-PRINTER:** catálogo comercial con modelo compatible, descripción técnica revisada, precio y disponibilidad. El cliente solicita la compra por WhatsApp. No existe una descarga pública ni automática.

## Separación de datos y acceso

- Cada recurso se clasifica en el servidor con un tipo explícito: `free_reset` o `paid_firmware`. La interfaz no decide la clasificación.
- El catálogo público del firmware solo expone información comercial aprobada: nombre, modelo, descripción, precio publicado y disponibilidad. No incluye ruta, enlace, clave, identificador de nodo ni metadatos privados de MEGA.
- Las referencias privadas de entrega se almacenan aparte del catálogo público, con acceso limitado a personal autorizado y secretos guardados fuera del repositorio. No se generan enlaces permanentes públicos ni se registran enlaces privados en analítica o logs.
- El panel administrativo requiere sesión empresarial y permiso de gestión de contenido. Toda alta, edición, publicación, cambio de precio/disponibilidad y entrega debe dejar un registro de auditoría.
- Una descarga gratuita solo se sirve desde un recurso expresamente publicado como gratuito. Una API pública no debe poder convertir un `paid_firmware` en una descarga por cambiar el slug o la URL.

## Flujo de compra

1. El cliente elige **Comprar por WhatsApp** en la ficha comercial.
2. Se abre el WhatsApp comercial con un texto preparado que identifica firmware y modelo y consulta precio, disponibilidad y forma de pago. La solicitud no se registra como pago ni libera archivos.
3. El equipo confirma manualmente el pago y la disponibilidad fuera del flujo público.
4. El personal autorizado entrega el archivo por el mecanismo privado definido para esa operación y registra la fecha/estado de entrega.

El sitio no procesa cobros ni cambia automáticamente el estado a pagado. La entrega privada queda separada de la ficha pública incluso si el archivo continúa alojado en MEGA.

## Administración prevista

La ficha administrable contempla marca, modelo(s), categoría, descripción, compatibilidad sustentada, información técnica revisada, precio, disponibilidad, estado de publicación y tipo de distribución. Para firmwares de pago agrega una referencia de almacenamiento privado; para resets gratuitos agrega el enlace de descarga aprobado, versión, tamaño, fecha, guía y contraseña cuando corresponda. La publicación valida campos obligatorios y el tipo de acceso antes de guardar.

## Incorporación segura de la biblioteca MEGA

El dashboard de MEGA es privado y no se debe automatizar su acceso compartiendo la contraseña de la cuenta. La importación debe partir de un inventario exportado o de archivos concretos compartidos por el titular mediante un método autorizado. Primero se cataloga nombre, tamaño, modelo probable y hash; luego se inspecciona el contenido en un entorno controlado, se identifica autor/licencia y se valida en hardware antes de publicar. Los paquetes no se vuelven a comprimir ni se les cambia la contraseña para redistribución hasta comprobar que sus términos lo permiten.

La carpeta indicada como **Reset LF-PRINTER TODOS 2026** y las carpetas/modelos mencionados por el CEO son referencias por revisar, no contenido ya inspeccionado ni compatibilidad ya confirmada.

## Campos que siguen pendientes de confirmación

- Inventario real de firmwares, modelos, especificaciones, precios y disponibilidad comercial.
- Recurso/canal autorizado para recibir un inventario de MEGA sin credenciales de la cuenta.
- Permisos de redistribución de cada reset gratuito, y documentación/validación de cada firmware comercial.
- Método operativo de confirmación de pago y entrega privada.
- Confirmación de que el número de WhatsApp comercial publicado actualmente en LF-PRINTER es el destinado a estas solicitudes.

Hasta completar estas verificaciones, no se deben mostrar precios inventados, compatibilidades certificadas, enlaces de MEGA ni botones que aparenten permitir una compra ya habilitada.

## Primera versión navegable

- El catálogo gratuito y el catálogo comercial viven en rutas separadas dentro de la misma sección, con buscador, filtros y fichas adaptables.
- Los ejemplos se marcan como `DEMO`; la guía inicial ilustra el formato y no pretende ser un procedimiento de reset aprobado.
- Las descargas gratuitas no verificadas están desactivadas. El catálogo comercial no contiene campos para enlaces de MEGA privados; sus llamadas a WhatsApp solo preparan una consulta y no confirman pedidos ni pagos.
- La administración persistente, el inventario real de archivos, precios aprobados y la entrega privada están pendientes.
- La vista previa Vercel necesita una conexión autorizada al proveedor. La publicación por un sitio alojado alternativo no se usa como sustituto de vista previa.
