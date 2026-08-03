# Proveedores reales — MISSION X-05

## CoinGecko

Fuente primaria agregada. El laboratorio usa Keyless Public API cuando `COINGECKO_API_KEY` no existe. Está destinada a experimentación de bajo volumen, tiene límites dinámicos compartidos por IP y no ofrece fiabilidad comercial. Para producción, el servidor acepta `COINGECKO_API_KEY` y cambia a Pro API sin enviar la clave al navegador.

Datos utilizados: `/coins/markets`, `/coins/{id}/ohlc` y `/coins/{id}/tickers`. Actualización de LAEX: catálogo cada 30 segundos; ficha cada 30 segundos; caché interna 25 segundos. La frescura real depende del plan y endpoint.

Estimación consultada el 3 de agosto de 2026, sin impuestos:

- Keyless / Demo: USD 0, solo evaluación; Demo exige atribución, 10.000 créditos/mes y 100 solicitudes/minuto.
- Basic: USD 35/mes o USD 29/mes con facturación anual; 100.000 créditos y licencia comercial.
- Analyst: USD 129/mes o USD 103,20/mes anual; 500.000 créditos, datos en tiempo real y WebSocket.
- Lite: USD 499/mes o USD 399,20/mes anual; desde 2 millones de créditos.
- Enterprise: cotización; SLA y licencia personalizada.

Los precios pueden cambiar y deben confirmarse antes de contratar.

## Binance Market Data Only

Fuente secundaria para pares soportados mediante `https://data-api.binance.vision`. Solo se consultan endpoints públicos `ticker/24hr` y `klines`, clasificados como seguridad `NONE`. No se configuran claves ni endpoints `TRADE`, `USER_DATA` o `USER_STREAM`.

Los límites son por IP y peso. Un 429 activa backoff; infracciones repetidas pueden producir bloqueo 418. Binance no publica un precio separado para estos endpoints públicos, pero su disponibilidad, jurisdicción y condiciones deben ser revisadas legalmente antes del uso comercial.

## Procedencia

Cada respuesta incluye proveedor, endpoints normalizados, hora observada, estado, caché, fallback y errores controlados. Datos de fuentes distintas nunca se suman dentro de una misma observación: si CoinGecko falla, el bundle completo procede de Binance.
