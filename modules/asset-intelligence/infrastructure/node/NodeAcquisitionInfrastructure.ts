import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AcquisitionRegistry, AssetClock, ChecksumService, GlobalAssetRegistry, OriginalAssetStore } from '../../domain/ports';
import type { AcquisitionRecord, GlobalAsset, GlobalAssetEvent, GlobalAssetId, RegisterGlobalAssetInput } from '../../domain/types';
import { formatGlobalAssetId } from '../../domain/global-assets';
import { addUsageToAsset, appendGlobalEvent, registerInGlobalCollection } from '../InMemoryGlobalAssetRegistry';

const safeSegment=(value:string)=>{
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value))throw new Error(`Segmento de ruta no v?lido: ${value}`);
  return value.toLowerCase();
};

export class NodeSha256ChecksumService implements ChecksumService {
  async sha256(bytes:Uint8Array){return crypto.createHash('sha256').update(bytes).digest('hex');}
}

export class SystemAssetClock implements AssetClock { now(){return new Date().toISOString();} }

export class JsonAcquisitionRegistry implements AcquisitionRegistry {
  constructor(private readonly file:string){}
  async save(record:AcquisitionRecord){
    const records=await this.read();
    const index=records.findIndex(item=>item.id===record.id);
    if(index>=0)records[index]=record;else records.push(record);
    await fs.mkdir(path.dirname(this.file),{recursive:true});
    const temporary=`${this.file}.${process.pid}.tmp`;
    await fs.writeFile(temporary,JSON.stringify({schemaVersion:1,updatedAt:new Date().toISOString(),assets:records.sort((a,b)=>a.id.localeCompare(b.id))},null,2)+'\n');
    await fs.rename(temporary,this.file);
  }
  async find(recordId:string){return(await this.read()).find(record=>record.id===recordId);}
  async findByLogicalAsset(projectId:string,logicalAssetId:string){return(await this.read()).filter(record=>record.projectId===projectId&&record.logicalAssetId===logicalAssetId);}
  async list(){return this.read();}
  private async read():Promise<AcquisitionRecord[]>{
    try{const parsed=JSON.parse(await fs.readFile(this.file,'utf8')) as {assets?:AcquisitionRecord[]};return parsed.assets??[];}
    catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return[];throw error;}
  }
}

export class FileSystemOriginalAssetStore implements OriginalAssetStore {
  constructor(private readonly root:string){}
  async preserve(input:{projectId:string;logicalAssetId:string;version:number;fileName:string;checksumSha256:string;bytes:Uint8Array}){
    const project=safeSegment(input.projectId),asset=safeSegment(input.logicalAssetId);
    const extension=path.extname(input.fileName).toLowerCase();
    if(!/^\.[a-z0-9]{2,5}$/.test(extension))throw new Error('La extensi?n del original no es v?lida.');
    const folder=path.resolve(this.root,project,asset,`v${input.version}`),root=path.resolve(this.root);
    if(folder!==root&&!folder.startsWith(root+path.sep))throw new Error('La ruta del original sali? del repositorio autorizado.');
    await fs.mkdir(folder,{recursive:true});
    const target=path.join(folder,`${input.checksumSha256}${extension}`);
    try{await fs.writeFile(target,input.bytes,{flag:'wx'});}catch(error){if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error;}
    return{uri:path.relative(process.cwd(),target).replaceAll('\\','/')};
  }
}

interface GlobalRegistryFile { schemaVersion:1; nextSequence:number; updatedAt:string; assets:GlobalAsset[] }

export class JsonGlobalAssetRegistry implements GlobalAssetRegistry {
  private queue:Promise<unknown>=Promise.resolve();
  constructor(private readonly file:string){}
  async registerOrReference(input:RegisterGlobalAssetInput){return this.mutate(state=>registerInGlobalCollection(state.assets,input,()=>formatGlobalAssetId(state.nextSequence++)));}
  async findById(assetId:GlobalAssetId){return(await this.read()).assets.find(asset=>asset.assetId===assetId);}
  async findByChecksum(checksum:string){return(await this.read()).assets.find(asset=>asset.versions.some(version=>version.checksumSha256===checksum));}
  async addUsage(assetId:GlobalAssetId,projectId:string,context:string,at:string){return this.mutate(state=>{const index=state.assets.findIndex(asset=>asset.assetId===assetId);if(index<0)throw new Error(`Asset ID global inexistente: ${assetId}`);const updated=addUsageToAsset(state.assets[index],projectId,context,at);state.assets[index]=updated;return updated;});}
  async appendEvent(assetId:GlobalAssetId,event:GlobalAssetEvent){return this.mutate(state=>{const index=state.assets.findIndex(asset=>asset.assetId===assetId);if(index<0)throw new Error(`Asset ID global inexistente: ${assetId}`);const updated=appendGlobalEvent(state.assets[index],event);state.assets[index]=updated;return updated;});}
  async list(){return(await this.read()).assets;}
  private async mutate<T>(operation:(state:GlobalRegistryFile)=>T):Promise<T>{
    const run=this.queue.then(async()=>{const state=await this.read(),result=operation(state);await this.write(state);return structuredClone(result);});
    this.queue=run.then(()=>undefined,()=>undefined);return run;
  }
  private async read():Promise<GlobalRegistryFile>{try{return JSON.parse(await fs.readFile(this.file,'utf8')) as GlobalRegistryFile;}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return{schemaVersion:1,nextSequence:1,updatedAt:new Date(0).toISOString(),assets:[]};throw error;}}
  private async write(state:GlobalRegistryFile){await fs.mkdir(path.dirname(this.file),{recursive:true});state.updatedAt=new Date().toISOString();const temporary=`${this.file}.${process.pid}.tmp`;await fs.writeFile(temporary,JSON.stringify(state,null,2)+'\n');await fs.rename(temporary,this.file);}
}

export const createLaexGlobalAssetRegistry=(workspaceRoot=process.cwd())=>new JsonGlobalAssetRegistry(path.join(workspaceRoot,'assets','asset-intelligence','global-asset-registry.json'));
