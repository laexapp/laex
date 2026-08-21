import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { ChapterTwoEngine } from "../../modules/business-engine/chapter-two/ChapterTwoEngine";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";
import { CompanyProvisioningService } from "../../modules/business-engine/platform/CompanyProvisioningService";
import { CompanyResolver } from "../../modules/business-engine/platform/CompanyResolver";
import { BusinessIdentity } from "../../modules/business-engine/server/BusinessIdentity";

const root = mkdtempSync(join(tmpdir(), "laex-saas-"));
const store = new SqliteChapterTwoStore(join(root, "saas.sqlite"));
const identity = new BusinessIdentity(store, "chapter-four-test-secret-with-more-than-32-chars");
const provisioning = new CompanyProvisioningService(store, identity, () => new Date("2026-08-08T12:00:00.000Z"));
let companyA: Awaited<ReturnType<typeof provisioning.provision>>;
let companyB: Awaited<ReturnType<typeof provisioning.provision>>;

before(async () => {
  companyA = await provisioning.provision({ name: "Empresa A", legalName: "Empresa A SRL", slug: "empresa-a", hostname: "a.example.test", ownerEmail: "shared@example.test", ownerPassword: "Shared-Password-2026!", enabledModules: ["dashboard", "inventory"] });
  companyB = await provisioning.provision({ name: "Empresa B", legalName: "Empresa B SRL", slug: "empresa-b", hostname: "b.example.test", ownerEmail: "shared@example.test", ownerPassword: "Shared-Password-2026!", enabledModules: ["dashboard", "inventory"] });
  await store.transact((state) => {
    state.products.push({ id: "product-a", tenantId: companyA.tenantId, companyId: companyA.companyId, sku: "SAME-SKU", name: "Producto A", priceMinor: 10000 });
    state.products.push({ id: "product-b", tenantId: companyB.tenantId, companyId: companyB.companyId, sku: "SAME-SKU", name: "Producto B", priceMinor: 20000 });
  });
});
after(() => { store.close(); rmSync(root, { recursive: true, force: true }); });

describe("Chapter 4 SaaS isolation", () => {
  it("requires explicit company selection for a multi-company user", async () => {
    await assert.rejects(identity.login("shared@example.test", "Shared-Password-2026!"), /company_selection_required/);
    const available = await identity.availableCompanies("shared@example.test", "Shared-Password-2026!");
    assert.deepEqual(new Set(available.map((item) => item.companyId)), new Set([companyA.companyId, companyB.companyId]));
  });
  it("keeps identical SKUs and business data isolated", async () => {
    const tokenA = await identity.login("shared@example.test", "Shared-Password-2026!", companyA.companyId);
    const tokenB = await identity.login("shared@example.test", "Shared-Password-2026!", companyB.companyId);
    const engine = new ChapterTwoEngine(store);
    const stateA = await engine.snapshot(await identity.requireActor(tokenA));
    const stateB = await engine.snapshot(await identity.requireActor(tokenB));
    assert.deepEqual(stateA.products.map((item) => item.name), ["Producto A"]);
    assert.deepEqual(stateB.products.map((item) => item.name), ["Producto B"]);
  });
  it("enforces domain uniqueness and suspends without deleting data", async () => {
    const resolver = new CompanyResolver(store);
    assert.equal((await resolver.bySlugOrHost("a.example.test")).id, companyA.companyId);
    await assert.rejects(provisioning.provision({ name: "Conflict", legalName: "Conflict", slug: "conflict", hostname: "a.example.test", ownerEmail: "other@example.test", ownerPassword: "Other-Password-2026!", enabledModules: [] }), /domain_already_assigned/);
    await store.transact((state) => { const company = state.platformCompanies.find((item) => item.id === companyA.companyId); if (company) company.status = "suspended"; });
    await assert.rejects(resolver.bySlugOrHost("empresa-a"), /company_suspended/);
    assert.equal((await store.snapshot()).products.filter((item) => item.companyId === companyA.companyId).length, 1);
  });
});
