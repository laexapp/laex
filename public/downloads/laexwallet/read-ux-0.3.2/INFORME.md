# LAEX Wallet — Redes + Activos Testnet 0.3.2

## Alcance y evidencia física

CEO/Arquitectura reportó pruebas físicas satisfactorias en BNB Testnet 97 y Polygon Amoy 80002, incluyendo 20 USDC recibidos y 1.234567 USDC enviados. Este informe reconoce ese reporte; no lo sustituye por fixtures ni afirma una verificación independiente de un hash USDC no adjuntado en el mandato.

Se conserva BLOQUEADO PARA MAINNET. No se añaden redes, tokens, precios, Web3, WalletConnect, Swap o Compra. La entrega es un candidato Testnet para regresión física corta.

## Actualización y estados

El Home muestra estado y fecha del último saldo conocido. La caché pública local se identifica por wallet, índice de cuenta, Chain ID y dirección; contiene únicamente identificadores de activos, cantidades atómicas y fecha. Nunca autoriza una firma ni sustituye la revalidación RPC de un envío.

Entrar/regresar a Cartera, volver de otra aplicación, seleccionar cuenta/red registrada, completar un envío, consultar un cambio de estado o recuperar conectividad solicita una lectura automática. No se borra el saldo para iniciar la consulta. Ante error se conserva la última instantánea válida completa: no se representa cero ni se eliminan activos. Sin lectura previa se muestra guion, no cero.

Estados: saldo actualizado; actualizando con último saldo conocido; RPC temporalmente no disponible; sin conexión. La fecha permite distinguir una lectura antigua. Las operaciones mantienen pendiente, confirmada, fallida o estado por comprobar. No se confunde el fallo de consulta posterior al broadcast con un envío fallido.

Coalescencia: una consulta automática en vuelo, mínimo 10 segundos entre inicios; eventos simultáneos se agrupan. Errores: reintentos tras 10, 30 y 60 segundos; después se detienen hasta un nuevo evento de navegación/conectividad o Actualizar. Un pending conocido se consulta cada 30 segundos, hasta seis continuaciones por ciclo en primer plano. No hay polling periódico general cuando no existe pending. Al pasar a segundo plano se eliminan temporizadores; una petición ya iniciada puede terminar por timeout, pero su respuesta no restaura pantallas ni dispara nuevas consultas de esa sesión.

El refresco captura contexto y generación de la vista; descarta respuestas tardías tras cambiar cuenta/red/sesión. No sustituye un formulario ni una pantalla sensible. No modifica el registro cifrado ni elimina el bloqueo de pending. Finalizar mantiene la conciliación protegida existente. Una consulta pública de confirmación puede actualizar Actividad sin autorizar un nuevo envío.

## Persistencia y autenticación

PublicViewStore conserva localmente cuenta/red/ruta y, al salir de la app, activo, dirección parcial válida e importe de un formulario sin firmar. Solo acepta campos con forma de dirección hexadecimal y cantidad numérica: no serializa el texto arbitrario introducido ni campos de respaldo, PIN o contraseña. Tampoco almacena borradores firmables, nonce, gas, autorizaciones o claves. Se conserva la última cuenta/red al recrear el proceso.

Una revisión restaurada vuelve a edición y exige cotización nueva, revisión y autenticación antes de firmar. La autorización anterior nunca se restaura. Antes de iniciar el envío se descarta el formulario público; si ese descarte falla, no se continúa. Si hay hash pendiente, la restauración dirige a Actividad y a la conciliación existente, sin reconstruir un pago. Las operaciones firmadas permanecen exclusivamente bajo el mecanismo cifrado previamente aprobado.

Consultar saldos, cambiar de red y seleccionar una cuenta ya registrada utilizan únicamente su dirección pública y no abren el vault. Las cuentas nuevas/derivadas sí requieren autenticación cuando necesitan generar, importar o derivar claves. Se mantienen autenticación fuerte para firma, respaldo, importación y acceso al registro cifrado de recuperación. La huella/PIN y parámetros de Keystore no se modifican. La app oculta y descarta secretos al salir; puede restaurar la vista pública sin firmar. El botón Bloquear ahora oculta la vista hasta entrar nuevamente; la opción explícita de PIN permanece disponible.

La caché pública puede mostrar información antigua o ser alterada en un dispositivo comprometido; no es evidencia de saldo gastable ni autoridad de firma. Se conserva la comprobación de la dirección derivada durante la firma y todas las revalidaciones previas. No se promete resistencia a un dispositivo comprometido.

## Revisión del pipeline USDC existente

