# Arquitectura y plan de integración

## Fronteras

`lab-market-intelligence` contiene dominio y datos simulados. La superficie `/market` solo consume información pública aprobada. `/mercado`, Firebase, Auth, Wallet, pagos y APIs productivas permanecen intactos.

El flujo comercial produce `CommercialOrder`; el editorial produce `AnalysisReport`. Los tipos impiden referencias cruzadas. Comercial no edita análisis; analistas no editan órdenes. Divulgaciones requieren dos aprobadores.

## Datos reales

1. Aprobar proveedores y licencias.
2. Crear adaptadores versionados por fuente.
3. Resolver identidad por assetId, red y contrato.
4. Normalizar precio, volumen, mercados, pares y timestamps.
5. Marcar retrasos, desconexiones y ausencia de datos.
6. Almacenar evidencia, procedencia y revisiones inmutables.
7. Validar cálculos contra datasets controlados.
8. Activar por flags y sin capacidad de trading.

## Seguridad

Separación por tenant, permisos por rol, sanitización y escaneo documental, enlaces expirables, registro de evidencia, detección de conflictos, doble aprobación promocional y exclusión de información privada en rutas públicas.

## Home y rollback

Se conserva la Home actual y se presenta `/market` como producto público destacado en navegación futura. Convertir Market Intelligence en `/` afectaría identidad, SEO, usuarios y conversión; requiere experimento, métricas y rollback explícitos antes de autorización.

## Terminal de mercado refinado

El laboratorio incorpora tres visualizaciones intercambiables (velas, línea y área), selector universal de activos, actualización simulada pausada y comparación de proveedores. La futura integración sustituirá el generador visual por snapshots normalizados y eventos versionados; la interfaz conservará estados explícitos de simulación, retraso, desconexión y ausencia de datos. La narrativa deberá derivarse de evidencia trazable y publicar confianza y limitaciones, nunca afirmaciones opacas.
