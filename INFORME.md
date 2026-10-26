# LAEX InvestOPTND — 0.1.1-demo

Fecha de cierre técnico: 26 de octubre de 2026. Candidato para revisión física, no para inversión real.

## Candidato

- Versión: **0.1.1-demo**, versionCode **2**.
- Aplicación: `com.laex.investoptnd.demo`.
- APK: `laex-investoptnd-0.1.1-demo.apk`.
- SHA-256: `7ea06830df260f83725fdf358469d8a40950488cc3705adc634b5052ddf0126b`.
- Certificado DEMO conservado: `98a25fd7b79e312cdc110149c842128825765d457dac063b5819e6dae2c62a9f`.
- Mismo identificador, certificado, origen local WebView y clave de almacenamiento que 0.1.0. Instalar mediante **Actualizar**, sin desinstalar ni borrar datos.
- API mínima 26, target/compile 35; build Review no depurable. Sin permiso INTERNET ni integración de pagos.

## Cambios terminados

1. Identidad independiente blanco/azul, fondos claros, tarjetas compactas, tipografía legible y controles táctiles. Verde para ganancias/cobros, ámbar para pendientes y rojo para pérdidas/incidencias, siempre con texto.
2. Navegación del inversionista: Inicio, Explorar, Mi cartera y Perfil. Contratos y liquidaciones accesibles desde cartera/perfil; administración fuera del recorrido habitual.
3. Inicio con explicación de cuatro pasos, categorías Básica/Intermedia/Premium, capital configurable y oportunidades con fotos. Importes de entrada separados de resultados estimados.
4. Cartera con cuatro conceptos: capital invertido, ganancia confirmada, liquidaciones pendientes y dinero ya pagado. El pago completado no se convierte en otro saldo retirable. Disponible para retirar es cero: la DEMO no custodia dinero. Las pérdidas se muestran aparte y no se ocultan dentro de ganancias positivas.
5. Seguimiento simplificado: Financiada → Comprada → En venta → Vendida → Pagada; adaptación para servicios. Los ocho estados internos originales siguen intactos. Fechas, documentos e incidencias están en un detalle desplegable.
6. Fotografías específicas verificadas de Epson XP-5100 y WF-3820, de fuentes oficiales Epson, incorporadas offline. No se alteraron los productos ni precios de Commerce.
7. Acceso administrativo separado desde Perfil → Acceso de administración → Entrar a administración. La autorización se verifica en rutas y en cada mutación administrativa, incluyendo el final de una lectura de archivo.

## Alcance exacto de la autenticación

Android solicita confirmar el PIN, patrón o contraseña del dispositivo mediante Keyguard. La aplicación no recibe, guarda ni registra esa credencial. Sin bloqueo seguro, con cancelación o sin un resultado nativo válido, se deniega el acceso.

La autorización permanece solo en memoria nativa, con reloj monotónico; dura como máximo cinco minutos. Se revoca al salir a segundo plano, cerrar sesión o destruir el proceso. El selector de archivos y el guardado de contratos son excepciones de ciclo de vida para completar esas acciones; no prolongan los cinco minutos. Se comprueba otra vez la autorización al aceptar un adjunto y antes de guardarlo.

**Es un operador local de DEMO:** cualquier persona que pueda desbloquear ese dispositivo puede gestionar los escenarios ficticios. No se implementó un directorio de empleados, autenticación remota ni roles empresariales de producción. El inversionista local conserva sus operaciones anteriores; registros con otra identidad explícita se excluyen y se rechaza el acceso directo desde su vista. El almacenamiento local y la auditoría ficticia no se presentan como contabilidad inviolable.

## Funciones conservadas

- Seis oportunidades iniciales, tres categorías y tres escenarios precargados.
- Un inversionista por unidad/orden, aceptación explícita y contrato individual con condiciones congeladas.
- Simulación positiva y con pérdidas; cálculo en centavos sin modificar el motor.
- Compra, venta cobrada, liquidación, pago simulado, incidencias y bloqueo de pago duplicado.
- Solicitud de salida después de 90 días, sujeta a acuerdo y liquidez; sin devolución instantánea.
- Objetivo de inicio de liquidación de 24–72 horas tras operación completada, cobrada y liquidable; no es garantía.
- Contrato descargable, adjuntos ficticios locales, configuración y creación administrativa de oportunidades e historial.

