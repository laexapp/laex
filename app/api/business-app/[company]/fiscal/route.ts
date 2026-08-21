import { NextRequest, NextResponse } from "next/server";
import { CompanyResolver } from "@/modules/business-engine/platform/CompanyResolver";
import { requireBusinessActor } from "@/modules/business-engine/server/BusinessRequestHandlers";
import { getBusinessRuntime } from "@/modules/business-engine/server/runtime";

async function requestContext(request: NextRequest, slug: string) {
  const runtime = getBusinessRuntime();
  const company = await new CompanyResolver(runtime.store).bySlugOrHost(slug);
  const actor = await requireBusinessActor(request, company.id);
  return { runtime, actor };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ company: string }> }) {
  try {
    const { runtime, actor } = await requestContext(request, (await params).company);
    if (!actor.capabilities.includes("fiscal.profile.read") && !actor.capabilities.includes("fiscal.document.read")) throw new Error("capability_denied");
    const state = await runtime.store.snapshot();
    const companyId = actor.companyId;
    return NextResponse.json({
      profile: state.fiscalConfigurations.find((item) => item.companyId === companyId) ?? null,
      sequences: state.fiscalSequences.filter((item) => item.companyId === companyId),
      documents: state.canonicalFiscalDocuments.filter((item) => item.companyId === companyId),
      reconciliations: state.fiscalReconciliations.filter((item) => item.companyId === companyId),
      dgiiConnection: "disabled",
      provider: "local-simulation",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "fiscal_read_failed";
    return NextResponse.json({ error: message }, { status: message.includes("capability") ? 403 : 400 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ company: string }> }) {
  try {
    const { runtime, actor } = await requestContext(request, (await params).company);
    const body = await request.json();
    const result = body.action === "profile.update" ? await runtime.fiscal.configureProfile(actor, body.input)
      : body.action === "sequence.register" ? await runtime.fiscal.registerSequence(actor, body.input)
      : body.action === "document.prepare" ? await runtime.fiscal.prepare(actor, body.input)
      : body.action === "sequence.assign" ? await runtime.fiscal.assignNumber(actor, body.documentId)
      : body.action === "xml.seal" ? await runtime.fiscal.sealCanonicalXml(actor, body.documentId)
      : body.action === "dgii.simulate" ? await runtime.fiscal.submitSimulation(actor, body.documentId, body.idempotencyKey)
      : body.action === "reconcile" ? await runtime.fiscal.reconcile(actor, body.period)
      : (() => { throw new Error("unknown_fiscal_action"); })();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "fiscal_action_failed";
    return NextResponse.json({ error: message }, { status: message.includes("capability") ? 403 : 400 });
  }
}
