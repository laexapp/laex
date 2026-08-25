import type { ActorContext, CompanyId, TenantId, UserId, WarehouseId } from "../domain/types";
import type { CanonicalFiscalDocument, ElectronicInvoiceRecord, FiscalSequenceAuthorization, FiscalTenantConfiguration } from "../electronic-invoicing/types";

export type CommerceAvailabilityMode = "in-stock" | "on-order" | "confirm-availability";
export type CommercePriceType = "fixed" | "tentative";
export type CommercePaymentRequirement = "full" | "deposit" | "confirmation";
export interface CommerceDeliveryPolicy {
  mode: CommerceAvailabilityMode;
  estimatedDelivery?: string;
  priceType: CommercePriceType;
  customerNote?: string;
  paymentRequirement: CommercePaymentRequirement;
  depositPercent?: number;
  tentativePriceValidUntil?: string;
}

export interface ChapterTwoState {
  platformTenants: Array<{ id: TenantId; name: string; status: "trial" | "active" | "suspended" | "cancelled"; createdAt: string }>;
  platformCompanies: Array<{ id: CompanyId; tenantId: TenantId; slug: string; name: string; legalName: string; taxId?: string; address?: string; phone?: string; email?: string; currency: string; timezone: string; primaryColor: string; logoUrl?: string; enabledModules: string[]; status: "trial" | "active" | "suspended" | "cancelled"; createdAt: string; version?: string; lastAccessAt?: string; printFormat?: "thermal" | "standard" }>;
  platformDomains: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; hostname: string; kind: "subdomain" | "custom" | "audit-path"; status: "active" | "pending" }>;
  companyExperienceReservations: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; catalogItemId: string; startDate: string; endDate: string; customer: { name: string; phone: string }; notes?: string; status: "requested" | "reviewing" | "accepted" | "declined" | "cancelled"; idempotencyKey: string; createdAt: string }>;
  branches: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; name: string; address?: string; status: "active" | "disabled" }>;
  warehouses: Array<{ id: WarehouseId; tenantId: TenantId; companyId: CompanyId; branchId: string; name: string; status: "active" | "disabled" }>;
  roles: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; name: string; capabilities: ActorContext["capabilities"]; system: boolean; status: "active" | "disabled" }>;
  assistantMessages: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; userId: UserId; agent: "LIA" | "ALAN" | "ETHAN"; role: "user" | "assistant"; text: string; proposalId?: string; at: string }>;
  assistantProposals: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; userId: UserId; agent: "LIA" | "ALAN" | "ETHAN"; command: "reception.create"; payload: { customerName: string; brand: string; model: string; phone?:string; address?:string; problem?:string }; summary: string; status: "pending" | "confirmed" | "cancelled"; createdAt: string; confirmedAt?: string }|{ id:string;tenantId:TenantId;companyId:CompanyId;userId:UserId;agent:"LIA";command:"catalog.bulk";payload:{warehouseId:string;rows:Array<{sku:string;name:string;quantity:number;costMinor:number;priceMinor:number;barcode?:string;brand?:string;model?:string;category?:string;description?:string}>;model?:string;phone?:string};summary:string;status:"pending"|"confirmed"|"cancelled";createdAt:string;confirmedAt?:string }>;
  aiActivity: Array<{id:string;tenantId:TenantId;companyId:CompanyId;userId:UserId;sessionId?:string;agent:"LIA"|"ALAN"|"ETHAN";provider:string;model:string;intent:string;tools:string[];result:"answered"|"proposed"|"clarification"|"denied"|"unavailable";dataCategories:string[];inputUnits:number;outputUnits:number;estimatedCostUsdMicros:number;createdAt:string}>;
  productMedia:Array<{id:string;tenantId:TenantId;companyId:CompanyId;productId:string;assetId?:string;manufacturer?:string;model?:string;status:"pending"|"associated"|"review-required";reason?:string;master:{uri?:string;checksum?:string;version?:number;sourceUrl?:string};derivatives:Array<{id:string;purpose:"carousel"|"card"|"detail"|"promotion";url:string;checksum:string;version:number;tool:string;transformation:string;createdAt:string;status:"approved"|"pending-human-review"}>;createdAt:string;updatedAt:string}>;
  mediaAcquisitionRequests:Array<{id:string;tenantId:TenantId;companyId:CompanyId;productId:string;manufacturer:string;model:string;assetKind:"product-image";status:"queued"|"official-source-required"|"rights-review"|"review-required"|"approved"|"failed";providerId?:string;candidateReference?:string;sourcePageUrl?:string;licenseStatus?:string;reason?:string;createdAt:string;updatedAt:string}>;
  commerceProjections:Array<{id:string;tenantId:TenantId;companyId:CompanyId;productId:string;slug:string;publicName:string;publicModel?:string;publicSku?:string;publicDescription:string;commercialCategory:string;compatibility?:string[];images:Array<{url:string;alt:string;order:number;hidden?:boolean;assetReference?:string;checksum?:string;version?:number;purpose?:"carousel"|"card"|"detail"|"promotion";tool?:string}>;publicPriceMinor:number;promotion?:{priceMinor:number;basePriceMinor?:number;startsAt:string;endsAt?:string;active:boolean;title?:string;description?:string;eligibilityMode?:"manual";assetReference?:string;createdAt?:string};deliveryPolicy?:CommerceDeliveryPolicy;features:string[];featured:boolean;publicationStatus:"draft"|"published"|"unpublished";seo:{title:string;description:string};version:number;synchronizedAt:string}>;
  commerceReservations:Array<{id:string;tenantId:TenantId;companyId:CompanyId;productId:string;orderId:string;quantity:number;status:"active"|"consumed"|"released"|"expired";expiresAt:string;createdAt:string}>;
  commerceOrders:Array<{id:string;publicId:string;tenantId:TenantId;companyId:CompanyId;channel:"WEB";status:"draft"|"pending"|"reserved"|"confirmed"|"to-acquire"|"received"|"preparing"|"ready"|"delivered"|"cancelled"|"expired";customer:{name:string;phone:string;email?:string;address?:string};fulfillment:"pickup"|"local-delivery"|"shipping";notes?:string;lines:Array<{productId:string;publicName:string;quantity:number;unitPriceMinor:number;taxMinor:number;totalMinor:number;deliverySnapshot?:CommerceDeliveryPolicy;priceConfirmedAt?:string}>;subtotalMinor:number;taxMinor:number;totalMinor:number;paymentStatus:"pending"|"authorized"|"paid"|"failed"|"cancelled"|"refunded";termsConfirmationRequired?:boolean;conditionsConfirmedAt?:string;idempotencyKey:string;createdAt:string;updatedAt:string}>;
  commercePaymentMethods:Array<{id:string;tenantId:TenantId;companyId:CompanyId;name:string;kind:"cash"|"bank-transfer"|"token"|"crypto"|"wallet"|"gateway";currency:string;instructions:string[];destinationLabel?:string;destinationValue?:string;requiresManualVerification:boolean;enabled:boolean;createdAt:string;updatedAt:string}>;
  commercePayments:Array<{id:string;tenantId:TenantId;companyId:CompanyId;orderId:string;methodId:string;amountMinor:number;currency:string;status:"pending"|"authorized"|"paid"|"rejected"|"cancelled"|"refunded";externalReference?:string;receiptReference?:string;providerId:string;providerEventId?:string;submittedAt:string;verifiedAt?:string;verifiedBy?:UserId;reconciledAt?:string;idempotencyKey:string}>;
  commerceOrderHistory:Array<{id:string;tenantId:TenantId;companyId:CompanyId;orderId:string;status:string;at:string;actorUserId?:UserId;note?:string}>;
  users: Array<{ id: UserId; email: string; passwordHash: string; salt: string; status: "active" | "disabled"; name?: string; sessionVersion?: number; lastAccessAt?: string; passwordChangedAt?: string; mustChangePassword?: boolean }>;
  memberships: Array<{ tenantId: TenantId; companyId: CompanyId; userId: UserId; capabilities: ActorContext["capabilities"]; status: "active" | "disabled"; roleId?: string; branchIds?: string[] }>;
  customers: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; name: string; phone?: string; email?: string; taxId?: string; address?: string; creditLimitMinor?: number; balanceMinor?: number; status?: "active" | "disabled"; normalizedName?: string }>;
  equipment: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; customerId: string; type: string; brand: string; model: string; serial?: string; physicalStatus: "received" | "delivered" }>;
  workOrders: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; equipmentId: string; status: "received" | "pending_diagnosis" | "pending_authorization" | "authorized" | "repairing" | "quality_control" | "completed" | "closed"; diagnosis: string; invoiceId?: string; technicianUserId?: UserId; authorizedAt?: string; qualityControlAt?: string }>;
  products: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; sku: string; barcode?: string; name: string; priceMinor: number; description?: string; category?: string; brand?: string; model?: string; costMinor?: number; taxRate?: number; taxIncluded?: boolean; unit?: string; minimumStock?: number; supplierId?: string; imageUrl?: string; status?: "active" | "disabled"; publishable?: boolean; visibility?: "visible" | "hidden"; commerceStatus?: "available" | "out-of-stock" | "discontinued"; publicPriceMinor?: number; mediaReference?: string }>;
  inventory: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; warehouseId: WarehouseId; productId: string; delta: number; kind: "purchase" | "opening" | "workshop" | "sale"; sourceId: string; occurredAt?: string; reason?: string; reference?: string; unitCostMinor?: number; userId?: UserId }>;
  suppliers: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; name: string; taxId?: string; phone?: string; email?: string; address?: string; status?: "active" | "disabled" }>;
  purchases: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; supplierId: string; status: "draft" | "ordered" | "partial" | "received" | "cancelled"; totalMinor: number; taxMinor?: number; paidMinor?: number; balanceMinor?: number; documentReference?: string; createdAt?: string; receivedAt?: string }>;
  quotes: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; customerId: string; status: "converted"; totalMinor: number; invoiceId: string }>;
  invoices: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; customerId: string; sourceType: "work_order" | "quote" | "pos"; sourceId: string; totalMinor: number; paidMinor: number; status: "paid"; createdAt?: string; customerType?: "consumer_final" | "fiscal_credit" | "government" | "special_regime" | string; subtotalMinor?: number; discountMinor?: number; taxableBaseMinor?: number; taxMinor?: number; taxMode?: "included" | "excluded" }>;
  payments: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; invoiceId: string; amountMinor: number; method: string; receivedMinor?: number; changeMinor?: number; metadata?: Record<string, string> }>;
  cashMovements: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; paymentId: string; amountMinor: number }>;
  history: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; entityType: string; entityId: string; event: string; at: string }>;
  events: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; name: string; aggregateId: string; occurredAt: string }>;
  fiscalConfigurations: FiscalTenantConfiguration[];
  electronicInvoices: ElectronicInvoiceRecord[];
  audit: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; userId: UserId; action: string; entityId: string; traceId: string; at: string }>;
  idempotency: Record<string, unknown>;
  businessSessions: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; userId: UserId; branchId?: string; issuedAt: string; expiresAt: string; lastSeenAt: string; status: "active" | "revoked" | "expired"; revokedAt?: string; revokedBy?: string; revokeReason?: string; supportGrantId?: string }>;
  cashSessions: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; branchId: string; userId: UserId; openedAt: string; openingMinor: number; status: "open" | "closed"; closedAt?: string; expectedMinor?: number; countedMinor?: number; differenceMinor?: number; supervisorUserId?: UserId }>;
  cashOperations: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; cashSessionId: string; userId: UserId; kind: "sale" | "entry" | "withdrawal" | "refund"; amountMinor: number; reason: string; at: string }>;
  supportGrants: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; reason: string; capabilities: ActorContext["capabilities"]; issuedAt: string; expiresAt: string; status: "active" | "revoked" | "expired"; issuedBy: string; revokedAt?: string; sensitiveActionsEnabled: boolean }>;
  backupRecords: Array<{ id: string; tenantId?: TenantId; companyId?: CompanyId; kind: "manual" | "scheduled"; status: "pending" | "completed" | "failed" | "not-configured"; createdAt: string; completedAt?: string; location?: string; sizeBytes?: number; checksum?: string; restoreTestStatus?: "not-tested" | "passed" | "failed" }>;
  migrationRecords: Array<{ version: string; appliedAt: string; status: "applied" | "pending" | "failed" }>;
  platformErrors: Array<{ id: string; tenantId?: TenantId; companyId?: CompanyId; service: string; message: string; at: string; resolved: boolean }>;
  expenses: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; supplierId?: string; category: string; description: string; amountMinor: number; taxMinor: number; occurredAt: string; documentReference?: string; paymentMethod?: string; createdBy: UserId; createdAt: string }>;
  reportRuns: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; userId: UserId; reportType: "sales" | "inventory" | "expenses" | "dgii-606" | "dgii-607" | "dgii-it1"; periodFrom: string; periodTo: string; resultCount: number; exported: boolean; createdAt: string }>;
  passwordTokens: Array<{ id: string; tenantId: TenantId; companyId: CompanyId; userId: UserId; tokenHash: string; purpose: "activation" | "recovery"; expiresAt: string; usedAt?: string; createdBy: UserId; createdAt: string }>;
  fiscalSequences: FiscalSequenceAuthorization[];
  canonicalFiscalDocuments: CanonicalFiscalDocument[];
  fiscalReconciliations: Array<{ id:string; tenantId:TenantId; companyId:CompanyId; periodFrom:string; periodTo:string; status:"balanced"|"differences"; differences:Array<{code:string;entityId:string;message:string}>; createdBy:UserId; createdAt:string }>;
}

