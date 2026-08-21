import { randomUUID } from "node:crypto";
import { AccessDeniedError, BusinessInvariantError, CapabilityDeniedError } from "../domain/errors";
import type { ActorContext, AuditEntry, BusinessState, Capability, Customer, InventoryMovement, WarehouseId } from "../domain/types";

export interface BusinessStateStore {
  transact<T>(operation: (draft: BusinessState) => T | Promise<T>): Promise<T>;
  snapshot(): Promise<BusinessState>;
}

export class BusinessEngine {
  constructor(private readonly store: BusinessStateStore, private readonly now: () => Date = () => new Date(), private readonly id: () => string = randomUUID) {}

  async findOrCreateCustomer(actor: ActorContext, idempotencyKey: string, input: Pick<Customer, "name" | "taxId" | "phone" | "email" | "type">): Promise<Customer> {
    this.require(actor, "customer.create");
    return this.execute(actor, idempotencyKey, async (draft) => {
      this.requireCompany(draft, actor);
      const phone = input.phone?.replace(/\D/g, "");
      const existing = draft.customers.find((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && ((phone && item.phone?.replace(/\D/g, "") === phone) || (input.taxId && item.taxId === input.taxId)));
      if (existing) return existing;
      const customer: Customer = { ...input, id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, status: "active", createdAt: this.now().toISOString() };
      draft.customers.push(customer);
      this.audit(draft, actor, "customer.created", "customer", customer.id, customer);
      return customer;
    });
  }

  async receiveInventory(actor: ActorContext, idempotencyKey: string, input: { warehouseId: WarehouseId; productId: string; quantity: number; sourceType: string; sourceId: string; reason?: string }): Promise<InventoryMovement> {
    this.require(actor, "inventory.receive");
    if (!Number.isFinite(input.quantity) || input.quantity <= 0) throw new BusinessInvariantError("Received quantity must be positive");
    return this.execute(actor, idempotencyKey, async (draft) => {
      this.requireCompany(draft, actor);
      const product = draft.products.find((item) => item.id === input.productId && item.tenantId === actor.tenantId && item.companyId === actor.companyId);
      if (!product) throw new AccessDeniedError();
      const movement: InventoryMovement = { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, warehouseId: input.warehouseId, productId: product.id, kind: "purchase", quantityDelta: input.quantity, sourceType: input.sourceType, sourceId: input.sourceId, reason: input.reason, actorUserId: actor.userId, occurredAt: this.now().toISOString() };
      draft.inventoryMovements.push(movement);
      this.audit(draft, actor, "inventory.received", "inventory_movement", movement.id, movement, input.reason);
      return movement;
    });
  }

  async inventoryBalance(actor: ActorContext, warehouseId: WarehouseId, productId: string): Promise<number> {
    this.require(actor, "inventory.read");
    const state = await this.store.snapshot(); this.requireCompany(state, actor);
    if (!state.products.some((item) => item.id === productId && item.tenantId === actor.tenantId && item.companyId === actor.companyId)) throw new AccessDeniedError();
    return state.inventoryMovements.filter((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && item.warehouseId === warehouseId && item.productId === productId).reduce((total, item) => total + item.quantityDelta, 0);
  }

  async listAudit(actor: ActorContext): Promise<AuditEntry[]> {
    this.require(actor, "audit.read"); const state = await this.store.snapshot(); this.requireCompany(state, actor);
    return state.audit.filter((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId);
  }

  private async execute<T>(actor: ActorContext, key: string, operation: (draft: BusinessState) => Promise<T>): Promise<T> {
    if (!key.trim()) throw new BusinessInvariantError("Idempotency key is required");
    const scopedKey = `${actor.tenantId}:${actor.companyId}:${key}`;
    return this.store.transact(async (draft) => {
      if (Object.hasOwn(draft.idempotency, scopedKey)) return structuredClone(draft.idempotency[scopedKey]) as T;
      const result = await operation(draft); draft.idempotency[scopedKey] = structuredClone(result); return result;
    });
  }

  private require(actor: ActorContext, capability: Capability) { if (!actor.capabilities.includes(capability)) throw new CapabilityDeniedError(capability); }
  private requireCompany(state: BusinessState, actor: ActorContext) { if (!state.companies.some((item) => item.id === actor.companyId && item.tenantId === actor.tenantId && item.status === "active")) throw new AccessDeniedError(); }
  private audit(state: BusinessState, actor: ActorContext, action: string, entityType: string, entityId: string, after?: unknown, reason?: string) { state.audit.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, actorUserId: actor.userId, action, entityType, entityId, after, reason, traceId: actor.traceId, occurredAt: this.now().toISOString() }); }
}
