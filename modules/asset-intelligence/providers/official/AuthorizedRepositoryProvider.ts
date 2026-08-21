import type { OfficialAssetProvider } from '../../domain/ports';
import type { AssetSearchRequest, DownloadedOfficialAsset, OfficialAssetCandidate } from '../../domain/types';

export class AuthorizedRepositoryProvider implements OfficialAssetProvider {
  constructor(
    readonly id:string,
    readonly manufacturers:readonly string[],
    private readonly candidates:OfficialAssetCandidate[],
    private readonly downloader:(candidate:OfficialAssetCandidate)=>Promise<DownloadedOfficialAsset>,
  ){}
  async search(request:AssetSearchRequest){return this.candidates.filter(candidate=>candidate.manufacturer.toLowerCase()===request.manufacturer.toLowerCase()&&candidate.model.toLowerCase()===request.model.toLowerCase());}
  async acquire(candidate:OfficialAssetCandidate){
    if(candidate.providerId!==this.id)throw new Error('El candidato pertenece a otro proveedor.');
    if(candidate.license.legalStatus==='prohibited')throw new Error('La adquisici?n est? jur?dicamente prohibida.');
    return this.downloader(candidate);
  }
}
