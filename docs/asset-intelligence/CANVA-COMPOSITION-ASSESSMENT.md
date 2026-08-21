# Consulta de Arquitectura — Canva como capa de composición

Fecha: 2026-08-05. Estado: evaluación; ninguna conexión implementada.

## Dictamen

Canva es compatible como destino derivado de composición comercial, nunca como
archivo maestro. Para el flujo completo de plantillas de marca con sustitución
dinámica de texto e imágenes, LAEX necesitaría Canva Enterprise. Free o Pro
permiten validar carga, creación y exportación, pero Autofill y Brand Templates
requieren que desarrollador y usuarios pertenezcan a una organización
Enterprise.

## Capacidades oficiales

- Connect APIs REST para activos, diseños, plantillas, autofill y exportación.
- Carga asíncrona de JPEG, PNG, HEIC, GIF estático, TIFF y WebP estático; las
  imágenes deben pesar menos de 50 MB.
- Creación de diseños con tipos predefinidos, dimensiones personalizadas o un
  activo ya cargado. Copiar diseños y crear desde Brand Template continúan como
  capacidades preview en el endpoint de creación.
- Autofill de campos de texto e imagen mediante Brand Templates; requiere
  Enterprise. Los medios deben cargarse primero en la biblioteca del usuario.
- Exportación asíncrona a JPG, PNG, GIF, PPTX, MP4, PDF, CSV, HTML bundle y HTML
  standalone. El fondo transparente de PNG es una función premium.
- Diseños para banners, campañas, redes, promociones y materiales de marketing;
  Canva mantiene una aplicación oficial de referencia para ese patrón.

## Límites y participación humana

Automatizable: carga del PNG aprobado, selección de plantilla, sustitución de
campos, creación de variaciones, inicio/consulta de trabajos de exportación y
retorno del derivado a LAEX.

Humano obligatorio en LAEX: creación/aprobación de plantillas, revisión visual,
verificación de marca y derechos, decisión editorial y autorización de
publicación. La API no debe convertir una exportación en publicación automática.

Límites documentados: carga de activos 30 solicitudes/minuto/usuario; creación
de diseños 20/minuto/usuario; exportación 750/5 minutos y 5000/día por
integración, 75/5 minutos por documento y 75/5 minutos y 500/día por usuario.
Los trabajos son asíncronos y requieren polling con backoff. Las URLs de descarga
de exportaciones vencen en 24 horas. Las funciones preview pueden cambiar sin
aviso y no son aceptadas en integraciones públicas durante revisión.

## Arquitectura propuesta

```text
Global Asset ID + versión aprobada
  -> Media Pipeline output
  -> Composition Request (plantilla + campos + formatos)
  -> Canva Adapter server-side
  -> Canva Design ID / Export Job ID
  -> Human Composition Review
  -> derivado comercial versionado
  -> canal autorizado
```

El adaptador solo recibiría una copia del rendition aprobado. LAEX conservaría
Global Asset ID, checksum de entrada, versión, plantilla, Design ID, Export Job
ID, checksum de salida, revisor y canal. La exportación de Canva sería un
derivado, no una nueva versión del producto oficial.

## Seguridad y publicación de la integración

Canva Connect usa OAuth 2.0 Authorization Code con PKCE SHA-256. Client secret,
access token y refresh token deben residir cifrados en servidor; Canva recomienda
vault o secreto de entorno, mínimo alcance, separación de tokens, TLS, auditoría
y no registrar credenciales. Los refresh tokens son de un solo uso.

Una integración privada solo está disponible para equipos Enterprise. Una
integración pública debe pasar revisión de Canva, justificar scopes, retirar
redirects locales, aportar documentación y cuenta de prueba; no puede depender
de APIs preview. Las apps públicas tienen además revisión del Marketplace.

## Plan y costos

Recomendación: Canva Enterprise si LAEX necesita generación real por Brand
Templates + Autofill, integración privada, gobierno de marca, SSO/SCIM y control
administrativo. Canva publica Enterprise mediante cotización; no existe un precio
fijo verificable en su página pública. Debe solicitarse propuesta comercial con
número de usuarios, almacenamiento, Autofill, API y soporte. Canva Pro puede
servir para un piloto manual individual y exportación PNG transparente, pero no
cumple el flujo automatizado empresarial.

## Licencias

Los activos propios cargados por LAEX conservan sus derechos previos, que deben
seguir gobernados por Asset Intelligence. Para contenido Free/Pro de Canva rige
el Content License Agreement: existen usos comerciales permitidos y múltiples
restricciones; contenido Editorial, Branded u otras colecciones puede no admitir
promoción comercial. Ningún elemento de Canva debe convertirse en logo, marca o
activo oficial sin revisión jurídica específica.

## Recomendación final

Canva es una buena opción para composición colaborativa, gobernada y con humano
en el circuito. No puede declararse la mejor opción absoluta sin una evaluación
separada de herramientas oficiales competidoras. Para render determinista,
masivo y totalmente server-side, su dependencia de OAuth por usuario,
Enterprise, trabajos asíncronos y límites puede ser menos conveniente. LAEX debe
definir un puerto `CommercialCompositionProvider` y tratar Canva como primer
adaptador reemplazable, no como nueva fuente de verdad.

## Documentación oficial consultada

- https://www.canva.dev/docs/connect/
- https://www.canva.dev/docs/connect/autofill-guide/
- https://www.canva.dev/docs/connect/api-reference/assets/
- https://www.canva.dev/docs/connect/api-reference/designs/create-design/
- https://www.canva.dev/docs/connect/api-reference/exports/create-design-export-job/
- https://www.canva.dev/docs/connect/authentication/
- https://www.canva.dev/docs/connect/guidelines/security/
- https://www.canva.dev/docs/apps/app-review-process/
- https://www.canva.com/pricing/
- https://www.canva.com/policies/content-license-agreement/