## Validación técnica

- **16 pruebas de motor/presentación aprobadas:** diez regresiones del motor y seis pruebas de roles, propiedad, separación financiera, estados y fotografías.
- **6 comprobaciones Java de sesión aprobadas:** inicio cerrado, concesión, límite previo, expiración exacta, revocación y recreación sin autorización persistida.
- **23 comprobaciones de interfaz aprobadas**, incluyendo carga del estado 0.1.0 sin modificaciones, rutas/mutaciones denegadas, cancelación, callback falso, cierre/expiración, ciclo completo, contratos, adjuntos y configuración.
- 16 rutas revisadas sin desbordamiento horizontal a 320, 393, 430 y 1000 px; pantallas principales con texto ampliado; controles principales de al menos 44 px.
- Build `assembleReview` correcto. `lintReview`: **0 errores, 1 advertencia** conocida sobre JavaScript habilitado, necesario para la interfaz offline. CSP restringida, navegación externa bloqueada, WebView debugging deshabilitado y sin INTERNET. No se ocultó la advertencia.
- Los 11 archivos empaquetados de interfaz/medios coinciden byte por byte con las fuentes usadas para las pruebas y capturas.
- Verificación de firma APK v2 correcta, mismo certificado DEMO que 0.1.0, versión/código correctos y build no depurable.
- Motor `engine.js` intacto: SHA-256 `fa50aedfa6cebe22df18b1473184d9a60ddb5bf0f8045766fbb0b0e8b529a25d`.
- Comparación de **209 archivos de LAEX Wallet/Commerce: ninguno modificado** respecto de la línea base de esta misión.

Las comprobaciones móviles son de Chrome emulado, no una prueba física en Samsung. El puente nativo se sustituye solo en los scripts de prueba/captura; ese sustituto no forma parte del APK. Las capturas finales utilizan los escenarios originales y no los cambios transitorios del ciclo de QA.

## Revisión física que corresponde a Arquitectura

1. Descargar el APK e instalar con **Actualizar** sobre 0.1.0. Confirmar versión 0.1.1-demo / 2 en Perfil y conservación de operaciones propias.
2. Revisar Inicio, categorías, fotos XP-5100/WF-3820, detalle y simulación de pérdida. Financiar una unidad ficticia y verificar seguimiento/contrato.
3. Revisar las cuatro cifras de Mi cartera. Un pago ya completado no debe sumarse al disponible para retirar.
4. Entrar a administración desde Perfil. Cancelar la autenticación y comprobar denegación; volver a entrar y confirmar el bloqueo real de Android.
5. Probar actualización de escenario y adjunto ficticio. Cerrar sesión, salir de la aplicación o esperar cinco minutos: debe volver a pedir autenticación administrativa.
6. Verificar tamaño de texto, teclado, barras de Android, archivo descargado y selector de documentos en el Samsung. Estos puntos nativos no se certifican mediante emulación de navegador.

## Evidencia visual y comparación

Se entregan 19 vistas móviles, páginas completas de las 17 pantallas principales y comparación antes/después de Inicio, Oportunidades y Mi cartera. El cambio es de presentación y acceso administrativo local; el motor financiero permanece igual.

## Fuentes de imágenes verificadas

- XP-5100: https://epson.com/Support/Printers/All-In-Ones/XP-Series/Epson-XP-5100/s/SPT_C11CG29201
- WF-3820: https://epson.com/Marketing-Categories/For-Work/Printers/Inkjet/WorkForce-Pro-WF-3820-Wireless-All-in-One-Printer/p/C11CJ07201
- Originales 690 × 460 px; URL exacta de medios y hashes en `image-sources.json` del paquete de evidencia.

## Límites / etapas posteriores

No hay pagos, depósitos, inversiones reales, USDT, OMD, OMDB, integración Commerce ni modificaciones de LAEX Wallet. La autenticación empresarial y los permisos entre usuarios reales requieren una etapa aparte; no se simula que ya existan. La aprobación física final de este candidato corresponde a CEO/Arquitectura.
