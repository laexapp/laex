# Integración oficial de Market Intelligence

## Flujo

Interfaz pública → Route Handler del servidor → Market Data Orchestrator → adaptadores CoinGecko/Binance → validación y normalización → caché → bundle con procedencia.

## Resiliencia

- Caché 25 segundos y ventana stale de 5 minutos.
- Deduplicación de solicitudes concurrentes.
- Timeout de 7,5 segundos.
- Un reintento con backoff.
- Circuit breaker tras tres fallos, con recuperación a los 60 segundos.
- Fuente secundaria completa; no mezcla parcial.
- Límite interno de 60 solicitudes por minuto.
- Estados: en vivo, retrasado, reconectando, pausado o no disponible.
- La gráfica deja de moverse si no llegan nuevos datos.

## Seguridad

Todas las llamadas externas se ejecutan en servidor. La clave opcional `COINGECKO_API_KEY` solo se lee desde entorno del servidor. No existen rutas de trading, firma, wallet, custodia, órdenes, pagos o datos privados.

## Catálogo

Se incorporan BTC, ETH, USDT, BNB, SOL, XRP, ADA, DOGE, TRX, AVAX, LINK, DOT, TON y POL mediante identidad interna, red, contrato cuando corresponde y providerId. OMD/OMDB permanece pendiente de confirmación del CEO. LAEX permanece conceptual.
