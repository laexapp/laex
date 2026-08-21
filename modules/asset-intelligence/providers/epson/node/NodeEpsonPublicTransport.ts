import 'server-only';
import path from 'node:path';
import sharp from 'sharp';
import type { DownloadedOfficialAsset } from '../../../domain/types';
import type { EpsonPublicTransport } from '../EpsonPublicConnector';

const allowedHosts=new Set(['epson.com','www.epson.com','support.epson.com','news.epson.com','download-center.epson.com','mediaserver.goepson.com','files.support.epson.com']);
export class NodeEpsonPublicTransport implements EpsonPublicTransport {
  constructor(private readonly maxImageBytes=25_000_000){}
  async getText(url:string){const response=await this.request(url,'text/html');const body=await response.text();if(body.length>5_000_000)throw new Error('La página Epson excede el límite permitido.');return{body,finalUrl:response.url};}
  async inspectImage(url:string){const downloaded=await this.downloadImage(url);return{finalUrl:url,contentType:downloaded.contentType,fileName:downloaded.fileName,dimensions:downloaded.dimensions};}
  async downloadImage(url:string):Promise<DownloadedOfficialAsset>{
    const response=await this.request(url,'image/*');const contentType=(response.headers.get('content-type')??'').split(';')[0].toLowerCase();if(!['image/jpeg','image/png','image/webp'].includes(contentType))throw new Error(`Tipo de imagen Epson no permitido: ${contentType||'desconocido'}`);
    const declared=Number(response.headers.get('content-length')??0);if(declared>this.maxImageBytes)throw new Error('La imagen Epson excede el límite permitido.');const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.byteLength>this.maxImageBytes)throw new Error('La imagen Epson excede el límite permitido.');const metadata=await sharp(bytes,{failOn:'error'}).metadata();if(!metadata.width||!metadata.height)throw new Error('No fue posible leer la resolución Epson.');const extension=contentType==='image/png'?'.png':contentType==='image/webp'?'.webp':'.jpg';const sourceName=path.basename(new URL(response.url).pathname);return{bytes,contentType,fileName:path.extname(sourceName)?sourceName:`epson-official${extension}`,dimensions:{width:metadata.width,height:metadata.height},acquiredAt:new Date().toISOString()};
  }
  private async request(value:string,accept:string){const url=new URL(value);this.assert(url);const response=await fetch(url,{headers:{accept,'user-agent':'LAEX-Asset-Intelligence/1.0'},redirect:'follow',signal:AbortSignal.timeout(20_000)});this.assert(new URL(response.url));if(!response.ok)throw new Error(`Epson respondió HTTP ${response.status}.`);return response;}
  private assert(url:URL){if(url.protocol!=='https:'||!allowedHosts.has(url.hostname.toLowerCase()))throw new Error(`Fuente Epson no autorizada: ${url.hostname}`);}
}
