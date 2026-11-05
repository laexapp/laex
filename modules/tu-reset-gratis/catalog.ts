export type ResetGuide = { title: string; steps: string[]; demoOnly: boolean };

export type ResetModel = {
  slug: string;
  model: string;
  brand: string;
  family: string;
  status: "review" | "verified";
  demoOnly: boolean;
  image?: string;
  issue: string;
  summary: string;
  publicDownload?: { url: string; version: string; size: string; updatedAt: string; passwordRequired: boolean };
  guide?: ResetGuide;
};

const demoGuide: ResetGuide = {
  title: "Ejemplo de guía de diagnóstico (DEMO)",
  demoOnly: true,
  steps: [
    "Confirma el modelo completo en la etiqueta del equipo y selecciona esa misma variante.",
    "Anota el mensaje exacto o el patrón de luces antes de iniciar cualquier mantenimiento.",
    "Revisa la guía oficial del fabricante y comprueba que no haya papel u objetos atascados.",
    "Si el equipo indica que una almohadilla llegó al fin de su vida útil, solicita servicio técnico antes de reiniciar un contador.",
  ],
};

// Las fichas de ejemplo son demostrativas. Solo los registros verificados pueden publicar descargas.
export const resetModels: ResetModel[] = [
  { slug: "epson-l3210", model: "Epson L3210", brand: "Epson", family: "L-Series", status: "review", demoOnly: true, issue: "Diagnóstico y mantenimiento", summary: "Ejemplo de ficha. La guía y cualquier herramienta específica están pendientes de validación para esta variante.", guide: demoGuide },
  { slug: "epson-l3250", model: "Epson L3250", brand: "Epson", family: "L-Series", status: "review", demoOnly: true, image: "/assets/lf-printer/official/printers/l3250-hero.webp", issue: "Diagnóstico y mantenimiento", summary: "Ejemplo de ficha. Procedimientos y herramientas por verificar." },
  { slug: "epson-l4260", model: "Epson L4260", brand: "Epson", family: "L-Series", status: "review", demoOnly: true, issue: "Diagnóstico y mantenimiento", summary: "Ejemplo de ficha. Procedimientos y herramientas por verificar." },
  { slug: "epson-l8050", model: "Epson L8050", brand: "Epson", family: "L-Series", status: "review", demoOnly: true, issue: "Diagnóstico y mantenimiento", summary: "Ejemplo de ficha. Procedimientos y herramientas por verificar." },
  { slug: "epson-wf-4830", model: "Epson WF-4830", brand: "Epson", family: "WF-Series", status: "review", demoOnly: true, image: "/assets/lf-printer/official/printers/wf-4830-hero.webp", issue: "Diagnóstico y mantenimiento", summary: "Ejemplo de ficha. La referencia a esta carpeta de firmware aún no se ha inspeccionado ni validado." },
  { slug: "epson-wf-3820", model: "Epson WF-3820", brand: "Epson", family: "WF-Series", status: "review", demoOnly: true, issue: "Diagnóstico y mantenimiento", summary: "Ejemplo de ficha. Procedimientos y herramientas por verificar." },
  { slug: "epson-et-2720", model: "Epson ET-2720", brand: "Epson", family: "ET-Series", status: "review", demoOnly: true, issue: "Diagnóstico y mantenimiento", summary: "Ejemplo de ficha. Procedimientos y herramientas por verificar." },
  { slug: "epson-xp-5100", model: "Epson XP-5100", brand: "Epson", family: "XP-Series", status: "review", demoOnly: true, issue: "Diagnóstico y mantenimiento", summary: "Ejemplo de ficha. Procedimientos y herramientas por verificar." },
  { slug: "canon-g6010", model: "Canon G6010", brand: "Canon", family: "Canon", status: "review", demoOnly: true, issue: "Diagnóstico y mantenimiento", summary: "Ejemplo de ficha. Procedimientos y herramientas por verificar." },
  { slug: "hp-smart-tank", model: "HP Smart Tank", brand: "HP", family: "HP", status: "review", demoOnly: true, issue: "Identificación de modelo", summary: "Ejemplo de categoría. Se requiere el modelo completo para preparar una ficha compatible." },
];

export const resetFamilies = ["Todos", "L-Series", "ET-Series", "WF-Series", "XP-Series", "Canon", "HP", "Otras marcas"];
export const getResetModel = (slug: string) => resetModels.find((entry) => entry.slug === slug);
