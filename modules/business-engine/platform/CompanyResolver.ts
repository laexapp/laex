import type { CompanyId } from "../domain/types";
import type { ChapterTwoStore } from "../chapter-two/types";
export class CompanyResolver {
  constructor(private readonly store: ChapterTwoStore) {}
  async bySlugOrHost(value: string) { const normalized = value.toLowerCase().split(":")[0]; const direct = await this.store.findCompanyBySlugOrHost?.(normalized); const state = direct ? undefined : await this.store.snapshot(); const domain = state?.platformDomains.find((d) => d.status === "active" && d.hostname === normalized); const company = direct ?? state?.platformCompanies.find((c) => c.status !== "cancelled" && (c.slug === normalized || c.id === normalized as CompanyId || c.id === domain?.companyId)); if (!company || (company.status !== "active" && company.status !== "trial")) throw new Error(company?.status === "suspended" ? "company_suspended" : "company_not_found"); return company; }
}
