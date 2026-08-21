import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AccessDeniedError, BusinessEngine, BusinessInvariantError, CapabilityDeniedError, MemoryBusinessStateStore } from "../../modules/business-engine";
import type { ActorContext, Company, CompanyId, Product, TenantId, UserId, WarehouseId } from "../../modules/business-engine";

const tenantA = "tenant-a" as TenantId, tenantB = "tenant-b" as TenantId;
const companyA = "company-a" as CompanyId, companyB = "company-b" as CompanyId;
const warehouseA = "warehouse-a" as WarehouseId;
const companies: Company[] = [
  { id: companyA, tenantId: tenantA, tradeName: "LF-PRINTER", legalName: "LF Printer Demo", country: "DO", currency: "DOP", timezone: "America/Santo_Domingo", status: "active" },
  { id: companyB, tenantId: tenantB, tradeName: "Other", legalName: "Other Demo", country: "DO", currency: "DOP", timezone: "America/Santo_Domingo", status: "active" },
];
const products: Product[] = [
  { id: "ink-a", tenantId: tenantA, companyId: companyA, sku: "T544-BK", name: "Tinta T544 Negro", unit: "unit", costMinor: 40000, priceMinor: 65000, taxCode: "ITBIS-18", status: "active" },
  { id: "ink-b", tenantId: tenantB, companyId: companyB, sku: "T544-BK", name: "Private", unit: "unit", costMinor: 1, priceMinor: 2, taxCode: "EXEMPT", status: "active" },
];

function actor(tenantId = tenantA, companyId = companyA, capabilities: ActorContext["capabilities"] = ["customer.create", "inventory.receive", "inventory.read", "audit.read"]): ActorContext {
  return { tenantId, companyId, userId: "demo-user" as UserId, capabilities, traceId: "trace-test" };
}
function setup() {
  const store = new MemoryBusinessStateStore({ companies, products }); let sequence = 0;
  return { store, engine: new BusinessEngine(store, () => new Date("2026-08-08T12:00:00.000Z"), () => `id-${++sequence}`) };
}

describe("Business Engine foundation", () => {
  it("finds an existing customer instead of duplicating it", async () => {
    const { engine, store } = setup();
    const first = await engine.findOrCreateCustomer(actor(), "customer-1", { name: "Juan Martínez", phone: "849-526-1212", type: "person" });
    const second = await engine.findOrCreateCustomer(actor(), "customer-2", { name: "Juan M.", phone: "(849) 526 1212", type: "person" });
    assert.equal(first.id, second.id); assert.equal((await store.snapshot()).customers.length, 1);
  });
  it("does not duplicate an idempotent inventory command", async () => {
    const { engine, store } = setup(); const command = { warehouseId: warehouseA, productId: "ink-a", quantity: 5, sourceType: "purchase_receipt", sourceId: "receipt-1" };
    const first = await engine.receiveInventory(actor(), "receive-1", command); const repeated = await engine.receiveInventory(actor(), "receive-1", command);
    assert.equal(first.id, repeated.id); assert.equal((await store.snapshot()).inventoryMovements.length, 1);
  });
  it("derives stock exclusively from movements", async () => {
    const { engine } = setup(); await engine.receiveInventory(actor(), "receive-1", { warehouseId: warehouseA, productId: "ink-a", quantity: 8, sourceType: "purchase_receipt", sourceId: "receipt-1" });
    assert.equal(await engine.inventoryBalance(actor(), warehouseA, "ink-a"), 8);
  });
  it("does not expose another tenant through a known id", async () => {
    const { engine } = setup(); await assert.rejects(engine.inventoryBalance(actor(), warehouseA, "ink-b"), AccessDeniedError); await assert.rejects(engine.inventoryBalance(actor(tenantA, companyB), warehouseA, "ink-b"), AccessDeniedError);
  });
  it("enforces capabilities before state access", async () => {
    const { engine } = setup(); await assert.rejects(engine.inventoryBalance(actor(tenantA, companyA, []), warehouseA, "ink-a"), CapabilityDeniedError);
  });
  it("rolls back an invalid operation", async () => {
    const { engine, store } = setup(); await assert.rejects(engine.receiveInventory(actor(), "bad", { warehouseId: warehouseA, productId: "ink-a", quantity: 0, sourceType: "purchase_receipt", sourceId: "bad" }), BusinessInvariantError);
    const state = await store.snapshot(); assert.equal(state.inventoryMovements.length, 0); assert.equal(state.audit.length, 0);
  });
  it("records scoped audit entries", async () => {
    const { engine } = setup(); await engine.receiveInventory(actor(), "receive-1", { warehouseId: warehouseA, productId: "ink-a", quantity: 3, sourceType: "purchase_receipt", sourceId: "receipt-1", reason: "Demo stock" });
    const entries = await engine.listAudit(actor()); assert.equal(entries.length, 1); assert.equal(entries[0].action, "inventory.received"); assert.equal(entries[0].reason, "Demo stock");
  });
});
