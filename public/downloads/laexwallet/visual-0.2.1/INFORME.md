# Refinamiento visual LAEX — 0.2.1-testnet

## Alcance

Se reutilizan WalletShell, WalletArchitecture y las rutas del armazón aprobado. Home con cuenta/red en una franja, tarjeta Saldo total reducida, geometría LAEX y acciones circulares dibujadas en Canvas; no se incorporan imágenes pesadas ni dependencias nuevas.

Saldo total muestra — USD porque no existe fuente de precios. El ojo oculta la valoración y la cantidad de las filas y su detalle dentro de Cartera; es una preferencia visual de sesión, no un bloqueo de capturas ni una protección de todo el historial. Al reiniciar se restablece. No cambia el cálculo de comisiones ni la autorización de envíos.

Las filas presentan símbolo, red y cantidad compacta. Si sobran decimales se marca ≈, y si la cantidad positiva es inferior a 0.00000001 se muestra ese límite. El detalle conserva la cantidad exacta. Ningún valor almacenado o utilizado para enviar se redondea.

Gestión permite buscar el activo disponible y filtrar Todos/Visibles/Ocultos sobre su estado real. No se ofrecen interruptores de persistencia ficticia: cambiar visibilidad, favoritos, orden y agregar contratos continúa pendiente. Más mantiene herramientas reales de cuentas, red y seguridad. Intercambiar y Explorar conservan su guarda central y presentación Próximamente.

Actividad presenta estado, cantidad y destino abreviado. Los registros existentes no tienen fecha: se indica Fecha no disponible. Al tocar se abre el detalle completo con las acciones existentes de comprobar y explorador. No se escriben fechas inventadas ni se cambia la conciliación.

## Verificación dirigida

Nueve casos únicos: cinco nuevos de presentación (ocultar cantidades, filtros reales, navegación activa, detalle de historial y precisión compacta), tres casos del armazón afectados y una transición de captura sensible/pública. Se repitieron solamente los casos afectados por el ajuste final de cifras. Compilación y lint del candidato sin errores.

Comparación con la base de la misión: archivos preexistentes fuera de MainActivity y WalletShell idénticos por hash. Diecisiete bloques protegidos de MainActivity y el callback de consulta/conciliación de Actividad idénticos. Sin cambios en seed, claves, PIN, Keystore, cifrado, firma, nonce, pending recovery ni retransmisión. Sin RPC, precios, contratos, redes o conexiones Web3 nuevas.

## Entrega

Renders nativos Robolectric, con datos públicos de fixture exclusivamente para evidencia visual; no son capturas físicas del Samsung ni saldos precargados en la aplicación. Se entregan Home, Más, Gestión, Actividad e Intercambiar/Explorar con navegación activa.

APK 0.2.1-testnet (versionCode 12), identificador com.laexwallet.testnet. Distribución del candidato desde rama dedicada, sin desplegar producción. Revisión física y decisión de Arquitectura pendientes.
