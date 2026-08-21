import { CanvaWf4830Lab } from '@/modules/commercial-composition/application/CanvaWf4830Lab';
import { createCanvaServerIntegration } from '@/modules/commercial-composition/providers/canva/server/factory';
import { CompanyResolver } from '@/modules/business-engine/platform/CompanyResolver';
import { getBusinessRuntime } from '@/modules/business-engine/server/runtime';
import { LF_PRINTER_COMMERCE_COMPANY } from '@/modules/lf-printer/infrastructure/commerce-public';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isLocal(request: Request) {
  const hostname = new URL(request.url).hostname;
  return hostname === '127.0.0.1' || hostname === 'localhost';
}

function lab() {
  return new CanvaWf4830Lab(createCanvaServerIntegration().adapter);
}

async function commerceCampaign() {
  const runtime = getBusinessRuntime();
  const company = await new CompanyResolver(runtime.store).bySlugOrHost(LF_PRINTER_COMMERCE_COMPANY);
  const catalog = await runtime.commerceCatalog.search(
    { tenantId: company.tenantId, companyId: company.id },
    { query: 'WF-4830', pageSize: 20 },
  );
  const product = catalog.products.find((item) => item.model === 'WF-4830');
  if (!product?.productId || !product.projectionId || !product.promotion?.active
    || product.promotion.basePriceMinor === undefined || !product.promotion.title
    || !product.promotion.description) {
    throw new Error('COMMERCE_WF4830_PROMOTION_NOT_FOUND');
  }
  return {
    companyId: company.id,
    productId: product.productId,
    projectionId: product.projectionId,
    slug: product.slug,
    name: product.name,
    model: product.model,
    basePriceMinor: product.promotion.basePriceMinor,
    promotionalPriceMinor: product.priceMinor,
    promotionTitle: product.promotion.title,
    promotionDescription: product.promotion.description,
    targetUrl: product.url,
  };
}

export async function GET() {
  try {
    return Response.json({ derivatives: await lab().list() });
  } catch {
    return Response.json({ error: 'No fue posible consultar los derivados comerciales.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isLocal(request)) {
    return Response.json({ error: 'El laboratorio Canva solo puede ejecutarse localmente.' }, { status: 403 });
  }

  try {
    return Response.json({ derivative: await lab().run(await commerceCampaign()) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.startsWith('CANVA_TEMPLATE_REQUIRED:')) {
      return Response.json({
        code: 'CANVA_TEMPLATE_REQUIRED',
        error: message.slice('CANVA_TEMPLATE_REQUIRED:'.length).trim(),
      }, { status: 409 });
    }
    console.error('Canva WF-4830 lab failed', error);
    return Response.json({ error: 'El ciclo Canva no pudo completarse. Revisa el registro seguro del servidor.' }, { status: 502 });
  }
}
