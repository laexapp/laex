export type DominicanTaxRegime = "traditional" | "electronic" | "transition";
export type FiscalReportKind = "dgii-606" | "dgii-607" | "dgii-it1";

export const DOMINICAN_FISCAL_RULES = {
  version: "DGII-reference-2026-05",
  effectiveFrom: "2026-05-12",
  sources: {
    eCF: "DGII Formato e-CF v1.0 y XSD oficiales publicados en la documentación e-CF",
    reports606: "DGII Instructivo de envío 606, revisión publicada 2026-02-12",
    reports607: "DGII Instructivo de envío 607, revisión publicada 2025-12-18",
    reportsGuide: "DGII Guía general de formatos de envío, revisión publicada 2026-05-12",
  },
} as const;

export function selectFiscalTreatment(regime: DominicanTaxRegime, report: FiscalReportKind) {
  const treatment = regime === "electronic" ? "electronic-taxpayer-review-required"
    : regime === "transition" ? "transition-review-required"
    : "traditional-format-preparation";
  return { report, regime, treatment, ruleVersion: DOMINICAN_FISCAL_RULES.version, transmissible: false as const };
}
