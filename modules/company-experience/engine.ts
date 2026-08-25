import type { ChapterTwoStore } from "@/modules/business-engine/chapter-two/types";
import type { CompanyId, TenantId } from "@/modules/business-engine/domain/types";
import { companyExperienceRegistry } from "./registry";
import type { CompanyExperienceDefinition, ExperienceWorkflowState, PublicCompanyExperienceDTO } from "./types";

const transitions: Record<ExperienceWorkflowState, ExperienceWorkflowState[]> = {
  draft: ["collecting-content"], "collecting-content": ["draft", "configuring"], configuring: ["collecting-content", "preview-ready"],
  "preview-ready": ["configuring", "domain-pending", "quality-review"], "domain-pending": ["preview-ready", "quality-review"],
  "quality-review": ["preview-ready", "published"], published: ["quality-review"]
};
const cleanKey = (value: string) => value.trim().toLowerCase().split(":")[0].replace(/^www\./, "");
export function canTransitionExperience(from: ExperienceWorkflowState, to: ExperienceWorkflowState) { return transitions[from].includes(to); }
export function resolveCompanyExperience(value: string, includeUnpublished = false): CompanyExperienceDefinition | undefined {
  const key = cleanKey(value);
  return companyExperienceRegistry.find((entry) => (entry.company.slug === key || entry.domainBindings.some((binding) => binding.kind !== "internal-path" && binding.status === "active" && cleanKey(binding.hostname) === key)) && (includeUnpublished || entry.experience.state === "published"));
}
export function toPublicExperience(definition: CompanyExperienceDefinition): PublicCompanyExperienceDTO {
  const { slug, name, tagline, description, locale, currency, timezone } = definition.company;
  const dto: PublicCompanyExperienceDTO = {
    scope: Object.freeze({ ...definition.scope }), company: { slug, name, tagline, description, locale, currency, timezone },
    brand: { ...definition.brand }, contact: { ...definition.contact }, experience: { ...definition.experience, seo: { ...definition.experience.seo }, enabledSections: [...definition.experience.enabledSections] },
    catalog: definition.catalog.map((item) => ({ ...item, features: [...item.features] })), services: definition.services.map((service) => ({ ...service }))
  };
  return Object.freeze(dto);
}
export function validateExperience(definition: CompanyExperienceDefinition) {
  const errors: string[] = [];
  if (!definition.company.name.trim() || !definition.company.slug.trim()) errors.push("company_identity_incomplete");
  if (!/^#[0-9a-f]{6}$/i.test(definition.brand.primaryColor)) errors.push("invalid_primary_color");
  if (!definition.contact.phone.trim() || !definition.contact.email.includes("@")) errors.push("contact_incomplete");
  if (!definition.catalog.length && !definition.services.length) errors.push("empty_experience");
  if (new Set(definition.catalog.map((item) => item.slug)).size !== definition.catalog.length) errors.push("duplicate_catalog_slug");
  return { valid: errors.length === 0, errors };
}
export interface ReservationInput { catalogItemSlug: string; startDate: string; endDate: string; name: string; phone: string; notes?: string }
export async function submitExperienceReservation(store: ChapterTwoStore, companyKey: string, idempotencyKey: string, input: ReservationInput) {
  const definition = resolveCompanyExperience(companyKey);
  if (!definition) throw new Error("company_experience_not_found");
  if (!idempotencyKey || idempotencyKey.length > 128) throw new Error("invalid_idempotency_key");
  const item = definition.catalog.find((candidate) => candidate.slug === input.catalogItemSlug);
  if (!item) throw new Error("catalog_item_not_found");
  const name = input.name.trim(), phone = input.phone.trim(), notes = input.notes?.trim();
  const start = new Date(`${input.startDate}T00:00:00Z`), end = new Date(`${input.endDate}T00:00:00Z`);
  if (name.length < 2 || name.length > 100 || phone.length < 7 || phone.length > 30) throw new Error("invalid_customer_data");
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start || end.getTime() - start.getTime() > 31_536_000_000) throw new Error("invalid_reservation_dates");
  if (notes && notes.length > 500) throw new Error("notes_too_long");
  const scopeKey = `${definition.scope.tenantId}:${definition.scope.companyId}:experience-reservation:${idempotencyKey}`;
  return store.transact((draft) => {
    const replay = draft.idempotency[scopeKey] as { id: string; status: string } | undefined;
    if (replay) return replay;
    const reservation = { id: crypto.randomUUID(), tenantId: definition.scope.tenantId as TenantId, companyId: definition.scope.companyId as CompanyId, catalogItemId: item.id, startDate: input.startDate, endDate: input.endDate, customer: { name, phone }, notes: notes || undefined, status: "requested" as const, idempotencyKey, createdAt: new Date().toISOString() };
    draft.companyExperienceReservations.push(reservation);
    const response = { id: reservation.id, status: reservation.status };
    draft.idempotency[scopeKey] = response;
    return response;
  });
}