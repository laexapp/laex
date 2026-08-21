import { CanvaBusinessWf4830Lab } from '@/modules/commercial-composition/application/CanvaBusinessWf4830Lab';
import { createCanvaServerIntegration } from '@/modules/commercial-composition/providers/canva/server/factory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const hostname = new URL(request.url).hostname;
  if (process.env.NODE_ENV === 'production' || (hostname !== '127.0.0.1' && hostname !== 'localhost')) {
    return Response.json({ error: 'La prueba Canva Negocios solo está habilitada localmente.' }, { status: 403 });
  }
  try {
    const lab = new CanvaBusinessWf4830Lab(createCanvaServerIntegration().adapter);
    return Response.json({ derivative: await lab.run(), mode: 'laex-raster-canva-design' }, { status: 201 });
  } catch (error) {
    console.error('Canva Business fallback failed', error);
    return Response.json({ error: 'La prueba Canva Negocios no pudo completarse. Revisa el registro seguro del servidor.' }, { status: 502 });
  }
}
