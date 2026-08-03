import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WorkspaceAccessService } from "../../modules/media-intelligence/application/WorkspaceAccessService";
import { CapabilityDeniedError, WorkspaceAccessDeniedError, WorkspaceInvariantError } from "../../modules/media-intelligence/domain/errors";
import { createMemoryRepositories } from "../../modules/media-intelligence/infrastructure/memory/MemoryRepositories";
import type { MediaWorkspace, TenantId, UserId, WorkspaceId, WorkspaceMembership } from "../../modules/media-intelligence/domain/types";

const tenantA = "tenant_a" as TenantId, tenantB = "tenant_b" as TenantId;
const workspaceA = "workspace_a" as WorkspaceId, workspaceB = "workspace_b" as WorkspaceId;
const ownerA = "owner_a" as UserId, editorA = "editor_a" as UserId, viewerA = "viewer_a" as UserId, ownerB = "owner_b" as UserId;

function workspace(id: WorkspaceId, tenantId: TenantId, ownerUserId: UserId): MediaWorkspace {
  return { id, tenantId, ownerUserId, name: id, kind: "company", role: "owner", color: "#fff", channelCount: 0, campaignCount: 0, status: "active", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", archivedAt: null, deletionRequestedAt: null };
}

function membership(id: string, tenantId: TenantId, workspaceId: WorkspaceId, userId: UserId, role: WorkspaceMembership["role"], status: WorkspaceMembership["status"] = "active"): WorkspaceMembership {
  return { id, tenantId, workspaceId, userId, role, status, capabilityOverrides: {}, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", removedAt: status === "removed" ? "2026-02-01T00:00:00.000Z" : null };
}

function setup() {
  const repositories = createMemoryRepositories({ workspaces: [workspace(workspaceA, tenantA, ownerA), workspace(workspaceB, tenantB, ownerB)], memberships: [membership("owner-a", tenantA, workspaceA, ownerA, "owner"), membership("editor-a", tenantA, workspaceA, editorA, "editor"), membership("viewer-a", tenantA, workspaceA, viewerA, "viewer"), membership("owner-b", tenantB, workspaceB, ownerB, "owner")] });
  const access = new WorkspaceAccessService(repositories, () => new Date("2026-03-01T12:00:00.000Z"));
  const actor = (tenantId: TenantId, userId: UserId) => ({ tenantId, userId, traceId: `trace_${userId}` });
  return { repositories, access, actor };
}

describe("aislamiento por workspace", () => {
  for (const [label, capability] of [["leer", "workspace.read"], ["modificar campañas", "campaign.manage"], ["consultar analytics", "analytics.read"], ["aprobar contenido", "content.approve"], ["modificar permisos", "members.manage"]] as const) {
    it(`Usuario A no puede ${label} en el workspace de Usuario B`, async () => {
      const { access, actor } = setup();
      await assert.rejects(access.authorize(actor(tenantA, ownerA), workspaceB, capability), WorkspaceAccessDeniedError);
    });
  }
  it("un identificador manipulado no evita el filtro tenant", async () => {
    const { access, actor } = setup();
    await assert.rejects(access.authorize(actor(tenantA, ownerA), "workspace_b" as WorkspaceId, "workspace.read"), WorkspaceAccessDeniedError);
  });
  it("audita el rechazo sin contaminar el tenant propietario", async () => {
    const { access, actor, repositories } = setup();
    await assert.rejects(access.authorize(actor(tenantA, ownerA), workspaceB, "workspace.read"));
    assert.equal((await repositories.audit.list({ tenantId: tenantA, workspaceId: workspaceB })).length, 1);
    assert.equal((await repositories.audit.list({ tenantId: tenantB, workspaceId: workspaceB })).length, 0);
  });
});

describe("capacidades y membresías", () => {
  it("un editor no puede actuar como propietario", async () => { const { access, actor } = setup(); await assert.rejects(access.authorize(actor(tenantA, editorA), workspaceA, "workspace.manage"), CapabilityDeniedError); });
  it("solo lectura no puede editar contenido", async () => { const { access, actor } = setup(); await assert.rejects(access.authorize(actor(tenantA, viewerA), workspaceA, "content.edit"), CapabilityDeniedError); });
  it("un miembro eliminado pierde el acceso", async () => {
    const { access, actor, repositories } = setup(); const removedUser = "removed" as UserId;
    await repositories.memberships.save(membership("removed", tenantA, workspaceA, removedUser, "editor", "removed"));
    await assert.rejects(access.authorize(actor(tenantA, removedUser), workspaceA, "content.edit"), WorkspaceAccessDeniedError);
  });
  it("el último propietario no puede eliminarse", async () => { const { access, actor } = setup(); await assert.rejects(access.removeMember(actor(tenantA, ownerA), workspaceA, "owner-a"), WorkspaceInvariantError); });
  it("el propietario no puede reducir su propio rol", async () => { const { access, actor } = setup(); await assert.rejects(access.changeRole(actor(tenantA, ownerA), workspaceA, "owner-a", "admin"), WorkspaceInvariantError); });
  it("una revocación explícita prevalece sobre el rol", async () => {
    const { access, actor, repositories } = setup(); const editor = (await repositories.memberships.listActive({ tenantId: tenantA, workspaceId: workspaceA })).find((item) => item.userId === editorA)!;
    editor.capabilityOverrides["content.edit"] = false; await repositories.memberships.save(editor);
    await assert.rejects(access.authorize(actor(tenantA, editorA), workspaceA, "content.edit"), CapabilityDeniedError);
  });
});

describe("ciclo de vida", () => {
  it("crea workspace y propietario juntos", async () => {
    const { access, actor, repositories } = setup(); const created = await access.createWorkspace(actor(tenantA, ownerA), { name: "Academia", kind: "academy", color: "#0ff" });
    assert.equal((await repositories.memberships.findActive({ tenantId: tenantA, workspaceId: created.id }, ownerA))?.role, "owner");
  });
  it("archiva y recupera sin borrar", async () => {
    const { access, actor, repositories } = setup(); await access.archive(actor(tenantA, ownerA), workspaceA); assert.equal((await repositories.workspaces.findById({ tenantId: tenantA, workspaceId: workspaceA }))?.status, "archived");
    await access.recover(actor(tenantA, ownerA), workspaceA); assert.equal((await repositories.workspaces.findById({ tenantId: tenantA, workspaceId: workspaceA }))?.status, "active");
  });
});
