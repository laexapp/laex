import type { PaymentVerification } from "../domain/types";
export type VerificationInput=Omit<PaymentVerification,"id"|"status"|"submittedAt"|"observations">;
export function createPendingVerification(input:VerificationInput):PaymentVerification { if(!input.transactionHash.trim()||!input.receiptName.trim())throw new Error("El Hash y el comprobante son obligatorios."); return {...input,id:crypto.randomUUID(),status:"pending",submittedAt:new Date().toISOString(),observations:[]}; }
