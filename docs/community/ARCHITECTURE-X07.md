# MISSION X-07 — Arquitectura de Comunidad LAEX

## Frontera

Comunidad es el contexto de inteligencia colaborativa. No es el registro maestro de proyectos, datos de mercado, noticias, contenido editorial, cursos, referidos, publicidad ni promociones. Consume referencias estables y evidencia de esos dominios sin reescribirlos.

```text
Market / News / Academy / Media / Projects / Network
                    ↓ referencias versionadas
             Community Intelligence
  UI → casos de uso → dominio → puertos → adaptadores
                    ↓ eventos
       búsqueda / notificaciones / read models
```

## Entrega implementada

- Centro público `/comunidad` con Radar, búsqueda y filtros.
- Núcleos de conocimiento relacionados con entidades del ecosistema.
- Evidencia, confianza, duplicados agrupados y síntesis diferenciada.
- Avisos permanentes de neutralidad y protección jurídica.
- Dock contextual reutilizable en Market, News, Academy, Media Intelligence, Proyectos y Mi Red.
- Aviso jurídico automático en toda ficha pública de proyecto.
- Contratos desacoplados para repositorio, IA, contexto de ecosistema y eventos.
- Motor de automatización que orquesta clustering, relaciones, resumen, persistencia y publicación de eventos.

Los registros visibles son datos demostrativos para validar la experiencia. No representan una IA productiva ni actividad en tiempo real. La conexión con proveedores reales exige autorización, persistencia, colas y controles operativos.

## Separación obligatoria

`EntityReference` enlaza dominios sin fusionarlos. `EvidenceReference` conserva tipo, fuente y captura. Comunidad no puede editar Market, News, Academy, Media, Projects o Network. Opinión, análisis, promoción y publicidad deberán usar tipos y estados diferentes; no se modelarán como `KnowledgeItem` indistinguible.

## IA

`CommunityAIProvider` abstrae `cluster`, `summarize` y `relate`. Una implementación productiva debe registrar proveedor, modelo, prompt, política, confianza, entradas y revisión. La publicación humana nunca depende de IA y una caída del proveedor no bloquea lectura o participación. Sanciones, asesoría financiera y decisiones editoriales quedan fuera del proveedor.

## Escala

- escrituras idempotentes y eventos versionados;
- read models paginados por cursor;
- colas para IA, indexación y notificaciones;
- partición por espacio/tenant;
- autorización en servidor;
- búsqueda con filtros de visibilidad;
- cachés y agregados, sin consultas cruzadas síncronas;
- observabilidad, cuotas, rate limits y dead-letter queue;
- migraciones progresivas y feature flags.

## Siguiente fase autorizable

Persistencia y participación autenticada requieren una misión específica: espacios, membresías, preguntas, respuestas, evidencia, moderación, apelación, preferencias y notificaciones. No se han modificado Firebase, Auth, Wallet, pagos ni Token LAEX.
