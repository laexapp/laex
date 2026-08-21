import type { OfficialAssetProvider } from '../../domain/ports';
import type { AssetDimensions, AssetLicense, AssetSearchRequest, DownloadedOfficialAsset, OfficialAssetCandidate } from '../../domain/types';

export interface EpsonPublicCatalogPage { model:string; url:string }
export interface EpsonPublicTransport {
  getText(url:string):Promise<{body:string;finalUrl:string}>;
  inspectImage(url:string):Promise<{finalUrl:string;contentType:string;fileName:string;dimensions:AssetDimensions}>;
  downloadImage(url:string):Promise<DownloadedOfficialAsset>;
}

const officialHosts=new Set(['epson.com','www.epson.com','support.epson.com','news.epson.com','download-center.epson.com','mediaserver.goepson.com','files.support.epson.com']);
const normalizeModel=(value:string)=>value.trim().toLowerCase().replaceAll(/[^a-z0-9]/g,'');
const officialPublicLicense:AssetLicense={name:'Epson public official resource',summary:'Fuente pública oficial. Uso comercial y modificación sujetos a revisión y autorización de Epson.',legalStatus:'permission-required',allowsCommercialUse:null,allowsModification:null,requiresWrittenAuthorization:true};

export class EpsonPublicConnector implements OfficialAssetProvider {
  readonly id='epson-public-official';
  readonly manufacturers=['epson'] as const;
  constructor(private readonly pages:readonly EpsonPublicCatalogPage[],private readonly transport:EpsonPublicTransport,private readonly definitiveMinimum=2000){}

  async search(request:AssetSearchRequest){
    if(request.manufacturer.toLowerCase()!=='epson')return[];
    const pages=this.pages.filter(page=>normalizeModel(page.model)===normalizeModel(request.model));
    const candidates=(await Promise.all(pages.map(page=>this.inspectPage(page,request)))).flat();
    return candidates.sort((a,b)=>Math.max(b.dimensions?.width??0,b.dimensions?.height??0)-Math.max(a.dimensions?.width??0,a.dimensions?.height??0));
  }

  async acquire(candidate:OfficialAssetCandidate){this.assertOfficial(candidate.sourcePageUrl);this.assertOfficial(candidate.originalUrl);return this.transport.downloadImage(candidate.originalUrl);}

  private async inspectPage(page:EpsonPublicCatalogPage,request:AssetSearchRequest){
    this.assertOfficial(page.url);const document=await this.transport.getText(page.url);this.assertOfficial(document.finalUrl);
    const urls=this.extractImageUrls(document.body,document.finalUrl);
    const inspected=await Promise.all(urls.map(async url=>{try{const image=await this.transport.inspectImage(url);this.assertOfficial(image.finalUrl);return image;}catch{return null;}}));
    return inspected.filter((image):image is NonNullable<typeof image>=>Boolean(image)).map((image,index):OfficialAssetCandidate=>{
      const longest=Math.max(image.dimensions.width,image.dimensions.height),temporary=longest<this.definitiveMinimum;
      return{id:`epson-public-${normalizeModel(page.model)}-${index+1}`,providerId:this.id,manufacturer:'epson',model:page.model,assetKind:request.assetKind,owner:'Seiko Epson Corporation / Epson regional affiliate',sourceKind:'manufacturer-product-page',sourcePageUrl:document.finalUrl,originalUrl:image.finalUrl,format:image.contentType,dimensions:image.dimensions,license:officialPublicLicense,access:'public',discoveredAt:new Date().toISOString(),metadata:{qualityState:temporary?'temporary-pending-replacement':'definitive',qualityLabel:temporary?'Temporal - Pendiente de sustitución':'Estándar definitivo',definitiveMinimumLongestSide:this.definitiveMinimum,fileName:image.fileName}};
    });
  }

  private extractImageUrls(html:string,base:string){
    const found=new Set<string>();
    const patterns=[/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi,/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/gi,/(?:data-zoom-image|data-src|src)=["']([^"']+\.(?:png|jpe?g|webp)(?:\?[^"']*)?)["']/gi,/"(?:contentUrl|image)"\s*:\s*"([^"]+)"/gi];
    for(const pattern of patterns)for(const match of html.matchAll(pattern)){try{const url=new URL(match[1].replaceAll('\\/','/').replaceAll('&amp;','&'),base);if(this.isOfficial(url))found.add(url.toString());}catch{}}
    return [...found];
  }
  private isOfficial(url:URL){return url.protocol==='https:'&&officialHosts.has(url.hostname.toLowerCase());}
  private assertOfficial(value:string){const url=new URL(value);if(!this.isOfficial(url))throw new Error(`Fuente Epson no autorizada: ${url.hostname}`);}
}
