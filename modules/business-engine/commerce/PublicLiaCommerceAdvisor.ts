import type { CommerceCatalogSearch } from "./CommerceCatalogSearch";
import type { CompanyId,TenantId } from "../domain/types";
export class PublicLiaCommerceAdvisor{
 constructor(private readonly catalog:CommerceCatalogSearch){}
 async ask(scope:{tenantId:TenantId;companyId:CompanyId},message:string){
  const trimmed=message.trim(),listIntent=/que impresoras tienen disponibles|qué impresoras tienen disponibles|que tienen disponible/i.test(trimmed);
  const model=trimmed.match(/\b[A-Za-z]{1,8}[- ]?\d{3,6}\b/)?.[0];
  const query=model??trimmed.replace(/[¿?]/g,"").replace(/^(lia|lía)[,:]?\s*/i,"").replace(/^(tienen|tiene|busco|necesito|quiero|cuanto cuesta|cuánto cuesta|muestrame|muéstrame|esta disponible|está disponible)(?:\s+|$)/i,"").replace(/^(el|la|los|las|un|una)\s+/i,"").trim();
  if(!listIntent&&!query)return{agent:"LIA" as const,tool:"commerce.catalog.search" as const,grounded:true,answer:"Indícame el nombre o modelo del producto para consultar su precio y disponibilidad reales.",products:[]};
  const catalog=await this.catalog.search(scope,{query:listIntent?undefined:query,pageSize:6}),products=catalog.products;
  if(!products.length)return{agent:"LIA" as const,tool:"commerce.catalog.search" as const,grounded:true,answer:"No encontré ese artículo entre los productos publicados actualmente por LF-PRINTER. No puedo confirmar precio, disponibilidad o compatibilidad sin una coincidencia real en Commerce.",products:[]};
  const first=products[0],price=new Intl.NumberFormat("es-DO",{style:"currency",currency:"DOP"}).format(first.priceMinor/100),summary=products.length===1?`Encontré ${first.name} a ${price}. Disponibilidad: ${first.availability}.`:`Encontré ${products.length} productos publicados. La primera coincidencia es ${first.name} a ${price}, con disponibilidad: ${first.availability}.`;
  return{agent:"LIA" as const,tool:"commerce.catalog.search" as const,grounded:true,answer:summary,products};
 }
}
