import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { CanvaTokenStore } from '../../../domain/ports';
import type { StoredCanvaConnection } from '../../../domain/types';
import { openServerData,sealServerData } from './sealed-data';

export class FileCanvaTokenStore implements CanvaTokenStore{
  private queue:Promise<unknown>=Promise.resolve();
  constructor(private readonly file:string,private readonly secret:string){}
  async read(){try{return openServerData<StoredCanvaConnection>(await fs.readFile(this.file,'utf8'),this.secret);}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return undefined;throw error;}}
  async write(connection:StoredCanvaConnection){return this.mutate(async()=>{await fs.mkdir(path.dirname(this.file),{recursive:true});const temporary=`${this.file}.${process.pid}.tmp`;await fs.writeFile(temporary,sealServerData(connection,this.secret),{encoding:'utf8',mode:0o600});await fs.rename(temporary,this.file);});}
  async delete(){return this.mutate(async()=>{try{await fs.unlink(this.file);}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}});}
  private async mutate(operation:()=>Promise<void>){const run=this.queue.then(operation);this.queue=run.then(()=>undefined,()=>undefined);return run;}
}
export const defaultCanvaTokenFile=()=>path.join(process.cwd(),'.data','integrations','canva.tokens.enc');
