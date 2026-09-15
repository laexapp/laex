# Network & Asset Management — 0.3.9-testnet / versionCode 22

## Base aceptada por Arquitectura
0.3.8 es la base física aceptada: actualización, wallets/cuentas y aislamiento, ambas Testnet, envíos nativos, ERC-20 de prueba, sesión 60 segundos, formulario y último saldo conocido. CEO confirmó recuperación en otro Android de Cuenta 1 y reconstrucción de Cuenta 2 mediante Añadir cuenta. Esta aceptación procede del CEO, no de pruebas físicas realizadas por Ingeniería. Fallback físico por bloqueo de red diferido por Arquitectura; cobertura técnica existente conservada. No se repiten las baterías históricas completas.

## Reutilizado y completado
- Se conserva catálogo operativo BNB Testnet 97 y Polygon Amoy 80002, tBNB/POL/USDC, IDs persistentes, límites, confirmaciones, contratos, endpoints y gas. Moneda nativa y token mantienen identidad por red y contrato; símbolo no es una clave de identidad.
- El catálogo incorpora RPC fallback, estado y marca Testnet. ReliableRpc obtiene ambos endpoints del catálogo, sin cambiar selección, backoff ni retransmisión. Descriptores de planificación BNB Mainnet 56 / Polygon Mainnet 137 están ocultos, sin RPC, fuera del catálogo operativo y rechazados por network()/AccountScope. No son redes conectadas.
- Gestión ya tenía búsqueda, visibilidad y favoritos persistentes por wallet/cuenta/red. Se conserva y añade búsqueda por nombre. Mover al principio guarda el orden de todos los activos de la red en una sola escritura, conservando orden relativo; favoritos siguen delante y el botón explica el grupo. No hay migración de preferencias.
- Agregar por contrato pasa por ruta central habilitada y autenticación de acceso vigente. Primero exige contrato preautorizado para la red antes de cualquier RPC. Después consulta Chain ID, código, decimals y symbol. Solo acepta metadatos coincidentes con el catálogo. No hay entrada de RPC arbitrario ni alta dinámica de autoridad de firma. En BNB Testnet no hay token autorizado; se explica sin inventar activos.
- Se muestra red, contrato, símbolo, decimales y moneda del gas antes de confirmar visibilidad. USDC existente se muestra/reincorpora sin duplicarse. Fallos no cambian preferencias. Respuesta/confirmación ligadas a scope, dirección, epoch, sesión y pantalla; no se aplican al cambiar contexto o abandonar la pantalla. La operación es de lectura, no solicita autorización de firma.
- Pantalla de redes permite consultar la configuración real de la red seleccionada. Se conserva Home, navegación, paleta e identidad LAEX.

## Seguridad y evidencia
20 pruebas dirigidas PASS: 12 nuevas (6 motor/admisión y 6 UI/preferencias), 8 directamente afectadas (guardas de rutas, endpoints, catálogo/signaturas nativa/ERC-20/revalidación/identidad serializada y cambio de cuenta). Primera pasada: 18/19; un test comprobaba FLAG_SECURE antes del callback de dibujo. Se ajustó la sincronización del test, no la política de captura. Luego se validaron las seis pruebas UI, incluyendo salida de la pantalla antes de confirmar. Build assemblePilot y lintPilot PASS, sin errores de lint; advertencias registradas.

La consulta externa de SOLO LECTURA a Amoy primario confirmó 80002, contrato con código (1798 bytes), USDC y 6 decimales. Una consulta inicial por lote recibió HTTP 500; las cuatro llamadas individuales como las usadas por la app fueron correctas. No se firmó ni transmitió ninguna transacción y no se consultaron cuentas privadas.

Comparación por hashes con 0.3.8 confirma intactos 21 módulos protegidos: claves/cifrado/Keystore/BIP-39/derivación/firma, sesión, recuperación, aislamiento, motor de operaciones, pendientes y reglas de retransmisión; también se compararon segmentos de MainActivity de recuperación, ciclo de vida y cambio de contexto. Los tests de operaciones afectados prueban los catálogos consumidos por el firmante sin cambiar el firmante. Son pruebas técnicas JVM/Robolectric y capturas con datos artificiales sin saldo, no evidencia física del Samsung ni auditoría independiente.

La exigencia de symbol/decimals es una restricción del catálogo LAEX para este token autorizado. ERC-20 los define como opcionales; otros contratos requieren evaluación futura, no se aceptan automáticamente. Referencias: https://eips.ethereum.org/EIPS/eip-20 y https://docs.soliditylang.org/en/latest/abi-spec.html .

## Revisión física de este candidato
Instalar mediante Actualizar sin borrar datos. Revisar versión 0.3.9, wallets, cuentas y activos previos. En Polygon Amoy: ocultar USDC, buscar por nombre/contrato, modificar favorito/orden y comprobar persistencia al reabrir. Agregar el contrato USDC aprobado, verificar USDC/6 decimales/red 80002/gas POL y Mostrar en mi cartera. Repetir no debe duplicar el activo. En BNB Testnet no se acepta ese contrato ni se mezcla con tBNB. Revisar cambios de wallet/cuenta/red, saldo y actividad propios. Envío/recepción conservan flujos aprobados, pendientes de revisión física normal del candidato.

## Posterior, no implementado
UX opcional para recuperar varias cuentas sin conocer índices: documentada. Descubrimiento automático, backend, Mainnet, OMD, OMDB, precios, Web3, WalletConnect, compra y swap no habilitados. OMD es un activo pendiente de especificación/autorización por red y contrato; OMDB es una red/moneda distinta y no se deriva su identidad del nombre OMD. No se añaden datos OMD a redes por suposición. Expansión requiere catálogo explícito y revisión, nunca activación por símbolo.

APK no depurable, mismo identificador com.laexwallet.testnet y certificado histórico de actualización Testnet. Se publica solo rama de revisión. No constituye firma definitiva Mainnet ni aprobación de producción. Mainnet BLOQUEADO.

SHA-256 APK: fd776c48a1c94d20f132c1411f1092bcc666c97908f3b27949a98e511b94f5d5
