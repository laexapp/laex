export type LFModuleId="inicio"|"tienda"|"taller"|"promociones"|"ofertas"|"servicios"|"clientes"|"seguimiento"|"inversion"|"laboratorio";
export interface CatalogItem{id:string;brand:"Epson"|"Canon"|"HP"|"Brother";model:string;category:"Impresora"|"Multifuncional"|"Consumible"|"Accesorio";technology:string;useCase:string;features:string[];status:"Catálogo demostrativo"|"Por confirmar";sourceUrl:string}
export type RepairStage="Recepción"|"Diagnóstico"|"Reparación"|"Control de calidad"|"Listo para entrega"|"Entregado";
export interface ServiceOrder{id:string;customerId:string;equipment:string;serialMasked:string;stage:RepairStage;history:{stage:RepairStage;at:string;note:string}[]}
export type InvestmentStatus="Borrador"|"En revisión"|"Disponible"|"Financiado"|"Cerrado";
export interface InventoryParticipation{id:string;itemId:string;itemLabel:string;currency:"CLP";requiredAmount:number;offeredPercentage:number;status:InvestmentStatus;disclosures:string[];history:{at:string;action:string;actorRole:"Administrador"|"Revisor"}[]}
export interface ApprovalRequest{id:string;participationId:string;action:"Publicar"|"Liberar capital"|"Registrar rendimiento"|"Cerrar";status:"Pendiente"|"Aprobado"|"Rechazado";requestedBy:string;reviewedBy?:string;reviewedAt?:string;reason?:string}
export interface LabIdea{id:string;title:string;problem:string;hypothesis:string;status:"Documentación"|"Evaluación"|"Prototipo"|"Aprobada"|"Archivada";owners:("CEO"|"Arquitecta"|"Ingeniero")[];decisionLog:{at:string;decision:string}[]}
