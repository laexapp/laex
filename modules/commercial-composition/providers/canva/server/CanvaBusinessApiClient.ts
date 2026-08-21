import 'server-only';

import { z } from 'zod';

const jobSchema = z.object({
  job: z.object({
    id: z.string(),
    status: z.enum(['in_progress', 'success', 'failed']),
    error: z.object({ code: z.string().optional() }).optional(),
  }).passthrough(),
});

export class CanvaBusinessApiClient {
  constructor(private readonly accessToken: string, private readonly request: typeof fetch = fetch) {}

  async uploadPng(bytes: Uint8Array, name: string) {
    const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    const response = await this.call('/asset-uploads', {
      method: 'POST',
      headers: {
        'content-type': 'application/octet-stream',
        'asset-upload-metadata': JSON.stringify({ name_base64: Buffer.from(name).toString('base64') }),
      },
      body,
    });
    const created = jobSchema.parse(await response.json());
    const completed = await this.poll(`/asset-uploads/${created.job.id}`);
    const asset = completed.job.asset as { id?: string } | undefined;
    if (!asset?.id) throw new Error('Canva no devolvió el Asset ID.');
    return { assetId: asset.id, jobId: created.job.id };
  }

  async createDesign(assetId: string, title: string) {
    const response = await this.call('/designs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        design_type: { type: 'custom', width: 1600, height: 900 },
        asset_id: assetId,
        title,
      }),
    });
    const data = await response.json() as { design?: { id?: string } };
    if (!data.design?.id) throw new Error('Canva no devolvió el Design ID.');
    return data.design.id;
  }

  async exportPng(designId: string) {
    const response = await this.call('/exports', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ design_id: designId, format: { type: 'png', lossless: true, transparent_background: false } }),
    });
    const created = jobSchema.parse(await response.json());
    const completed = await this.poll(`/exports/${created.job.id}`);
    const urls = completed.job.urls as string[] | undefined;
    if (!urls?.[0]) throw new Error('Canva no devolvió la exportación PNG.');
    const url = new URL(urls[0]);
    if (url.protocol !== 'https:' || !(url.hostname === 'canva.com' || url.hostname.endsWith('.canva.com'))) throw new Error('URL de exportación no autorizada.');
    const download = await this.request(url, { cache: 'no-store', signal: AbortSignal.timeout(30_000) });
    if (!download.ok || !(download.headers.get('content-type') ?? '').startsWith('image/png')) throw new Error('Canva no entregó un PNG válido.');
    return { bytes: new Uint8Array(await download.arrayBuffer()), jobId: created.job.id };
  }

  private async poll(path: string) {
    for (let attempt = 0; attempt < 12; attempt++) {
      const response = await this.call(path, { method: 'GET' });
      const parsed = jobSchema.parse(await response.json());
      if (parsed.job.status === 'success') return parsed;
      if (parsed.job.status === 'failed') throw new Error(`Trabajo Canva falló: ${parsed.job.error?.code ?? 'unknown'}.`);
      await new Promise((resolve) => setTimeout(resolve, Math.min(500 * 2 ** attempt, 4_000)));
    }
    throw new Error('Tiempo de espera agotado para Canva.');
  }

  private async call(path: string, init: RequestInit) {
    const response = await this.request(`https://api.canva.com/rest/v1${path}`, {
      ...init,
      headers: { authorization: `Bearer ${this.accessToken}`, accept: 'application/json', ...init.headers },
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`Canva API rechazó la operación (${response.status}).`);
    return response;
  }
}
