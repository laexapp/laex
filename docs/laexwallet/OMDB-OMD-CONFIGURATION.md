# OMDB y OMD preconfigurados

Comprobación de lectura del 7 de septiembre de 2026. No se firmaron ni difundieron transacciones.

| Configuración | Red | Datos |
| --- | --- | --- |
| Moneda nativa OMDB | OMDBlockchain | Chain ID 9580; RPC https://rpc.omdbscan.com; explorador https://omdbscan.com |
| Token OMD | BNB Chain (56) | Contrato 0xA7670e2e6742a18029436E262b01F7C50A863C40; 8 decimales |

El RPC de OMDB devolvió `eth_chainId = 0x256c` (9580). Para el contrato indicado, `eth_getCode`, `symbol()`, `decimals()` y `name()` devolvieron `0x` en OMDB.

El RPC https://bsc-dataseed.bnbchain.org devolvió código de contrato (12390 caracteres de resultado hexadecimal), `symbol() = OMD` y `decimals() = 8` para esa dirección en BNB Chain. Esto verifica presencia y metadatos según los RPC consultados; no certifica autenticidad comercial, seguridad, liquidez ni ausencia de restricciones de transferencia. No se asocia este contrato a OMDBlockchain.

La demo carga ambos ajustes automáticamente, incluso tras reiniciarla. OMD se lista en BNB Chain; OMDB aparece al seleccionar OMDBlockchain. Los saldos siguen siendo ficticios o cero y no hay conexión RPC desde el navegador. Los ejemplos de envío e intercambio siguen usando USDT/BNB.

Para la versión real: núcleo Android con firma local y respaldo, verificación de restauración en dispositivos de prueba, adaptadores de red con gas/nonce/recibos, pruebas en testnet y auditoría independiente antes de una prueba limitada de fondos reales. Falta comprobar una testnet oficial OMDB y su comportamiento de firma/confirmación. La incorporación de esta configuración no equivale a habilitar transferencias reales.
