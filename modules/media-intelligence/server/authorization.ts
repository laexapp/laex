import "server-only";
import type { Capability } from "../domain/permissions";
import type { WorkspaceId } from "../domain/types";
import type { AuthenticatedActor, WorkspaceAccessService } from "../application/WorkspaceAccessService";

export interface MediaSessionResolver { requireActor(): Promise<AuthenticatedActor>; }

export async function authorizeWorkspaceRequest(session: MediaSessionResolver, access: WorkspaceAccessService, untrustedWorkspaceId: string, capability: Capability) {
  const actor = await session.requireActor();
  return access.authorize(actor, untrustedWorkspaceId as WorkspaceId, capability);
}
