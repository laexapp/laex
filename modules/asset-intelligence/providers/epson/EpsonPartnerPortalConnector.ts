import type { OfficialAssetProvider } from '../../domain/ports';
import type { AssetSearchRequest, DownloadedOfficialAsset, OfficialAssetCandidate } from '../../domain/types';

export interface EpsonPartnerPortalTransport { search(request:AssetSearchRequest,accessToken:string):Promise<OfficialAssetCandidate[]>; acquire(candidate:OfficialAssetCandidate,accessToken:string):Promise<DownloadedOfficialAsset> }
export interface EpsonPartnerPortalCredentials { accessToken:string; authorizationReference:string; enabled:boolean }

export class EpsonPartnerPortalConnector implements OfficialAssetProvider {
  readonly id='epson-partner-portal';readonly manufacturers=['epson'] as const;
  constructor(private readonly credentials:EpsonPartnerPortalCredentials,private readonly transport:EpsonPartnerPortalTransport){}
  async search(request:AssetSearchRequest){this.assertEnabled();return this.transport.search(request,this.credentials.accessToken);}
  async acquire(candidate:OfficialAssetCandidate){this.assertEnabled();if(candidate.access!=='authorized-account')throw new Error('El recurso no pertenece al flujo autenticado Epson.');return this.transport.acquire(candidate,this.credentials.accessToken);}
  private assertEnabled(){if(!this.credentials.enabled||!this.credentials.accessToken||!this.credentials.authorizationReference)throw new Error('Epson Partner Portal permanece deshabilitado hasta recibir acceso y autorización formal.');}
}
