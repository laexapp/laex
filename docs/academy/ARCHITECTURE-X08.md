# MISSION X-08 — Arquitectura de LAEX Academy

## Propósito

Academy organiza conocimiento en rutas y lecciones conectadas con evidencia del ecosistema. No duplica noticias, datos de mercado, proyectos, conversaciones ni piezas editoriales: usa referencias estables hacia sus fuentes.

## Capas

- `domain`: rutas, lecciones, señales del alumno, referencias y puertos.
- `application`: orquestación de planes y búsqueda, independiente de Next.js.
- `infrastructure`: catálogo demostrativo sustituible por repositorios.
- `components`: explorador interactivo; el resto permanece server-rendered.
- `app/academia`: portada, layout y rutas prerenderizadas.

## Integración

Cada `LearningReference` enlaza Market, News, Community, Media o Projects sin importar sus repositorios. `LearningEventPublisher` permitirá comunicar progreso y planes mediante eventos versionados. `AcademyAIProvider` abstrae recomendación y explicación; deberá conservar proveedor, modelo, prompt, fuentes y confianza.

## Escala

La evolución productiva requiere repositorios paginados, read models por alumno, colas para recomendaciones, búsqueda desacoplada, idempotencia, contenido versionado, localización, prerrequisitos como grafo y eventos de progreso. La IA no estará en el camino crítico: una caída no bloqueará el aprendizaje.

## Seguridad y límites

Academy es educativa. No recomienda comprar o vender y no sustituye asesoría financiera. El progreso persistente y la personalización autenticada quedan para una fase autorizada; Firebase, Auth, Wallet, pagos y Token LAEX no fueron modificados.
