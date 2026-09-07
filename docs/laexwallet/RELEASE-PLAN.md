# laexWallet — del prototipo a Android

Actualizado: 5 de septiembre de 2026.

## Decisiones de producto

Conservar el símbolo de flechas y una experiencia sencilla en español. Verde inspirado en USDT, con matices oliva de billete; cada activo conserva su identificación propia. La demo pública sigue siendo una simulación sin secretos ni conexión blockchain. El APK nativo será un producto separado, no una envoltura de la página web.

La meta incluye autocustodia, transferencias, tokens personalizados, varias redes y conexión a aplicaciones Web3. La entrega inicial funcional se limita a una red de pruebas para demostrar creación, respaldo, recuperación y transferencia de extremo a extremo.

## Entregas y aceptación

| Entrega | Resultado | Condición de aceptación |
| --- | --- | --- |
| 0. Experiencia | Demo móvil con verdes ajustados y menos desplazamiento | Navegación, importes, revisión y accesibilidad comprobados en pantallas pequeñas |
| 1. Android en testnet | APK con wallet local, respaldo, restauración, saldo, QR y envío de moneda nativa de prueba | Dos dispositivos de prueba pueden recibir/enviar; hash y destino coinciden en explorador; restauración reproduce dirección y acceso |
| 2. Tokens | Lectura y transferencias de token de prueba, alta por contrato | Validar red, contrato y decimales; distinguir saldo del token y moneda para gas; contratos inválidos no se agregan |
| 3. Primera red real | Versión candidata revisada antes de publicación | Auditoría independiente y correcciones, respaldo validado, política de privacidad, soporte, firma y proceso de actualización |
| 4. Varias redes EVM | BNB Smart Chain y Ethereum; OMDBLOCKCHAIN sujeta a validación | Pruebas por red de chain ID, RPC, gas, firmas, recibos, recuperación e historial; redes nunca se confunden por compartir dirección |
| 5. Web3 | Conexiones autorizadas a aplicaciones y después navegador integrado | Mostrar dominio, red, cuenta y acción; rechazar solicitudes no admitidas; revocar sesiones; ninguna web accede a la frase |
| 6. Intercambio | Swap en una red compatible | Proveedor evaluado, cotización/comisión/deslizamiento visibles, límites de aprobación y simulación verificados |

Esta tabla es el orden de trabajo, no una afirmación de que estas funciones estén implementadas. Los hitos no tienen aún una fecha ni presupuesto acordado.

## Base técnica propuesta

Android nativo con Kotlin y Jetpack Compose. Seleccionar y revisar una biblioteca de claves/firma mantenida antes de programar el firmante. La protección local se diseña con Android Keystore, comprobando sus capacidades por dispositivo; no se presupone soporte de claves secp256k1 no exportables. El respaldo de recuperación es controlado por el usuario, sin copia en servidores LAEX.

El adaptador EVM separa `Chain`, `Asset`, `UnsignedTransaction`, `LocalSigner`, `RpcClient` y seguimiento de recibos. Un activo se identifica por cadena y dirección de contrato, no por nombre o logo. Los importes reales usarán enteros de precisión arbitraria; el modelo numérico ficticio de la demo no es el núcleo de producción.

BNB Smart Chain testnet es el candidato para el primer APK. Usar solo activos sin valor y nombres explícitos de prueba; no presentar un token de prueba como USDT auténtico. Ethereum comparte estándares EVM, pero se valida por separado. Bitcoin, Solana y otras familias requieren adaptadores y pruebas adicionales.

Para OMDBLOCKCHAIN solicitar o corroborar documentación técnica oficial: chain ID, RPC HTTPS, moneda de gas, explorador, red de pruebas, formatos de transacción y finalización. Los datos presentes en una guía son pistas, no certificación de compatibilidad.

Las conexiones Web3 deben comenzar con un protocolo de sesiones como WalletConnect, sujeto a revisión de su SDK y términos. El navegador integrado necesita aislamiento de contenido, permisos por dominio y cuenta, protección frente a redirecciones y confirmaciones de firmas comprensibles. Conectar una aplicación no autoriza automáticamente a gastar activos.

## Lo que debe aportar el titular de LAEX

1. Un Android de prueba y su modelo/versión; idealmente un segundo dispositivo para comprobar recuperación. No usar la frase de una wallet con fondos.
2. Datos sobre empresa existente y país real de operación, más países de lanzamiento. Determinar con asesoría local la entidad adecuada antes de registrar cuentas a nombre de terceros.
3. Cuenta de Google Play Console de la organización, documentación y D-U-N-S cuando corresponda. Mantener propiedad y recuperación de cuenta bajo control del titular.
4. Correo de soporte, responsable de privacidad y textos legales revisados para las funciones efectivamente lanzadas.
5. Presupuesto acordado para proveedores de red, distribución, mantenimiento y auditoría independiente antes de fondos reales. Cotizar después de definir alcance y usuarios; no comprar servicios por adelantado sin necesidad.

La demo ya se consulta en `https://www.laexapp.com/laexwallet`. Publicar esa página no publica una wallet Android ni la habilita para recibir fondos. El siguiente artefacto de uso será el APK de pruebas; la distribución pública en Play llegará después de las verificaciones técnicas y de cuenta.

## Políticas verificadas

Google indica cuenta de organización para servicios financieros, incluidas wallets de criptomonedas, y exige D-U-N-S para esa cuenta: https://support.google.com/googleplay/android-developer/answer/13634885?hl=en

Google excluye actualmente las wallets no custodiales de su política específica de exchanges y software wallets. Esa exclusión no equivale a una exención de toda política de Play ni de obligaciones legales locales. Revaluar al incorporar swaps: https://support.google.com/googleplay/android-developer/answer/16329703?hl=en

No se determina aquí una licencia aplicable ni se recomienda una jurisdicción extranjera sin conocer empresa, operación y mercados.
