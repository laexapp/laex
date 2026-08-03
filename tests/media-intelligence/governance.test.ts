import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { WorkspaceGovernanceService } from "../../modules/media-intelligence/application/WorkspaceGovernanceService";
import { WorkspaceAccessService } from "../../modules/media-intelligence/application/WorkspaceAccessService";
import { WorkspaceInvariantError } from "../../modules/media-intelligence/domain/errors";
import { createMemoryRepositories } from "../../modules/media-intelligence/infrastructure/memory/MemoryRepositories";
import type { MediaWorkspace, TenantId, UserId, WorkspaceId, WorkspaceInvitation, WorkspaceMembership } from "../../modules/media-intelligence/domain/types";

const tenant = "tenant" as TenantId, workspaceId = "workspace" as WorkspaceId, ownerId = "owner" as UserId, editorId = "editor" as UserId;
const at = "2026-08-02T12:00:00.000Z";
const workspace: MediaWorkspace = { id: workspaceId, tenantId: tenant, ownerUserId: ownerId, name: "Workspace", kind: "company", role: "owner", color: "#fff", channelCount: 0, campaignCount: 0, status: "active" };
const member = (id: string, userId: UserId, role: WorkspaceMembership["role"], status: WorkspaceMembership["status"] = "active"): WorkspaceMembership => ({ id, tenantId: tenant, workspaceId, userId, role, status, capabilityOverrides: {}, createdAt: at, updatedAt: at, removedAt: null });
const actor = (userId: UserId) => ({ tenantId: tenant, userId, traceId: `trace_${userId}` });
function setup(invitation?: WorkspaceInvitation) { const repositories = createMemoryRepositories({ workspaces: [workspace], memberships: [member("owner", ownerId, "owner"), member("editor", editorId, "editor")], invitations: invitation ? [invitation] : [] }); const access = new WorkspaceAccessService(repositories, () => new Date(at)); return { repositories, access, governance: new WorkspaceGovernanceService(repositories, access, () => new Date(at)) }; }

describe("gobierno del Workspace", () => {
  it("un usuario suspendido pierde autorización", async () => { const { repositories, access } = setup(); await repositories.memberships.save(member("suspended", "suspended" as UserId, "editor", "suspended")); await assert.rejects(access.authorize(actor("suspended" as UserId), workspaceId, "content.edit")); });
  it("un override concedido habilita una capacidad", async () => { const { repositories, access } = setup(); const editor = await repositories.memberships.findActive({ tenantId: tenant, workspaceId }, editorId); assert.ok(editor); editor.capabilityOverrides["workspace.manage"] = true; await repositories.memberships.save(editor); const result = await access.authorize(actor(editorId), workspaceId, "workspace.manage"); assert.equal(result.membership.userId, editorId); });
  it("rechaza y marca una invitación expirada", async () => { const invitation: WorkspaceInvitation = { id: "expired", tenantId: tenant, workspaceId, emailHash: "hash", role: "viewer", invitedBy: ownerId, status: "pending", expiresAt: "2026-08-01T00:00:00.000Z", createdAt: "2026-07-01T00:00:00.000Z", acceptedAt: null }; const { repositories, governance } = setup(invitation); await assert.rejects(governance.acceptInvitation(actor("guest" as UserId), workspaceId, invitation.id), WorkspaceInvariantError); assert.equal((await repositories.invitations.findById({ tenantId: tenant, workspaceId }, invitation.id))?.status, "expired"); });
  it("transfiere propiedad sin dejar el Workspace sin propietario", async () => { const { repositories, governance } = setup(); const target = await governance.transferOwnership(actor(ownerId), workspaceId, editorId); assert.equal(target.role, "owner"); assert.equal((await repositories.memberships.findActive({ tenantId: tenant, workspaceId }, ownerId))?.role, "admin"); assert.equal(await repositories.memberships.countActiveOwners({ tenantId: tenant, workspaceId }), 1); });
  it("repetir una transferencia al mismo propietario no altera el estado", async () => { const { repositories, governance } = setup(); await governance.transferOwnership(actor(ownerId), workspaceId, editorId); const transferredActor = actor(editorId); const repeated = await governance.transferOwnership(transferredActor, workspaceId, editorId); assert.equal(repeated.role, "owner"); assert.equal(await repositories.memberships.countActiveOwners({ tenantId: tenant, workspaceId }), 1); });
});
