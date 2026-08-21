import 'server-only';

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { CanvaCompositionAdapter } from '../providers/canva/CanvaCompositionAdapter';
import { CanvaBusinessApiClient } from '../providers/canva/server/CanvaBusinessApiClient';
import { CommercialDerivativeRegistry, type CommercialDerivative } from '../infrastructure/CommercialDerivativeRegistry';

const sourceId = 'LAEX-ASSET-0000002';
const reviewSource = 'assets/lf-printer/official-review/printers/wf-7840-transparent.png';

async function compose(product: Buffer, logo: Buffer) {
  const image = await sharp(product).resize({ width: 720, height: 650, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const brand = await sharp(logo).resize({ width: 160, height: 96, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const canvas = Buffer.from(`<svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050d1b"/><stop offset=".58" stop-color="#102d4b"/><stop offset="1" stop-color="#0b6f78"/></linearGradient><linearGradient id="cta" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#55e6d7"/><stop offset="1" stop-color="#7cf0bc"/></linearGradient></defs><rect width="1600" height="900" fill="url(#bg)"/><circle cx="1450" cy="55" r="380" fill="#46ded4" opacity=".1"/><path d="M0 760 C300 690 520 830 850 750 S1320 650 1600 720 V900 H0Z" fill="#071426" opacity=".7"/><text x="82" y="205" fill="#fff" font-family="Arial" font-size="72" font-weight="700">Epson WorkForce Pro</text><text x="82" y="286" fill="#fff" font-family="Arial" font-size="72" font-weight="700">WF-7840</text><text x="82" y="370" fill="#bcd0df" font-family="Arial" font-size="29">Imprime hasta 13 × 19 pulgadas</text><text x="82" y="420" fill="#bcd0df" font-family="Arial" font-size="29">Dos bandejas de 250 hojas</text><text x="82" y="470" fill="#bcd0df" font-family="Arial" font-size="29">Pantalla táctil de 4.3 pulgadas</text><text x="82" y="575" fill="#fff" font-family="Arial" font-size="43" font-weight="700">Precio a consultar</text><rect x="82" y="635" width="430" height="86" rx="43" fill="url(#cta)"/><text x="297" y="691" text-anchor="middle" fill="#06152a" font-family="Arial" font-size="28" font-weight="700">Solicita una cotización</text><rect x="82" y="780" width="335" height="48" rx="24" fill="#f59e0b"/><text x="249" y="812" text-anchor="middle" fill="#201200" font-family="Arial" font-size="19" font-weight="700">BORRADOR · REVISIÓN INTERNA</text></svg>`);
  return sharp(canvas).composite([{ input: brand, left: 82, top: 20 }, { input: image, left: 850, top: 145 }]).png().toBuffer();
}

export class CanvaBusinessWf7840Lab {
  constructor(private readonly adapter: CanvaCompositionAdapter, private readonly registry = new CommercialDerivativeRegistry()) {}

  async run() {
    return this.adapter.withValidAccessToken(async (token) => {
      const global = JSON.parse(await fs.readFile(path.join(process.cwd(), 'assets', 'asset-intelligence', 'global-asset-registry.json'), 'utf8')) as { assets: Array<{ assetId: string; model: string; status: string; currentVersion: number; currentChecksumSha256: string }> };
      const asset = global.assets.find((item) => item.assetId === sourceId);
      if (!asset || asset.model !== 'WF-7840' || asset.status !== 'review-required') throw new Error('La WF-7840 no coincide con el activo en revisión esperado.');
      const source = await fs.readFile(path.join(process.cwd(), 'assets', 'lf-printer', 'official-review', 'printers', 'wf-7840-transparent.png'));
      const sourceChecksum = crypto.createHash('sha256').update(source).digest('hex');
      const logo = await fs.readFile(path.join(process.cwd(), 'public', 'assets', 'lf-printer', 'official', 'logos', 'lf-printer-logo-on-dark.png'));
      const composed = await compose(source, logo);
      const canva = new CanvaBusinessApiClient(token);
      const upload = await canva.uploadPng(composed, 'LAEX WF-7840 internal commercial draft');
      const designId = await canva.createDesign(upload.assetId, 'LAEX · WF-7840 · Promoción en revisión');
      const exported = await canva.exportPng(designId);
      const id = `LAEX-DERIVATIVE-${crypto.randomUUID()}`;
      const outputPath = `/assets/commercial-composition/canva/${id}.png`;
      const absolute = path.join(process.cwd(), 'public', ...outputPath.split('/').filter(Boolean));
      await fs.mkdir(path.dirname(absolute), { recursive: true });
      await fs.writeFile(absolute, exported.bytes, { flag: 'wx' });
      const derivative: CommercialDerivative = {
        id, sourceGlobalAssetId: sourceId, sourceVersion: asset.currentVersion,
        sourceOriginalChecksum: asset.currentChecksumSha256, sourceRenditionChecksum: sourceChecksum,
        sourceRendition: reviewSource, provider: 'canva', providerAssetId: upload.assetId,
        templateId: 'not-applicable:canva-business-raster', designId, uploadJobId: upload.jobId,
        autofillJobId: 'not-applicable', exportJobId: exported.jobId, outputPath,
        outputChecksum: crypto.createHash('sha256').update(exported.bytes).digest('hex'),
        purpose: 'promotional-banner', status: 'pending-human-review', createdAt: new Date().toISOString(),
      };
      return this.registry.save(derivative);
    });
  }
}
