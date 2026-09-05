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
