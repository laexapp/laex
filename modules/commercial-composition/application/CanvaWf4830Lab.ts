import 'server-only';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { CanvaCompositionAdapter } from '../providers/canva/CanvaCompositionAdapter';
import { CanvaApiClient } from '../providers/canva/server/CanvaApiClient';
import { CommercialDerivativeRegistry, type CommercialDerivative } from '../infrastructure/CommercialDerivativeRegistry';

const SOURCE_ID = 'LAEX-ASSET-0000001';
const sourceFile = path.join(process.cwd(), 'public', 'assets', 'lf-printer', 'official', 'printers', 'wf-4830-transparent.png');
const aliases = { image: ['PRODUCT_IMAGE', 'IMAGEN_PRODUCTO', 'IMAGE'], name: ['PRODUCT_NAME', 'NOMBRE', 'NAME'], price: ['PRICE', 'PRECIO'], benefits: ['BENEFITS', 'BENEFICIOS'], cta: ['CTA', 'CALL_TO_ACTION'] };
const normalize = (value: string) => value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '_');
const findField = (dataset: Record<string, { type: string }>, names: string[], type: string) => Object.keys(dataset).find((key) => names.includes(normalize(key)) && dataset[key].type === type);
const pesos = (minor: number) => new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(minor / 100);
export type CanvaWf4830Campaign = { companyId: string; productId: string; projectionId: string; slug: string; name: string; model?: string; basePriceMinor: number; promotionalPriceMinor: number; promotionTitle: string; promotionDescription: string; targetUrl: string };

export class CanvaWf4830Lab {
  constructor(private readonly adapter: CanvaCompositionAdapter, private readonly registry = new CommercialDerivativeRegistry()) {}
  async run(campaign: CanvaWf4830Campaign) {
    if (campaign.model !== 'WF-4830' || campaign.promotionalPriceMinor >= campaign.basePriceMinor) throw new Error('COMMERCE_CAMPAIGN_INVALID');
    return this.adapter.withValidAccessToken(async (token) => {
      const global = JSON.parse(await fs.readFile(path.join(process.cwd(), 'assets', 'asset-intelligence', 'global-asset-registry.json'), 'utf8')) as { assets: Array<{ assetId: string; model: string; currentVersion: number; currentChecksumSha256: string }> };
      const asset = global.assets.find((item) => item.assetId === SOURCE_ID);
      if (!asset || asset.model !== 'WF-4830') throw new Error('El activo oficial WF-4830 no coincide con LAEX-ASSET-0000001.');
      const source = await fs.readFile(sourceFile);
      const sourceChecksum = crypto.createHash('sha256').update(source).digest('hex');
      const canva = new CanvaApiClient(token);
      const templates = await canva.listBrandTemplates();
      let selected: { id: string; fields: Record<keyof typeof aliases, string> } | undefined;
      for (const template of templates) {
        const dataset = await canva.brandTemplateDataset(template.id);
        const fields = { image: findField(dataset, aliases.image, 'image'), name: findField(dataset, aliases.name, 'text'), price: findField(dataset, aliases.price, 'text'), benefits: findField(dataset, aliases.benefits, 'text'), cta: findField(dataset, aliases.cta, 'text') };
        if (Object.values(fields).every(Boolean)) { selected = { id: template.id, fields: fields as Record<keyof typeof aliases, string> }; break; }
      }
      if (!selected) throw new Error('CANVA_TEMPLATE_REQUIRED: Crea una Brand Template con los campos PRODUCT_IMAGE, PRODUCT_NAME, PRICE, BENEFITS y CTA.');
      const upload = await canva.uploadAsset(source, 'LF-PRINTER WF-4830 approved Commerce asset');
      const autofill = await canva.createAutofill(selected.id, {
        [selected.fields.image]: { type: 'image', asset_id: upload.assetId }, [selected.fields.name]: { type: 'text', text: campaign.name },
        [selected.fields.price]: { type: 'text', text: `Antes ${pesos(campaign.basePriceMinor)} · Exclusivo ${pesos(campaign.promotionalPriceMinor)}` },
        [selected.fields.benefits]: { type: 'text', text: `${campaign.promotionTitle} · ${campaign.promotionDescription}` },
        [selected.fields.cta]: { type: 'text', text: `Ver en LF-PRINTER · ${campaign.targetUrl}` },
      });
      const exported = await canva.exportPng(autofill.designId); const output = await canva.downloadExport(exported.url);
      const id = `LAEX-DERIVATIVE-${crypto.randomUUID()}`; const publicPath = `/assets/commercial-composition/canva/${id}.png`; const absolute = path.join(process.cwd(), 'public', ...publicPath.split('/').filter(Boolean));
      await fs.mkdir(path.dirname(absolute), { recursive: true }); await fs.writeFile(absolute, output, { flag: 'wx' });
      const derivative: CommercialDerivative = { id, sourceGlobalAssetId: SOURCE_ID, sourceVersion: asset.currentVersion, sourceOriginalChecksum: asset.currentChecksumSha256, sourceRenditionChecksum: sourceChecksum, sourceRendition: '/assets/lf-printer/official/printers/wf-4830-transparent.png', provider: 'canva', providerAssetId: upload.assetId, templateId: selected.id, designId: autofill.designId, uploadJobId: upload.jobId, autofillJobId: autofill.jobId, exportJobId: exported.jobId, outputPath: publicPath, outputChecksum: crypto.createHash('sha256').update(output).digest('hex'), purpose: 'promotional-banner', status: 'pending-human-review', createdAt: new Date().toISOString(), commerceSnapshot: { ...campaign }, automation: ['commerce.catalog.search', 'asset-registry.exact-match', 'canva.asset-upload', 'canva.brand-template.dataset', 'canva.autofill', 'canva.png-export', 'laex.human-review'] };
      return this.registry.save(derivative);
    });
  }
  list() { return this.registry.list(); }
}
