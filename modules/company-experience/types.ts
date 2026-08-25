export type ExperienceWorkflowState = "draft" | "collecting-content" | "configuring" | "preview-ready" | "domain-pending" | "quality-review" | "published";
export type ExperienceKind = "product" | "service" | "vehicle";
export interface CompanyExperienceDefinition {
  scope: { tenantId: string; companyId: string };
  company: { slug: string; name: string; legalName: string; tagline: string; shortDescription?: string; description: string; sector?: string; publicStatus?: "hidden" | "preview" | "published"; locale: string; currency: string; timezone: string };
  domainBindings: Array<{ hostname: string; path?: string; kind: "internal-path" | "subdomain" | "custom"; status: "pending" | "active" }>;
  workflow: Array<{ from?: ExperienceWorkflowState; to: ExperienceWorkflowState; at: string; note: string }>;
  brand: { logoText: string; logoUrl?: string; logoVariants?: string[]; faviconUrl?: string; heroImageUrl?: string; primaryColor: string; secondaryColor: string; accentColor: string; backgroundColor?: string; surfaceColor: string; textColor: string; fontFamily: string };
  contact: { phone: string; whatsapp: string; email: string; address: string; hours: string };
  experience: { template: "catalog"; navigation?: Array<{ label: string; href: string }>; primaryCta?: { label: string; href: string }; secondaryCta?: { label: string; href: string }; faq?: Array<{ question: string; answer: string }>; state: ExperienceWorkflowState; enabledSections: Array<"hero" | "catalog" | "services" | "contact">; commerceMode: "products" | "services" | "mixed"; seo: { title: string; description: string; noIndex: boolean }; demoNotice?: string };
  catalog: Array<{ id: string; slug: string; kind: ExperienceKind; name: string; summary: string; image: string; imageAlt: string; year?: string; passengers?: number; transmission?: string; fuel?: string; luggage?: number; features: string[]; priceLabel: string; demo: boolean }>;
  services: Array<{ id: string; name: string; description: string }>;
}
export interface PublicCompanyExperienceDTO {
  scope: Readonly<{ tenantId: string; companyId: string }>;
  company: Omit<CompanyExperienceDefinition["company"], "legalName">;
  brand: Readonly<CompanyExperienceDefinition["brand"]>;
  contact: Readonly<CompanyExperienceDefinition["contact"]>;
  experience: Readonly<CompanyExperienceDefinition["experience"]>;
  catalog: ReadonlyArray<Readonly<CompanyExperienceDefinition["catalog"][number]>>;
  services: ReadonlyArray<Readonly<CompanyExperienceDefinition["services"][number]>>;
}