import type { OfficialAssetProvider } from '../../domain/ports';
import type { AssetSearchRequest, OfficialAssetCandidate } from '../../domain/types';

const normalized=(value:string)=>decodeURIComponent(value).toLowerCase().replaceAll(/[^a-z0-9]/g,'');

/** Prevents generic Epson logos or campaign art from becoming product assets. */
export class StrictEpsonPublicConnector implements OfficialAssetProvider {
  readonly id:string;readonly manufacturers:readonly string[];
  constructor(private readonly connector:OfficialAssetProvider){this.id=connector.id;this.manufacturers=connector.manufacturers;}
  async search(request:AssetSearchRequest){const model=normalized(request.model);const results=await this.connector.search(request);return results.filter(candidate=>normalized(candidate.originalUrl).includes(model));}
  async acquire(candidate:OfficialAssetCandidate){return this.connector.acquire(candidate);}
}
