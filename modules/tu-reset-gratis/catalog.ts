export type ResetGuide = { title: string; steps: string[]; demoOnly: boolean };
export type ModelStatus = "identified" | "pending_identification";
export type ResourceStatus = "pending_verification" | "available";
export type ResetCatalogSource = "public_title_candidate" | "lf_printer_media";

export type ResetModel = {
  slug: string;
  code: string;
  model: string;
  brand: string;
  family: string;
  status: "review" | "verified";
  modelStatus: ModelStatus;
  resourceStatus: ResourceStatus;
  sources: ResetCatalogSource[];
  demoOnly: boolean;
  image?: string;
  issue: string;
  summary: string;
  publicDownload?: { url: string; version: string; size: string; updatedAt: string; passwordRequired: boolean };
  guide?: ResetGuide;
};

const demoGuide: ResetGuide = {
  title: "Guia inicial segura - DEMO",
  demoOnly: true,
  steps: [
    "Confirma el modelo completo en la etiqueta del equipo y selecciona esa misma variante.",
    "Anota el mensaje exacto o el patron de luces antes de iniciar cualquier mantenimiento.",
    "Consulta el manual oficial y comprueba si hay papel u objetos atascados.",
    "Si la impresora informa que una almohadilla o caja llego al fin de su vida util, solicita servicio tecnico antes de reiniciar un contador.",
  ],
};

const identifiedCodes = [
  "L100", "L1110", "L121", "L1210", "L130", "L1300", "L1800", "L210", "L220", "L300", "L3060", "L310", "L3110", "L3150", "L3160", "L3210", "L3250", "L3251", "L3260", "L350", "L355", "L360", "L365", "L375", "L380", "L395", "L4150", "L4160", "L4260", "L475", "L495", "L5190", "L5290", "L555", "L575", "L6091", "L6161", "L6171", "L800", "L801", "L805", "L8050", "L810", "L811", "L850",
  "ET1810", "ET2710", "ET2720", "ET2726", "ET2800", "ET2803", "ET2810", "ET2811", "ET2812", "ET2814", "ET2815", "ET2850", "ET2851", "ET2856", "ET4700",
  "XP100", "XP102", "XP103", "XP111", "XP200", "XP201", "XP202", "XP203", "XP204", "XP205", "XP207", "XP208", "XP210", "XP212", "XP213", "XP214", "XP215", "XP216", "XP222", "XP225", "XP231", "XP235", "XP241", "XP300", "XP302", "XP303", "XP305", "XP306", "XP310", "XP311", "XP312", "XP313", "XP315", "XP322", "XP325", "XP400", "XP402", "XP403", "XP405", "XP406", "XP412", "XP413", "XP415", "XP422", "XP425", "XP431", "XP441", "XP510", "XP600", "XP605", "XP610", "XP700", "XP710", "XP721", "XP800", "XP801", "XP810",
  "B1100", "B42WD", "G2100", "G2110", "G2160", "G6010", "G7010", "IP2700", "IP2770",
] as const;

// These short codes were extracted from titles but need exact model identification.
const pendingCodes = ["XP20", "XP30", "XP33", "XP36"] as const;

const localMediaModels = [
  { code: "L1250", image: "l1250" },
  { code: "L3250", image: "l3250" },
  { code: "WF-C4810", image: "wf-c4810" },
  { code: "WF-4830", image: "wf-4830" },
  { code: "WF-4834", image: "wf-4834" },
  { code: "WF-7820", image: "wf-7820" },
  { code: "WF-7840", image: "wf-7840" },
  { code: "XP-4105", image: "xp-4105" },
  { code: "XP-4205", image: "xp-4205" },
] as const;

const codeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const formatModel = (brand: string, code: string) => {
  const compact = code.replace(/[^A-Z0-9]/g, "");
  if (brand === "Canon" && compact.startsWith("IP")) return "Canon iP" + compact.slice(2);
  if (compact.startsWith("XP")) return brand + " XP-" + compact.slice(2);
  if (compact.startsWith("WFC")) return brand + " WF-C" + compact.slice(3);
  if (compact.startsWith("WF")) return brand + " WF-" + compact.slice(2);
  return brand + " " + code;
};
const familyFor = (brand: string, code: string) => {
  if (code.startsWith("ET")) return "ET-Series";
  if (code.startsWith("L")) return "L-Series";
  if (code.startsWith("XP")) return "XP-Series";
  if (code.replace(/[^A-Z0-9]/g, "").startsWith("WFC")) return "WF-C Series";
  if (code.startsWith("WF")) return "WF-Series";
  if (code.startsWith("B")) return "B-Series";
  if (code.startsWith("IP")) return "Canon iP-Series";
  if (code.startsWith("G")) return "Canon G-Series";
  return brand + " - Otros modelos";
};
const brandFor = (code: string) => code.startsWith("G") || code.startsWith("IP") ? "Canon" : "Epson";
const titleSlug = (brand: string, code: string) => (brand + "-" + code).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function makeModel(code: string, modelStatus: ModelStatus, source: ResetCatalogSource, image?: string): ResetModel {
  const brand = brandFor(code);
  const model = formatModel(brand, code);
  const ambiguous = modelStatus === "pending_identification";
  const summary = source === "lf_printer_media"
    ? "Modelo con imagen registrada en los medios LF-PRINTER. No hay un recurso de reset verificado para publicar."
    : ambiguous
      ? "El codigo aparece incompleto o ambiguo en el titulo consultado. El modelo exacto y cualquier compatibilidad siguen pendientes de identificacion."
      : "Codigo de modelo identificado en un titulo de referencia publica. LF-PRINTER aun no ha validado compatibilidad, version, licencia ni recurso de reset.";
  return {
    slug: titleSlug(brand, code), code, model, brand, family: familyFor(brand, code), status: "review",
    modelStatus, resourceStatus: "pending_verification", sources: [source], demoOnly: true,
    image: image ? "/assets/lf-printer/official/printers/" + image + "-hero.webp" : undefined,
    issue: ambiguous ? "Modelo pendiente de identificar" : "Recurso de reset pendiente de verificacion",
    summary, guide: demoGuide,
  };
}

const imageByCode = new Map(localMediaModels.map(({ code, image }) => [codeKey(code), image]));
const allCandidates = [
  ...identifiedCodes.map((code) => makeModel(code, "identified", "public_title_candidate", imageByCode.get(codeKey(code)))),
  ...pendingCodes.map((code) => makeModel(code, "pending_identification", "public_title_candidate", imageByCode.get(codeKey(code)))),
  ...localMediaModels.map(({ code, image }) => makeModel(code, "identified", "lf_printer_media", image)),
];

const unique = new Map<string, ResetModel>();
for (const model of allCandidates) {
  const key = codeKey(model.brand + model.code);
  const existing = unique.get(key);
  if (!existing) {
    unique.set(key, model);
    continue;
  }
  const sources = Array.from(new Set([...existing.sources, ...model.sources]));
  unique.set(key, { ...existing, image: existing.image ?? model.image, sources });
}

export const resetModels = Array.from(unique.values()).sort((left, right) => left.family.localeCompare(right.family) || left.model.localeCompare(right.model));
export const resetFamilies = ["Todos", ...Array.from(new Set(resetModels.map((entry) => entry.family))).sort()];
export const resetBrands = ["Todas las marcas", ...Array.from(new Set(resetModels.map((entry) => entry.brand))).sort()];
export const getResetModel = (slug: string) => resetModels.find((entry) => entry.slug === slug);

export function normalizeResetSearch(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

export function filterResetModels(options: { query?: string; family?: string; brand?: string } = {}) {
  const query = normalizeResetSearch(options.query ?? "");
  return resetModels.filter((entry) => {
    const familyMatches = !options.family || options.family === "Todos" || entry.family === options.family;
    const brandMatches = !options.brand || options.brand === "Todas las marcas" || entry.brand === options.brand;
    const searchMatches = !query || normalizeResetSearch([entry.model, entry.code, entry.brand, entry.family, entry.issue].join(" ")).includes(query);
    return familyMatches && brandMatches && searchMatches;
  });
}

export const buildResetModelHref = (slug: string) => "/tu-reset-gratis/" + slug;
