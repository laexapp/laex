# Persistencia local controlada

`LocalProductStore` guarda el agregado de Media Intelligence en `.data/media-intelligence/product.json`. La carpeta debe permanecer fuera de control de versiones y no contiene credenciales.

Cada mutación se serializa en proceso, exige la revisión leída por el cliente, incrementa `revision`, escribe un archivo temporal y lo renombra sobre el destino. Un conflicto responde `409 revision_conflict`; el cliente debe recargar antes de repetir la intención.

Este adaptador satisface durabilidad local y permite demostrar aislamiento sin tocar Firebase. No es apto para múltiples instancias, despliegues serverless ni producción. El adaptador Firestore Emulator futuro deberá conservar el mismo contrato y ejecutar las invariantes críticas dentro de transacciones reales.

Rollback local: detener mutaciones, conservar el JSON afectado como evidencia y restaurar un snapshot previo. No existen migraciones destructivas.