Contrato autorizado: 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582, únicamente Chain ID 80002. AssetCodec transforma 1.234567 USDC en 1234567 unidades; AssetEngine verifica código/decimales, consulta balanceOf y estima gas para transfer(destino,1234567). La comisión permanece en POL. WalletCore firma el contrato como destinatario de la transacción EVM, valor nativo cero, calldata ERC-20 y Chain ID Amoy. PendingOperation verifica los mismos campos contra los bytes firmados. PendingRecovery exige recibo canónico, 12 confirmaciones y Transfer coincidente; retransmite solo bytes/hash existentes cuando la evidencia lo permite. Esta misión no genera ninguna transferencia para comprobarlo.

## Notificaciones: preparada, no habilitada

IncomingFunds define un evento público con contexto, dirección, activo, cantidad, hash e índice del evento. No se emiten notificaciones ni se infiere un ingreso por una mera diferencia de balance. No hay backend, push, token FCM, servicio permanente, permisos de notificaciones ni telemetría nuevos.

Propuesta para Arquitectura: detector optativo respaldado por receipts/logs confirmados, deduplicado por cuenta/red/hash/índice. Para nativos se requiere evidencia transaccional equivalente. Debe definirse cobertura en segundo plano, permisos, privacidad de direcciones y proveedor antes de implementar. Un indexador o servicio push exige aprobación separada; no se incorporó en este capítulo.

## Módulos afectados

- MainActivity: ciclo de vida público, restauración, coordinación de lecturas, conectividad y refresco de Actividad.
- PublicViewStore: caché y formulario públicos por contexto.
- RefreshBudget: coalescencia y límites de reintento.
- SendForm: restauración de campos sin reutilizar cotización.
- IncomingFunds: interfaz futura; sin implementación ni emisión de avisos.
- AndroidManifest: permiso normal ACCESS_NETWORK_STATE para observar conectividad; sin permisos de secretos/notificaciones.
- app/build.gradle: 0.3.2-testnet, versionCode 15.
- ReadUxTest: pruebas nuevas de lectura/restauración y límites.

Referencias Android consultadas: https://developer.android.com/develop/connectivity/network-ops/reading-network-state y https://developer.android.com/guide/components/activities/activity-lifecycle . Se usan callbacks de conectividad mientras la actividad está visible y se retiran al detenerla.

## Regresión física corta propuesta

Actualizar sin desinstalar ni borrar datos. Verificar versión y dirección. Entrar al Home y comprobar lectura automática; cambiar entre cuentas y las dos Testnets sin autenticación de firma. Desde Enviar USDC escribir destino/importe, salir a otra app y regresar: mismos datos, pero revisión deshabilitada hasta cotización nueva. Probar modo avión y reconexión: saldo anterior con estado visible, no cero. Si se realiza un envío de prueba autorizado por CEO, verificar refresco de saldo y Actividad, y que Finalizar conserva la protección contra duplicación. El dispositivo no debe solicitar palabras para actualizar. Nunca adjuntar respaldo o PIN como evidencia.

Pendiente: aprobación física de Arquitectura; definición posterior de notificaciones completas y autorización separada para publicar este candidato en una rama pública. No hay autorización Mainnet.

## Resultado del candidato congelado

22 comprobaciones dirigidas aprobadas: 13 nuevas ReadUxTest y 9 regresiones afectadas (6 ScreenCapturePolicyTest, 2 SendFormTest y 1 AmoyRecoveryTest). Incluyen recreacion del proceso, aislamiento de respuestas tardias, caché ante errores, restauracion sin autorizacion, conectividad y confirmacion sin liberar pendientes. assemblePilot y lintPilot: PASS. No se repitio la bateria historica completa ni se realizo una nueva transferencia.

16 modulos del nucleo se compararon mediante SHA-256 con el manifiesto 0.3.1 y permanecen identicos; el detalle figura en PRUEBAS.json. La coordinacion de lecturas y autenticacion de la interfaz si cambio conforme al mandato. No se agregaron semillas, claves, PIN ni telemetria al almacenamiento nuevo.

APK: 0.3.2-testnet; versionCode 15; com.laexwallet.testnet; no depurable. Firma verificada y coincidente con 0.3.1: 55f1050d21de0c6501ad7c416ae8bf09df78077a6989104c5146b248b1690a69. Sigue siendo el certificado historico Android Debug de pruebas: no constituye una politica de firma Mainnet aprobada.

SHA-256 APK: 8f9238a73e3d703f1ea10600d0e2f84bcdd8f705ef7dd679cb4c5d033d44c095.

Instalable mediante Actualizar, sin desinstalar ni borrar datos. No se modificaron formatos/aliases del vault ni el mecanismo de migracion; la conservacion fisica en Samsung debe comprobarla CEO. Candidato preparado localmente; pendiente autorizacion especifica de publicacion y regresion fisica. BLOQUEADO PARA MAINNET.
