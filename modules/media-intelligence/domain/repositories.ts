import type { AuditEvent } from "./audit";
import type { MediaWorkspace, TenantId, UserId, WorkspaceId, WorkspaceInvitation, WorkspaceMembership, WorkspacePreferences } from "./types";

export interface WorkspaceScope { tenantId: TenantId; workspaceId: WorkspaceId; }

export interface WorkspaceRepository {
  findById(scope: WorkspaceScope): Promise<MediaWorkspace | null>;
  listForUser(tenantId: TenantId, userId: UserId): Promise<MediaWorkspace[]>;
  save(workspace: MediaWorkspace): Promise<void>;
}

export interface MembershipRepository {
  findActive(scope: WorkspaceScope, userId: UserId): Promise<WorkspaceMembership | null>;
  listActive(scope: WorkspaceScope): Promise<WorkspaceMembership[]>;
  countActiveOwners(scope: WorkspaceScope): Promise<number>;
  save(membership: WorkspaceMembership): Promise<void>;
}

export interface InvitationRepository {
  save(invitation: WorkspaceInvitation): Promise<void>;
  findById(scope: WorkspaceScope, invitationId: string): Promise<WorkspaceInvitation | null>;
}

export interface PreferencesRepository {
  find(scope: WorkspaceScope): Promise<WorkspacePreferences | null>;
  save(preferences: WorkspacePreferences): Promise<void>;
}

export interface AuditRepository {
  append(event: AuditEvent): Promise<void>;
  list(scope: WorkspaceScope): Promise<AuditEvent[]>;
}

export interface MediaIntelligenceRepositories {
  workspaces: WorkspaceRepository;
  memberships: MembershipRepository;
  invitations: InvitationRepository;
  preferences: PreferencesRepository;
  audit: AuditRepository;
}
