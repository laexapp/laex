import { randomUUID } from "node:crypto";

import { sanitizeAuditChanges } from "../domain/audit";
import { CapabilityDeniedError, ResourceNotFoundError, WorkspaceAccessDeniedError, WorkspaceInvariantError } from "../domain/errors";
import { can, type Capability, type WorkspaceRole } from "../domain/permissions";
import type { MediaIntelligenceRepositories, WorkspaceScope } from "../domain/repositories";
import type { MediaWorkspace, TenantId, UserId, WorkspaceId, WorkspaceInvitation, WorkspaceMembership } from "../domain/types";

export interface AuthenticatedActor { tenantId: TenantId; userId: UserId; traceId: string; }

export class WorkspaceAccessService {
  constructor(private readonly repositories: MediaIntelligenceRepositories, private readonly now = () => new Date()) {}

  async authorize(actor: AuthenticatedActor, workspaceId: WorkspaceId, capability: Capability) {
    const scope = { tenantId: actor.tenantId, workspaceId };
    const workspace = await this.repositories.workspaces.findById(scope);
    if (!workspace || workspace.status === "pending_deletion") {
      await this.audit(actor, scope, capability, "workspace", workspaceId, "denied", "workspace_not_found");
      throw new WorkspaceAccessDeniedError();
    }
    const membership = await this.repositories.memberships.findActive(scope, actor.userId);
    if (!membership) {
      await this.audit(actor, scope, capability, "workspace", workspaceId, "denied", "membership_missing");
      throw new WorkspaceAccessDeniedError();
    }
    const override = membership.capabilityOverrides[capability];
    if (override === false || (override !== true && !can(membership.role, capability))) {
      await this.audit(actor, scope, capability, "workspace", workspaceId, "denied", "capability_denied");
      throw new CapabilityDeniedError(capability);
    }
    return { scope, workspace, membership };
  }

  async listWorkspaces(actor: AuthenticatedActor) {
    return this.repositories.workspaces.listForUser(actor.tenantId, actor.userId);
  }

  async createWorkspace(actor: AuthenticatedActor, input: Pick<MediaWorkspace, "name" | "kind" | "color">) {
    const timestamp = this.now().toISOString();
    const workspaceId = `ws_${randomUUID()}` as WorkspaceId;
    const workspace: MediaWorkspace = { id: workspaceId, tenantId: actor.tenantId, ownerUserId: actor.userId, name: input.name.trim(), kind: input.kind, color: input.color, role: "owner", channelCount: 0, campaignCount: 0, status: "active", createdAt: timestamp, updatedAt: timestamp, archivedAt: null, deletionRequestedAt: null };
    const membership: WorkspaceMembership = { id: `mem_${randomUUID()}`, tenantId: actor.tenantId, workspaceId, userId: actor.userId, role: "owner", capabilityOverrides: {}, status: "active", createdAt: timestamp, updatedAt: timestamp, removedAt: null };
    await this.repositories.workspaces.save(workspace);
    await this.repositories.memberships.save(membership);
    await this.audit(actor, { tenantId: actor.tenantId, workspaceId }, "workspace.manage", "workspace", workspaceId, "success");
    return workspace;
  }

  async invite(actor: AuthenticatedActor, workspaceId: WorkspaceId, emailHash: string, role: Exclude<WorkspaceRole, "owner">) {
    const { scope } = await this.authorize(actor, workspaceId, "members.invite");
    const timestamp = this.now();
    const invitation: WorkspaceInvitation = { id: `inv_${randomUUID()}`, tenantId: scope.tenantId, workspaceId, emailHash, role, invitedBy: actor.userId, status: "pending", createdAt: timestamp.toISOString(), expiresAt: new Date(timestamp.getTime() + 7 * 86_400_000).toISOString(), acceptedAt: null };
    await this.repositories.invitations.save(invitation);
    await this.audit(actor, scope, "members.invite", "invitation", invitation.id, "success", undefined, { role: { to: role } });
    return invitation;
  }

  async changeRole(actor: AuthenticatedActor, workspaceId: WorkspaceId, memberId: string, role: WorkspaceRole) {
    const { scope } = await this.authorize(actor, workspaceId, "members.manage");
    const member = (await this.repositories.memberships.listActive(scope)).find((item) => item.id === memberId);
    if (!member) throw new ResourceNotFoundError("Membresía");
    if (member.userId === actor.userId && member.role === "owner" && role !== "owner") throw new WorkspaceInvariantError("self_role_escalation_or_abandonment", "El propietario no puede reducir su propio rol sin transferir la propiedad.");
    const previous = member.role;
    member.role = role;
    member.updatedAt = this.now().toISOString();
    await this.repositories.memberships.save(member);
    await this.audit(actor, scope, "members.manage", "membership", member.id, "success", undefined, { role: { from: previous, to: role } });
    return member;
  }

  async removeMember(actor: AuthenticatedActor, workspaceId: WorkspaceId, memberId: string) {
    const { scope } = await this.authorize(actor, workspaceId, "members.manage");
    const member = (await this.repositories.memberships.listActive(scope)).find((item) => item.id === memberId);
    if (!member) throw new ResourceNotFoundError("Membresía");
    if (member.role === "owner" && await this.repositories.memberships.countActiveOwners(scope) <= 1) throw new WorkspaceInvariantError("last_owner_required", "El último propietario no puede ser eliminado.");
    member.status = "removed";
    member.removedAt = this.now().toISOString();
    member.updatedAt = member.removedAt;
    await this.repositories.memberships.save(member);
    await this.audit(actor, scope, "members.manage", "membership", member.id, "success");
  }

  async archive(actor: AuthenticatedActor, workspaceId: WorkspaceId) {
    const { scope, workspace } = await this.authorize(actor, workspaceId, "workspace.manage");
    const previous = workspace.status ?? "active";
    workspace.status = "archived";
    workspace.archivedAt = this.now().toISOString();
    workspace.updatedAt = workspace.archivedAt;
    await this.repositories.workspaces.save(workspace);
    await this.audit(actor, scope, "workspace.manage", "workspace", workspaceId, "success", undefined, { status: { from: previous, to: "archived" } });
  }

  async recover(actor: AuthenticatedActor, workspaceId: WorkspaceId) {
    const scope = { tenantId: actor.tenantId, workspaceId };
    const workspace = await this.repositories.workspaces.findById(scope);
    const membership = await this.repositories.memberships.findActive(scope, actor.userId);
    if (!workspace || !membership || membership.role !== "owner") throw new WorkspaceAccessDeniedError();
    workspace.status = "active";
    workspace.archivedAt = null;
    workspace.updatedAt = this.now().toISOString();
    await this.repositories.workspaces.save(workspace);
    await this.audit(actor, scope, "workspace.manage", "workspace", workspaceId, "success", undefined, { status: { from: "archived", to: "active" } });
  }

  private async audit(actor: AuthenticatedActor, scope: WorkspaceScope, action: string, resourceType: string, resourceId: string, outcome: "success" | "denied" | "failed", errorCode?: string, changes?: Record<string, { from?: unknown; to?: unknown }>) {
    await this.repositories.audit.append({ id: `audit_${randomUUID()}`, tenantId: scope.tenantId, workspaceId: scope.workspaceId, actorUserId: actor.userId, action, resourceType, resourceId, occurredAt: this.now().toISOString(), outcome, origin: "system", changes: sanitizeAuditChanges(changes), errorCode, traceId: actor.traceId });
  }
}
