# Configuración segura de cobros

LF-PRINTER administra todos sus destinos de cobro en el secreto de servidor
`LF_PRINTER_PAYMENT_METHODS_JSON`. En desarrollo se guarda en `.env.local`; en
producción, en el gestor de secretos del proveedor de hosting. Nunca debe usar
el prefijo `NEXT_PUBLIC_` ni incluirse en Git.

La plantilla `lf-printer.payment-methods.example.json` define el formato sin
contener datos reales. Para actualizar PayPal, Banco BHD, OMD, OMDB o cualquier
método futuro se modifica el JSON del secreto y se reinicia/republica la
aplicación. Los IDs se relacionan con los perfiles públicos del proyecto.

`getServerPaymentConfiguration("lf-printer")` valida versión, proyecto, IDs y
campos obligatorios antes de que un servicio server-side pueda usar los datos.
Los componentes cliente no importan este archivo y continúan mostrando solo
información pública o mensajes de confirmación privada.
