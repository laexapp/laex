export const PAYMENT_STATUSES = ["pending", "in_review", "verified", "rejected", "refunded", "cancelled"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type PaymentMethodProfile = { id:string; name:string; category:"token"|"crypto"|"wallet"|"bank"|"gateway"; currencies:readonly string[]; instructions:readonly string[]; destinationLabel:string; destinationValue:string; enabled:boolean; };
export type PaymentVerification = { id:string; customerName:string; email:string; phone:string; project:string; amount:number; currency:string; paidAt:string; methodId:string; transactionHash:string; receiptName:string; status:PaymentStatus; submittedAt:string; observations:readonly string[]; };
