import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { saveContentVersion, transitionContent } from "../../modules/media-intelligence/domain/editorial";
import type { ProductContent } from "../../modules/media-intelligence/domain/product";
import { SimulatedPublicationQueue } from "../../modules/media-intelligence/infrastructure/simulation/SimulatedPublicationQueue";
function content(): ProductContent { return { id: "content_a", title: "Pieza", description: "", sourceType: "manual", status: "in_review", authorId: "author", confidence: 80, risks: [], keywords: [], categories: [], versions: [{ number: 1, title: "Pieza", body: "v1", author: "author", createdAt: "2026-01-01T00:00:00.000Z", note: "Inicial" }], approvedVersion: null, reviewReason: null, updatedAt: "2026-01-01T00:00:00.000Z" }; }
describe("flujo editorial humano", () => {
  it("la IA no puede aprobar", () => assert.throws(() => transitionContent(content(), "approved", "ai")));
  it("la aprobación identifica la versión", () => { const value = content(); transitionContent(value, "approved", "human"); assert.equal(value.approvedVersion, 1); });
  it("editar después de aprobar invalida la aprobación", () => { const value = content(); transitionContent(value, "approved", "human"); assert.equal(saveContentVersion(value, "v2", "editor"), 2); assert.equal(value.approvedVersion, null); assert.equal(value.status, "draft"); });
  it("una transición inválida se rechaza", () => assert.throws(() => transitionContent(content(), "simulated_published", "human")));
});
describe("publicación simulada idempotente", () => {
  it("una operación repetida conserva el mismo trabajo", () => { const queue = new SimulatedPublicationQueue(); const first = queue.enqueue({ idempotencyKey: "same", workspaceId: "a", resourceId: "c" }); const repeated = queue.enqueue({ idempotencyKey: "same", workspaceId: "a", resourceId: "c" }); assert.equal(first.id, repeated.id); });
  it("reintenta un fallo sin duplicar el trabajo", () => { const queue = new SimulatedPublicationQueue(); queue.enqueue({ idempotencyKey: "retry", workspaceId: "a", resourceId: "c" }); assert.equal(queue.execute("retry", "failed").attempts, 1); const retried = queue.execute("retry", "success"); assert.equal(retried.attempts, 2); assert.equal(retried.status, "success"); });
});
