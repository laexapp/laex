import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { DominicanFiscalEngine, LocalDgiiSimulationProvider } from "../../modules/business-engine/fiscal/DominicanFiscalEngine";
import { SqliteChapterTwoStore } from "../../modules/business-engine/infrastructure/sqlite/SqliteChapterTwoStore";
import type { ActorContext, CompanyId, TenantId, UserId } from "../../modules/business-engine/domain/types";
import { ReportingService } from "../../modules/business-engine/reporting/ReportingService";
import { LocalAssistantOrchestrator } from "../../modules/business-engine/chapter-two/LocalAssistantOrchestrator";
import { ChapterTwoEngine } from "../../modules/business-engine/chapter-two/ChapterTwoEngine";
import { ReceptionEngine } from "../../modules/business-engine/chapter-two/ReceptionEngine";

const root = mkdtempSync(join(tmpdir(), "laex-c9-"));
const tenant = "tenant-c9" as TenantId, company = "company-c9" as CompanyId, otherCompany = "other-c9" as CompanyId, user = "user-c9" as UserId;
let store: SqliteChapterTwoStore, engine: DominicanFiscalEngine, actor: ActorContext;

before(async () => {
  store = new SqliteChapterTwoStore(join(root, "chapter-nine.sqlite"));
  actor = { tenantId: tenant, companyId: company, userId: user, traceId: "trace-c9", capabilities: ["dashboard.view","assistant.use","report.sales","report.expenses","report.fiscal.prepare","fiscal.profile.read","fiscal.profile.manage","fiscal.document.read","fiscal.document.prepare","fiscal.sequence.manage","fiscal.reconcile","fiscal.submit"] };
  engine = new DominicanFiscalEngine(store, new LocalDgiiSimulationProvider("accepted"), () => new Date("2026-08-12T12:00:00.000Z"));
  await store.transact((state) => {
    state.invoices.push({ id: "invoice-c9", tenantId: tenant, companyId: company, customerId: "customer-c9", sourceType: "pos", sourceId: "sale-c9", totalMinor: 65000, paidMinor: 65000, status: "paid", subtotalMinor: 65000, discountMinor: 0, taxableBaseMinor: 55085, taxMinor: 9915, taxMode: "included" });
    state.invoices.push({ id: "invoice-other", tenantId: tenant, companyId: otherCompany, customerId: "hidden", sourceType: "pos", sourceId: "hidden", totalMinor: 99900, paidMinor: 99900, status: "paid" });
  });
});
after(() => { store.close(); rmSync(root, { recursive: true, force: true }); });

