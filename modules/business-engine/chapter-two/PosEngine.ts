import { randomUUID } from "node:crypto";
import { AccessDeniedError, BusinessInvariantError, CapabilityDeniedError } from "../domain/errors";
import type { ActorContext, WarehouseId } from "../domain/types";
import type { ChapterTwoStore } from "./types";
import { DisabledElectronicInvoicingProvider, ElectronicInvoicingService, classifyPosCustomerType } from "../electronic-invoicing";

export type PosCustomerType = "consumer_final" | "fiscal_credit" | "government" | "special_regime" | string;
export type PosPaymentMethod = "cash" | "card" | "transfer" | "digital_token" | "omd" | "omdb" | "usdt" | "bnb" | "crypto" | "web3" | string;
export interface PosPaymentInput { method: PosPaymentMethod; amountMinor: number; receivedMinor?: number; metadata?: Record<string, string> }
export interface PosSaleInput {
  customerId?: string;
  customerType: PosCustomerType;
  warehouseId: WarehouseId;
  lines: Array<{ productId: string; quantity: number }>;
  discountMinor: number;
  taxRate: number;
  taxMode: "included" | "excluded";
  payments: PosPaymentInput[];
}
export interface PosSaleResult { invoiceId: string; paymentIds: string[]; customerName: string; customerType: PosCustomerType; subtotalMinor: number; discountMinor: number; taxableBaseMinor: number; taxMinor: number; totalMinor: number; changeMinor: number; electronicInvoice: { id: string; type: string; status: "draft"; eNcf: null }; status: "paid" }

const forbiddenMetadata = /card.?number|full.?card|pan|cvv|cvc|pin|password|secret|private.?key|seed/i;

export class PosEngine {
  constructor(private readonly store: ChapterTwoStore, private readonly now: () => Date = () => new Date(), private readonly id: () => string = randomUUID) {}

