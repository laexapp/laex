# LAEX InvestOPTND — capítulos 0.1.2 y 0.1.3 DEMO

## Candidato para revisión física

- Versión final: **0.1.3-demo / versionCode 4**.
- Paquete: `com.laex.investoptnd.demo`.
- APK: `laex-investoptnd-0.1.3-demo.apk`.
- SHA-256: `c150c225bbbb2dd0f41e1bfd710bd93d6fa152b5ddbf4d2467a8a2f8daabd618`.
- Certificado conservado: `98a25fd7b79e312cdc110149c842128825765d457dac063b5819e6dae2c62a9f`.
- Build Review no depurable; sin permiso Android INTERNET. Firma de distribución DEMO, no firma definitiva de producción.
- Actualizar sobre la instalación anterior; **no desinstalar ni borrar datos**.

El mandato más reciente autorizó continuar a 0.1.3 tras verificar técnicamente 0.1.2, sin esperar una prueba física intermedia. El APK final incorpora ambos capítulos. No se habilitó dinero real.

## Punto de control 0.1.2

Se conservó localmente el APK 0.1.2-demo / código 3 y un archivo del código de ese punto de control. SHA-256 del APK: `a8a47123fe79bc9116c743a4bf792abedf4702cdf3788fd543bfbccdbf237ee7`.

Implementado:

- Inventario individual con códigos únicos, serie, contrato, inversión, usuario, capital y fechas vinculados.
- Prevención de doble asignación; identificadores opacos permanentes para nuevas inversiones y QR.
- Registros antiguos migrados como provisionales sin inventar números de serie ni verificaciones históricas.
- Serie y evidencia obligatorias antes de declarar recepción verificada. Etiquetas provisionales claramente identificadas.
- Etiquetas PDF con logo, datos del activo y QR; formato configurable de 100–150 mm de ancho y 75–200 mm de alto. Probados 100 × 75 y 100 × 150 mm.
- Guardado mediante selector de documentos Android; impresión mediante servicio de impresión Android; reimpresiones auditadas sin crear inversiones nuevas.
- Escáner QR local por cámara, imagen o referencia; el QR no autoriza administración y no navega a URLs arbitrarias.
- Mi inversión: fotografía, equipo, contrato, capital, fecha, días, cinco etapas, evidencia e historial.
- Avisos locales y revisión de 90 días; sin rendimientos automáticos ni promesa de devolución inmediata.

Verificación del punto de control: 14 pruebas de inventario y 19 comprobaciones de interfaz móvil aprobadas; build/lint correctos. Tres PDFs reales fueron renderizados, revisados visualmente y sus QR decodificados por una biblioteca independiente. No se afirma haber impreso en papel ni probado cámara física Samsung.

## Capítulo 0.1.3

- Panel financiero CEO separado y protegido por la autenticación administrativa local existente.
- Órdenes únicas con inversión, usuario, activo, red DEMO, contrato ficticio, receptor ficticio, cantidad, cotización manual, fecha, referencia y aceptación de términos.
- Conciliación por identidad completa y evidencia explícita; rechazo de referencia/activo/red/contrato/receptor/cantidad incorrectos y hash ficticio reutilizado.
- USDT, OMD y OMDB separados. **No se verificaron contratos blockchain reales:** las redes `SIM-*`, contratos `DEMO-CONTRACT-*` y decimales del escenario son datos artificiales. No implican autorización o compatibilidad con activos reales.
- Capital recibido, capital asignado a inventario, obligaciones, ganancias, liquidez de venta y cantidades ya pagadas separados.
- Liquidez vinculada únicamente a la venta de la misma inversión. No se permite usar capital de nuevos inversionistas para liquidar otras operaciones.
- Cálculo a partir de venta cobrada, capital y gastos. Ejemplo comprobado: capital 500, venta 800, gastos 80, participación 50% → utilidad 220, ganancia del inversionista 110, liquidación 610 USD de referencia.
- Devoluciones, gastos adicionales y ventas anuladas conservan el historial y requieren revisión. Invalidan cálculos no enviados; no reescriben cantidades ya enviadas/confirmadas.
- Circuito: calculada → revisada → aprobada → enviada → confirmada. No permite saltos ni confirmación duplicada. Un rechazo ficticio libera la reserva, pero no ejecuta un reintento automático.
- Cantidades de tokens calculadas con enteros BigInt; moneda de cuenta USD, valoración de aporte y de liquidación separadas, responsable de comisión, redondeos y variaciones visibles.
- Condiciones aceptadas conservadas en anexos ficticios; modificaciones de capital/participación de oportunidades disponibles guardan versiones antes/después, sin modificar contratos aceptados.
- Indicadores de solicitudes de salida, incidencias y liquidaciones por estado.
- Siete informes CSV: inversiones activas, inventario financiado, capital, obligaciones, pagos confirmados, revisión de 90 días y auditoría. Exportación local protegida y campos escapados frente a fórmulas de hoja de cálculo.

## Validación final

