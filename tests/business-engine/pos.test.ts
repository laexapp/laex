import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { PosEngine } from "../../modules/business-engine/chapter-two/PosEngine";
import type { ActorContext, CompanyId, TenantId, UserId, WarehouseId } from "../../modules/business-engine/domain/types";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";

const tenantId = "tenant-pos" as TenantId, companyId = "company-pos" as CompanyId, userId = "cashier-pos" as UserId, warehouseId = "warehouse-pos" as WarehouseId;
const actor = { tenantId, companyId, userId, capabilities: ["pos.sell"], traceId: "trace-pos" } as unknown as ActorContext;
const root = mkdtempSync(join(tmpdir(), "laex-pos-")); const database = join(root, "pos.sqlite");
let store: SqliteChapterTwoStore, engine: PosEngine;

before(async () => {
  store = new SqliteChapterTwoStore(database); engine = new PosEngine(store, () => new Date("2026-08-08T15:00:00.000Z"));
  await store.transact((state) => { state.memberships.push({ tenantId, companyId, userId, capabilities: ["pos.sell"] as never, status: "active" }); state.customers.push({ id: "customer-pos", tenantId, companyId, name: "Cliente POS" }); state.products.push({ id: "ink", tenantId, companyId, sku: "T544", barcode: "7861234567890", name: "Tinta", priceMinor: 65000 }); state.inventory.push({ id: "opening", tenantId, companyId, warehouseId, productId: "ink", delta: 10, kind: "purchase", sourceId: "opening" }); });
});
after(() => { store.close(); rmSync(root, { recursive: true, force: true }); });

describe("Point of Sale", () => {
  it("confirms a mixed payment sale through inventory, invoice, cash and audit", async () => {
    const input = { customerId: "customer-pos", customerType: "fiscal_credit", warehouseId, lines: [{ productId: "ink", quantity: 2 }], discountMinor: 10000, taxRate: .18, taxMode: "included" as const, payments: [{ method: "cash", amountMinor: 70000, receivedMinor: 100000 }, { method: "card", amountMinor: 50000, metadata: { cardType: "credit", last4: "4242", authorizationReference: "AUTH-1", processor: "Demo Bank" } }] };
    const result = await engine.confirmSale(actor, "pos-sale-1", input); assert.equal(result.subtotalMinor, 130000); assert.equal(result.taxableBaseMinor, 101695); assert.equal(result.taxMinor, 18305); assert.equal(result.totalMinor, 120000); assert.equal(result.changeMinor, 30000); assert.equal(result.paymentIds.length, 2);
    const state = await store.snapshot(); assert.equal(state.invoices.length, 1); assert.equal(state.invoices[0].sourceType, "pos"); assert.equal(state.payments.length, 2); assert.equal(state.cashMovements.length, 2); assert.equal(state.inventory.reduce((sum, item) => sum + item.delta, 0), 8); assert.equal(state.audit[0].action, "pos.sale.confirmed"); assert.deepEqual(state.payments[1].metadata, { cardType: "credit", last4: "4242", authorizationReference: "AUTH-1", processor: "Demo Bank" }); assert.equal(state.invoices[0].taxMode, "included");
    const repeated = await engine.confirmSale(actor, "pos-sale-1", input); assert.equal(repeated.invoiceId, result.invoiceId); assert.equal((await store.snapshot()).invoices.length, 1);
  });
});
