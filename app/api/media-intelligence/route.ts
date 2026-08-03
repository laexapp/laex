import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { can } from "@/modules/media-intelligence/domain/permissions";
import type { MediaProductState, ProductWorkspace } from "@/modules/media-intelligence/domain/product";
import { getLocalProductState, updateLocalProductState } from "@/modules/media-intelligence/infrastructure/local/LocalProductStore";
import { requireControlledDevelopmentActor } from "@/modules/media-intelligence/server/controlled-session";
export const runtime = "nodejs";
const unavailable = () => NextResponse.json({ error: "not_available" }, { status: 404 });
function failure(error: unknown) { const code = error instanceof Error ? error.message : "operation_failed"; const status = code === "authentication_required" ? 401 : code === "revision_conflict" ? 409 : code.endsWith("_denied") ? 403 : 400; return NextResponse.json({ error: code }, { status }); }
function activeMember(workspace: ProductWorkspace, userId: string) { return workspace.members.find((item) => item.id === userId && item.status === "active"); }
function authorize(workspace: ProductWorkspace, userId: string, capability: Parameters<typeof can>[1]) { const member = activeMember(workspace, userId); if (!member) throw new Error("workspace_access_denied"); const override = member.overrides[capability]; if (override === false || (override !== true && !can(member.role, capability))) throw new Error("capability_denied"); }
function audit(workspace: ProductWorkspace, actorId: string, action: string, resource: string) { workspace.audit.unshift({ id: randomUUID(), workspaceId: workspace.id, actorId, action, resource, outcome: "success", at: new Date().toISOString() }); }
export async function GET() { if (process.env.NODE_ENV !== "development") return unavailable(); try { const actor = await requireControlledDevelopmentActor(); const state = await getLocalProductState(); return NextResponse.json({ ...state, workspaces: state.workspaces.filter((item) => activeMember(item, actor.userId)), actor, persistence: "local-atomic-json" }); } catch (error) { return failure(error); } }
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return unavailable();
  try {
    const actor = await requireControlledDevelopmentActor();
    const body = await request.json() as { revision: number; action: string; workspaceId?: string; payload?: Record<string, unknown> };
    const next = await updateLocalProductState(body.revision, (state: MediaProductState) => {
      if (body.action === "workspace.create") { const name = String(body.payload?.name ?? "").trim(); if (name.length < 2) throw new Error("invalid_workspace_name"); const id = `ws_${randomUUID()}`; state.workspaces.push(newWorkspace(id, name, actor)); state.activeWorkspaceId = id; return; }
      const workspace = state.workspaces.find((item) => item.id === body.workspaceId); if (!workspace) throw new Error("workspace_access_denied");
      if (body.action === "workspace.activate") { authorize(workspace, actor.userId, "workspace.read"); state.activeWorkspaceId = workspace.id; return; }
      if (body.action === "content.create") { authorize(workspace, actor.userId, "content.edit"); const title = String(body.payload?.title ?? "").trim(); if (!title) throw new Error("invalid_title"); workspace.contents.unshift({ id: `content_${randomUUID()}`, title, description: String(body.payload?.description ?? ""), sourceType: "manual", status: "draft", authorId: actor.userId, confidence: 0, risks: [], keywords: [], categories: [], versions: [{ number: 1, title, body: String(body.payload?.body ?? ""), author: actor.name, createdAt: new Date().toISOString(), note: "Borrador inicial" }], approvedVersion: null, reviewReason: null, updatedAt: new Date().toISOString() }); audit(workspace, actor.userId, "content.created", title); return; }
      if (body.action === "content.analyze") { authorize(workspace, actor.userId, "content.edit"); const content = workspace.contents.find((item) => item.id === body.payload?.contentId); if (!content) throw new Error("resource_not_found"); content.status = "analyzed"; content.confidence = 86; content.keywords = ["estrategia", "audiencia", "decisión"]; content.risks = ["Resultado generado por IA simulada"]; content.updatedAt = new Date().toISOString(); audit(workspace, actor.userId, "simulation.analyzed", content.id); return; }
      if (body.action === "content.transition") { const content = workspace.contents.find((item) => item.id === body.payload?.contentId); if (!content) throw new Error("resource_not_found"); const status = String(body.payload?.status); authorize(workspace, actor.userId, status === "approved" ? "content.approve" : "content.edit"); content.status = status as typeof content.status; content.reviewReason = String(body.payload?.reason ?? "") || null; if (status === "approved") content.approvedVersion = content.versions.at(-1)?.number ?? null; content.updatedAt = new Date().toISOString(); audit(workspace, actor.userId, `content.${status}`, content.id); return; }
      throw new Error("unsupported_action");
    });
    return NextResponse.json(next);
  } catch (error) { return failure(error); }
}
function newWorkspace(id: string, name: string, actor: { userId: string; name: string }): ProductWorkspace { return { id, name, kind: "other", description: "Nuevo workspace", color: "#67E8F9", audience: "Por definir", objectives: [], tone: "Profesional", locale: "es", timezone: "America/Santiago", status: "active", members: [{ id: actor.userId, name: actor.name, email: "dev@laex.local", role: "owner", status: "active", overrides: {} }], invitations: [], contents: [], campaigns: [], channels: [], audit: [{ id: randomUUID(), workspaceId: id, actorId: actor.userId, action: "workspace.created", resource: id, outcome: "success", at: new Date().toISOString() }] }; }