- **48 pruebas automáticas aprobadas**: 18 financieras nuevas, 14 de inventario y 16 del motor/presentación afectados por la integración. Resultados en `tests-final.txt`.
- **14 comprobaciones de interfaz móvil aprobadas**: migración, acceso administrativo, orden, conciliación rechazada/aceptada, liquidación completa, cartera, anexos, siete CSV, PDF, reinicio, expiración y diseño adaptable.
- Nueve rutas afectadas revisadas a 320, 393 y 430 px, sin desbordamiento horizontal. Chrome con emulación móvil; no sustituye Samsung físico.
- `assembleReview` y `lintReview`: correctos. Lint: 0 errores y 1 advertencia conocida `SetJavaScriptEnabled`, necesaria para la interfaz local. Recursos locales, CSP restrictiva y navegación controlada; no acceso a Internet.
- PDF final 100 × 75 mm, una página, texto legible, QR opaco decodificado independientemente.
- Firma, paquete y versionCode comprobados directamente en APK. Los recursos del APK coinciden byte por byte con el código final.
- Migración desde 0.1.1 y desde el estado 0.1.2: conserva operaciones, contratos, comprobantes, inventario e identificadores. Se guardan copias locales del estado anterior; los errores de migración no reinicializan datos silenciosamente.
- Motor original `engine.js` sin cambios: SHA-256 `fa50aedfa6cebe22df18b1473184d9a60ddb5bf0f8045766fbb0b0e8b529a25d`.
- **208 archivos protegidos de LAEX Wallet y Commerce comparados sin cambios.**
- Se reutilizó la evidencia vigente de la sesión administrativa nativa: seis comprobaciones del temporizador/revocación; ese componente no se modificó.

Durante las pruebas se corrigieron un error de acumulación BigInt, la política local de imágenes blob usada por el lector QR y la presentación de obligaciones todavía sin resultado conocido. Todos quedaron corregidos antes de congelar el APK. No hubo pagos reales, consultas blockchain ni modificación de Wallet/Commerce.

## Prueba física breve en Samsung

1. Descargar el APK final, seleccionar **Actualizar**, comprobar versión 0.1.3-demo y verificar inversiones/contratos anteriores.
2. Abrir Mi cartera → Mi inversión: equipo, contrato, fechas, etapas y días.
3. Entrar al administrador con la credencial del dispositivo. Inventario → equipo: completar una serie ficticia si sigue provisional y registrar evidencia de recepción.
4. Descargar etiqueta PDF, abrirla, comprobar tamaño/QR y hacer una reimpresión. Debe conservar inversión y QR; cada solicitud aparece en historial. La impresora Android debe ofrecer un tamaño compatible; usar tamaño real para no reducir el QR.
5. Leer el QR desde Escanear, con imagen o cámara. Solo resuelve registros existentes en ESTA instalación; no existe sincronización remota entre teléfonos.
6. En una inversión DEMO, crear aporte: por ejemplo, capital 200 USD → 200 USDT-DEMO con cotización ficticia 1. Aceptar el anexo.
7. En Control financiero CEO, conciliar la referencia exacta con el hash DEMO y evidencia. Registrar liquidez ficticia de la venta, sin exceder venta menos gastos.
8. Para el ejemplo precargado de capital 200, venta 350 y gastos 50: liquidez propia 300 USDT-DEMO a cotización 1; liquidación 250. Con comisión de 1 a cargo de la empresa, necesita 251 de liquidez propia.
9. Recorrer cálculo, revisión, aprobación, envío ficticio y confirmación. Revisar que no pueda pagarse dos veces, y que cartera muestre el importe en dinero ya pagado, no disponible para retirar.
10. Exportar CSV desde Reportes del CEO, cerrar sesión y comprobar que inventario, finanzas y exportaciones vuelven a pedir autenticación.

## Límites y pendientes

- DEMO offline con un perfil ficticio local y operador autenticado por el dispositivo; no constituye seguridad multiusuario de producción ni separación de dos personas en revisión/aprobación.
- Sin depósitos, transferencias, gas, wallets, precios de mercado, contratos blockchain verificados, sincronización ni notificaciones remotas.
- Historial local auditable en la interfaz, pero no registro inmutable contra manipulación del dispositivo.
- Las nuevas conciliaciones no inventan depósitos o hashes para operaciones históricas. Los pagos antiguos se conservan como pagos ficticios históricos.
- Después de un ajuste posterior a un envío/confirmación, el importe enviado permanece congelado y la incidencia queda visible. La resolución operativa de devoluciones posteriores no genera pagos extra automáticamente.
- La demostración de guardado nativo, impresión física y escaneo con cámara Samsung está pendiente de Arquitectura. No había un dispositivo conectado para ejecutar esas pruebas.
- Producción requerirá catálogo blockchain autorizado/verificado, permisos y auditoría de servidor, sincronización, firma de producción y revisión independiente de seguridad, contratos y regulación.

**Resultado:** ambos capítulos terminados técnicamente en el candidato combinado; pendiente aprobación física de Arquitectura. No avanzar a pagos reales ni otros capítulos.