  async confirmSale(actor: ActorContext, idempotencyKey: string, input: PosSaleInput): Promise<PosSaleResult> {
    if (!(actor.capabilities as readonly string[]).includes("pos.sell")) throw new CapabilityDeniedError("pos.sell");
    if (!idempotencyKey) throw new BusinessInvariantError("Idempotency key required");
    if (!input.lines.length) throw new BusinessInvariantError("Sale requires at least one product");
    return this.store.transact((state) => {
      const membership = state.memberships.find((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && item.userId === actor.userId && item.status === "active");
      if (!membership) throw new AccessDeniedError();
      const productiveCompany=state.platformCompanies.some(company=>company.id===actor.companyId);
      const cashSession=state.cashSessions.find(session=>session.companyId===actor.companyId&&session.userId===actor.userId&&session.status==="open");
      if(productiveCompany&&!cashSession)throw new BusinessInvariantError("An active cash session is required");
      const scopedKey = `${actor.tenantId}:${actor.companyId}:pos:${idempotencyKey}`;
      if (Object.hasOwn(state.idempotency, scopedKey)) return structuredClone(state.idempotency[scopedKey]) as PosSaleResult;
      const customer = input.customerId ? state.customers.find((item) => item.id === input.customerId && item.tenantId === actor.tenantId && item.companyId === actor.companyId) : undefined;
      if (input.customerId && !customer) throw new AccessDeniedError();
      let subtotalMinor = 0;
      for (const line of input.lines) {
        const product = state.products.find((item) => item.id === line.productId && item.tenantId === actor.tenantId && item.companyId === actor.companyId);
        if (!product) throw new AccessDeniedError();
        if (!Number.isInteger(line.quantity) || line.quantity <= 0) throw new BusinessInvariantError("Product quantity must be a positive integer");
        const available = state.inventory.filter((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && item.warehouseId === input.warehouseId && item.productId === product.id).reduce((sum, item) => sum + item.delta, 0);
        if (available < line.quantity) throw new BusinessInvariantError(`Insufficient inventory for ${product.sku}`);
        subtotalMinor += product.priceMinor * line.quantity;
      }
      if (input.discountMinor < 0 || input.discountMinor > subtotalMinor) throw new BusinessInvariantError("Invalid discount");
      if(productiveCompany&&input.discountMinor>0&&!(actor.capabilities as readonly string[]).includes("pos.discount"))throw new CapabilityDeniedError("pos.discount");
      if(productiveCompany&&input.discountMinor>subtotalMinor*.05&&!(actor.capabilities as readonly string[]).includes("pos.discount.override"))throw new CapabilityDeniedError("pos.discount.override");
      if (input.taxRate < 0 || input.taxRate > 1) throw new BusinessInvariantError("Invalid tax rate");
      const discountedMinor = subtotalMinor - input.discountMinor;
      const taxableBaseMinor = input.taxMode === "included" ? Math.round(discountedMinor / (1 + input.taxRate)) : discountedMinor;
      const taxMinor = input.taxMode === "included" ? discountedMinor - taxableBaseMinor : Math.round(taxableBaseMinor * input.taxRate);
      const totalMinor = input.taxMode === "included" ? discountedMinor : taxableBaseMinor + taxMinor;
      const appliedMinor = input.payments.reduce((sum, payment) => sum + payment.amountMinor, 0);
      if (!input.payments.length || appliedMinor !== totalMinor || input.payments.some((payment) => payment.amountMinor <= 0)) throw new BusinessInvariantError("Payments must cover the sale total exactly");
      const safePayments = input.payments.map((payment) => this.validatePayment(payment));
      const invoiceId = this.id(), consumerId = customer?.id ?? "consumer-final";
      state.invoices.push({ id: invoiceId, tenantId: actor.tenantId, companyId: actor.companyId, customerId: consumerId, sourceType: "pos", sourceId: invoiceId, subtotalMinor, discountMinor: input.discountMinor, taxableBaseMinor, taxMinor, taxMode: input.taxMode, customerType: input.customerType, totalMinor, paidMinor: totalMinor, status: "paid" });
      const electronicInvoice = new ElectronicInvoicingService(new DisabledElectronicInvoicingProvider(), this.id, this.now).prepareDraft({ tenantId: actor.tenantId, companyId: actor.companyId, invoiceId, type: classifyPosCustomerType(input.customerType), userId: actor.userId, idempotencyKey: scopedKey }); state.electronicInvoices.push(electronicInvoice);
      for (const line of input.lines) state.inventory.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, warehouseId: input.warehouseId, productId: line.productId, delta: -line.quantity, kind: "sale", sourceId: invoiceId });
      const paymentIds: string[] = []; let changeMinor = 0;
      for (const payment of safePayments) {
        const paymentId = this.id(); paymentIds.push(paymentId); changeMinor += payment.changeMinor;
        state.payments.push({ id: paymentId, tenantId: actor.tenantId, companyId: actor.companyId, invoiceId, amountMinor: payment.amountMinor, method: payment.method, receivedMinor: payment.receivedMinor, changeMinor: payment.changeMinor, metadata: payment.metadata });
        state.cashMovements.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, paymentId, amountMinor: payment.amountMinor });
      }
      if(cashSession)state.cashOperations.push({id:this.id(),tenantId:actor.tenantId,companyId:actor.companyId,cashSessionId:cashSession.id,userId:actor.userId,kind:"sale",amountMinor:totalMinor,reason:`POS ${invoiceId}`,at:this.now().toISOString()});
      for (const name of ["InvoiceIssued", "PaymentReceived", "InvoicePaid", "InventoryChanged"] as const) state.events.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, name, aggregateId: invoiceId, occurredAt: this.now().toISOString() });
      state.audit.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, userId: actor.userId, action: "pos.sale.confirmed", entityId: invoiceId, traceId: actor.traceId, at: this.now().toISOString() });
      const result: PosSaleResult = { invoiceId, paymentIds, customerName: customer?.name ?? "Consumidor final", customerType: input.customerType, subtotalMinor, discountMinor: input.discountMinor, taxableBaseMinor, taxMinor, totalMinor, changeMinor, electronicInvoice: { id: electronicInvoice.id, type: electronicInvoice.type, status: "draft", eNcf: null }, status: "paid" };
      state.idempotency[scopedKey] = structuredClone(result); return result;
    });
  }

  private validatePayment(payment: PosPaymentInput) {
    const metadata = payment.metadata ?? {};
    if (Object.keys(metadata).some((key) => forbiddenMetadata.test(key))) throw new BusinessInvariantError("Sensitive payment metadata is forbidden");
    if (payment.method === "cash") {
      const receivedMinor = payment.receivedMinor ?? payment.amountMinor;
      if (receivedMinor < payment.amountMinor) throw new BusinessInvariantError("Cash received is insufficient");
      return { ...payment, receivedMinor, changeMinor: receivedMinor - payment.amountMinor, metadata: {} };
    }
    if (payment.receivedMinor !== undefined) throw new BusinessInvariantError("Received cash is only valid for cash payments");
    if (payment.method === "card") {
      if (!["debit", "credit"].includes(metadata.cardType) || !/^\d{4}$/.test(metadata.last4 ?? "") || !metadata.authorizationReference) throw new BusinessInvariantError("Card type, last 4 digits and authorization are required");
      return { ...payment, receivedMinor: undefined, changeMinor: 0, metadata: { cardType: metadata.cardType, last4: metadata.last4, authorizationReference: metadata.authorizationReference, ...(metadata.processor ? { processor: metadata.processor } : {}) } };
    }
    if (payment.method === "transfer") {
      if (!metadata.channel || !metadata.reference || !metadata.date) throw new BusinessInvariantError("Transfer channel, reference and date are required");
      return { ...payment, receivedMinor: undefined, changeMinor: 0, metadata: { channel: metadata.channel, reference: metadata.reference, date: metadata.date, verificationStatus: metadata.verificationStatus ?? "pending" } };
    }
    return { ...payment, receivedMinor: undefined, changeMinor: 0, metadata: Object.fromEntries(Object.entries(metadata).filter(([key]) => !forbiddenMetadata.test(key))) };
  }
}
