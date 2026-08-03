import { randomUUID } from "node:crypto";

import { WorkspaceAccessDeniedError, WorkspaceInvariantError } from "../domain/errors";
import type { MediaIntelligenceRepositories } from "../domain/repositories";
import type { UserId, WorkspaceId } from "../domain/types";
import type { AuthenticatedActor } from "./WorkspaceAccessService";
import { WorkspaceAccessService } from "./WorkspaceAccessService";

export class WorkspaceGovernanceService {
  constructor(
    private readonly repositories: MediaIntelligenceRepositories,
    private readonly access: WorkspaceAccessService,
    private readonly now = () => new Date(),
  ) {}

  async acceptInvitation(actor: AuthenticatedActor, workspaceId: WorkspaceId, invitationId: string) {
    const scope = { tenantId: actor.tenantId, workspaceId };
    const invitation = await this.repositories.invitations.findById(scope, invitationId);
    if (!invitation || invitation.status !== "pending") throw new WorkspaceAccessDeniedError();
    if (new Date(invitation.expiresAt).getTime() <= this.now().getTime()) {
      invitation.status = "expired";
      await this.repositories.invitations.save(invitation);
      throw new WorkspaceInvariantError("invitation_expired", "La invitación ha expirado.");
    }
    const timestamp = this.now().toISOString();
    await this.repositories.memberships.save({ id: `mem_${randomUUID()}`, tenantId: scope.tenantId, workspaceId, userId: actor.userId, role: invitation.role, capabilityOverrides: {}, status: "active", createdAt: timestamp, updatedAt: timestamp, removedAt: null });
    invitation.status = "accepted";
    invitation.acceptedAt = timestamp;
    await this.repositories.invitations.save(invitation);
  }

  async transferOwnership(actor: AuthenticatedActor, workspaceId: WorkspaceId, targetUserId: UserId) {
    const { scope, membership: currentOwner } = await this.access.authorize(actor, workspaceId, "workspace.manage");
    if (currentOwner.role !== "owner") throw new WorkspaceAccessDeniedError();
    const target = (await this.repositories.memberships.listActive(scope)).find((item) => item.userId === targetUserId);
    if (!target || target.status !== "active") throw new WorkspaceInvariantError("active_target_required", "La propiedad sólo puede transferirse a un miembro activo.");
    if (target.userId === currentOwner.userId) return target;
    const timestamp = this.now().toISOString();
    target.role = "owner";
    target.updatedAt = timestamp;
    await this.repositories.memberships.save(target);
    currentOwner.role = "admin";
    currentOwner.updatedAt = timestamp;
    await this.repositories.memberships.save(currentOwner);
    return target;
  }
}

