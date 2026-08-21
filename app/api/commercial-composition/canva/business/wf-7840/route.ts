import { CanvaBusinessWf7840Lab } from '@/modules/commercial-composition/application/CanvaBusinessWf7840Lab';
import { createCanvaServerIntegration } from '@/modules/commercial-composition/providers/canva/server/factory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const hostname = new URL(request.url).hostname;
  if (process.env.NODE_ENV === 'production' || (hostname !== '127.0.0.1' && hostname !== 'localhost')) {
    return Response.json({ error: 'La generación de laboratorio solo está habilitada localmente.' }, { status: 403 });
  }
  try {
    const lab = new CanvaBusinessWf7840Lab(createCanvaServerIntegration().adapter);
    return Response.json({ derivative: await lab.run(), mode: 'laex-raster-canva-design' }, { status: 201 });
  } catch (error) {
    console.error('Canva Business WF-7840 lab failed', error);
    return Response.json({ error: 'No fue posible completar la promoción WF-7840. Revisa el registro seguro del servidor.' }, { status: 502 });
  }
}
