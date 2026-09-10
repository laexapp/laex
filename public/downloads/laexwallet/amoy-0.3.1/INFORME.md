# LAEX Wallet 0.3.1-testnet — Amoy / cierre técnico A1

## Alcance y dictamen

Solo BNB Testnet 97 y Polygon Amoy 80002. No Mainnet ni Mandato B. La validación física de POL + USDC pertenece a CEO/Arquitectura; los fixtures de pruebas y capturas técnicas no la sustituyen. A1 no se declara cerrado físicamente hasta recibir sus hashes y conciliación.

Catálogo autorizado: RPC https://polygon-amoy.drpc.org, explorador https://amoy.polygonscan.com, gas POL de prueba (18 decimales), USDC de prueba de Circle (6 decimales), contrato 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582. No existe formulario de autorización de RPC ni firma para redes/contratos arbitrarios.

## Política de gas y confirmación (definida antes del ciclo físico)

- Firma legacy tipo 0 con protección EIP-155 y Chain ID 80002. Polygon mantiene compatibilidad con este formato; no se introduce tipo 2 en esta misión. Fuente: https://docs.polygon.technology/pos/concepts/transactions/eip-1559
- `eth_gasPrice` del RPC autorizado, en unidades atómicas de POL. Debe ser positivo y no superar 500 gwei. Es un límite de este candidato Testnet, no una tarifa recomendada ni garantía de inclusión.
- `eth_estimateGas` sobre destinatario/value/calldata exactos y el gasPrice cotizado. POL: solo cuentas sin código, 21 000 unidades. USDC: estimación más 20%, redondeada hacia arriba. Límite final 500 000 unidades, incluido el margen. No se recorta una estimación para hacerla pasar.
- Máximo por operación: 1 POL o 20 USDC de prueba. USDC tiene seis decimales: 0.0000001 USDC se rechaza. Comisión máxima en POL = gasPrice × gasLimit. El importe USDC nunca se suma numéricamente a POL. El gas no utilizado no se consume; la comisión efectiva se consulta en el recibo/explorador.
- Cotización válida durante 120 segundos. Antes de firmar se vuelven a comprobar cuenta/red/activo, contrato/decimales, saldo de activo y gas, nonce y gas. Si sube la necesidad de gas/precio o cambia nonce/saldo, se exige otra revisión. No se aumenta una comisión ya autorizada automáticamente.
- Amoy: recibo del hash esperado en bloque canónico y al menos **12 confirmaciones**, contando el bloque de inclusión. Es un umbral conservador del piloto, no finalidad absoluta ni un criterio válido para Mainnet. BNB Testnet mantiene sus 3 confirmaciones.
- USDC: receipt `status=1` solo se comunica como transferencia confirmada cuando contiene un evento ERC-20 `Transfer` del contrato autorizado con origen, destinatario e importe exactos. Sin ese evento queda por comprobar. Un recibo fallido no se presenta como envío exitoso.
- Nonce consumido por otra operación: se comprueba también a profundidad de 12 bloques para Amoy, con estabilidad del hash del bloque consultado. No se crea otro pago. Si solo existe conflicto reciente, queda pendiente.
- Reinicio/error RPC: reconciliar primero; retransmitir solo los mismos bytes y hash cuando el nonce esté disponible y no haya evidencia de operación conocida. Nunca volver a firmar, cambiar nonce o aumentar gas automáticamente. Sin evidencia suficiente se conserva el pendiente.

Fuentes de catálogo: https://docs.polygon.technology/pos/reference/rpc-endpoints y https://developers.circle.com/stablecoins/usdc-contract-addresses . USDC y POL de Testnet no tienen valor económico. Faucet USDC: https://faucet.circle.com ; recursos de POL: https://faucet.polygon.technology . Pueden existir límites y restricciones de los proveedores.

## Cambios

- Motor conectado a transferencias nativas POL y ERC-20 USDC, metadatos, balances y comisión separada.
- Home, selector de red, selector de activo al enviar, QR de dirección pública con Chain ID, formularios y Actividad usan el contexto explícito.
- Gestión por red/cuenta: búsqueda por símbolo/contrato, mostrar/ocultar, favoritos y mover al principio. Solo contratos del catálogo.
- Al cambiar cuenta/red se invalidan cotizaciones y saldos y se requiere desbloqueo; durante autenticación/trabajo activo no se admite el cambio. La respuesta tardía de una consulta no puede cambiar el borrador de otro contexto.
- La wallet original, vault, alias Keystore y archivos históricos no cambian. Los pendientes Amoy usan el almacenamiento por wallet/cuenta/red ya existente; identificación del token y cantidades se validan contra la transacción firmada. Ningún secreto se añade a modelos, historial o informes.
- Al reiniciar se abre la wallet original/BNB Testnet, como en 0.3.0. Seleccionar Amoy de nuevo no elimina su actividad, activos ni pendientes. Una misma cuenta EVM tiene la misma dirección en ambas redes y saldos independientes.

