import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";
import { CommerceCatalogSearch } from "../../modules/business-engine/commerce/CommerceCatalogSearch";
import { CommerceEngine } from "../../modules/business-engine/commerce/CommerceEngine";
import type { CompanyId, TenantId } from "../../modules/business-engine/domain/types";

const root = mkdtempSync(join(tmpdir(), "laex-refinery-commerce-"));
const store = new SqliteChapterTwoStore(join(root, "state.sqlite"));
const tenantId = "tenant-refinery" as TenantId;
const companyId = "company-refinery" as CompanyId;
const now = () => new Date("2026-08-13T18:00:00.000Z");

describe("Refinery Commerce read-your-own-writes", () => {
  after(() => { store.close(); rmSync(root, { recursive: true, force: true }); });

  it("returns the new availability immediately after a reservation without exposing private stock records", async () => {
    await store.transact(state => {
      state.platformCompanies.push({ id: companyId, tenantId, slug: "refinery", name: "Refinery", legalName: "Refinery", currency: "DOP", timezone: "America/Santo_Domingo", primaryColor: "#00bbfc", enabledModules: ["commerce"], status: "active", createdAt: now().toISOString() });
      state.products.push({ id: "product-1", tenantId, companyId, sku: "PUBLIC-1", name: "Producto reactivo", costMinor: 100, priceMinor: 1000, taxRate: 18, status: "active" });
      state.inventory.push({ id: "movement-1", tenantId, companyId, warehouseId: "warehouse-1" as never, productId: "product-1", delta: 2, kind: "opening", sourceId: "opening" });
      state.commerceProjections.push({ id: "projection-1", tenantId, companyId, productId: "product-1", slug: "producto-reactivo", publicName: "Producto reactivo", publicDescription: "Prueba", commercialCategory: "Pruebas", images: [], publicPriceMinor: 1000, features: [], featured: true, publicationStatus: "published", seo: { title: "Producto reactivo", description: "Prueba" }, version: 1, synchronizedAt: now().toISOString() });
    });
    const catalog = new CommerceCatalogSearch(store, now);
    const commerce = new CommerceEngine(store, now);
    assert.equal((await catalog.search({ tenantId, companyId }, { query: "reactivo" })).products[0].availableQuantity, 2);
    await commerce.checkout(companyId, "reservation-once", { customer: { name: "Cliente", phone: "8490000000" }, fulfillment: "pickup", lines: [{ slug: "producto-reactivo", quantity: 1 }] });
    const refreshed = (await catalog.search({ tenantId, companyId }, { query: "reactivo" })).products[0] as unknown as Record<string, unknown>;
    assert.equal(refreshed.availableQuantity, 1);
    for (const privateField of ["costMinor", "inventory", "stock", "tenantId", "companyId"]) assert.equal(privateField in refreshed, false);
  });
});
