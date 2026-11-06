import { normalizeResetSearch, resetModels } from "./catalog";

export type CommercialSolutionKind = "reset_key" | "adjustment_program" | "chipless_firmware";
export type CommercialSolution = {
  id: string;
  slug: string;
  /** Original provider product identity; stored internally, not shown in the public catalog. */
  title: string;
  publicName: string;
  provider: string;
  kind: CommercialSolutionKind;
  modelCodes: string[];
  sourceUrl: string;
  providerClaim: string;
  licenseSummary: string;
  restrictions: string[];
  compatibilityStatus: "provider_announced_lf_unverified";
  commercializationStatus: "pending_authorization";
  deliveryPolicy: "private_after_manual_confirmation";
};

// Public provider descriptions only. No downloaded files, prices, private links,
// LF compatibility claims, or reseller rights are represented as confirmed.
const solutionCandidates: CommercialSolution[] = [
  {
    id: "inkchip-wic-reset-key", slug: "inkchip-wic-reset-key", title: "WIC Reset Utility · clave de reset", publicName: "Clave de reset de contador",
    provider: "INKCHIP", kind: "reset_key",
    modelCodes: ["L100","L1110","L1210","L1250","L1300","L1800","L3050","L3060","L3100","L3110","L3150","L3160","L3210","L3250","L3251","L3260","L4150","L4160","L4260","L5190","L5290","L800","L805","L810","L850","XP100","XP102","XP103","XP200","XP201","XP202","XP203","XP204","XP205","XP207","XP208","XP210","XP212","XP213","XP214","XP215","XP216","XP225","XP235","XP300","XP302","XP303","XP305","XP306","XP310","XP315","XP322","XP325","XP400","XP402","XP406","XP412","XP415","XP422","XP425","XP510","XP600","XP605","XP610","XP700","XP710","XP721","XP800","XP801","XP810","B1100","B42WD"],
    sourceUrl: "https://inkchip.net/wic/", providerClaim: "El proveedor publica esta utilidad y su lista de modelos compatibles. LF-PRINTER aún debe verificar el caso y la licencia aplicable.",
    licenseSummary: "Licencia de software digital del proveedor; los derechos de reventa o redistribución por LF-PRINTER requieren confirmación expresa.",
    restrictions: ["Uso condicionado a la licencia del proveedor", "No redistribuir software ni claves sin autorización"],
    compatibilityStatus: "provider_announced_lf_unverified", commercializationStatus: "pending_authorization", deliveryPolicy: "private_after_manual_confirmation",
  },
  {
    id: "inkchip-chipless-firmware", slug: "inkchip-chipless-firmware", title: "Firmware Chipless + activación", publicName: "Firmware chipless + activación",
    provider: "INKCHIP", kind: "chipless_firmware", modelCodes: ["XP4105","XP4205","WF-C5890"],
    sourceUrl: "https://inkchip.net/soft/", providerClaim: "El proveedor separa firmware y activación. La compatibilidad por variante, autorización de reventa y disponibilidad para LF-PRINTER siguen pendientes.",
    licenseSummary: "Firmware y activación sujetos a las condiciones de licencia y titularidad del proveedor; la reventa debe autorizarse expresamente.",
    restrictions: ["Confirmar versión exacta y requisitos antes de ofrecer", "No redistribuir firmware o claves sin autorización"],
    compatibilityStatus: "provider_announced_lf_unverified", commercializationStatus: "pending_authorization", deliveryPolicy: "private_after_manual_confirmation",
  },
  {
    id: "camo-csreset-tool", slug: "camo-csreset-tool", title: "CSReset Tool V1.3 · clave de uso", publicName: "Clave de reset técnico",
    provider: "Camo Systems Perú", kind: "reset_key",
    modelCodes: ["L100","L1110","L1210","L1250","L1300","L1800","L3050","L3060","L3100","L3110","L3150","L3160","L3210","L3250","L3251","L3260","L4150","L4160","L4260","L5190","L5290","B1100","B42WD","XP100","XP200","XP210","XP225","XP235","XP300","XP310","XP400","XP422","XP425","XP600","XP610","XP700","XP710","XP800","XP810","WF3720"],
    sourceUrl: "https://camosystemsperu.com/csreset_tool/", providerClaim: "La página del proveedor describe una herramienta para Windows y una clave asociada a un equipo. Su lista no valida este servicio en LF-PRINTER.",
    licenseSummary: "Clave individual según las condiciones publicadas por el proveedor; la distribución por LF-PRINTER está pendiente de autorización.",
    restrictions: ["Herramienta para Windows según el proveedor", "Una clave por impresora según el proveedor", "No redistribuir aplicación o claves sin autorización"],
    compatibilityStatus: "provider_announced_lf_unverified", commercializationStatus: "pending_authorization", deliveryPolicy: "private_after_manual_confirmation",
  },
  {
    id: "camo-adjustment-program", slug: "camo-adjustment-program", title: "Adjustment Program · modelo específico", publicName: "Programa de ajuste por modelo",
    provider: "Camo Systems Perú", kind: "adjustment_program",
    modelCodes: ["L1210","L3110","L3150","L3160","L3210","L3250","L3251","L3260","L4150","L4160","L4260","L4261","L4267","L5190","L5290","L5590","L6091","L6161","L6171","L6190","WF-4830","WF-4834","WF-C5890"],
    sourceUrl: "https://camosystemsperu.com/descarga-reset-epson-y-canon-gratis/", providerClaim: "El proveedor agrupa programas por modelos. La versión exacta, requisitos, licencia y compatibilidad local se deben confirmar antes de ofrecerla.",
    licenseSummary: "Derechos de uso y distribución no confirmados para LF-PRINTER; requiere validar titularidad, licencia y alcance de comercialización.",
    restrictions: ["Verificar el modelo y versión exactos", "No publicar ni entregar archivos hasta confirmar derechos y condiciones"],
    compatibilityStatus: "provider_announced_lf_unverified", commercializationStatus: "pending_authorization", deliveryPolicy: "private_after_manual_confirmation",
  },
];

const codeKey = (code: string) => normalizeResetSearch(code);
export const commercialSolutions: CommercialSolution[] = solutionCandidates.map((solution) => ({
  ...solution,
  modelCodes: Array.from(new Set(solution.modelCodes.map((code) => resetModels.find((model) => codeKey(model.code) === codeKey(code))?.code).filter((code): code is string => Boolean(code)))),
}));

export const getCommercialSolution = (slug: string) => commercialSolutions.find((solution) => solution.slug === slug);
export const getCommercialSolutionsForModel = (code: string) => commercialSolutions.filter((solution) => solution.modelCodes.includes(code));
