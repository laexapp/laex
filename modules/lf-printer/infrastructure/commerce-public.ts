import "server-only";
import { CompanyResolver } from "@/modules/business-engine/platform/CompanyResolver";
import { getBusinessRuntime } from "@/modules/business-engine/server/runtime";
import { toLFPrinterCommerceCatalog, type LFPrinterCommerceCatalog, type PublicCommerceCatalog } from "./commerce-presentation";

const configuredCompany = process.env.COMMERCE_REFERENCE_COMPANY_SLUG?.trim();
const productionDeployment = process.env.VERCEL_ENV === "production" || process.env.BUSINESS_DEPLOYMENT_MODE === "saas";
export const LF_PRINTER_COMMERCE_COMPANY = configuredCompany || (productionDeployment ? "" : "empresa-limpia-c7");

export async function getLFPrinterCommerceCatalog(): Promise<LFPrinterCommerceCatalog> {
  if (!LF_PRINTER_COMMERCE_COMPANY) throw new Error("COMMERCE_REFERENCE_COMPANY_SLUG is required for the LF-PRINTER production storefront");
  const runtime = getBusinessRuntime();
  try {
    const company = await new CompanyResolver(runtime.store).bySlugOrHost(LF_PRINTER_COMMERCE_COMPANY);
    const catalog = await runtime.commerceCatalog.search({tenantId:company.tenantId,companyId:company.id},{pageSize:24}) as PublicCommerceCatalog;
    return toLFPrinterCommerceCatalog(LF_PRINTER_COMMERCE_COMPANY, catalog);
  } catch {
    return toLFPrinterCommerceCatalog(LF_PRINTER_COMMERCE_COMPANY, { company: null, products: [] });
  }
}
