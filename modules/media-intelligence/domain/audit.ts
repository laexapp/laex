import type { TenantId, UserId, WorkspaceId } from "./types";

export type AuditOutcome = "success" | "denied" | "failed";

export interface AuditEvent {
  id: string;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  actorUserId: UserId;
  action: string;
  resourceType: string;
  resourceId: string;
  occurredAt: string;
  outcome: AuditOutcome;
  origin: "server-action" | "route-handler" | "system" | "test";
  changes?: Record<string, { from?: unknown; to?: unknown }>;
  errorCode?: string;
  traceId: string;
}

const forbiddenAuditKeys = /token|secret|password|credential|authorization|cookie/i;

export function sanitizeAuditChanges(changes?: Record<string, { from?: unknown; to?: unknown }>) {
  if (!changes) return undefined;
  return Object.fromEntries(Object.entries(changes).filter(([key]) => !forbiddenAuditKeys.test(key)));
}
