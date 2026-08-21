import type { OfficialAssetProvider } from '../../domain/ports';
import type { AssetSearchRequest, DownloadedOfficialAsset, OfficialAssetCandidate } from '../../domain/types';

export type EpsonCatalogEntry=Omit<OfficialAssetCandidate,'providerId'|'manufacturer'|'owner'|'discoveredAt'>;
export interface AuthorizedAssetDownloader { download(url:string):Promise<DownloadedOfficialAsset> }

const officialHosts=new Set(['epson.com','www.epson.com','support.epson.com','news.epson.com','download-center.epson.com','mediaserver.goepson.com','epsonpartnerportal.com','www.epsonpartnerportal.com']);

export class EpsonAssetProvider implements OfficialAssetProvider {
  readonly id='epson-official';
  readonly manufacturers=['epson'] as const;
  constructor(private readonly catalog:EpsonCatalogEntry[],private readonly downloader?:AuthorizedAssetDownloader){}

  async search(request:AssetSearchRequest){
    if(request.manufacturer.toLowerCase()!=='epson')return[];
    return this.catalog.filter(item=>item.model.toLowerCase()===request.model.toLowerCase()).map(item=>{
      this.assertOfficialUrl(item.sourcePageUrl);this.assertOfficialUrl(item.originalUrl);
      return{...item,providerId:this.id,manufacturer:'epson',owner:'Seiko Epson Corporation / Epson regional affiliate',discoveredAt:new Date().toISOString()};
    });
  }

  async acquire(candidate:OfficialAssetCandidate){
    this.assertOfficialUrl(candidate.originalUrl);
    if(candidate.access==='authorized-account')throw new Error('La Fase 1 no automatiza inicio de sesi?n en Epson Partner Portal. Use un conector autorizado futuro.');
    if(!this.downloader)throw new Error('No existe descargador autorizado configurado para Epson.');
    return this.downloader.download(candidate.originalUrl);
  }

  private assertOfficialUrl(value:string){
    const url=new URL(value);
    if(url.protocol!=='https:'||!officialHosts.has(url.hostname.toLowerCase()))throw new Error(`Fuente Epson no autorizada: ${url.hostname}`);
  }
}
