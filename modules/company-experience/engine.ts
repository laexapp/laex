import type { ChapterTwoState, ChapterTwoStore } from "@/modules/business-engine/chapter-two/types";
import type { CompanyId, TenantId } from "@/modules/business-engine/domain/types";
import { companyExperienceRegistry } from "./registry";
import type { CompanyExperienceDefinition, ExperienceWorkflowState, PublicCompanyExperienceDTO, VehicleOperationalStatus } from "./types";

const transitions: Record<ExperienceWorkflowState, ExperienceWorkflowState[]> = {
  draft: ["collecting-content"], "collecting-content": ["draft", "configuring"], configuring: ["collecting-content", "preview-ready"],
  "preview-ready": ["configuring", "domain-pending", "quality-review"], "domain-pending": ["preview-ready", "quality-review"],
  "quality-review": ["preview-ready", "published"], published: ["quality-review"]
};
const blockingReservationStates = new Set(["requested", "reviewing", "accepted"]);
const cleanKey = (value: string) => value.trim().toLowerCase().split(":")[0].replace(/^www\./, "");
const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(new Date(`${value}T00:00:00Z`).getTime());
const overlaps = (startDate: string, endDate: string, otherStart: string, otherEnd: string) => startDate <= otherEnd && endDate >= otherStart;

export const vehicleStatusLabels: Record<VehicleOperationalStatus, string> = { available: "Disponible", reserved: "Reservado", rented: "Alquilado", maintenance: "No disponible · Mantenimiento" };
export function canTransitionExperience(from: ExperienceWorkflowState, to: ExperienceWorkflowState) { return transitions[from].includes(to); }
export function resolveCompanyExperience(value: string, includeUnpublished = false): CompanyExperienceDefinition | undefined {
  const key = cleanKey(value);
  return companyExperienceRegistry.find((entry) => (entry.company.slug === key || entry.domainBindings.some((binding) => binding.kind !== "internal-path" && binding.status === "active" && cleanKey(binding.hostname) === key)) && (includeUnpublished || entry.experience.state === "published"));
}
export function toPublicExperience(definition: CompanyExperienceDefinition): PublicCompanyExperienceDTO {
  const { slug, name, tagline, description, locale, currency, timezone } = definition.company;
  const dto: PublicCompanyExperienceDTO = { scope: Object.freeze({ ...definition.scope }), company: { slug, name, tagline, description, locale, currency, timezone }, brand: { ...definition.brand }, contact: { ...definition.contact }, experience: { ...definition.experience, seo: { ...definition.experience.seo }, enabledSections: [...definition.experience.enabledSections] }, catalog: definition.catalog.map((item) => ({ ...item, features: [...item.features] })), services: definition.services.map((service) => ({ ...service })) };
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
function validateDateRange(startDate: string, endDate: string) {
  if (!isIsoDate(startDate) || !isIsoDate(endDate) || endDate < startDate || new Date(`${endDate}T00:00:00Z`).getTime() - new Date(`${startDate}T00:00:00Z`).getTime() > 31_536_000_000) throw new Error("invalid_reservation_dates");
}
function itemAvailability(definition: CompanyExperienceDefinition, reservations: ChapterTwoState["companyExperienceReservations"], itemId: string, startDate: string, endDate: string) {
  const item = definition.catalog.find((candidate) => candidate.id === itemId);
  if (!item) throw new Error("catalog_item_not_found");
  const operationalStatus = item.operationalStatus ?? "available";
  const conflict = reservations.some((reservation) => reservation.tenantId === definition.scope.tenantId && reservation.companyId === definition.scope.companyId && reservation.catalogItemId === item.id && blockingReservationStates.has(reservation.status) && overlaps(startDate, endDate, reservation.startDate, reservation.endDate));
  return { available: operationalStatus === "available" && !conflict, operationalStatus, statusLabel: conflict ? "Reservado para esas fechas" : vehicleStatusLabels[operationalStatus], reason: conflict ? "date_conflict" : operationalStatus === "available" ? undefined : operationalStatus };
}
export interface AvailabilityQuery { startDate: string; endDate: string; passengers?: number }
export async function checkExperienceAvailability(store: ChapterTwoStore, companyKey: string, query: AvailabilityQuery) {
  const definition = resolveCompanyExperience(companyKey); if (!definition) throw new Error("company_experience_not_found"); validateDateRange(query.startDate, query.endDate);
  if (query.passengers !== undefined && (!Number.isInteger(query.passengers) || query.passengers < 1 || query.passengers > 100)) throw new Error("invalid_passenger_count");
  const state = store.snapshotForCompany ? await store.snapshotForCompany(definition.scope.tenantId as TenantId, definition.scope.companyId as CompanyId, ["companyExperienceReservations"]) : await store.snapshot();
  return { startDate: query.startDate, endDate: query.endDate, demo: true, vehicles: definition.catalog.filter((item) => item.kind === "vehicle" && (!query.passengers || (item.passengers ?? 0) >= query.passengers)).map((item) => ({ id: item.id, slug: item.slug, ...itemAvailability(definition, state.companyExperienceReservations, item.id, query.startDate, query.endDate) })) };
}
export interface ReservationInput { catalogItemSlug: string; startDate: string; endDate: string; name: string; phone: string; notes?: string }
export async function submitExperienceReservation(store: ChapterTwoStore, companyKey: string, idempotencyKey: string, input: ReservationInput) {
  const definition = resolveCompanyExperience(companyKey); if (!definition) throw new Error("company_experience_not_found");
  if (!idempotencyKey || idempotencyKey.length > 128) throw new Error("invalid_idempotency_key");
  const item = definition.catalog.find((candidate) => candidate.slug === input.catalogItemSlug && candidate.kind === "vehicle"); if (!item) throw new Error("catalog_item_not_found");
  const name = input.name.trim(), phone = input.phone.trim(), notes = input.notes?.trim(); validateDateRange(input.startDate, input.endDate);
  if (name.length < 2 || name.length > 100 || phone.length < 7 || phone.length > 30) throw new Error("invalid_customer_data"); if (notes && notes.length > 500) throw new Error("notes_too_long");
  const scopeKey = `${definition.scope.tenantId}:${definition.scope.companyId}:experience-reservation:${idempotencyKey}`;
  return store.transact((draft) => {
    const replay = draft.idempotency[scopeKey] as { id: string; status: string } | undefined; if (replay) return replay;
    if (!itemAvailability(definition, draft.companyExperienceReservations, item.id, input.startDate, input.endDate).available) throw new Error("vehicle_unavailable_for_dates");
    const reservation = { id: crypto.randomUUID(), tenantId: definition.scope.tenantId as TenantId, companyId: definition.scope.companyId as CompanyId, catalogItemId: item.id, startDate: input.startDate, endDate: input.endDate, customer: { name, phone }, notes: notes || undefined, status: "requested" as const, idempotencyKey, createdAt: new Date().toISOString() };
    draft.companyExperienceReservations.push(reservation); const response = { id: reservation.id, status: reservation.status }; draft.idempotency[scopeKey] = response; return response;
  });
}