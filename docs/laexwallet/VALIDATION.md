# Verificación de la demostración

Fecha: 5 de septiembre de 2026.

- Seis pruebas del modelo: importes decimales exactos, rechazo de valores inválidos, rechazo de direcciones reales, descuento del token y comisión, máximo de BNB con reserva de comisión, fondos insuficientes y recepción simulada.
- ESLint sin errores en componentes, modelo y ruta.
- Compilación de producción Next.js y TypeScript completada en una copia limpia del proyecto con los archivos nuevos de laexWallet.
- Recorrido interactivo verificado en Chrome con pantallas de 320×740, 390×844, 430×932, 768×1024 y 1440×1000.
- Comprobados: bienvenida, consentimiento de demo, ocultar/mostrar balance, envío inválido y válido, edición antes de confirmar, saldo posterior, recepción, copia, historial y filtros, detalles, educación sobre respaldo, reinicio y cierre de diálogo con Escape.
- Sin desbordamiento horizontal, errores JavaScript ni solicitudes externas durante esos recorridos.
- Las pantallas se revisaron visualmente. Evidencia local: `tmp/laexwallet-qa/`.

Limitaciones: emulación de tamaños de pantalla en navegador; no equivale a pruebas de un APK en dispositivos Android físicos. No hay criptografía ni transacciones reales que auditar en esta entrega.

## Ampliación del 7 de septiembre de 2026

- Ocho pruebas unitarias: seis originales más conversión exacta del intercambio, gas único, historial vinculado, falta de gas, sobregiro y cantidades inferiores a la precisión de salida.
- Compilación de producción y TypeScript completados en copia aislada.
- Recorridos originales repetidos en 320, 390, 430, 768 y 1440 píxeles.
- Nuevos recorridos comprobados en 320, 390, 430 y 1440 píxeles: alta/ocultación de token, contrato inválido, alta/borrado de red, rechazo de RPC HTTP, selección y saldo separado, intercambio con actualización de saldos e historial, conexión rechazada/aceptada, permiso limitado, desconexión, contactos usados en envío, nombre de wallet, bloqueo visual, recuperación ficticia y reinicio.
- Sin solicitudes de red fuera del origen, sin errores JavaScript ni desbordamiento horizontal en los recorridos comprobados. No se escribió localStorage ni se solicitó una frase real.
- Capturas revisadas: inicio, redes, alta de token, contrato Web3, conexión e intercambio. Archivos locales `tmp/laexwallet-qa/expanded-*.png`.
- Las limitaciones de emulación y ausencia de criptografía siguen vigentes. Alcance y próximos requisitos en `BLOCKCHAIN-CONNECTION.md`.