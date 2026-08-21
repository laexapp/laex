# LAEX Business Platform V1.0

Este directorio convierte el Documento Maestro de Arquitectura en reglas técnicas verificables y registra la promoción progresiva de los componentes estables de LAEX.

## Documentos

- [Capítulo 1 — Visión, filosofía y principios fundamentales](./CHAPTER-01-VISION.md)
- [Capítulo 2 — Business Engine](./CHAPTER-02-BUSINESS-ENGINE.md)
- [Entrega del Capítulo 2](./DELIVERY-CHAPTER-02.md)
- [Capítulo 3 — Promoción del Business Engine al núcleo de LAEX](./CHAPTER-03-BUSINESS-ENGINE-PROMOTION.md)
- [Capítulo 9 — Motor fiscal dominicano y preparación DGII](./CHAPTER-09-DOMINICAN-FISCAL-ENGINE.md)
- [Capítulo 10 — AI Engine empresarial seguro](./CHAPTER-10-AI-ENGINE.md)
- [Capítulo 11 — Commerce & Publication Engine](./CHAPTER-11-COMMERCE-PUBLICATION.md)
- [Arquitectura de referencia y plan de ejecución](./REFERENCE-ARCHITECTURE.md)

## Estado

El Business Engine aprobado en el Capítulo 2 está promovido como infraestructura oficial reutilizable en `modules/business-engine`. LF-PRINTER se mantiene como piloto aislado y el laboratorio consume el mismo motor mediante adaptadores específicos de laboratorio.

## Regla de cambio

Toda funcionalidad empresarial debe declarar:

1. tenant y empresa a los que pertenece;
2. capacidades necesarias para leerla o modificarla;
3. comandos, eventos y efectos secundarios;
4. estrategia de idempotencia y auditoría;
5. qué parte resuelven reglas deterministas y qué parte requiere IA;
6. criterios de aceptación y recuperación ante fallos.
