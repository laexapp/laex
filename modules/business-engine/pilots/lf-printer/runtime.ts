import "server-only";
import type { CompanyId, TenantId, UserId, WarehouseId } from "../../domain/types";
import { getLaboratoryBusinessRuntime } from "../../server/runtime";

export const LF_PRINTER_PILOT = {
  tenantId: "tenant-lf-printer" as TenantId,
  companyId: "company-lf-printer" as CompanyId,
  ownerUserId: "user-lf-owner" as UserId,
  warehouseId: "warehouse-lf-main" as WarehouseId,
  ownerEmail: "owner@lf-printer.demo",
  ownerPassword: "LAEX-Demo-2026!",
  productId: "product-t544-black",
} as const;

let provisioned: Promise<void> | undefined;
export function ensureLfPrinterPilot(): Promise<void> {
  provisioned ??= (async () => {
    const runtime = getLaboratoryBusinessRuntime(), pilot = LF_PRINTER_PILOT;
    await runtime.store.transact((state) => {
      if (!state.products.some((item) => item.id === pilot.productId)) state.products.push({ id: pilot.productId, tenantId: pilot.tenantId, companyId: pilot.companyId, sku: "T544-BK", barcode: "7861234567890", name: "Tinta Epson T544 Negro", priceMinor: 65000 });
      const opening = state.inventory.find((item) => item.tenantId === pilot.tenantId && item.companyId === pilot.companyId && (item.sourceId === "pilot-opening" || item.sourceId === "demo-opening")); if (!opening) state.inventory.push({ id: "inventory-lf-pilot-opening", tenantId: pilot.tenantId, companyId: pilot.companyId, warehouseId: pilot.warehouseId, productId: pilot.productId, delta: 100, kind: "purchase", sourceId: "pilot-opening" }); else if (opening.sourceId === "demo-opening") opening.sourceId = "pilot-opening";
      const product = state.products.find((item) => item.id === pilot.productId && item.tenantId === pilot.tenantId && item.companyId === pilot.companyId); if (product && !product.barcode) product.barcode = "7861234567890";
      const membership = state.memberships.find((item) => item.userId === pilot.ownerUserId && item.tenantId === pilot.tenantId && item.companyId === pilot.companyId); if (membership) { const required = ["pos.sell", "assistant.use", "workorder.create"]; membership.capabilities = [...new Set([...(membership.capabilities as readonly string[]), ...required])] as never; }
    });
    await runtime.businessIdentity.provisionAccount({ email: pilot.ownerEmail, password: pilot.ownerPassword, tenantId: pilot.tenantId, companyId: pilot.companyId, userId: pilot.ownerUserId, capabilities: ["customer.create", "inventory.read", "inventory.receive", "audit.read", "workshop.complete", "purchase.receive", "quote.convert", "pos.sell", "assistant.use", "workorder.create"] as never });
  })();
  return provisioned;
}

