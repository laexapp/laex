import { BusinessInvariantError } from "../domain/errors";
import type { ElectronicInvoicingProvider } from "./types";

export class DisabledElectronicInvoicingProvider implements ElectronicInvoicingProvider {
  readonly provider = "disabled-dgii"; readonly version = "chapter-2";
  async sign(): Promise<never> { throw new BusinessInvariantError("Real DGII signing is disabled"); }
  async submit(): Promise<never> { throw new BusinessInvariantError("Real DGII submission is disabled"); }
  async queryStatus(): Promise<never> { throw new BusinessInvariantError("Real DGII status queries are disabled"); }
  async printableRepresentation(): Promise<never> { throw new BusinessInvariantError("Official e-CF representation is disabled"); }
}
