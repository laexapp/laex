# Capítulo 10 — AI Engine empresarial seguro

Estado: núcleo de orquestación, gobierno, evaluación y proveedor determinístico implementados. Proveedor cloud y voz: deshabilitados, pendientes de autorización del CEO.

## Arquitectura

`Usuario → agente → AIProvider → interpretación estructurada → Tool Registry → permisos → validación → confirmación → Business/Reporting/Fiscal Engine → transacción → auditoría`.

Ningún agente recibe conexión a PostgreSQL. `AIProvider` es reemplazable y no forma parte del dominio empresarial. El runtime oficial usa `DeterministicAIProvider`, que tolera variaciones lingüísticas conocidas y permite pruebas repetibles sin enviar información fuera de LAEX.

## Agentes y herramientas

- LIA: clientes, recepciones, productos, inventario, cotizaciones, facturas, caja y reportes autorizados.
- ALAN: consulta de taller y preparación técnica. No recibe herramientas financieras o fiscales.
- ETHAN: inventario, caja y reportes autorizados. Es consultivo.

El catálogo declara para cada herramienta agente, capacidad requerida, riesgo y confirmación. Lecturas autorizadas pueden ejecutarse directamente; preparaciones y cambios operacionales requieren confirmación; operaciones financieras/fiscales requieren confirmación y validaciones adicionales del motor correspondiente.

La recepción conversacional extrae cliente, teléfono, equipo y síntoma; detecta datos faltantes y nombres duplicados, prepara una propuesta y sólo crea cliente/equipo/orden después de confirmación. El ejemplo con errores `RAMON MARTINEZ ... ALE UNA RECEPCION` forma parte de las evaluaciones.

## Seguridad, privacidad y memoria

- Herramientas filtradas primero por agente y después por capacidades del usuario.
- Contexto de conversación limitado a doce turnos y aislado por tenant, company y usuario.
- Cambio de empresa implica otro contexto; no existe memoria global compartida.
- Patrones de secretos, claves, certificados y números de tarjeta se redactan antes de interpretación y persistencia conversacional.
- Sólo se registran categorías de datos enviadas, no una copia adicional del contexto.
- Texto importado o mensajes que intenten redefinir políticas se clasifican como contenido no autorizado.
- Fallo futuro del proveedor debe devolver un mensaje seguro sin afectar las funciones normales de LAEX.

## Uso y costos

Cada solicitud registra proveedor, modelo, agente, tenant/company, usuario, sesión, intención, herramientas, resultado, categorías de datos, unidades de entrada/salida y costo estimado. El proveedor determinístico registra costo cero. La tabla permite imponer posteriormente límites por empresa, plan, usuario y período.

## Proveedor cloud pendiente

No existe proveedor externo autorizado ni se configuró credencial. La frontera puede implementar OpenAI Responses API u otro proveedor sin cambiar agentes, herramientas o Business Engine. La documentación oficial de OpenAI recomienda function calling con esquemas estrictos para que la aplicación reciba argumentos estructurados; LAEX mantendrá la decisión y ejecución de herramientas en servidor.

Cuando CEO autorice un proveedor se requerirán, como mínimo:

1. Identificador del proveedor/modelo permitido y presupuesto por tenant.
2. Secreto en variable de entorno o gestor de secretos del servidor, nunca en frontend, código, chat o logs.
3. Lista aprobada de categorías de datos que pueden enviarse y política de retención del proveedor.
4. Pruebas de estructura, fallback, límites, latencia, costos, inyección y aislamiento antes de habilitar empresas.

Para OpenAI, el secreto previsto sería `OPENAI_API_KEY`, configurado localmente en `.env.local` por el CEO o administrador sin imprimirlo. No debe añadirse hasta autorizar explícitamente el proveedor y completar el adaptador. Referencia: https://developers.openai.com/api/docs/guides/function-calling.

## Persistencia y evaluación

La migración `0006_ai_engine_governance.sql` crea actividad de IA normalizada con RLS forzada. Las evaluaciones cubren errores ortográficos, confirmación, escalamiento, inyección, redacción, memoria multiempresa, auditoría y continuidad del Business Engine.

## Pendiente para lenguaje natural productivo

El proveedor determinístico comprende los recorridos evaluados, pero no equivale a comprensión general de lenguaje. Inventario multilínea, cotizaciones complejas, diagnósticos abiertos, comparaciones analíticas flexibles y conversación altamente variable requieren un proveedor/modelo autorizado, esquemas estructurados por herramienta y una batería mayor de evaluaciones. Hasta entonces la interfaz identifica correctamente el modo determinístico y nunca promete capacidad cloud.
