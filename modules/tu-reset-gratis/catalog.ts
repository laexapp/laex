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
  title: "Guía inicial segura · DEMO",
  demoOnly: true,
  steps: [
    "Confirma el modelo completo en la etiqueta del equipo y selecciona esa misma variante.",
    "Anota el mensaje exacto o el patrón de luces antes de iniciar cualquier mantenimiento.",
    "Revisa el manual oficial del fabricante y comprueba si hay papel u objetos atascados.",
    "Si la impresora informa que una almohadilla llegó al fin de su vida útil, solicita servicio técnico antes de reiniciar un contador.",
  ],
};

const summary = "La foto del modelo está preparada. Su procedimiento, herramienta gratuita y enlace de descarga siguen en revisión técnica.";
const issue = "Diagnóstico y mantenimiento · guía y herramienta por verificar";
const photo = (filename: string) => "/assets/lf-printer/official/printers/" + filename + "-hero.webp";

// Los modelos corresponden a medios publicados en el registro oficial LF-PRINTER.
// Las imágenes no implican que haya una herramienta de reset validada o disponible.
export const resetModels: ResetModel[] = [
  { slug: "epson-l1250", model: "Epson L1250", brand: "Epson", family: "L-Series", status: "review", demoOnly: true, image: photo("l1250"), issue, summary, guide: demoGuide },
  { slug: "epson-l3250", model: "Epson L3250", brand: "Epson", family: "L-Series", status: "review", demoOnly: true, image: photo("l3250"), issue, summary, guide: demoGuide },
  { slug: "epson-wf-c4810", model: "Epson WF-C4810", brand: "Epson", family: "WF-C Series", status: "review", demoOnly: true, image: photo("wf-c4810"), issue, summary, guide: demoGuide },
  { slug: "epson-wf-4830", model: "Epson WF-4830", brand: "Epson", family: "WF-Series", status: "review", demoOnly: true, image: photo("wf-4830"), issue, summary, guide: demoGuide },
  { slug: "epson-wf-4834", model: "Epson WF-4834", brand: "Epson", family: "WF-Series", status: "review", demoOnly: true, image: photo("wf-4834"), issue, summary, guide: demoGuide },
  { slug: "epson-wf-7820", model: "Epson WF-7820", brand: "Epson", family: "WF-Series", status: "review", demoOnly: true, image: photo("wf-7820"), issue, summary, guide: demoGuide },
  { slug: "epson-wf-7840", model: "Epson WF-7840", brand: "Epson", family: "WF-Series", status: "review", demoOnly: true, image: photo("wf-7840"), issue, summary, guide: demoGuide },
  { slug: "epson-xp-4105", model: "Epson XP-4105", brand: "Epson", family: "XP-Series", status: "review", demoOnly: true, image: photo("xp-4105"), issue, summary, guide: demoGuide },
  { slug: "epson-xp-4205", model: "Epson XP-4205", brand: "Epson", family: "XP-Series", status: "review", demoOnly: true, image: photo("xp-4205"), issue, summary, guide: demoGuide },
];

export const resetFamilies = ["Todos", "L-Series", "WF-Series", "WF-C Series", "XP-Series"];
export const getResetModel = (slug: string) => resetModels.find((entry) => entry.slug === slug);
