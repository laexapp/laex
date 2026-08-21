import { NextRequest, NextResponse } from "next/server";
import { CompanyResolver } from "@/modules/business-engine/platform/CompanyResolver";
import { requireBusinessActor } from "@/modules/business-engine/server/BusinessRequestHandlers";
import { getBusinessRuntime } from "@/modules/business-engine/server/runtime";

export async function POST(request: NextRequest, { params }: { params: Promise<{ company: string }> }) { try { const runtime = getBusinessRuntime(), company = await new CompanyResolver(runtime.store).bySlugOrHost((await params).company), actor = await requireBusinessActor(request, company.id), body = await request.json() as { userId?: string; purpose?: "activation" | "recovery" }; if (!body.userId || !body.purpose) throw new Error("invalid_request"); return NextResponse.json(await runtime.businessIdentity.issuePasswordToken(actor, body.userId as never, body.purpose)); } catch (error) { const message = error instanceof Error ? error.message : "identity_operation_failed"; return NextResponse.json({ error: message }, { status: message.includes("capability") || message.includes("access") ? 403 : 400 }); } }
