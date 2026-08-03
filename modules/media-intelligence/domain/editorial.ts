import type { EditorialStatus, ProductContent } from "./product";

const transitions: Record<EditorialStatus, readonly EditorialStatus[]> = {
  draft: ["queued", "in_review", "archived"], queued: ["analyzing", "cancelled"], analyzing: ["analyzed", "analysis_error", "cancelled"], analysis_error: ["queued", "archived"], analyzed: ["generating", "in_review", "archived"], generating: ["generated", "generation_error", "cancelled"], generation_error: ["generating", "archived"], generated: ["in_review", "archived"], in_review: ["changes_requested", "approved", "rejected"], changes_requested: ["draft", "in_review", "archived"], approved: ["scheduled", "draft", "archived"], rejected: ["draft", "archived"], scheduled: ["simulated_publishing", "cancelled"], simulated_publishing: ["simulated_published", "simulated_partial", "simulated_publish_error", "cancelled"], simulated_partial: ["simulated_publishing", "archived"], simulated_publish_error: ["simulated_publishing", "archived"], simulated_published: ["archived"], cancelled: ["draft", "archived"], archived: ["draft"],
};

export class EditorialTransitionError extends Error { constructor(from: EditorialStatus, to: EditorialStatus) { super(`invalid_transition:${from}:${to}`); } }
export function canTransition(from: EditorialStatus, to: EditorialStatus) { return transitions[from].includes(to); }
export function transitionContent(content: ProductContent, to: EditorialStatus, actorKind: "human" | "ai", reason?: string) {
  if (to === "approved" && actorKind !== "human") throw new EditorialTransitionError(content.status, to);
  if (!canTransition(content.status, to)) throw new EditorialTransitionError(content.status, to);
  content.status = to; content.reviewReason = reason?.trim() || null; content.updatedAt = new Date().toISOString();
  if (to === "approved") content.approvedVersion = content.versions.at(-1)?.number ?? null;
  if (to === "draft" && content.approvedVersion !== null) content.approvedVersion = null;
  return content;
}

export function saveContentVersion(content: ProductContent, body: string, author: string, note = "Edición") {
  const previous = content.versions.at(-1); const number = (previous?.number ?? 0) + 1;
  content.versions.push({ number, title: content.title, body, author, note, createdAt: new Date().toISOString() });
  if (content.approvedVersion !== null) { content.approvedVersion = null; content.status = "draft"; }
  content.updatedAt = new Date().toISOString(); return number;
}

