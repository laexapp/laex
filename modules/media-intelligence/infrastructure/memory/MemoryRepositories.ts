import type { AuditEvent } from "../../domain/audit";
import type { MediaIntelligenceRepositories, WorkspaceScope } from "../../domain/repositories";
import type { MediaWorkspace, TenantId, UserId, WorkspaceInvitation, WorkspaceMembership, WorkspacePreferences } from "../../domain/types";

type Seed = {
  workspaces?: MediaWorkspace[];
  memberships?: WorkspaceMembership[];
  invitations?: WorkspaceInvitation[];
  preferences?: WorkspacePreferences[];
  audit?: AuditEvent[];
};

const clone = <T>(value: T): T => structuredClone(value);
const scopeKey = (scope: WorkspaceScope) => `${scope.tenantId}:${scope.workspaceId}`;

export function createMemoryRepositories(seed: Seed = {}): MediaIntelligenceRepositories {
  const workspaces = new Map((seed.workspaces ?? []).map((item) => [scopeKey({ tenantId: item.tenantId, workspaceId: item.id }), clone(item)]));
  const memberships = new Map((seed.memberships ?? []).map((item) => [item.id, clone(item)]));
  const invitations = new Map((seed.invitations ?? []).map((item) => [item.id, clone(item)]));
  const preferences = new Map((seed.preferences ?? []).map((item) => [scopeKey(item), clone(item)]));
  const audit = (seed.audit ?? []).map(clone);

  return {
    workspaces: {
      async findById(scope) { return clone(workspaces.get(scopeKey(scope)) ?? null); },
      async listForUser(tenantId: TenantId, userId: UserId) {
        const allowed = [...memberships.values()].filter((item) => item.tenantId === tenantId && item.userId === userId && item.status === "active");
        return clone(allowed.flatMap((membership) => {
          const workspace = workspaces.get(scopeKey(membership));
          return workspace && workspace.status !== "pending_deletion" ? [workspace] : [];
        }));
      },
      async save(workspace) { workspaces.set(scopeKey({ tenantId: workspace.tenantId, workspaceId: workspace.id }), clone(workspace)); },
    },
    memberships: {
      async findActive(scope, userId) {
        return clone([...memberships.values()].find((item) => item.tenantId === scope.tenantId && item.workspaceId === scope.workspaceId && item.userId === userId && item.status === "active") ?? null);
      },
      async listActive(scope) { return clone([...memberships.values()].filter((item) => item.tenantId === scope.tenantId && item.workspaceId === scope.workspaceId && item.status === "active")); },
      async countActiveOwners(scope) { return [...memberships.values()].filter((item) => item.tenantId === scope.tenantId && item.workspaceId === scope.workspaceId && item.status === "active" && item.role === "owner").length; },
      async save(membership) { memberships.set(membership.id, clone(membership)); },
    },
    invitations: {
      async save(invitation) { invitations.set(invitation.id, clone(invitation)); },
      async findById(scope, invitationId) {
        const invitation = invitations.get(invitationId);
        return clone(invitation?.tenantId === scope.tenantId && invitation.workspaceId === scope.workspaceId ? invitation : null);
      },
    },
    preferences: {
      async find(scope) { return clone(preferences.get(scopeKey(scope)) ?? null); },
      async save(value) { preferences.set(scopeKey(value), clone(value)); },
    },
    audit: {
      async append(event) { audit.push(clone(event)); },
      async list(scope) { return clone(audit.filter((event) => event.tenantId === scope.tenantId && event.workspaceId === scope.workspaceId)); },
    },
  };
}
