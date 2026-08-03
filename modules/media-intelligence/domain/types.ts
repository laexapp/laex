export type TenantId = string & { readonly __brand: "TenantId" };
export type WorkspaceId = string & { readonly __brand: "WorkspaceId" };
export type UserId = string & { readonly __brand: "UserId" };

export type MediaIntelligenceVersion = "v1";

export type WorkspaceKind =
  | "creator"
  | "company"
  | "academy"
  | "community"
  | "podcast"
  | "organization"
  | "investment-project"
  | "personal-brand"
  | "other";

import type { Capability, WorkspaceRole } from "./permissions";
export type { Capability, WorkspaceRole } from "./permissions";

export interface TenantContext {
  tenantId: TenantId;
  userId: UserId;
  workspaceId: WorkspaceId;
  role: WorkspaceRole;
  version: MediaIntelligenceVersion;
}

export interface MediaWorkspace {
  id: WorkspaceId;
  tenantId: TenantId;
  name: string;
  kind: WorkspaceKind;
  role: WorkspaceRole;
  color: string;
  channelCount: number;
  campaignCount: number;
  status?: "active" | "suspended" | "archived" | "pending_deletion";
  ownerUserId?: UserId;
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string | null;
  deletionRequestedAt?: string | null;
}

export interface WorkspaceMembership {
  id: string;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  userId: UserId;
  role: WorkspaceRole;
  capabilityOverrides: Partial<Record<Capability, boolean>>;
  status: "active" | "suspended" | "removed";
  createdAt: string;
  updatedAt: string;
  removedAt: string | null;
}

export interface WorkspaceInvitation {
  id: string;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  emailHash: string;
  role: Exclude<WorkspaceRole, "owner">;
  invitedBy: UserId;
  status: "pending" | "accepted" | "revoked" | "expired";
  expiresAt: string;
  createdAt: string;
  acceptedAt: string | null;
}

export interface WorkspacePreferences {
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  locale: string;
  timezone: string;
  defaultApprovalRequired: true;
  simulatedDataLabel: boolean;
  objectives: string[];
  updatedAt: string;
}

export type ChannelPlatform =
  | "youtube"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "x"
  | "linkedin"
  | "telegram"
  | "whatsapp"
  | "news";

export interface ConnectedChannel {
  id: string;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  platform: ChannelPlatform;
  label: string;
  status: "connected" | "attention" | "disconnected";
  pluginVersion: string;
}

export interface CampaignSummary {
  id: string;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  title: string;
  sourceType: "video" | "audio" | "article" | "event" | "document";
  status: "detected" | "analyzing" | "review" | "approved" | "scheduled" | "published" | "failed";
  confidence: number;
  generatedAssets: number;
  updatedAt: string;
}
