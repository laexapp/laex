import { randomUUID } from "node:crypto";
import { AccessDeniedError, CapabilityDeniedError } from "../domain/errors";
import type { ActorContext } from "../domain/types";
import type { ChapterTwoStore } from "./types";

export class ReceptionEngine {
  constructor(private readonly store: ChapterTwoStore, private readonly now: () => Date = () => new Date(), private readonly id: () => string = randomUUID) {}
  async receive(actor: ActorContext, key: string, input: { customerName: string; brand: string; model: string; phone?:string; address?:string; problem?:string }) {
    if (!(actor.capabilities as readonly string[]).includes("workorder.create")) throw new CapabilityDeniedError("workorder.create");
    return this.store.transact((state) => {
      const membership = state.memberships.find((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && item.userId === actor.userId && item.status === "active");
      if (!membership) throw new AccessDeniedError();
      const scoped = `${actor.tenantId}:${actor.companyId}:${key}`;
      if (Object.hasOwn(state.idempotency, scoped)) return structuredClone(state.idempotency[scoped]);
      const normalized=(value:string)=>value.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().trim();const customer = state.customers.find((item) => item.tenantId === actor.tenantId && item.companyId === actor.companyId && normalized(item.name) === normalized(input.customerName) && (!input.phone||!item.phone||item.phone.replace(/\D/g,"")===input.phone.replace(/\D/g,""))) ?? { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, name: input.customerName,phone:input.phone,address:input.address };
      if(state.customers.includes(customer)){if(input.phone&&!customer.phone)customer.phone=input.phone;if(input.address&&!customer.address)customer.address=input.address}
      if (!state.customers.includes(customer)) state.customers.push(customer);
      const equipment = { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, customerId: customer.id, type: "printer", brand: input.brand, model: input.model, physicalStatus: "received" as const };
      const workOrder = { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, equipmentId: equipment.id, status: "pending_diagnosis" as const, diagnosis: input.problem?`Síntoma informado: ${input.problem}`:"Pendiente de diagnóstico" };
      state.equipment.push(equipment); state.workOrders.push(workOrder);
      const at = this.now().toISOString();
      state.events.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, name: "EquipmentReceived", aggregateId: equipment.id, occurredAt: at }, { id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, name: "WorkOrderCreated", aggregateId: workOrder.id, occurredAt: at });
      state.history.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, entityType: "equipment", entityId: equipment.id, event: "received", at });
      state.audit.push({ id: this.id(), tenantId: actor.tenantId, companyId: actor.companyId, userId: actor.userId, action: "reception.created", entityId: workOrder.id, traceId: actor.traceId, at });
      const result = { customerId: customer.id, equipmentId: equipment.id, workOrderId: workOrder.id, status: workOrder.status };
      state.idempotency[scoped] = structuredClone(result); return result;
    });
  }
}