## Ciclo físico para CEO (solo después de instalar mediante Actualizar)

1. Confirmar versión 0.3.1-testnet, dirección, cuentas y actividad BNB existentes. No desinstalar, borrar datos ni importar de nuevo el respaldo para actualizar.
2. Seleccionar la cuenta de prueba y Polygon Amoy. Verificar red 80002 en Recibir. Obtener POL de prueba y USDC en el contrato indicado, usando únicamente la dirección pública. No introducir palabras en faucets.
3. Actualizar saldos. Guardar saldo inicial POL y USDC. Comprobar visibilidad, favoritos y orden; cambiar cuenta/red y volver para verificar aislamiento.
4. Enviar por ejemplo 0.001 POL a otra cuenta de prueba. Registrar cantidad, comisión máxima, hash, origen y destino. Comprobar estado hasta 12 confirmaciones, revisar Actividad y pulsar Finalizar. Anotar comisión efectiva y saldo final del explorador.
5. Enviar 1.234567 USDC. Confirmar que el importe está en USDC y la comisión en POL. Registrar hash, evento Transfer, comisión efectiva POL, saldo final POL y USDC en origen y saldo recibido en destino. Finalizar.
6. Conciliar por separado: USDC inicial − importe = USDC final; POL inicial − comisión efectiva = POL final en el envío de token. Para envío nativo restar importe POL más comisión efectiva.
7. Cerrar/abrir, seleccionar la misma cuenta y Amoy, consultar saldos y actividad. Confirmar que los hashes no aparecen duplicados y que no se retransmite una operación confirmada. Repetir la comprobación de aislamiento con otra cuenta y BNB Testnet.
8. Ante error no repetir el pago: consultar Actividad/Comprobar estado y aportar captura operativa y hash. Las pruebas de fallo RPC/reemplazo deliberado se documentan técnicamente; no se solicita al CEO provocar pagos duplicados.

## Puerta Mainnet

Se mantiene BLOQUEADO PARA MAINNET. El avance físico 0.3.0 fue reportado por CEO; este informe no inventa características del Keystore del Samsung. Siguen pendientes el ciclo físico Amoy/USDC, revisión independiente, política definitiva de firma y aprobación expresa de la Puerta de Seguridad. El certificado histórico de pruebas se mantiene solo para actualizar este APK no depurable.

## Resultados técnicos y distribución

44 comprobaciones únicas aprobadas: 20 nuevas (motor Amoy 8, recuperación Amoy 4, UI/aislamiento/gestión 6, persistencia cifrada 1 y RPC real de solo lectura 1), más 24 directamente afectadas (recuperación previa 9, RPC 3, cotización 4 y formulario 8). No se ejecutó la batería histórica de 52. Los casos de UI inicialmente no pudieron iniciar por el bloqueo de caché de Robolectric en el entorno restringido; se ejecutaron con el acceso necesario. Se corrigió la expectativa de render antes de liberar capturas y se conservó el importe exacto faltante en el mensaje nativo. Los resultados finales por caso figuran en PRUEBAS.json.

Compilación pilot y lint aprobados. APK no depurable, applicationId com.laexwallet.testnet, versionCode 14. Certificado SHA-256: 55f1050d21de0c6501ad7c416ae8bf09df78077a6989104c5146b248b1690a69, el mismo certificado histórico de actualización Testnet. No es la política definitiva para valor real.

Lecturas públicas reales: Chain ID 80002, código del contrato USDC presente y decimals=6; gasPrice dentro del límite del candidato. El primer cliente Python recibió HTTP 403; curl y después el transporte HTTP real de la aplicación respondieron correctamente. No hubo firma ni difusión en esas consultas. Las cotizaciones/firmas, fallos y receipts de los tests son fixtures controlados, no transferencias físicas del CEO. Las capturas de esta carpeta son renders técnicos: los importes del formulario son datos de test identificados, no saldo real de una wallet.

Comparación contra el manifiesto congelado 0.3.0: LocalVault, VaultEnvelope, VaultUpgrade, AuthenticationFlow, ScreenCapturePolicy, PendingStore, AccountDirectory, AccountScope y AssetCodec permanecen idénticos byte por byte. La generación/derivación de claves y el método de firma de WalletCore también permanecen iguales. Se ajustaron el contexto del constructor de borrador, el débito nativo separado del token y las rutas de presentación/consulta/conciliación ya descritas. No se añadió almacenamiento de seed, claves privadas, PIN ni secretos a los registros públicos. El archivo cifrado de pendientes conserva su esquema; usa exactamente la transacción firmada.

Estado: A1 técnico preparado para ciclo físico POL/USDC; cierre A1 pendiente de hashes y conciliación del CEO. A2 conserva el avance físico reportado, con aislamiento red/cuenta revalidado técnicamente para Amoy; falta su comprobación física en esta versión. A3 conserva BLOQUEADO PARA MAINNET: revisión independiente, política definitiva de firma y puerta expresa pendientes. No se declara aptitud para valor real.
