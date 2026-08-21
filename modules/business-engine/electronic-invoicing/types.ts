import type { CompanyId, TenantId, UserId } from "../domain/types";

export type ElectronicFiscalDocumentType = "E31" | "E32" | "E33" | "E34" | "E41" | "E43" | "E44" | "E45" | "E46" | "E47";
export type ElectronicInvoiceStatus = "draft" | "pending-signature" | "signed" | "pending-submission" | "accepted" | "rejected" | "contingency";

export interface ElectronicInvoiceRecord {
  id: string;
  tenantId: TenantId;
  companyId: CompanyId;
  invoiceId: string;
  type: ElectronicFiscalDocumentType;
  status: ElectronicInvoiceStatus;
  eNcf: string | null;
  issuedAt: string;
  signedAt: string | null;
  submittedAt: string | null;
  dgiiStatus: string | null;
  acknowledgementId: string | null;
  originalElectronicInvoiceId: string | null;
  retryCount: number;
  idempotencyKey: string;
  contingencyReason: string | null;
  createdBy: UserId;
}

export interface FiscalTenantConfiguration {
  tenantId: TenantId;
  companyId: CompanyId;
  enabled: boolean;
  environment: "disabled" | "pre-certification" | "certification" | "production";
  rnc: string;
  obligationsCurrent: boolean;
  authorizedElectronicIssuer: boolean;
  softwareCertified: boolean;
  certificateReference: string | null;
  credentialReference: string | null;
  sequenceVaultReference: string | null;
  legalName?: string; tradeName?: string; fiscalAddress?: string; contactEmail?: string; contactPhone?: string;
  taxRegime?: "traditional" | "electronic" | "transition"; effectiveFrom?: string; enabledDocumentTypes?: ElectronicFiscalDocumentType[];
  itbisMode?: "included" | "excluded" | "mixed"; ruleVersion?: string;
}

export interface FiscalSequenceAuthorization { id:string;tenantId:TenantId;companyId:CompanyId;type:ElectronicFiscalDocumentType;prefix:"E";rangeStart:number;rangeEnd:number;nextNumber:number;authorizedReference:string;environment:"pre-certification"|"certification"|"production";status:"active"|"exhausted"|"disabled";createdAt:string;createdBy:UserId }
export interface CanonicalFiscalDocument { id:string;tenantId:TenantId;companyId:CompanyId;businessDocumentId:string;type:ElectronicFiscalDocumentType;schemaVersion:"1.0";ruleVersion:string;status:"draft"|"number-assigned"|"pending-signature"|"signed"|"pending-submission"|"accepted"|"rejected"|"contingency";eNcf:string|null;originalFiscalDocumentId:string|null;buyer:{name:string;rnc?:string};totals:{subtotalMinor:number;discountMinor:number;taxableBaseMinor:number;itbisMinor:number;totalMinor:number};sequenceId:string|null;integrityHash:string|null;xmlArtifact:string|null;dgiiResponseArtifact:string|null;createdAt:string;createdBy:UserId }

export interface ProviderResult {
  status: "signed" | "accepted" | "rejected" | "contingency";
  eNcf?: string;
  acknowledgementId?: string;
  dgiiStatus?: string;
  occurredAt: string;
  reason?: string;
}

export interface ElectronicInvoicingProvider {
  readonly provider: string;
  readonly version: string;
  sign(record: ElectronicInvoiceRecord, configuration: FiscalTenantConfiguration): Promise<ProviderResult>;
  submit(record: ElectronicInvoiceRecord, configuration: FiscalTenantConfiguration): Promise<ProviderResult>;
  queryStatus(record: ElectronicInvoiceRecord, configuration: FiscalTenantConfiguration): Promise<ProviderResult>;
  printableRepresentation(record: ElectronicInvoiceRecord): Promise<{ mimeType: "application/pdf" | "text/html"; content: Uint8Array | string }>;
}

export function classifyPosCustomerType(customerType: string): ElectronicFiscalDocumentType {
  if (customerType === "fiscal_credit") return "E31";
  if (customerType === "government") return "E45";
  if (customerType === "special_regime") return "E44";
  return "E32";
}
