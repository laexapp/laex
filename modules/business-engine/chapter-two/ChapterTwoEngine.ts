import { randomUUID } from "node:crypto";
import { AccessDeniedError, BusinessInvariantError, CapabilityDeniedError } from "../domain/errors";
import type { ActorContext, WarehouseId } from "../domain/types";
import type { ChapterTwoState, ChapterTwoStore } from "./types";

type Line = { productId: string; quantity: number };
type ChapterCapability = "workshop.complete" | "purchase.receive" | "quote.convert" | "audit.read";

export class ChapterTwoEngine {
  constructor(private readonly store: ChapterTwoStore, private readonly now: () => Date = () => new Date(), private readonly id: () => string = randomUUID) {}

  async completeWorkshopJourney(actor: ActorContext, key: string, input: { customer: { name: string; phone?: string }; equipment: { type: string; brand: string; model: string; serial?: string }; diagnosis: string; warehouseId: WarehouseId; parts: Line[]; serviceTotalMinor: number; paymentMethod: string }) {
    this.require(actor, "workshop.complete");
    if (!input.parts.length && input.serviceTotalMinor <= 0) throw new BusinessInvariantError("Parts or services are required before invoicing");
    return this.execute(actor, key, (state) => {
      const customer = state.customers.find((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && input.customer.phone && item.phone === input.customer.phone) ?? this.push(state.customers, { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, ...input.customer });
      const equipment = state.equipment.find((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && input.equipment.serial && item.serial === input.equipment.serial) ?? this.push(state.equipment, { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, customerId: customer.id, ...input.equipment, physicalStatus: "received" as const });
      const workOrder = this.push(state.workOrders, { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, equipmentId: equipment.id, status: "completed" as const, diagnosis: input.diagnosis });
      let partsTotal = 0;
      for (const line of input.parts) { const product = this.product(state, actor, line.productId); if (line.quantity <= 0 || this.balance(state, actor, input.warehouseId, product.id) < line.quantity) throw new BusinessInvariantError(`Insufficient inventory for ${product.sku}`); partsTotal += product.priceMinor * line.quantity; state.inventory.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, warehouseId: input.warehouseId, productId: product.id, delta: -line.quantity, kind: "workshop", sourceId: workOrder.id }); }
      const totalMinor = partsTotal + input.serviceTotalMinor;
      const invoice = this.push(state.invoices, { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, customerId: customer.id, sourceType: "work_order" as const, sourceId: workOrder.id, totalMinor, paidMinor: totalMinor, status: "paid" as const });
      const payment = this.push(state.payments, { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, invoiceId: invoice.id, amountMinor: totalMinor, method: input.paymentMethod });
      state.cashMovements.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, paymentId: payment.id, amountMinor: totalMinor });
      workOrder.invoiceId = invoice.id; workOrder.status = "closed"; equipment.physicalStatus = "delivered";
      for (const [event, id] of [["EquipmentReceived", equipment.id], ["WorkOrderCreated", workOrder.id], ["WorkOrderCompleted", workOrder.id], ["InvoiceIssued", invoice.id], ["PaymentReceived", payment.id], ["EquipmentDelivered", equipment.id]] as const) this.event(state, actor, event, id);
      state.history.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, entityType: "equipment", entityId: equipment.id, event: "delivered", at: this.now().toISOString() }); this.audit(state, actor, "workshop.journey.completed", workOrder.id);
      return { customerId: customer.id, equipmentId: equipment.id, workOrderId: workOrder.id, invoiceId: invoice.id, paymentId: payment.id, totalMinor, status: "closed" as const };
    });
  }

  async receivePurchase(actor: ActorContext, key: string, input: { supplierName: string; warehouseId: WarehouseId; lines: Array<Line & { unitCostMinor: number }> }) {
    this.require(actor, "purchase.receive");
    return this.execute(actor, key, (state) => {
      if (!input.lines.length) throw new BusinessInvariantError("Purchase requires lines");
      const supplier = state.suppliers.find((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && item.name === input.supplierName) ?? this.push(state.suppliers, { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, name: input.supplierName });
      let totalMinor = 0; const purchaseId = this.id();
      for (const line of input.lines) { this.product(state, actor, line.productId); if (line.quantity <= 0) throw new BusinessInvariantError("Purchase quantity must be positive"); totalMinor += line.quantity * line.unitCostMinor; state.inventory.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, warehouseId: input.warehouseId, productId: line.productId, delta: line.quantity, kind: "purchase", sourceId: purchaseId }); }
      state.purchases.push({ id: purchaseId, tenantId: actor.tenantId, companyId: actor.companyId, supplierId: supplier.id, status: "received", totalMinor }); this.event(state, actor, "PurchaseReceived", purchaseId); this.event(state, actor, "InventoryChanged", purchaseId); this.audit(state, actor, "purchase.received", purchaseId);
      return { purchaseId, supplierId: supplier.id, totalMinor, status: "received" as const };
    });
  }

  async convertQuoteAndPay(actor: ActorContext, key: string, input: { customerId: string; lines: Line[]; paymentMethod: string }) {
    this.require(actor, "quote.convert");
    return this.execute(actor, key, (state) => {
      const customer = state.customers.find((item) => item.id === input.customerId && item.tenantId === actor.tenantId && item.companyId === actor.companyId); if (!customer) throw new AccessDeniedError();
      let totalMinor = 0; for (const line of input.lines) { const product = this.product(state, actor, line.productId); if (line.quantity <= 0) throw new BusinessInvariantError("Quote quantity must be positive"); totalMinor += product.priceMinor * line.quantity; }
      const quoteId = this.id(), invoiceId = this.id(); state.quotes.push({ id: quoteId, tenantId: actor.tenantId, companyId: actor.companyId, customerId: customer.id, status: "converted", totalMinor, invoiceId }); state.invoices.push({ id: invoiceId, tenantId: actor.tenantId, companyId: actor.companyId, customerId: customer.id, sourceType: "quote", sourceId: quoteId, totalMinor, paidMinor: totalMinor, status: "paid" });
      const payment = this.push(state.payments, { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, invoiceId, amountMinor: totalMinor, method: input.paymentMethod }); state.cashMovements.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, paymentId: payment.id, amountMinor: totalMinor });
      this.event(state, actor, "QuoteAccepted", quoteId); this.event(state, actor, "InvoiceIssued", invoiceId); this.event(state, actor, "InvoicePaid", invoiceId); this.audit(state, actor, "quote.converted_and_paid", quoteId);
      return { quoteId, invoiceId, paymentId: payment.id, totalMinor, status: "paid" as const };
    });
  }

  async snapshot(actor: ActorContext) { if(!(actor.capabilities as readonly string[]).some(c=>c==="audit.read"||c==="dashboard.view"||c==="pos.sell"))throw new CapabilityDeniedError("dashboard.view"); const state = await this.store.snapshot(); const own = <T extends { tenantId: string; companyId: string }>(items: T[]) => items.filter((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId); const can=(capability:string)=>(actor.capabilities as readonly string[]).includes(capability); const products=own(state.products).map(p=>can("product.cost.read")?p:({...p,costMinor:undefined})),workshop=can("workshop.read")||can("workorder.create")||can("workshop.complete"),financial=can("invoice.read")||can("pos.sell")||can("quote.convert")||can("workshop.complete"); return { customers: can("customer.read")||can("customer.create")?own(state.customers):[], equipment: workshop?own(state.equipment):[], workOrders: workshop?own(state.workOrders):[], products: can("inventory.read")||can("pos.sell")?products:[], inventory: can("inventory.read")||can("pos.sell")?own(state.inventory):[], suppliers: can("supplier.manage")||can("purchase.receive")?own(state.suppliers):[], purchases: can("purchase.manage")||can("purchase.receive")?own(state.purchases):[], quotes: can("quote.convert")?own(state.quotes):[], invoices: financial?own(state.invoices):[], payments: financial||can("cash.read")?own(state.payments):[], cashMovements: financial||can("cash.read")?own(state.cashMovements):[], history: can("audit.read")||workshop?own(state.history):[], events: can("audit.read")?own(state.events):[], audit: can("audit.read")?own(state.audit):[] }; }

  private async execute<T>(actor: ActorContext, key: string, operation: (state: ChapterTwoState) => T): Promise<T> { if (!key) throw new BusinessInvariantError("Idempotency key required"); const scoped = `${actor.tenantId}:${actor.companyId}:${key}`; return this.store.transact((state) => { const membership = state.memberships.find((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && item.userId === actor.userId && item.status === "active"); if (!membership) throw new AccessDeniedError(); if (Object.hasOwn(state.idempotency, scoped)) return structuredClone(state.idempotency[scoped]) as T; const result = operation(state); state.idempotency[scoped] = structuredClone(result); return result; }); }
  private require(actor: ActorContext, capability: ChapterCapability) { if (!(actor.capabilities as readonly string[]).includes(capability)) throw new CapabilityDeniedError(capability); }
  private product(state: ChapterTwoState, actor: ActorContext, id: string) { const found = state.products.find((item) => item.id === id && item.tenantId === actor.tenantId && item.companyId === actor.companyId); if (!found) throw new AccessDeniedError(); return found; }
  private balance(state: ChapterTwoState, actor: ActorContext, warehouseId: WarehouseId, productId: string) { return state.inventory.filter((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && item.warehouseId === warehouseId && item.productId === productId).reduce((sum, item) => sum + item.delta, 0); }
  private push<T>(target: T[], value: T) { target.push(value); return value; }
  private event(state: ChapterTwoState, actor: ActorContext, name: string, aggregateId: string) { state.events.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, name, aggregateId, occurredAt: this.now().toISOString() }); }
  private audit(state: ChapterTwoState, actor: ActorContext, action: string, entityId: string) { state.audit.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, userId: actor.userId, action, entityId, traceId: actor.traceId, at: this.now().toISOString() }); }
}
