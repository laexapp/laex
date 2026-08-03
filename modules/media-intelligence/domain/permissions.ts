export type Capability =
  | "workspace.read" | "workspace.manage"
  | "members.invite" | "members.manage"
  | "content.read" | "content.create" | "content.edit" | "content.review" | "content.approve" | "content.reject"
  | "campaign.read" | "campaign.create" | "campaign.manage" | "campaign.schedule"
  | "channel.read" | "channel.connect" | "channel.disconnect"
  | "analytics.read" | "settings.manage" | "audit.read";

export type WorkspaceRole = "owner" | "admin" | "editor" | "analyst" | "reviewer" | "member" | "viewer";

const allCapabilities: readonly Capability[] = [
  "workspace.read", "workspace.manage", "members.invite", "members.manage",
  "content.read", "content.create", "content.edit", "content.review", "content.approve", "content.reject",
  "campaign.read", "campaign.create", "campaign.manage", "campaign.schedule",
  "channel.read", "channel.connect", "channel.disconnect", "analytics.read", "settings.manage", "audit.read",
];

export const capabilitiesByRole: Record<WorkspaceRole, readonly Capability[]> = {
  owner: allCapabilities,
  admin: allCapabilities.filter((capability) => capability !== "workspace.manage"),
  editor: ["workspace.read", "content.read", "content.create", "content.edit", "content.review", "campaign.read", "campaign.create", "campaign.manage", "channel.read", "analytics.read"],
  analyst: ["workspace.read", "content.read", "campaign.read", "channel.read", "analytics.read"],
  reviewer: ["workspace.read", "content.read", "content.edit", "content.review", "content.approve", "content.reject", "campaign.read", "channel.read", "analytics.read"],
  member: ["workspace.read", "content.read", "content.create", "campaign.read", "channel.read"],
  viewer: ["workspace.read", "content.read", "campaign.read", "channel.read", "analytics.read"],
};

export function can(role: WorkspaceRole, capability: Capability) {
  return capabilitiesByRole[role].includes(capability);
}