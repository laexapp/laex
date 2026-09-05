# laexWallet — arquitectura inicial

Estado: demostración de producto, 5 de septiembre de 2026.

## Objetivo

Wallet Android de autocustodia: crear y recuperar una wallet, consultar activos, recibir y enviar en una sola red. El intercambio se evaluará después de validar esa base. BNB Chain es una propuesta visual para el prototipo, no una decisión irrevocable ni una integración ya disponible.

## Entrega de esta etapa

Ruta pública de demostración: `/laexwallet`. Aplicación web adaptable a móvil, no APK Android.

- Bienvenida y explicación inicial de autocustodia.
- Balance ilustrativo, ocultación de saldo y dos activos ficticios.
- Envío con selección de moneda, destinatarios ficticios, cantidad, saldo disponible, comisión simulada, revisión y confirmación.
- Recepción simulada, identificador no válido en blockchain y QR que contiene `LAEXWALLET:DEMO:NOT-A-PAYMENT-ADDRESS`.
- Historial, filtros y detalle local de movimientos.
- Educación sobre respaldo sin generar ni solicitar palabras reales.
- Intercambio y biometría señalados como capacidades futuras.
- Reinicio confirmado y retorno al estado inicial al recargar.

No contiene claves privadas, frase real, firma criptográfica, conexión RPC, proveedor de swaps, banco, explorador de transacciones, base de datos ni persistencia de saldos. Los precios y la comisión son constantes ilustrativas. Las referencias `DEMO-*` no son hashes de blockchain. El formulario de envío rechaza direcciones reales.

## Separación actual

| Archivo | Responsabilidad |
| --- | --- |
| `app/laexwallet/page.tsx` | Ruta y metadatos sin indexación |
| `modules/laex-wallet/WalletDemo.tsx` | Recorridos, formularios y estado de sesión |
| `modules/laex-wallet/wallet-demo.css` | Identidad visual aislada y adaptación móvil |
| `modules/laex-wallet/demo-model.ts` | Operaciones ficticias y validación en unidades enteras |
| `tests/laex-wallet-demo.test.mjs` | Casos límite de cantidades, fondos y comisiones |
| `public/wallet-demo/receive-demo.svg` | QR no utilizable para pagos |

El modelo demo no debe convertirse en un firmante real agregándole un RPC. Está deliberadamente separado del futuro núcleo criptográfico.

## Arquitectura propuesta para Android

1. **Presentación:** pantallas Android, navegación, accesibilidad y estados claros de carga/error. Kotlin y Jetpack Compose son candidatos; la decisión se valida antes del primer APK.
2. **Casos de uso:** crear, respaldar, recuperar, consultar, preparar envío, revisar, autorizar y seguir su estado.
3. **Dominio:** red, activo identificado por red y contrato, cantidad en unidades enteras, transacción, comisión y estado de confirmación. Sin depender de pantallas ni un proveedor concreto.
4. **Gestión local de claves:** biblioteca criptográfica mantenida y revisada; cifrado local y protección con las capacidades disponibles de Android. Las garantías del hardware y los requisitos de recuperación deben comprobarse por dispositivo. No inventar criptografía ni afirmar que todas las claves de blockchain pueden vivir directamente en Android Keystore.
5. **Adaptador de red:** consulta de saldos, estimación, nonce, preparación, difusión y confirmaciones. Debe distinguir token de moneda nativa, cadena y contratos; manejar RPC caído, cambios de comisión y reorganizaciones.
6. **Autorización local:** el usuario revisa importe, dirección completa, red y comisión antes de firmar. Ningún servidor LAEX conserva una clave maestra. Una operación en revisión debe invalidarse si cambian sus datos.
7. **Infraestructura mínima:** distribución, actualizaciones y, si hace falta, lectura pública. Logs y métricas deben excluir secretos y minimizar exposición de direcciones. Un RPC externo puede observar consultas de direcciones e IP: autocustodia no significa anonimato.

## Secuencia de entregas

### A. Validar experiencia (actual)

Recorrer la demo con usuarios principiantes y ajustar comprensión, letras, navegación y errores. Definir red, activos, países de lanzamiento, nombre legal y presupuesto operativo.

### B. Primer APK en red de pruebas

Crear claves reales únicamente para pruebas, comprobar respaldo y restauración en otro dispositivo de prueba, consultar saldo y enviar/recibir activos sin valor real. Pruebas de bloqueo, segundo plano, desinstalación/restauración y pérdida de conectividad. Un explorador debe mostrar las transacciones efectivamente difundidas.

### C. Preparación para fondos reales

Modelo de amenazas, revisión criptográfica, auditoría independiente, corrección de hallazgos, validación legal, privacidad, gestión de incidentes, soporte y publicación Android. Control estricto de firma de releases y dependencias. Criterios de aceptación explícitos; no basta que una transacción funcione.

### D. Intercambio

Evaluar proveedor y jurisdicciones, liquidez, validación de calldata y destinatario, permisos de tokens, deslizamiento, cotizaciones vencidas y comisiones transparentes. No habilitar puentes entre redes en la primera entrega de swaps. La ausencia de bancos y de custodia no elimina automáticamente las obligaciones por facilitar intercambios.

## Riesgos que deben resolverse antes del lanzamiento

- Dispositivo comprometido, captura de pantalla, portapapeles y exposición de respaldo.
- Dependencias maliciosas y distribución de APKs falsos.
- Sustitución de destinatario, red incorrecta, metadatos falsos de tokens y decimales incorrectos.
- Doble envío, nonce en conflicto, transacción fallida o pendiente y estimaciones caducadas.
- Pérdida de frase: LAEX no tendrá capacidad de recuperar fondos por el usuario.

## Verificación reproducible del modelo

`node --experimental-strip-types --test tests/laex-wallet-demo.test.mjs`

Las pruebas del prototipo validan comportamiento de simulación. No constituyen auditoría de una wallet real.
