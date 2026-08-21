import type { OfficialAssetProvider } from "../../domain/ports";
import type { AssetSearchRequest, DownloadedOfficialAsset, OfficialAssetCandidate } from "../../domain/types";

export interface ManufacturerPartnerTransport {
  search(request:AssetSearchRequest):Promise<OfficialAssetCandidate[]>;
  download(candidate:OfficialAssetCandidate):Promise<DownloadedOfficialAsset>;
}

export interface ManufacturerPartnerConfig {
  id:string;
  manufacturer:string;
  enabled:boolean;
  authorizationReference?:string;
  allowedHosts:readonly string[];
}

const normalize=(value:string)=>value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"");

/** Independent adapter boundary for an authorized manufacturer/partner media library. */
export class ManufacturerPartnerConnector implements OfficialAssetProvider {
  readonly id:string;readonly manufacturers:readonly string[];private readonly allowed:Set<string>;
  constructor(private readonly config:ManufacturerPartnerConfig,private readonly transport:ManufacturerPartnerTransport){this.id=config.id;this.manufacturers=[config.manufacturer.toLowerCase()];this.allowed=new Set(config.allowedHosts.map(host=>host.toLowerCase()))}
  async search(request:AssetSearchRequest){
    if(!this.config.enabled||normalize(request.manufacturer)!==normalize(this.config.manufacturer))return[];
    if(!this.config.authorizationReference)throw new Error(`Conector ${this.id} habilitado sin referencia de autorización.`);
    const results=await this.transport.search(request);return results.filter(candidate=>this.exact(candidate,request)).map(candidate=>({...candidate,providerId:this.id,manufacturer:this.config.manufacturer,access:"authorized-account" as const,metadata:{...candidate.metadata,authorizationReference:this.config.authorizationReference!}}));
  }
  async acquire(candidate:OfficialAssetCandidate){
    if(!this.config.enabled||!this.config.authorizationReference)throw new Error(`Conector ${this.id} no autorizado.`);
    if(candidate.providerId!==this.id||candidate.access!=="authorized-account"||!this.official(candidate.originalUrl)||!this.official(candidate.sourcePageUrl))throw new Error("El activo no pertenece al repositorio autorizado configurado.");
    if(!["licensed","manufacturer-authorized"].includes(candidate.license.legalStatus)||candidate.license.allowsCommercialUse!==true||candidate.license.allowsModification!==true)throw new Error("El activo no posee permisos comerciales y de transformación suficientes.");
    return this.transport.download(candidate);
  }
  private exact(candidate:OfficialAssetCandidate,request:AssetSearchRequest){return normalize(candidate.manufacturer)===normalize(this.config.manufacturer)&&normalize(candidate.model)===normalize(request.model)&&candidate.access!=="public"&&this.official(candidate.sourcePageUrl)&&this.official(candidate.originalUrl)}
  private official(value:string){try{const url=new URL(value);return url.protocol==="https:"&&this.allowed.has(url.hostname.toLowerCase())}catch{return false}}
}

export const priorityManufacturerConnectorConfigs=(enabled:Partial<Record<"epson"|"canon"|"hp"|"brother",{authorizationReference:string;allowedHosts:string[]}>>)=>
  (["epson","canon","hp","brother"] as const).map(manufacturer=>({id:`${manufacturer}-partner-authorized`,manufacturer,enabled:Boolean(enabled[manufacturer]),authorizationReference:enabled[manufacturer]?.authorizationReference,allowedHosts:enabled[manufacturer]?.allowedHosts??[]} satisfies ManufacturerPartnerConfig));
