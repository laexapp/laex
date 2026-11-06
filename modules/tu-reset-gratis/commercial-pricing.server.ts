import "server-only";

export const COMMERCIAL_FIXED_MARKUP_USD = 5;

export type SupplierCostRecord = {
  solutionId: string;
  supplierCostUsd: number | null;
  costVerified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  commercializationAuthorized: boolean;
  authorizationVerifiedAt: string | null;
  paymentFeesUsd: number | null;
  taxesUsd: number | null;
  otherCostsUsd: number | null;
};

// Internal starting records. Keep amounts unset until an invoice/receipt and
// license for LF-PRINTER distribution have been reviewed. This module is server-only.
const supplierCosts: Record<string, SupplierCostRecord> = {
  "inkchip-wic-reset-key": { solutionId: "inkchip-wic-reset-key", supplierCostUsd: null, costVerified: false, verifiedAt: null, verifiedBy: null, commercializationAuthorized: false, authorizationVerifiedAt: null, paymentFeesUsd: null, taxesUsd: null, otherCostsUsd: null },
  "inkchip-chipless-firmware": { solutionId: "inkchip-chipless-firmware", supplierCostUsd: null, costVerified: false, verifiedAt: null, verifiedBy: null, commercializationAuthorized: false, authorizationVerifiedAt: null, paymentFeesUsd: null, taxesUsd: null, otherCostsUsd: null },
  "camo-csreset-tool": { solutionId: "camo-csreset-tool", supplierCostUsd: null, costVerified: false, verifiedAt: null, verifiedBy: null, commercializationAuthorized: false, authorizationVerifiedAt: null, paymentFeesUsd: null, taxesUsd: null, otherCostsUsd: null },
  "camo-adjustment-program": { solutionId: "camo-adjustment-program", supplierCostUsd: null, costVerified: false, verifiedAt: null, verifiedBy: null, commercializationAuthorized: false, authorizationVerifiedAt: null, paymentFeesUsd: null, taxesUsd: null, otherCostsUsd: null },
};

export function calculateLfPrinterSalePriceUsd(supplierCostUsd: number | null, costVerified: boolean, commercializationAuthorized: boolean) {
  if (!costVerified || !commercializationAuthorized || supplierCostUsd === null || !Number.isFinite(supplierCostUsd) || supplierCostUsd < 0) return null;
  return Math.round((supplierCostUsd + COMMERCIAL_FIXED_MARKUP_USD) * 100) / 100;
}

export function getPublicCommercialPrice(solutionId: string) {
  const record = supplierCosts[solutionId];
  const priceUsd = record ? calculateLfPrinterSalePriceUsd(record.supplierCostUsd, record.costVerified, record.commercializationAuthorized) : null;
  return { priceUsd, priceLabel: priceUsd === null ? "Consultar precio" : `US$${priceUsd.toFixed(2)}` };
}

// Server-side only; an administrative persistence adapter can update a cost
// record once the internal cost-entry workflow is connected.
export function getInternalSupplierCostRecord(solutionId: string) {
  return supplierCosts[solutionId] ? { ...supplierCosts[solutionId] } : null;
}
