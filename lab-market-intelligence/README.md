# LAEX Market Intelligence Laboratory

Laboratorio independiente para demostrar contratos, modelos de datos y separación entre análisis editorial y actividad comercial.

## Fronteras

- No usa Firebase, Auth, Wallet, pagos ni APIs externas.
- Todos los precios, gráficos, órdenes e indicadores son simulados.
- `AnalysisReport` no admite referencias comerciales.
- `CommercialOrder` no admite referencias a informes de análisis.
- La superficie pública se demuestra en `/market`; `/mercado` permanece intacta.

## Recorridos

- Mercado público: `/market`
- Ficha de activo: `/market/bitcoin`, `/market/ethereum`, `/market/omd`, `/market/laex`
- Metodología: `/methodology`
- Solicitud y promoción: `/promote`
- Catálogo configurable: `/promote/packages`

Este laboratorio no ejecuta operaciones ni constituye asesoría financiera.