export const emptyChapterTwoState = (): ChapterTwoState => ({ platformTenants: [], platformCompanies: [], platformDomains: [], companyExperienceReservations: [], branches: [], warehouses: [], roles: [], assistantMessages: [], assistantProposals: [], aiActivity: [], productMedia: [], mediaAcquisitionRequests:[], commerceProjections: [], commerceReservations: [], commerceOrders: [], commercePaymentMethods:[], commercePayments:[], commerceOrderHistory:[], users: [], memberships: [], customers: [], equipment: [], workOrders: [], products: [], inventory: [], suppliers: [], purchases: [], quotes: [], invoices: [], payments: [], cashMovements: [], history: [], events: [], fiscalConfigurations: [], electronicInvoices: [], audit: [], idempotency: {}, businessSessions: [], cashSessions: [], cashOperations: [], supportGrants: [], backupRecords: [], migrationRecords: [], platformErrors: [], expenses: [], reportRuns: [], passwordTokens: [], fiscalSequences: [], canonicalFiscalDocuments: [], fiscalReconciliations: [] });

export interface ChapterTwoStore {
  transact<T>(operation: (draft: ChapterTwoState) => T | Promise<T>): Promise<T>;
  snapshot(): Promise<ChapterTwoState>;
  snapshotForCompany?(tenantId: TenantId, companyId: CompanyId, buckets?: Array<keyof ChapterTwoState>): Promise<ChapterTwoState>;
  findCompanyBySlugOrHost?(value: string): Promise<ChapterTwoState["platformCompanies"][number] | undefined>;
}



