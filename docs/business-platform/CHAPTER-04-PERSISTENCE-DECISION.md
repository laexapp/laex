# Persistencia SaaS — decisión del Capítulo 4

SQLite continúa activo durante el piloto para evitar una migración destructiva. El contrato `ChapterTwoStore` mantiene desacoplados los servicios y permite incorporar un adaptador PostgreSQL.

Se prepara `0001_saas_core.sql` con claves compuestas tenant/empresa, restricciones, dominios únicos, membresías, auditoría, idempotencia e índices. No debe activarse hasta disponer del adaptador, migrador, comparación de datos y prueba de restauración.

## Estrategia de transición

1. Congelar versión del esquema SQLite.
2. Exportar por tenant/empresa con conteos y hashes.
3. Aplicar migraciones PostgreSQL versionadas en staging.
4. Importar y verificar entidades, saldos, facturas y auditoría.
5. Ejecutar pruebas de aislamiento y recorridos integrales.
6. Realizar dual-read controlado, nunca dual-write improvisado.
7. Programar ventana de corte y conservar rollback a snapshot SQLite.

## Backup y restauración

- SaaS: backup cifrado diario, WAL/PITR, retención definida por política y copia en región separada.
- Instancia dedicada: repositorio y claves exclusivos del cliente, política RPO/RTO contractual.
- Prueba de restauración trimestral en entorno aislado.
- Restauración siempre verifica conteos por tenant, auditoría e inventario derivado.
