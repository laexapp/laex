import { CanvaBusinessWf7840ProposalsLab } from '@/modules/commercial-composition/application/CanvaBusinessWf7840ProposalsLab';
import { CommercialDerivativeRegistry } from '@/modules/commercial-composition/infrastructure/CommercialDerivativeRegistry';
import { createCanvaServerIntegration } from '@/modules/commercial-composition/providers/canva/server/factory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const derivatives = await new CommercialDerivativeRegistry().list();
    const latest = new Map<string, (typeof derivatives)[number]>();
    for (const item of derivatives) {
      if (item.sourceGlobalAssetId !== 'LAEX-ASSET-0000002' || !item.templateId.startsWith('canva-business-proposal:')) continue;
      const slug = item.templateId.slice('canva-business-proposal:'.length);
      const current = latest.get(slug);
      if (!current || item.createdAt > current.createdAt) latest.set(slug, item);
    }
    const order = ['executive-dark', 'retail-impact', 'editorial-light'];
    return Response.json({ derivatives: order.map((slug) => latest.get(slug)).filter(Boolean) });
  } catch {
    return Response.json({ error: 'No fue posible consultar las propuestas comerciales.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const hostname = new URL(request.url).hostname;
  if (process.env.NODE_ENV === 'production' || (hostname !== '127.0.0.1' && hostname !== 'localhost')) return Response.json({ error: 'El laboratorio solo está habilitado localmente.' }, { status: 403 });
  try {
    const lab = new CanvaBusinessWf7840ProposalsLab(createCanvaServerIntegration().adapter);
    return Response.json({ derivatives: await lab.run() }, { status: 201 });
  } catch (error) {
    console.error('WF-7840 proposal generation failed', error);
    return Response.json({ error: 'No fue posible completar las propuestas. Revisa el registro seguro.' }, { status: 502 });
  }
}