describe("Chapter 9 Dominican fiscal engine", () => {
  it("requires an explicit authorized range and prevents parallel active sequences", async () => {
    await assert.rejects(engine.registerSequence(actor, { type: "E32", rangeStart: 1, rangeEnd: 2, authorizedReference: "", environment: "certification" }), /invalid_authorized_sequence/);
    await engine.registerSequence(actor, { type: "E32", rangeStart: 1, rangeEnd: 2, authorizedReference: "DGII-CERT-LOCAL", environment: "certification" });
    await assert.rejects(engine.registerSequence(actor, { type: "E32", rangeStart: 3, rangeEnd: 4, authorizedReference: "DGII-CERT-LOCAL-2", environment: "certification" }), /active_sequence_exists/);
  });
  it("prepares idempotently, assigns a unique 13-character e-NCF and preserves invoice totals", async () => {
    const input = { businessDocumentId: "invoice-c9", type: "E32" as const, buyer: { name: "Consumidor final" }, idempotencyKey: "prepare-1" };
    const first = await engine.prepare(actor, input), repeated = await engine.prepare(actor, input);
    assert.equal(first.id, repeated.id);
    const numbered = await engine.assignNumber(actor, first.id);
    assert.match(numbered.eNcf!, /^E32\d{10}$/);
    assert.equal(numbered.totals.totalMinor, 65000);
    const sealed = await engine.sealCanonicalXml(actor, first.id);
    assert.equal(sealed.schemaValidated, false);
    assert.match(sealed.xml, /pending-official-xsd/);
  });
  it("cannot prepare a document from another company", async () => {
    await assert.rejects(engine.prepare(actor, { businessDocumentId: "invoice-other", type: "E32", buyer: { name: "Oculto" }, idempotencyKey: "foreign" }), /business_document_not_found/);
  });
  it("enforces fiscal permissions and links credit notes to the original document", async () => {
    const limited = { ...actor, capabilities: ["dashboard.view"] as ActorContext["capabilities"] };
    await assert.rejects(engine.configureProfile(limited, { enabled: false, environment: "disabled", rnc: "101000001", obligationsCurrent: false, authorizedElectronicIssuer: false, softwareCertified: false }), /Missing capability/);
    const original = (await store.snapshot()).canonicalFiscalDocuments[0];
    const note = await engine.prepare(actor, { businessDocumentId: "invoice-c9", type: "E34", buyer: { name: "Consumidor final" }, originalFiscalDocumentId: original.id, idempotencyKey: "credit-note-1" });
    assert.equal(note.originalFiscalDocumentId, original.id);
  });
  it("simulates DGII locally, audits the outcome and reconciles without silent correction", async () => {
    const state = await store.snapshot(), document = state.canonicalFiscalDocuments[0];
    await engine.configureProfile(actor, { enabled: false, environment: "disabled", rnc: "101000001", obligationsCurrent: false, authorizedElectronicIssuer: false, softwareCertified: false, legalName: "Empresa C9", taxRegime: "traditional", ruleVersion: "DGII-reference-2026-05" });
    const submitted = await engine.submitSimulation(actor, document.id, "submit-1");
    assert.equal(submitted.status, "accepted");
    const reconciliation = await engine.reconcile(actor, { from: "2026-08-01", to: "2026-08-31" });
    assert.equal(reconciliation.status, "balanced");
    assert.ok((await store.snapshot()).audit.some((entry) => entry.action === "fiscal.dgii.simulated.accepted"));
  });
  it("preserves simulated rejection and contingency outcomes", async () => {
    const document = (await store.snapshot()).canonicalFiscalDocuments[0];
    const rejected = await new DominicanFiscalEngine(store, new LocalDgiiSimulationProvider("rejected")).submitSimulation(actor, document.id, "reject-1");
    assert.equal(rejected.status, "rejected");
    const contingency = await new DominicanFiscalEngine(store, new LocalDgiiSimulationProvider("contingency")).submitSimulation(actor, document.id, "contingency-1");
    assert.equal(contingency.status, "contingency");
  });
  it("selects versioned 606/607 treatment by taxpayer modality and blocks LIA escalation", async () => {
    const reporting = new ReportingService(store, () => new Date("2026-08-12T12:00:00.000Z"));
    const report = await reporting.fiscalPreparation(actor, "dgii-607", { from: "2026-08-01", to: "2026-08-31" });
    assert.equal(report.regime, "traditional"); assert.equal(report.transmissible, false); assert.match(report.ruleVersion, /2026/);
    const orchestrator = new LocalAssistantOrchestrator(store, new ChapterTwoEngine(store), new ReceptionEngine(store), reporting, undefined, () => new Date("2026-08-12T12:00:00.000Z"));
    const limited = { ...actor, userId: "limited-c9" as UserId, capabilities: ["assistant.use","dashboard.view"] as ActorContext["capabilities"] };
    const denied = await orchestrator.ask(limited, "LIA", "LIA, prepara la información fiscal de julio");
    assert.match(denied.answer, /No tienes permisos/);
    const allowed = await orchestrator.ask(actor, "LIA", "LIA, prepara la información fiscal de hoy");
    assert.match(allowed.answer, /no transmisible/);
  });
});
