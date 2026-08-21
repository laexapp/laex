import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { ChapterTwoEngine } from "../../modules/business-engine/chapter-two/ChapterTwoEngine";
import type { ActorContext, CompanyId, TenantId, UserId, WarehouseId } from "../../modules/business-engine/domain/types";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";
import { BusinessIdentity } from "../../modules/business-engine/server/BusinessIdentity";

const tenantId = "tenant-lf" as TenantId, companyId = "company-lf" as CompanyId, userId = "owner-lf" as UserId, warehouseId = "warehouse-lf" as WarehouseId;
const capabilities = ["customer.create", "inventory.read", "inventory.receive", "audit.read", "workshop.complete", "purchase.receive", "quote.convert"] as never;
const root = mkdtempSync(join(tmpdir(), "laex-business-")); const path = join(root, "business.sqlite");
let store: SqliteChapterTwoStore, engine: ChapterTwoEngine, identity: BusinessIdentity, actor: ActorContext;

before(async () => {
  store = new SqliteChapterTwoStore(path); identity = new BusinessIdentity(store, "test-secret-with-at-least-thirty-two-characters");
  await identity.provisionAccount({ email: "owner@test.demo", password: "Strong-Demo-Password!", tenantId, companyId, userId, capabilities });
  await store.transact((state) => { state.products.push({ id: "ink", tenantId, companyId, sku: "T544", name: "Tinta", priceMinor: 65000 }); state.inventory.push({ id: "opening", tenantId, companyId, warehouseId, productId: "ink", delta: 20, kind: "purchase", sourceId: "opening" }); });
  const token = await identity.login("owner@test.demo", "Strong-Demo-Password!"); actor = await identity.requireActor(token, "trace-e2e"); engine = new ChapterTwoEngine(store, () => new Date("2026-08-08T12:00:00.000Z"));
});
after(() => { store.close(); rmSync(root, { recursive: true, force: true }); });

describe("Chapter 2 required journeys", () => {
  it("persists and verifies a signed server identity", async () => {
    await assert.rejects(identity.requireActor("tampered.session"), /authentication_required/);
    const second = new SqliteChapterTwoStore(path); const snapshot = await second.snapshot(); second.close(); assert.equal(snapshot.users.length, 1); assert.equal(snapshot.memberships.length, 1);
  });
  it("runs reception through delivery and history atomically", async () => {
    const result = await engine.completeWorkshopJourney(actor, "workshop-1", { customer: { name: "Juan Martínez", phone: "8495261212" }, equipment: { type: "printer", brand: "Epson", model: "L3250", serial: "EPSON-1" }, diagnosis: "Basic service", warehouseId, parts: [{ productId: "ink", quantity: 1 }], serviceTotalMinor: 150000, paymentMethod: "cash" });
    assert.equal(result.status, "closed"); const state = await engine.snapshot(actor); assert.equal(state.workOrders[0].status, "closed"); assert.equal(state.equipment[0].physicalStatus, "delivered"); assert.equal(state.invoices[0].status, "paid"); assert.equal(state.history[0].event, "delivered"); assert.equal(state.inventory.reduce((sum, item) => sum + item.delta, 0), 19);
    const repeated = await engine.completeWorkshopJourney(actor, "workshop-1", { customer: { name: "ignored" }, equipment: { type: "printer", brand: "x", model: "x" }, diagnosis: "x", warehouseId, parts: [], serviceTotalMinor: 1, paymentMethod: "cash" }); assert.equal(repeated.workOrderId, result.workOrderId);
  });
  it("runs purchase through receipt and inventory", async () => {
    const result = await engine.receivePurchase(actor, "purchase-1", { supplierName: "Epson Demo", warehouseId, lines: [{ productId: "ink", quantity: 10, unitCostMinor: 40000 }] }); assert.equal(result.status, "received");
    const state = await engine.snapshot(actor); assert.equal(state.purchases.length, 1); assert.ok(state.events.some((event) => event.name === "PurchaseReceived")); assert.equal(state.inventory.reduce((sum, item) => sum + item.delta, 0), 29);
  });
  it("runs quote through invoice and payment", async () => {
    const state = await engine.snapshot(actor); const result = await engine.convertQuoteAndPay(actor, "quote-1", { customerId: state.customers[0].id, lines: [{ productId: "ink", quantity: 2 }], paymentMethod: "transfer" }); assert.equal(result.status, "paid");
    const final = await engine.snapshot(actor); assert.equal(final.quotes[0].status, "converted"); assert.equal(final.invoices.length, 2); assert.equal(final.payments.length, 2); assert.equal(final.cashMovements.length, 2); assert.equal(final.audit.length, 3);
  });
});

