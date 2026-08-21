import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { ChapterTwoEngine } from "../../modules/business-engine/chapter-two/ChapterTwoEngine";
import { LocalAssistantOrchestrator } from "../../modules/business-engine/chapter-two/LocalAssistantOrchestrator";
import { ReceptionEngine } from "../../modules/business-engine/chapter-two/ReceptionEngine";
import type { ActorContext, CompanyId, TenantId, UserId } from "../../modules/business-engine/domain/types";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";
import { BusinessIdentity } from "../../modules/business-engine/server/BusinessIdentity";

const tenantId = "tenant-assistant" as TenantId, companyId = "company-assistant" as CompanyId, userId = "user-assistant" as UserId;
const root = mkdtempSync(join(tmpdir(), "laex-assistant-")); let store: SqliteChapterTwoStore, actor: ActorContext, orchestrator: LocalAssistantOrchestrator;
before(async () => { store = new SqliteChapterTwoStore(join(root, "assistant.sqlite")); const identity = new BusinessIdentity(store, "assistant-test-secret-at-least-thirty-two"); await identity.provisionAccount({ email: "assistant@test.demo", password: "Assistant-Test-2026!", tenantId, companyId, userId, capabilities: ["audit.read", "assistant.use", "workorder.create"] as never }); actor = await identity.requireActor(await identity.login("assistant@test.demo", "Assistant-Test-2026!"), "trace-assistant"); const business = new ChapterTwoEngine(store, () => new Date("2026-08-08T12:00:00.000Z")); orchestrator = new LocalAssistantOrchestrator(store, business, new ReceptionEngine(store, () => new Date("2026-08-08T12:00:00.000Z")), () => new Date("2026-08-08T12:00:00.000Z")); });
after(() => { store.close(); rmSync(root, { recursive: true, force: true }); });
describe("local assistant orchestration", () => {
  it("proposes a sensitive reception without modifying business data", async () => { const response = await orchestrator.ask(actor, "LIA", "LIA, recibe una Epson L3250 de Juan Martínez."); assert.equal(response.proposal?.status, "pending"); const state = await store.snapshot(); assert.equal(state.customers.length, 0); assert.equal(state.workOrders.length, 0); });
  it("confirms through an authorized idempotent command and audit", async () => { const state = await store.snapshot(); const proposal = state.assistantProposals[0]; const first = await orchestrator.confirm(actor, proposal.id) as { workOrderId: string }; const repeated = await orchestrator.confirm(actor, proposal.id) as { workOrderId: string }; assert.equal(first.workOrderId, repeated.workOrderId); const final = await store.snapshot(); assert.equal(final.customers[0].name, "Juan Martínez"); assert.equal(final.workOrders[0].status, "pending_diagnosis"); assert.ok(final.audit.some((entry) => entry.action === "reception.created")); });
  it("lets ALAN query operations and ETHAN aggregate today's invoices without mutations", async () => { const before = (await store.snapshot()).audit.length; const alan = await orchestrator.ask(actor, "ALAN", "ALAN, muéstrame las órdenes pendientes de diagnóstico."); const ethan = await orchestrator.ask(actor, "ETHAN", "ETHAN, ¿cuánto vendimos hoy?"); assert.match(alan.answer, /1 orden/); assert.match(ethan.answer, /RD\$0\.00|0,00/); assert.equal((await store.snapshot()).audit.length, before); });
});


