import { randomUUID } from "node:crypto";
import { BusinessInvariantError } from "../domain/errors";
import type { CompanyId, TenantId, UserId } from "../domain/types";
import type { ElectronicFiscalDocumentType, ElectronicInvoiceRecord, ElectronicInvoicingProvider, FiscalTenantConfiguration } from "./types";

const transitions = {
  draft: ["pending-signature"], "pending-signature": ["signed", "rejected", "contingency"], signed: ["pending-submission"], "pending-submission": ["accepted", "rejected", "contingency"], accepted: [], rejected: ["pending-signature"], contingency: ["pending-signature", "pending-submission"],
} as const;

export class ElectronicInvoicingService {
  constructor(private readonly provider: ElectronicInvoicingProvider, private readonly id: () => string = randomUUID, private readonly now: () => Date = () => new Date()) {}

  prepareDraft(input: { tenantId: TenantId; companyId: CompanyId; invoiceId: string; type: ElectronicFiscalDocumentType; userId: UserId; idempotencyKey: string; original?: ElectronicInvoiceRecord }): ElectronicInvoiceRecord {
    if ((input.type === "E33" || input.type === "E34") && !input.original) throw new BusinessInvariantError("Credit and debit notes require the original electronic invoice");
    if (input.original && (input.original.tenantId !== input.tenantId || input.original.companyId !== input.companyId)) throw new BusinessInvariantError("Original fiscal document belongs to another company");
    return { id: this.id(), tenantId: input.tenantId, companyId: input.companyId, invoiceId: input.invoiceId, type: input.type, status: "draft", eNcf: null, issuedAt: this.now().toISOString(), signedAt: null, submittedAt: null, dgiiStatus: null, acknowledgementId: null, originalElectronicInvoiceId: input.original?.id ?? null, retryCount: 0, idempotencyKey: input.idempotencyKey, contingencyReason: null, createdBy: input.userId };
  }

  async sign(record: ElectronicInvoiceRecord, configuration: FiscalTenantConfiguration) {
    this.assertReady(record, configuration); this.move(record, "pending-signature"); const result = await this.provider.sign(record, configuration); this.move(record, result.status); record.signedAt = result.status === "signed" ? result.occurredAt : null; record.contingencyReason = result.reason ?? null; return record;
  }

  async submit(record: ElectronicInvoiceRecord, configuration: FiscalTenantConfiguration) {
    this.assertReady(record, configuration); this.move(record, "pending-submission"); const result = await this.provider.submit(record, configuration); this.move(record, result.status); record.eNcf = result.eNcf ?? record.eNcf; record.acknowledgementId = result.acknowledgementId ?? null; record.dgiiStatus = result.dgiiStatus ?? result.status; record.submittedAt = result.occurredAt; record.contingencyReason = result.reason ?? null; return record;
  }

  registerRetry(record: ElectronicInvoiceRecord, idempotencyKey: string) { if (record.idempotencyKey !== idempotencyKey) throw new BusinessInvariantError("Fiscal retry must reuse the original idempotency key"); record.retryCount += 1; return record; }

  private assertReady(record: ElectronicInvoiceRecord, configuration: FiscalTenantConfiguration) {
    if (record.tenantId !== configuration.tenantId || record.companyId !== configuration.companyId) throw new BusinessInvariantError("Fiscal configuration belongs to another company");
    if (!configuration.enabled || configuration.environment === "disabled" || !configuration.rnc || !configuration.obligationsCurrent || !configuration.authorizedElectronicIssuer || !configuration.softwareCertified || !configuration.certificateReference || !configuration.credentialReference || !configuration.sequenceVaultReference) throw new BusinessInvariantError("Electronic invoicing is disabled until company authorization and certification are complete");
  }

  private move(record: ElectronicInvoiceRecord, next: ElectronicInvoiceRecord["status"]) { const allowed = transitions[record.status] as readonly string[]; if (!allowed.includes(next)) throw new BusinessInvariantError(`Invalid electronic invoice transition: ${record.status} -> ${next}`); record.status = next; }
}
