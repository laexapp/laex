# Corrección de sesión de acceso — LAEX Wallet 0.3.3-testnet

## Causa exacta

En 0.3.2 MainActivity.onPostResume invocaba enterPublic automáticamente a partir del contexto público persistido. Además, Entrar llamaba directamente a enterPublic. Ese método habilitaba la interfaz utilizando una dirección registrada y la existencia del vault, sin una sesión autenticada. Se confundió lectura sin autorización de firma con acceso sin autenticación. La exposición de Cartera y Seguridad reportada por CEO es una regresión de acceso, aunque las operaciones criptográficas conservaran su autenticación independiente. 0.3.2 no es candidato de cierre.

## Política aplicada

- Apertura nueva, proceso/Activity recreado o cierre: sesión inválida; se presenta la entrada bloqueada. Entrar solicita biometría fuerte o credencial del dispositivo; la alternativa PIN utiliza credencial del dispositivo. Cancelar o fallar no concede acceso.
- Sesión solo en memoria, nunca en preferencias, archivos ni estado guardado Android. No contiene claves ni permite firmar.
- Regreso antes de 60 segundos en segundo plano: restaura acceso público si la sesión seguía válida. A los 60 segundos exactos o después exige autenticar nuevamente. Se utiliza reloj monotónico, no hora de calendario.
- Durante uso continuo en primer plano no hay expiración adicional por tiempo. Cada nueva salida inicia otro intervalo máximo de 60 segundos. La autorización criptográfica conserva sus límites anteriores, independientes.
- Apagar/bloquear la pantalla, Bloquear ahora, finalizar o destruir la Activity revoca el acceso. También se comprueba el bloqueo del dispositivo al regresar. La recreación de Activity, incluida una recreación por configuración, exige autenticación de nuevo como decisión conservadora.
- Se ocultan las vistas al pasar a segundo plano. Las rutas de acceso público, Cartera y Seguridad comprueban la sesión; la existencia de una dirección o un archivo de vault ya no basta para entrar.
- Firma, respaldo, importación, derivación y recuperación protegida conservan su flujo de autorización sensible. El nuevo prompt de entrada no lee ni modifica el vault ni sus claves. La sesión no sustituye esos prompts.

## Formulario y pendientes

Antes de ocultar una pantalla autenticada se guardan únicamente los campos públicos ya autorizados: contexto, activo, destino e importe. La pantalla bloqueada no sobrescribe el contexto guardado en pausas posteriores. Cancelar una autenticación conserva esos campos. Después de autenticar se restaura el formulario; una revisión vuelve a edición, sin cotización vigente ni autorización reutilizable.

Regresar brevemente conserva los mismos campos y también exige cotización nueva para revisar el envío. Un proceso nuevo restaura el contexto público exclusivamente después del desbloqueo. Las rutas públicas soportadas son Home, Enviar, Recibir, Actividad y Gestión de activos; otras pantallas vuelven al Home, nunca a secretos visibles.

Si existe un envío pendiente, se continúa hacia Actividad y el mecanismo existente de reconciliación. No se reconstruye, firma ni retransmite otro pago por restaurar una pantalla. El nonce, los bytes firmados y el registro cifrado no cambian.

## Pruebas y candidato

16 comprobaciones dirigidas aprobadas: 6 nuevas AccessSessionTest, 4 ReadUxTest directamente afectadas y 6 ScreenCapturePolicyTest. Incluyen frontera exacta de expiración, acceso frío bloqueado a Cartera/Seguridad, solicitud de autenticación, expiración y restauración posterior, regreso breve, recreación, selección de red en sesión válida, pending sin reconstrucción, bloqueo de pantalla, callback obsoleto y capturas sensibles/operativas. No se repitieron las baterías históricas completas. Las pruebas usan fixtures y callbacks controlados; no representan prueba física de huella en Samsung.

assemblePilot y lintPilot: PASS. APK no depurable, com.laexwallet.testnet, versionCode 16, versionName 0.3.3-testnet. Certificado SHA-256: 55f1050d21de0c6501ad7c416ae8bf09df78077a6989104c5146b248b1690a69, igual al candidato anterior. Continúa siendo la firma histórica de pruebas, no una política de distribución Mainnet aprobada.

APK SHA-256: 27891b14524f05a3c617ec7034e3b88c757709d006005b3665de0247ccc9572b.

Cambios: MainActivity, AccessSession nuevo, versión en app/build.gradle, AccessSessionTest nuevo y adaptación de fixtures/expectativas de ReadUxTest y ScreenCapturePolicyTest. Los módulos criptográficos, catálogo, almacenamiento público, firma y recuperación cifrada se comparan con el manifiesto congelado 0.3.2 en PRUEBAS.json. No se añaden secretos, telemetría ni infraestructura.

## Regresión física pendiente

Actualizar sin desinstalar ni borrar datos y confirmar versión/dirección. Cerrar y reabrir: no debe mostrar cartera ni Seguridad antes de autenticar. Entrar con huella/PIN. Cambiar de cuenta/red dentro de la sesión: no pedir autorización de firma. Escribir destino/importe, salir menos de 60 segundos y regresar: campos conservados. Repetir esperando 60 segundos o bloqueando el teléfono: entrada bloqueada y campos restaurados tras autenticar. Cancelar y reintentar el desbloqueo tampoco debe borrar el formulario. Ver respaldo o autorizar envío debe conservar la protección sensible independiente. No es necesario realizar otro pago para esta regresión.

Pendiente validación física CEO/Arquitectura y autorización específica para publicar 0.3.3. El APK local permite Actualizar mediante el mismo identificador y certificado; no se modificaron formatos de almacenamiento de claves. No desinstalar ni borrar datos. Mainnet y Mandato B permanecen bloqueados.
