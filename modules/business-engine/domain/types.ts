export type TenantId = string & { readonly __brand: "TenantId" };
export type CompanyId = string & { readonly __brand: "CompanyId" };
export type WarehouseId = string & { readonly __brand: "WarehouseId" };
export type UserId = string & { readonly __brand: "UserId" };

export type Capability =
  | "dashboard.view" | "customer.read" | "customer.create" | "customer.update" | "customer.credit"
  | "inventory.read" | "inventory.receive" | "inventory.adjust" | "product.manage" | "product.cost.read"
  | "supplier.manage" | "purchase.receive" | "purchase.manage" | "quote.convert" | "invoice.read"
  | "invoice.void" | "invoice.return" | "pos.sell" | "pos.discount" | "pos.discount.override"
  | "cash.open" | "cash.operate" | "cash.close" | "cash.read" | "workorder.create"
  | "workshop.read" | "workshop.complete" | "workshop.supervise" | "audit.read" | "assistant.use"
  | "user.manage" | "role.manage" | "settings.manage" | "branch.select" | "backup.manage" | "support.diagnose"
  | "report.sales" | "report.inventory" | "report.expenses" | "report.fiscal.prepare" | "expense.read" | "expense.create"
  | "fiscal.profile.read" | "fiscal.profile.manage" | "fiscal.document.read" | "fiscal.document.prepare" | "fiscal.sequence.manage" | "fiscal.reconcile" | "fiscal.submit"
  | "commerce.read" | "commerce.publish" | "commerce.order.manage";

export interface ActorContext {
  tenantId: TenantId;
  companyId: CompanyId;
  userId: UserId;
  capabilities: readonly Capability[];
  traceId: string;
  sessionId?: string;
  branchId?: string;
  supportGrantId?: string;
}

export interface Company {
  id: CompanyId;
  tenantId: TenantId;
  tradeName: string;
  legalName: string;
  country: string;
  currency: string;
  timezone: string;
  status: "active" | "suspended";
}

export interface Customer {
  id: string;
  tenantId: TenantId;
  companyId: CompanyId;
  name: string;
  taxId?: string;
  phone?: string;
  email?: string;
  type: "person" | "business";
  status: "active" | "inactive";
  createdAt: string;
}

export interface Product {
  id: string;
  tenantId: TenantId;
  companyId: CompanyId;
  sku: string;
  name: string;
  unit: string;
  costMinor: number;
  priceMinor: number;
  taxCode: string;
  status: "active" | "inactive";
}

export interface InventoryMovement {
  id: string;
  tenantId: TenantId;
  companyId: CompanyId;
  warehouseId: WarehouseId;
  productId: string;
  kind: "purchase" | "sale" | "adjustment" | "workshop_consumption" | "reservation" | "release";
  quantityDelta: number;
  sourceType: string;
  sourceId: string;
  reason?: string;
  actorUserId: UserId;
  occurredAt: string;
}

export interface AuditEntry {
  id: string;
  tenantId: TenantId;
  companyId: CompanyId;
  actorUserId: UserId;
  action: string;
  entityType: string;
  entityId: string;
  after?: unknown;
  reason?: string;
  traceId: string;
  occurredAt: string;
}

export interface BusinessState {
  companies: Company[];
  customers: Customer[];
  products: Product[];
  inventoryMovements: InventoryMovement[];
  audit: AuditEntry[];
  idempotency: Record<string, unknown>;
}

