# Mandato A — candidato 0.3.0-testnet

## Dictamen: BLOQUEADO PARA MAINNET

Este candidato permite revisar avances A1/A2/A3 en Testnet. No equivale al cierre completo de A1 ni a una autorización de piloto real. Etapa 1 conserva su cierre histórico; las garantías afectadas por la nueva arquitectura se revalidaron de forma dirigida.

## A1 — Motor y activos

NetworkCatalog es la única autoridad local de redes y activos. AccountScope identifica wallet, índice derivado y red. AssetEngine prepara cotizaciones nativas mediante contexto explícito, valida Chain ID, límite de importe, gas y saldo. WalletCore firma usando la cuenta derivada y el contexto del borrador, no la selección visual posterior. La ruta nativa de TestnetRpc utiliza el motor nuevo.

AssetCodec y AssetEngine incorporan cantidades exactas por decimales, ABI ERC-20 balanceOf/transfer, comprobación de decimales de contrato y comisión separada del saldo del token. La rama de tokens no tiene un contrato aprobado en el catálogo. No se permite añadir uno arbitrariamente ni sustituir un RPC desde el formulario. Solo BNB Testnet 97/tBNB está habilitado. El motor se limita a EVM con transacciones legacy de gasPrice; EIP-1559 y redes no EVM no están calificadas.

Estado de activos: búsqueda, visibilidad y favoritos reales y persistentes, aislados por wallet/cuenta/red. Orden persistente disponible en el modelo y comparador; con un solo activo no se presenta un ordenamiento ficticio. El formulario de contrato solo acepta el catálogo. No se añadieron OMD, OMDB, USDT, Mainnet, precios, Web3, WalletConnect ni compra.

Pendiente A1: autorizar una segunda Testnet y un contrato de token de prueba, completar pruebas integradas de transferencia/recuperación y su presentación por activo. Las pruebas de ABI y rechazo de contratos no sustituyen ese ciclo. No declarar soporte multired/tokens comercial completo con este candidato.

## A2 — Wallets y cuentas

La wallet original mantiene wallet-testnet.vault y su alias anterior. Nuevas wallets usan identificadores aleatorios públicos, archivos y aliases separados. Las cuentas derivadas comparten respaldo de su wallet y utilizan m/44'/60'/0'/0/i. Índice limitado a 0..100. No hay eliminación de wallets.

Mis cuentas permite crear/importar otra wallet de prueba, derivar cuentas y seleccionar. El índice almacena únicamente walletId, índice y dirección pública verificada mediante derivación. Rechaza direcciones duplicadas entre entradas. Importar un respaldo que ya está registrado indica seleccionar la cuenta existente. Al reiniciar se abre la wallet original; la selección adicional se realiza desde Mis cuentas. Recuperar una cuenta derivada requiere recuperar su wallet y recrear su índice, no un respaldo distinto.

El cambio de cuenta invalida el borrador, saldo y callbacks anteriores y bloquea la sesión. Se impide durante autenticación o trabajo activo. El envío revisado comprueba contexto antes de firmar; firma y RPC vuelven a verificar dirección/red. Las consultas pendientes capturan el RPC de su contexto.

Actividad, comprobación de respaldo, saldos y pendientes se separan por contexto. Los pendientes nuevos contienen walletId, accountIndex y assetId públicos, además del registro autorizado anterior. Archivos cifrados y AAD separan contextos, incluso cuando dos cuentas derivadas utilizan la misma clave AES de su wallet. No se genera una nueva operación durante recuperación.

## A3 — Evidencia y límites

52 comprobaciones dirigidas: 14 nuevas (motor 6, almacenamiento 5, UI/contexto 3), más 38 de componentes afectados (WalletCore 5, TestnetRpc 3, SendQuote 4, PendingRecovery 9, PendingStore 3, VaultUpgrade 6, política de capturas 6 y disponibilidad central 2). Todas pasaron. El ajuste final de límite de gas al firmar y el render de identificación/icono se verifican repitiendo únicamente 12 de esos casos. Compilación y lint del candidato no depurable forman parte del cierre técnico.

Migración comprobada localmente: ruta y bytes originales preservados; registros de pendientes antiguos sin los tres campos nuevos se interpretan como cuenta original, sin reconstruir firma/hash; cifrado alterado, clave incorrecta y lectura cruzada fallan de forma cerrada. No se realizó una actualización física en Samsung desde esta sesión: adb no detectó dispositivos. Los tests no equivalen a auditoría independiente ni a prueba física de Keystore.

Mis cuentas → Comprobar protección del dispositivo permite leer localmente KeyInfo: TEE/StrongBox/software cuando la API lo informa, requerimiento de autenticación, aplicación por hardware, tipo y duración. No transmite secretos ni resultados a un servidor. CEO debe aportar esa pantalla pública para incorporar la evidencia física. No se presupone StrongBox.

## Bloqueos para valor real

1. A1 no está calificado con otra red y token autorizados: falta el ciclo integrado completo y la adaptación/validación del flujo de token habilitado.
2. Falta prueba física de actualización 0.2.1 → 0.3.0, creación/importación/derivación, selección, recuperación y un envío Testnet desde cuentas distintas sin mezclar datos.
3. Falta lectura real de protección Keystore/autenticación en el Samsung piloto.
4. Falta revisión independiente y corrección de hallazgos que afecten fondos, aislamiento o recuperación.
5. Firma de distribución para valor real no establecida: el candidato no depurable mantiene el certificado Android Debug anterior exclusivamente para actualizar pruebas. Hace falta firma release bajo custodia controlada, gestión de accesos/recuperación y estrategia de identidad/instalación antes de Mainnet. No se reemplaza la firma silenciosamente ni se promete actualización directa con una clave distinta.
6. Mainnet inicial, activo, límites de importe/comisión, criterios de confirmación y autorización física de CEO todavía pendientes.

## Revisión física propuesta (sin dinero real)

Actualizar sin desinstalar/borrar datos. Comprobar 0.3.0-testnet en Seguridad, dirección original y saldo consultado. Revisar Actividad original antes de nuevos envíos. Desde Mis cuentas, obtener la lectura de protección y probar cuenta derivada/otra wallet exclusivamente con respaldos de prueba. Comprobar que cada cuenta muestra su dirección y su actividad, y que volver a la original conserva sus registros. No compartir palabras, PIN ni claves; solo capturas operativas y hashes públicos.

## Distribución y congelación

Build pilot: no depurable, applicationId com.laexwallet.testnet, versionCode 13, versionName 0.3.0-testnet. Firma histórica de actualización conservada. APK, fuentes de la instantánea y evidencia se identifican por SHA-256. El icono adaptativo mantiene el símbolo LAEX en fondo verde con iluminación menta y se renderiza en máscaras redondeadas.

Mandato B no iniciado. La revisión física del candidato no concede autorización para depositar valor real.
