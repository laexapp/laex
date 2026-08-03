# Arquitectura futura de conectores

Documento de diseño; no existen conexiones ni credenciales reales en Fase 1.

## Contrato común

Cada plataforma se implementará como plugin independiente con módulos de autenticación, publicación, lectura de estado, analytics, normalización de errores y control de cuotas. El plugin recibe comandos con `TenantContext`, clave de idempotencia y referencia a secretos cifrados. Devuelve resultados normalizados sin filtrar respuestas propietarias al Core.

Manejo común de tokens:

- OAuth se inicia desde una acción del usuario y usa PKCE y `state` firmado.
- Access y refresh tokens se cifran en reposo y nunca se exponen al cliente.
- Cada conexión pertenece a un único tenant y workspace.
- Renovación ocurre en servidor, con bloqueo para evitar rotaciones concurrentes.
- Revocación, expiración y cambios de permisos llevan la conexión a `attention`.
- Secretos y scopes se registran por versión, sin guardar valores en logs.

Errores comunes: autorización revocada, scopes insuficientes, rate limit, medios inválidos, revisión de plataforma, recurso eliminado, duplicado, timeout y fallo parcial. Todos se traducen a códigos estables: `auth`, `permission`, `rate_limit`, `validation`, `policy`, `not_found`, `conflict`, `temporary` o `terminal`.

## YouTube

- **Autenticación:** OAuth 2.0 de Google por workspace; cuentas de marca deben resolverse explícitamente.
- **Permisos:** principio de mínimo privilegio para lectura del canal, carga/gestión y analytics según capacidad habilitada.
- **APIs oficiales:** YouTube Data API y YouTube Analytics API; carga reanudable para medios.
- **Publicación:** crear metadata, cargar video, asignar privacidad/playlist y consultar procesamiento. Nunca asumir éxito al terminar la carga.
- **Estadísticas:** vistas, tiempo de reproducción, retención, impresiones, CTR y suscriptores cuando la API y el propietario lo permitan.
- **Límites:** cuotas por proyecto y costes distintos por operación; presupuestos internos por tenant.
- **Riesgos:** cuentas de marca, claims, contenido infantil, restricciones regionales y cambios de cuota.
- **Actualización:** plugin versionado, pruebas contractuales y matriz de campos soportados antes de adoptar nuevas revisiones.

## Facebook

- **Autenticación:** Meta Login; intercambio seguro por token de larga duración cuando aplique.
- **Permisos:** páginas administradas, publicación, lectura de engagement e insights sujetos a App Review.
- **APIs oficiales:** Graph API para Pages, media e Insights.
- **Publicación:** post, enlace, imagen o video mediante flujos específicos; video se trata como proceso asíncrono.
- **Estadísticas:** alcance, impresiones, clics, reacciones, comentarios, compartidos y reproducciones según disponibilidad.
- **Límites:** rate limits por aplicación, usuario y página; cabeceras de uso alimentan el throttle.
- **Riesgos:** cambios frecuentes de versiones, revisión de permisos, Page Access Tokens y activos de Business Manager.
- **Actualización:** fijar versión Graph por plugin y migrar antes del fin de soporte.

## Instagram

- **Autenticación:** Meta Login sobre cuenta profesional vinculada a una página.
- **Permisos:** gestión de contenido, lectura básica e insights, sujetos a tipo de cuenta y revisión.
- **APIs oficiales:** Instagram Graph API y contenedores de publicación.
- **Publicación:** crear contenedor, esperar procesamiento y publicar; carruseles y Reels tienen validaciones propias.
- **Estadísticas:** alcance, impresiones, reproducciones, guardados, engagement y seguidores cuando estén expuestos.
- **Límites:** ventanas y cuotas de publicación; medios deben ser accesibles temporalmente desde una URL segura.
- **Riesgos:** restricciones de formato, música/derechos, cuentas no profesionales y expiración de URLs.
- **Actualización:** pruebas por tipo de medio y capability flags por versión del plugin.

## TikTok

