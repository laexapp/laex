import { CommercialDerivativeRegistry } from '@/modules/commercial-composition/infrastructure/CommercialDerivativeRegistry';
import type { CommercialDerivative } from '@/modules/commercial-composition/infrastructure/CommercialDerivativeRegistry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request, context: RouteContext<'/api/commercial-composition/canva/derivatives/[id]/review'>) {
  const hostname = new URL(request.url).hostname;
  if (process.env.NODE_ENV === 'production' || (hostname !== '127.0.0.1' && hostname !== 'localhost')) {
    return Response.json({ error: 'La revisión del laboratorio solo está habilitada localmente.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null) as { decision?: unknown } | null;
  if (body?.decision !== 'approved' && body?.decision !== 'rejected') {
    return Response.json({ error: 'Decisión inválida.' }, { status: 400 });
  }

  const { id } = await context.params;
  const registry = new CommercialDerivativeRegistry();
  const derivative = (await registry.list()).find((entry) => entry.id === id);
  if (!derivative) return Response.json({ error: 'Derivado no encontrado.' }, { status: 404 });

  const reviewed: CommercialDerivative = {
    ...derivative,
    status: body.decision,
    reviewedAt: new Date().toISOString(),
    reviewedBy: 'LAEX local reviewer',
  };
  await registry.save(reviewed);
  return Response.json({ derivative: reviewed });
}
