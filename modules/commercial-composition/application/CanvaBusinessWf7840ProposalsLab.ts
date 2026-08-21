import 'server-only';

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { CanvaCompositionAdapter } from '../providers/canva/CanvaCompositionAdapter';
import { CanvaBusinessApiClient } from '../providers/canva/server/CanvaBusinessApiClient';
import { CommercialDerivativeRegistry, type CommercialDerivative } from '../infrastructure/CommercialDerivativeRegistry';

const sourceId = 'LAEX-ASSET-0000002';
const sourceReference = 'assets/lf-printer/official-review/printers/wf-7840-transparent.png';
type Proposal = { slug: string; title: string; logoRole: 'dark' | 'light'; compose(product: Buffer, logo: Buffer): Promise<Buffer> };

const resizeProduct = (product: Buffer, width: number, height: number) => sharp(product).resize({ width, height, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const resizeLogo = (logo: Buffer, width: number, height: number) => sharp(logo).resize({ width, height, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

const proposals: Proposal[] = [
  {
    slug: 'executive-dark', title: 'Executive Dark', logoRole: 'dark',
    async compose(product, logo) {
      const [printer, brand] = await Promise.all([resizeProduct(product, 720, 650), resizeLogo(logo, 150, 92)]);
      const svg = Buffer.from(`<svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#030712"/><stop offset=".62" stop-color="#102b47"/><stop offset="1" stop-color="#087681"/></linearGradient><linearGradient id="cta"><stop stop-color="#5eead4"/><stop offset="1" stop-color="#a7f3d0"/></linearGradient></defs><rect width="1600" height="900" fill="url(#bg)"/><circle cx="1390" cy="80" r="390" fill="#5eead4" opacity=".1"/><path d="M0 795 C330 680 590 855 920 748 S1390 675 1600 720 V900 H0Z" fill="#020817" opacity=".72"/><text x="78" y="205" fill="#fff" font-family="Arial" font-size="68" font-weight="700">Potencia para</text><text x="78" y="282" fill="#fff" font-family="Arial" font-size="68" font-weight="700">pensar en grande.</text><text x="78" y="375" fill="#b9cedd" font-family="Arial" font-size="29">Impresión profesional hasta 13 × 19 pulgadas</text><text x="78" y="425" fill="#b9cedd" font-family="Arial" font-size="29">Doble bandeja · 500 hojas · Pantalla táctil</text><text x="78" y="545" fill="#fff" font-family="Arial" font-size="44" font-weight="700">WF-7840</text><rect x="78" y="612" width="430" height="88" rx="44" fill="url(#cta)"/><text x="293" y="669" text-anchor="middle" fill="#041522" font-family="Arial" font-size="28" font-weight="700">Solicita una cotización</text><rect x="78" y="785" width="330" height="46" rx="23" fill="#f59e0b"/><text x="243" y="815" text-anchor="middle" fill="#211300" font-family="Arial" font-size="18" font-weight="700">BORRADOR · REVISIÓN INTERNA</text></svg>`);
      return sharp(svg).composite([{ input: brand, left: 78, top: 28 }, { input: printer, left: 850, top: 150 }]).png().toBuffer();
    },
  },
  {
    slug: 'retail-impact', title: 'Retail Impact', logoRole: 'dark',
    async compose(product, logo) {
      const [printer, brand] = await Promise.all([resizeProduct(product, 760, 630), resizeLogo(logo, 145, 88)]);
      const svg = Buffer.from(`<svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071426"/><stop offset=".55" stop-color="#103d63"/><stop offset="1" stop-color="#4d155f"/></linearGradient><linearGradient id="flash" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#00bbfc"/><stop offset="1" stop-color="#fc0a7c"/></linearGradient></defs><rect width="1600" height="900" fill="url(#bg)"/><circle cx="1160" cy="420" r="385" fill="#fff" opacity=".08"/><circle cx="1160" cy="420" r="310" fill="#00bbfc" opacity=".1"/><path d="M0 0 H590 L440 900 H0Z" fill="#020817" opacity=".62"/><rect x="74" y="174" width="390" height="44" rx="22" fill="url(#flash)"/><text x="269" y="203" text-anchor="middle" fill="#fff" font-family="Arial" font-size="19" font-weight="700" letter-spacing="2">FORMATO ANCHO PROFESIONAL</text><text x="74" y="315" fill="#fff" font-family="Arial" font-size="82" font-weight="700">WF-7840</text><text x="74" y="377" fill="#64e8ff" font-family="Arial" font-size="33" font-weight="700">Más espacio. Más posibilidades.</text><text x="74" y="460" fill="#d9e8f3" font-family="Arial" font-size="27">Hasta 13 × 19 pulgadas</text><text x="74" y="506" fill="#d9e8f3" font-family="Arial" font-size="27">500 hojas de capacidad</text><text x="74" y="552" fill="#d9e8f3" font-family="Arial" font-size="27">Todo-en-uno empresarial</text><rect x="74" y="628" width="410" height="92" rx="18" fill="#fff"/><text x="279" y="686" text-anchor="middle" fill="#0a2440" font-family="Arial" font-size="27" font-weight="700">Consulta disponibilidad</text><rect x="74" y="785" width="330" height="46" rx="23" fill="#f59e0b"/><text x="239" y="815" text-anchor="middle" fill="#211300" font-family="Arial" font-size="18" font-weight="700">BORRADOR · REVISIÓN INTERNA</text></svg>`);
      return sharp(svg).composite([{ input: brand, left: 74, top: 28 }, { input: printer, left: 770, top: 145 }]).png().toBuffer();
    },
  },
  {
    slug: 'editorial-light', title: 'Editorial Light', logoRole: 'light',
    async compose(product, logo) {
      const [printer, brand] = await Promise.all([resizeProduct(product, 730, 650), resizeLogo(logo, 140, 86)]);
      const svg = Buffer.from(`<svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="soft" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#dff8f7"/></linearGradient></defs><rect width="1600" height="900" fill="url(#soft)"/><rect x="0" y="0" width="24" height="900" fill="#00a9c7"/><circle cx="1320" cy="170" r="360" fill="#00bbfc" opacity=".08"/><text x="86" y="215" fill="#082338" font-family="Arial" font-size="62" font-weight="700">Producción profesional,</text><text x="86" y="285" fill="#082338" font-family="Arial" font-size="62" font-weight="700">sin límites de formato.</text><text x="86" y="370" fill="#2076b9" font-family="Arial" font-size="31" font-weight="700">Epson WorkForce Pro WF-7840</text><line x1="86" y1="414" x2="560" y2="414" stroke="#00a9c7" stroke-width="5"/><text x="86" y="485" fill="#40566a" font-family="Arial" font-size="27">• Impresión hasta 13 × 19 pulgadas</text><text x="86" y="535" fill="#40566a" font-family="Arial" font-size="27">• Dos bandejas de 250 hojas</text><text x="86" y="585" fill="#40566a" font-family="Arial" font-size="27">• Pantalla táctil de 4.3 pulgadas</text><rect x="86" y="650" width="410" height="86" rx="43" fill="#082338"/><text x="291" y="706" text-anchor="middle" fill="#fff" font-family="Arial" font-size="27" font-weight="700">Habla con un especialista</text><rect x="86" y="790" width="330" height="46" rx="23" fill="#f59e0b"/><text x="251" y="820" text-anchor="middle" fill="#211300" font-family="Arial" font-size="18" font-weight="700">BORRADOR · REVISIÓN INTERNA</text></svg>`);
      return sharp(svg).composite([{ input: brand, left: 86, top: 30 }, { input: printer, left: 850, top: 155 }]).png().toBuffer();
    },
  },
];

export class CanvaBusinessWf7840ProposalsLab {
  constructor(private readonly adapter: CanvaCompositionAdapter, private readonly registry = new CommercialDerivativeRegistry()) {}

  async run() {
    return this.adapter.withValidAccessToken(async (token) => {
      const global = JSON.parse(await fs.readFile(path.join(process.cwd(), 'assets', 'asset-intelligence', 'global-asset-registry.json'), 'utf8')) as { assets: Array<{ assetId: string; model: string; status: string; currentVersion: number; currentChecksumSha256: string }> };
      const asset = global.assets.find((item) => item.assetId === sourceId);
      if (!asset || asset.model !== 'WF-7840' || asset.status !== 'review-required') throw new Error('La WF-7840 no permanece en el estado de revisión esperado.');
      const [source, darkLogo, lightLogo] = await Promise.all([
        fs.readFile(path.join(process.cwd(), 'assets', 'lf-printer', 'official-review', 'printers', 'wf-7840-transparent.png')),
        fs.readFile(path.join(process.cwd(), 'public', 'assets', 'lf-printer', 'official', 'logos', 'lf-printer-logo-on-dark.png')),
        fs.readFile(path.join(process.cwd(), 'public', 'assets', 'lf-printer', 'official', 'logos', 'lf-printer-logo-primary.png')),
      ]);
      const sourceChecksum = crypto.createHash('sha256').update(source).digest('hex');
      const canva = new CanvaBusinessApiClient(token);
      const results: CommercialDerivative[] = [];
      for (const proposal of proposals) {
        const composition = await proposal.compose(source, proposal.logoRole === 'dark' ? darkLogo : lightLogo);
        const upload = await canva.uploadPng(composition, `LF-PRINTER WF-7840 ${proposal.title}`);
        const designId = await canva.createDesign(upload.assetId, `LF-PRINTER · WF-7840 · ${proposal.title}`);
        const exported = await canva.exportPng(designId);
        const id = `LAEX-DERIVATIVE-${crypto.randomUUID()}`;
        const outputPath = `/assets/commercial-composition/canva/${id}.png`;
        await fs.mkdir(path.join(process.cwd(), 'public', 'assets', 'commercial-composition', 'canva'), { recursive: true });
        await fs.writeFile(path.join(process.cwd(), 'public', 'assets', 'commercial-composition', 'canva', `${id}.png`), exported.bytes, { flag: 'wx' });
        results.push(await this.registry.save({
          id, sourceGlobalAssetId: sourceId, sourceVersion: asset.currentVersion, sourceOriginalChecksum: asset.currentChecksumSha256,
          sourceRenditionChecksum: sourceChecksum, sourceRendition: sourceReference, provider: 'canva', providerAssetId: upload.assetId,
          templateId: `canva-business-proposal:${proposal.slug}`, designId, uploadJobId: upload.jobId, autofillJobId: 'not-applicable', exportJobId: exported.jobId,
          outputPath, outputChecksum: crypto.createHash('sha256').update(exported.bytes).digest('hex'), purpose: 'promotional-banner',
          status: 'pending-human-review', createdAt: new Date().toISOString(),
        }));
      }
      return results;
    });
  }
}