- **Autenticación:** OAuth de TikTok for Developers por creador/empresa.
- **Permisos:** perfil, video y publicación directa solo tras aprobación y alcance habilitado.
- **APIs oficiales:** Content Posting API y APIs de Display/Research/Business cuando correspondan legalmente.
- **Publicación:** iniciar, cargar o transferir medio, consultar estado y manejar moderación.
- **Estadísticas:** vistas, likes, comentarios, compartidos y duración cuando el producto aprobado lo permita.
- **Límites:** cuotas, tamaños, duración, privacidad y auditoría de aplicaciones.
- **Riesgos:** acceso condicionado a revisión, políticas regionales y procesamiento/moderación asíncronos.
- **Actualización:** plugin deshabilitable por región y scopes; no degradar a automatización no oficial.

## X

- **Autenticación:** OAuth 2.0 con PKCE u OAuth 1.0a solo para capacidades que todavía lo requieran.
- **Permisos:** lectura, escritura y medios conforme al nivel de acceso contratado.
- **APIs oficiales:** X API y endpoints oficiales de carga de media disponibles para el plan.
- **Publicación:** cargar medio, esperar procesamiento y crear post; hilos usan comandos relacionados e idempotentes.
- **Estadísticas:** impresiones y engagement cuando el nivel de API lo exponga.
- **Límites:** planes y rate limits variables por endpoint.
- **Riesgos:** costes, cambios de acceso, límites estrictos y métricas restringidas.
- **Actualización:** aislar plan/capabilities en configuración del plugin y fallar de forma explícita si desaparecen.

## LinkedIn

- **Autenticación:** OAuth 2.0 para persona u organización administrada.
- **Permisos:** publicación y analytics dependen de productos aprobados y rol sobre la organización.
- **APIs oficiales:** Posts/UGC, Assets y Organization/Page Statistics vigentes.
- **Publicación:** registrar carga, transferir medios y crear publicación referenciando el asset.
- **Estadísticas:** impresiones, clics, reacciones, comentarios, compartidos y seguidores según autorización.
- **Límites:** throttling por aplicación/miembro y restricciones de productos.
- **Riesgos:** acceso de marketing revisado, ownership de páginas y cambios de endpoints.
- **Actualización:** capability discovery y contract tests contra sandbox/cuentas de prueba autorizadas.

## Telegram

- **Autenticación:** token de Bot API almacenado cifrado; validación de identidad del bot y chat autorizado.
- **Permisos:** el bot debe ser administrador del canal/grupo con permisos explícitos.
- **APIs oficiales:** Telegram Bot API.
- **Publicación:** mensajes, álbumes y documentos; dividir contenido respetando límites.
- **Estadísticas:** Bot API ofrece señales limitadas; métricas avanzadas requieren capacidades oficiales adicionales y consentimiento.
- **Límites:** rate limits globales y por chat, tamaño y longitud.
- **Riesgos:** token de alto impacto, expulsión del bot, chat IDs incorrectos y escasa analítica estándar.
- **Actualización:** rotación inmediata del token y compatibilidad declarada con versión Bot API.

## WhatsApp

- **Autenticación:** Meta Business, System User y tokens administrados en servidor.
- **Permisos:** cuenta de WhatsApp Business, números, plantillas e insights sujetos a aprobación.
- **APIs oficiales:** WhatsApp Cloud API y webhooks oficiales.
- **Publicación:** solo mensajes permitidos; fuera de ventana se usan plantillas aprobadas. No tratar WhatsApp como feed social.
- **Estadísticas:** enviado, entregado, leído, fallido y costes/conversaciones cuando estén disponibles.
- **Límites:** tier de mensajería, calidad, plantillas, ventanas y políticas anti-spam.
- **Riesgos:** consentimiento, bloqueo de número, calidad, datos personales y costes por conversación.
- **Actualización:** versionar Graph API y reglas de plantillas; pausar campañas ante caída de calidad.

## Futuras plataformas

Un nuevo plugin solo puede registrarse si implementa el contrato del Core, declara autenticación/scopes, esquema de capabilities, límites, clasificación de errores, idempotencia, webhooks, analytics, regiones, política de secretos y matriz de compatibilidad. El registro no otorga acceso automático: cada tenant habilita y autoriza el plugin de forma independiente.

## Estrategia de actualización global

1. Observar deprecaciones oficiales y registrar fecha límite.
2. Implementar nueva versión detrás de capability flags.
3. Ejecutar contract tests con fixtures y cuentas autorizadas.
4. Habilitar por porcentaje de workspaces internos.
5. Comparar errores, latencia y resultados normalizados.
6. Migrar tokens/scopes solo con consentimiento cuando sea requerido.
7. Retirar versión anterior después de una ventana reversible y auditada.

