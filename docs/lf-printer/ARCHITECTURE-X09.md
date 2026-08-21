# MISSION X-09 — Arquitectura LF-PRINTER Ecosystem

## Mapa de módulos

```text
LF-PRINTER Project Shell
├── Inicio: identidad, estado y acceso a módulos
├── Tienda: catálogo, categorías, disponibilidad y cotización
├── Taller: recepción, diagnóstico, reparación, control y entrega
├── Promociones: campañas separadas del catálogo
├── Ofertas: condiciones, precio y vigencia versionados
├── Servicios: catálogo de prestaciones técnicas
├── Clientes: relación, consentimiento y privacidad
├── Seguimiento: lectura del estado e historial del equipo
├── Participación: fichas y solicitudes con aprobación humana
└── Laboratorio: ideas, decisiones, prototipos y promoción a producto
```

Cada módulo expone contratos propios y se integra mediante identificadores y eventos versionados. Ninguno importa repositorios internos de otro módulo.

## Propuesta visual y navegación

LF-PRINTER conserva el canvas, superficies, tipografía, legibilidad y motion de LAEX. Añade magenta de impresión como señal comercial, acompañado por cian técnico. No se inventó un logotipo: el monograma `LF` es un identificador provisional. La navegación principal usa una sola ruta oficial `/proyectos/lf-printer` con anclas modulares; futuras superficies profundas podrán vivir bajo `/proyectos/lf-printer/[module]` sin dominio o aplicación separados.

## Catálogo

`CatalogItem` separa marca, modelo, categoría, tecnología, uso, características, estado y fuente. La UI no contiene reglas por marca; ampliar catálogo requiere agregar registros o conectar `CatalogRepository`. Los modelos iniciales se verificaron en páginas oficiales de Epson Chile, Canon Chile, HP Chile y Brother Chile. Precio y stock permanecen por confirmar.

## Taller y seguimiento

`WorkshopService` controla una máquina de estados lineal: Recepción → Diagnóstico → Reparación → Control de calidad → Listo para entrega → Entregado. Rechaza saltos inválidos y publica eventos sin acoplar notificaciones. La persistencia, identidad del cliente, archivos y mensajería no se conectaron.

## Arquitectura de participación en inventario

```text
Ficha en borrador
 → revisión documental humana
 → publicación administrativa
 → manifestación de interés
 → verificación humana
 → movimiento externo registrado
 → solicitud de liberación
 → aprobación/rechazo administrativo
 → historial inmutable
```

`InventoryParticipation` describe artículo, monto, porcentaje, estado, divulgaciones e historial. `ApprovalRequest` representa Publicar, Liberar capital, Registrar rendimiento o Cerrar. `InvestmentApprovalService` solo crea solicitudes pendientes; deliberadamente no existe puerto de pagos, wallet, transferencia o desembolso. Esta superficie es conceptual y no constituye oferta vigente ni asesoría financiera. Antes de operación requiere revisión jurídica, financiera, fiscal, KYC/AML, riesgos, custodia, contratos, elegibilidad y jurisdicción.

## Arquitectura del Laboratorio

`LabIdea` exige problema, hipótesis, estado, responsables y registro de decisiones. Ciclo: Documentación → Evaluación → Prototipo → Aprobada/Archivada. Solo una idea aprobada puede originar una misión y un módulo oficial. El laboratorio no despliega código, no edita producción y no sustituye el proceso de aprobación del CEO y la Arquitecta.

## Integraciones futuras

- Academy: formación sobre equipos, mantenimiento y operación.
- Community: conocimiento y preguntas vinculadas, no soporte transaccional.
- News/Media: novedades y contenidos con procedencia.
- Market: análisis empresarial separado de precios de productos.
- Mi Red: derivación y acompañamiento, sin autoridad financiera.

## Escala y seguridad

IDs estables, multi-tenancy, autorización en servidor, idempotencia, paginación por cursor, auditoría, colas, archivos con escaneo, datos personales cifrados, retención, exportación y separación comando/lectura. Los módulos se conectarán por puertos y eventos; Firebase, Auth, Wallet y pagos permanecen intactos.
