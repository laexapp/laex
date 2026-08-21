import { randomUUID } from 'node:crypto';
import { PostgresChapterTwoStore } from '../../modules/business-engine/infrastructure/postgres/PostgresChapterTwoStore';
import { ProductMediaAutomation } from '../../modules/business-engine/media/ProductMediaAutomation';
import { CommerceEngine } from '../../modules/business-engine/commerce/CommerceEngine';
import type { ActorContext, UserId } from '../../modules/business-engine/domain/types';

const allowed = new Set(['L1250','WF-4830','WF-4834','WF-C4810','WF-7820','WF-7840','XP-4105','XP-4205']);
const databaseUrl = process.env.BUSINESS_DATABASE_URL;
if (!databaseUrl) throw new Error('BUSINESS_DATABASE_URL is required');

async function main() {
  const store = PostgresChapterTwoStore.fromUrl(databaseUrl!);
  const media = new ProductMediaAutomation(store);
  const commerce = new CommerceEngine(store, undefined, undefined, media);
  try {
    const state = await store.snapshot();
    const company = state.platformCompanies.find((item) => item.slug === 'empresa-limpia-c7' && item.status !== 'cancelled');
    if (!company) throw new Error('LF-PRINTER reference company is not available');
    const actor: ActorContext = { tenantId: company.tenantId, companyId: company.id, userId: 'user-laex-media-operator' as UserId, traceId: `transparent-media-${randomUUID()}`, capabilities: ['commerce.publish'] };
    const results = [];
    for (const projection of state.commerceProjections.filter((item) => item.companyId === company.id && item.publicationStatus === 'published')) {
      const product = state.products.find((item) => item.id === projection.productId && item.companyId === company.id);
      if (!product?.model || !allowed.has(product.model)) continue;
      await media.associate(actor, product.id);
      const refreshed = await commerce.publish(actor, {
        productId: product.id, publicName: projection.publicName, publicSku: projection.publicSku,
        description: projection.publicDescription, category: projection.commercialCategory,
        compatibility: projection.compatibility, features: projection.features, featured: projection.featured,
        promotion: projection.promotion ? { priceMinor: projection.promotion.priceMinor, startsAt: projection.promotion.startsAt, endsAt: projection.promotion.endsAt, active: projection.promotion.active, title: projection.promotion.title, description: projection.promotion.description, eligibilityMode: projection.promotion.eligibilityMode, assetReference: projection.promotion.assetReference } : undefined,
        deliveryPolicy: projection.deliveryPolicy,
      });
      results.push({ model: product.model, projectionId: refreshed.id, mediaVersion: 5, images: refreshed.images.map((image) => image.url) });
    }
    console.log(JSON.stringify({ companyId: company.id, refreshed: results }, null, 2));
  } finally { await store.close(); }
}
void main().catch((error) => { console.error(error instanceof Error ? error.message : 'transparent_media_refresh_failed'); process.exitCode = 1; });
