# Multi-wallet y multi-cuentas — candidato 0.3.4-testnet

## Base y alcance

CEO/Arquitectura declaró cerrado Redes + Activos Testnet tras la regresión física de 0.3.3 (versionCode 16). Se utiliza esa base; 0.3.2 permanece descartado. Este candidato no cambia redes, contratos, notificaciones ni habilita Mainnet, Web3, WalletConnect, Swap o Compra.

## Arquitectura y experiencia

Mis wallets muestra las wallets registradas. Seleccionar una muestra únicamente sus cuentas; seleccionar una cuenta cambia el contexto operativo. Se añaden nombres locales editables para wallet y cuenta. Home, recepción y revisión del envío identifican la selección; Actividad identifica cuenta y red y declara que es historial local. La dirección es secundaria en el selector.

Una wallet corresponde a un respaldo y a su archivo/alias protegido existente. Wallets adicionales mantienen identificadores UUID independientes. Añadir cuenta no genera entropía: utiliza el desbloqueo/derivación existente de la wallet elegida. Crear nueva wallet usa WalletCore.newEntropy y LocalVault.save existentes; importar usa validación BIP39 local y el mismo almacenamiento protegido. No se cambia el formato criptográfico ni sus parámetros.

Ruta conservada: `m/44'/60'/0'/0/i`, con `i` entre 0 y 100 inclusive. “Cuenta” en la interfaz significa aquí una dirección derivada en ese índice final, no otro componente BIP44 endurecido. Cuenta 1 es índice 0. Los índices siguientes son máximo registrado + 1; no se rellenan huecos ni se reutilizan cuentas registradas. El registro rechaza sustituir una dirección para la misma identidad y duplicar una dirección en otra wallet. Las operaciones protegidas en curso bloquean el cambio de contexto; no se ejecutan derivaciones concurrentes desde la interfaz.

Los nombres son metadatos públicos adicionales, hasta 40 caracteres y 5 palabras, sin modificar el índice de identidades. No introducir secretos en etiquetas. Renombrar no abre el vault. No se implementa eliminación de wallets/cuentas en este capítulo. Importar un respaldo ya registrado se rechaza para evitar duplicación local; debe seleccionarse su wallet existente.

## Aislamiento

AccountScope conserva wallet + índice + Chain ID. Los balances y formularios públicos incluyen además dirección y activo. Las preferencias de visibilidad/favoritos/orden son por wallet + cuenta + red + activo, nunca globales ambiguas. El motor existente sigue limitado a BNB Testnet y Polygon Amoy con tBNB, POL y el USDC autorizado.

Al cambiar contexto, selectScope invalida el borrador y la generación de respuestas asíncronas, cambia RPC contextual, preferencias, dirección y almacén de pendientes. Una respuesta de una consulta antigua no debe poblar otra cuenta. Cambiar durante autenticación o trabajo protegido se rechaza. El formulario público anterior queda separado bajo su identidad; no se transforma en un envío de la nueva selección.

La firma conserva scope, dirección de origen, Chain ID, activo, nonce, destino, valor y gas del borrador aprobado. submit verifica scope antes de usar el vault seleccionado; WalletCore verifica que la clave derivada del índice corresponda al origen. La revalidación RPC y el mecanismo de pendientes no se modifican. PendingStore mantiene aislamiento de archivo y contexto autenticado; una operación de otra cuenta/wallet se rechaza incluso si se copia su archivo.

Actividad utiliza exclusivamente las preferencias del contexto actual. Importar un respaldo recupera direcciones, no reconstruye historial local de otro dispositivo. Los depósitos se consultan como balance y el explorador ofrece la información de red. No se presenta una lista local como historial reconstruido.

## Compatibilidad y seguridad

Se conservan archivos originales, alias Keystore, registro accounts, direcciones, preferencias e historial. Las etiquetas se guardan en claves adicionales dentro del directorio público. La wallet legacy recibe nombres predeterminados sin reescribir su identidad. No hay migración de entropía/clave ni cambio de derivación.

La sesión de 0.3.3 permanece: 60 segundos en segundo plano, bloqueo del dispositivo y autenticación al recrear acceso. Seleccionar wallets/cuentas registradas dentro de una sesión válida no autoriza firma ni exige leer secretos. Crear/importar/derivar, respaldar y firmar mantienen su autorización sensible. No se añaden secretos a modelos, logs, telemetría o servidores. Las etiquetas son entrada del usuario: se indica expresamente no escribir secretos en ellas.

## Módulos

- AccountDirectory: agrupación, nombres y siguiente índice; registro de identidades existente conservado.
- MainActivity: navegación jerárquica, renombrado, selección de wallet para derivación y etiquetas de contexto.
- app/build.gradle: 0.3.4-testnet, versionCode 17.
- MultiWalletTest: comprobaciones nuevas dirigidas.

No se modifica la implementación de LocalVault, WalletCore, PendingStore/PendingRecovery, TestnetRpc, AccessSession ni AuthenticationFlow. El manifiesto identifica fuentes congeladas y PRUEBAS.json registra comparación con 0.3.3.

## Límites y regresión física pendiente

La prueba de actualización automatizada usa datos de formato anterior y verifica conservación; no equivale a instalar físicamente sobre el Samsung. CEO debe Actualizar sin desinstalar, comprobar dirección/historial anteriores, crear una wallet de prueba y una cuenta derivada, renombrarlas, alternar cuentas/redes y comprobar recepción/contexto y bloqueo. No hace falta repetir faucets ni múltiples transferencias. No compartir respaldos como evidencia.

Se conserva la firma histórica de Testnet para actualización; aún no es la política definitiva de Mainnet. El límite actual es 101 cuentas por wallet. Las pruebas con almacenamiento simulado no certifican hardware Keystore de otros dispositivos. La revisión independiente y Mainnet permanecen pendientes. No se publica el APK sin autorización expresa.

## Resultado congelado

24 comprobaciones PASS: 10 MultiWalletTest nuevas; 5 MandateAStorageTest, 1 MandateAUiTest, 6 AccessSessionTest y 2 ReadUxTest afectadas. Build assemblePilot y lintPilot PASS. Los 20 módulos de núcleo enumerados en PRUEBAS.json son idénticos por SHA-256 a 0.3.3. No se realizaron transferencias ni pruebas físicas.

APK no depurable, com.laexwallet.testnet, 0.3.4-testnet / 17. Misma firma verificada: 55f1050d21de0c6501ad7c416ae8bf09df78077a6989104c5146b248b1690a69.

SHA-256 APK: 620c934e50f9946e3375eaeb4faa1a1487c0f832d7ed0e72e14c5c841cca1a1c.

WalletShell.java: solamente normalizacion de finales de linea; sin cambios de comportamiento.
