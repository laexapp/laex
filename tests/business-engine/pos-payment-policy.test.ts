import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { PosEngine } from "../../modules/business-engine/chapter-two/PosEngine";
import type { ActorContext, CompanyId, TenantId, UserId, WarehouseId } from "../../modules/business-engine/domain/types";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";

const tenantId = "tenant-tax" as TenantId, companyId = "company-tax" as CompanyId, userId = "cashier-tax" as UserId, warehouseId = "warehouse-tax" as WarehouseId;
const actor = { tenantId, companyId, userId, capabilities: ["pos.sell"], traceId: "trace-tax" } as unknown as ActorContext;
const root = mkdtempSync(join(tmpdir(), "laex-pos-policy-")); const database = join(root, "policy.sqlite");
let store: SqliteChapterTwoStore, engine: PosEngine;

before(async () => {
  store = new SqliteChapterTwoStore(database); engine = new PosEngine(store, () => new Date("2026-08-08T16:00:00.000Z"));
  await store.transact((state) => { state.memberships.push({ tenantId, companyId, userId, capabilities: ["pos.sell"] as never, status: "active" }); state.products.push({ id: "product", tenantId, companyId, sku: "P-650", name: "Producto 650", priceMinor: 65000 }); state.inventory.push({ id: "opening", tenantId, companyId, warehouseId, productId: "product", delta: 10, kind: "purchase", sourceId: "opening" }); });
});
after(() => { store.close(); rmSync(root, { recursive: true, force: true }); });

describe("POS tax and payment policy", () => {
  it("keeps an included-tax price at RD$650 and extracts its taxable base", async () => {
    const result = await engine.confirmSale(actor, "included-650", { customerType: "consumer_final", warehouseId, lines: [{ productId: "product", quantity: 1 }], discountMinor: 0, taxRate: .18, taxMode: "included", payments: [{ method: "cash", amountMinor: 65000, receivedMinor: 100000 }] });
    assert.equal(result.totalMinor, 65000); assert.equal(result.taxableBaseMinor, 55085); assert.equal(result.taxMinor, 9915); assert.equal(result.changeMinor, 35000);
  });

  it("continues supporting tax added for future company configurations", async () => {
    const result = await engine.confirmSale(actor, "excluded-767", { customerType: "consumer_final", warehouseId, lines: [{ productId: "product", quantity: 1 }], discountMinor: 0, taxRate: .18, taxMode: "excluded", payments: [{ method: "cash", amountMinor: 76700, receivedMinor: 100000 }] });
    assert.equal(result.taxableBaseMinor, 65000); assert.equal(result.taxMinor, 11700); assert.equal(result.totalMinor, 76700); assert.equal(result.changeMinor, 23300);
  });

  it("rejects insufficient cash and sensitive card metadata", async () => {
    await assert.rejects(engine.confirmSale(actor, "cash-short", { customerType: "consumer_final", warehouseId, lines: [{ productId: "product", quantity: 1 }], discountMinor: 0, taxRate: .18, taxMode: "included", payments: [{ method: "cash", amountMinor: 65000, receivedMinor: 60000 }] }), /insufficient/);
    await assert.rejects(engine.confirmSale(actor, "unsafe-card", { customerType: "consumer_final", warehouseId, lines: [{ productId: "product", quantity: 1 }], discountMinor: 0, taxRate: .18, taxMode: "included", payments: [{ method: "card", amountMinor: 65000, metadata: { cardType: "debit", last4: "4242", authorizationReference: "AUTH", cardNumber: "4242424242424242" } }] }), /Sensitive payment metadata/);
    const state = await store.snapshot(); assert.equal(state.invoices.length, 2);
  });
});
