import 'server-only';

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { CanvaCompositionAdapter } from '../providers/canva/CanvaCompositionAdapter';
import { CanvaBusinessApiClient } from '../providers/canva/server/CanvaBusinessApiClient';
import { CommercialDerivativeRegistry, type CommercialDerivative } from '../infrastructure/CommercialDerivativeRegistry';

const sourceId = 'LAEX-ASSET-0000001';
const sourcePath = '/assets/lf-printer/official/printers/wf-4830-transparent.png';
const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

async function compose(product: Buffer) {
  const image = await sharp(product).resize({ width: 690, height: 690, fit: 'contain' }).png().toBuffer();
  const name = escapeXml('Epson WorkForce Pro WF-4830');
  const svg = Buffer.from(`<svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07152d"/><stop offset="1" stop-color="#164a71"/></linearGradient></defs><rect width="1600" height="900" fill="url(#b)"/><circle cx="1390" cy="100" r="360" fill="#63e6e2" opacity=".12"/><text x="90" y="110" fill="#63e6e2" font-family="Arial" font-size="27" font-weight="700" letter-spacing="5">LF-PRINTER · EPSON</text><text x="90" y="235" fill="#fff" font-family="Arial" font-size="65" font-weight="700">${name}</text><text x="90" y="330" fill="#c4d4e4" font-family="Arial" font-size="27">Impresión, copia, escaneo y fax dúplex</text><text x="90" y="380" fill="#c4d4e4" font-family="Arial" font-size="27">ADF de 50 hojas · Capacidad de 500 hojas</text><text x="90" y="520" fill="#fff" font-family="Arial" font-size="46" font-weight="700">Precio a consultar</text><rect x="90" y="595" width="420" height="92" rx="46" fill="#63e6e2"/><text x="300" y="654" text-anchor="middle" fill="#07152d" font-family="Arial" font-size="29" font-weight="700">Consulta disponibilidad</text><text x="90" y="820" fill="#8198af" font-family="Arial" font-size="21">Derivado comercial · sujeto a aprobación humana</text></svg>`);
  return sharp(svg).composite([{ input: image, left: 850, top: 150 }]).png().toBuffer();
}

export class CanvaBusinessWf4830Lab {
  constructor(private readonly adapter: CanvaCompositionAdapter, private readonly registry = new CommercialDerivativeRegistry()) {}

  async run() {
    return this.adapter.withValidAccessToken(async (token) => {
      const registryPath = path.join(process.cwd(), 'assets', 'asset-intelligence', 'global-asset-registry.json');
      const global = JSON.parse(await fs.readFile(registryPath, 'utf8')) as { assets: Array<{ assetId: string; model: string; currentVersion: number; currentChecksumSha256: string }> };
      const asset = global.assets.find((item) => item.assetId === sourceId);
      if (!asset || asset.model !== 'WF-4830') throw new Error('El activo oficial WF-4830 no coincide con el Asset ID esperado.');
      const source = await fs.readFile(path.join(process.cwd(), 'public', ...sourcePath.split('/').filter(Boolean)));
      const sourceChecksum = crypto.createHash('sha256').update(source).digest('hex');
      const composed = await compose(source);
      const canva = new CanvaBusinessApiClient(token);
      const upload = await canva.uploadPng(composed, 'LAEX WF-4830 commercial banner');
      const designId = await canva.createDesign(upload.assetId, 'LAEX · WF-4830 · Banner comercial');
      const exported = await canva.exportPng(designId);
      const id = `LAEX-DERIVATIVE-${crypto.randomUUID()}`;
      const outputPath = `/assets/commercial-composition/canva/${id}.png`;
      const absolute = path.join(process.cwd(), 'public', ...outputPath.split('/').filter(Boolean));
      await fs.mkdir(path.dirname(absolute), { recursive: true });
      await fs.writeFile(absolute, exported.bytes, { flag: 'wx' });
      const derivative: CommercialDerivative = {
        id, sourceGlobalAssetId: sourceId, sourceVersion: asset.currentVersion,
        sourceOriginalChecksum: asset.currentChecksumSha256, sourceRenditionChecksum: sourceChecksum,
        sourceRendition: sourcePath, provider: 'canva', providerAssetId: upload.assetId,
        templateId: 'not-applicable:canva-business-raster', designId, uploadJobId: upload.jobId,
        autofillJobId: 'not-applicable', exportJobId: exported.jobId, outputPath,
        outputChecksum: crypto.createHash('sha256').update(exported.bytes).digest('hex'),
        purpose: 'promotional-banner', status: 'pending-human-review', createdAt: new Date().toISOString(),
      };
      return this.registry.save(derivative);
    });
  }
}
