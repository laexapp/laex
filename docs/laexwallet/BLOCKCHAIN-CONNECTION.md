# laexWallet: qué falta para operar en blockchain

7 de septiembre de 2026. Guía para el titular de LAEX.

## Qué tienes hoy

Una aplicación web de demostración con recorridos de bienvenida, respaldo educativo, recuperación ficticia, envío, recepción, historial, intercambio de ejemplo USDT a BNB, alta y eliminación de redes, alta y ocultación de tokens, contactos, preferencias, bloqueo visual, navegador ficticio y conexión/autorización/desconexión Web3.

Todo vive en memoria y se reinicia al recargar. Las redes añadidas no se consultan. Los contratos introducidos se validan por su formato, no por su existencia ni seguridad. No hay claves, firmas, WalletConnect real, cámara, huella, contraseña, precios de mercado ni fondos. OMDBlockchain está preconfigurada con Chain ID 9580; su compatibilidad operativa sigue pendiente. OMD está preconfigurado en BNB Chain con 8 decimales. Ver OMDB-OMD-CONFIGURATION.md. Los saldos y movimientos utilizables corresponden al escenario BNB Chain; otras redes comienzan sin saldo de ejemplo.

Esta entrega permite revisar los recorridos principales del producto. No es una wallet terminada para producción, un APK, una auditoría ni una copia de todas las funciones de Binance o SafePal.

## Qué significa conectar la wallet

No es activar un interruptor en la demo. Se construirá un núcleo Android que genere y proteja claves localmente mediante bibliotecas revisadas, restaure el mismo acceso desde un respaldo y firme únicamente tras la autorización del usuario. Luego se integrarán RPC, consulta de saldos, gas, nonce, difusión y seguimiento de confirmaciones. El historial real se debe reconciliar con la red, no deducirse solo de lo que ocurrió en el teléfono.

Primer hito: instalar en el Samsung A55 un APK de testnet, recibir moneda sin valor, enviar a otro dispositivo, verificar el hash en el explorador y restaurar la cuenta en un entorno de prueba. El respaldo, la seguridad y la firma se validan antes de habilitar una red con fondos reales.

## Permisos y costes: son cosas distintas

| Concepto | Qué significa para LAEX |
| --- | --- |
| Acceso a una blockchain pública | En Ethereum no se compra una licencia a la red para desarrollar una wallet. Sus interfaces públicas son accesibles sin una autorización comercial del protocolo. Otras redes deben comprobarse individualmente. |
| RPC e historial | Se puede usar infraestructura propia o un proveedor. Planes, límites, condiciones y costes dependen del servicio y del volumen. |
| Gas | Las transacciones y operaciones de contratos consumen comisiones de red. No es un pago por registrar la marca ni una mensualidad de LAEX. |
| Web3 | Una integración de sesiones requiere seleccionar SDK, registrar el proyecto cuando corresponda y revisar licencias y condiciones del proveedor. No confundir el SDK Reown WalletKit con otros productos de nombre similar. |
| Intercambios | Requieren proveedor o integración DEX, disponibilidad por país, cotizaciones, liquidez, permisos de contratos y revisión jurídica. Pueden existir comisiones y acuerdos comerciales. |
| Distribución Android | Cuenta del titular, verificación empresarial, documentos y requisitos de Google Play. Publicar la web no publica el APK en la tienda. |
| Operación | Presupuestar mantenimiento, soporte, revisión legal y auditoría independiente. Los precios se cotizan según el alcance; no existe aquí un presupuesto aprobado. |

## Lo que prepararás tú

1. Confirmar la entidad legal, dirección real y países de lanzamiento con asesoría local. El dominio no sustituye el registro empresarial.
2. Preparar la cuenta de organización de Google Play bajo tu control, con los documentos y D-U-N-S requeridos. Te guiaremos por cada formulario; no hace falta compartir contraseñas en el chat.
3. Disponer del Samsung A55 para pruebas y, cuando corresponda, un segundo dispositivo de prueba para recuperación.
4. Definir correo de soporte, responsable de privacidad y presupuesto de revisión y operación.
5. Facilitar documentación oficial de OMDBLOCKCHAIN si se decide incluirla: chain ID, RPC, gas, explorador y testnet. La presencia en el diseño no certifica compatibilidad.

## Fuentes verificadas

- Ethereum: acceso sin permiso para crear wallets e interfaces: https://ethereum.org/latest/why-build-on-ethereum/
- Ethereum: contratos y gas: https://ethereum.org/developers/docs/smart-contracts/
- Reown WalletKit: integración de conexiones de wallets: https://docs.reown.com/walletkit/overview?platform=android
- Google: tipo de cuenta y D-U-N-S: https://support.google.com/googleplay/android-developer/answer/13634885?hl=en
- Google: las wallets no custodiales están fuera de su política específica de exchanges/software wallets; esto no elimina las demás políticas ni las obligaciones legales locales: https://support.google.com/googleplay/android-developer/answer/16329703?hl=en

La aplicabilidad legal se evalúa con la entidad, funciones y mercados reales. No se afirma que operar sin bancos elimine licencias o responsabilidades.
