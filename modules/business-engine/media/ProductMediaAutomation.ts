import { createHash, randomUUID } from "node:crypto";
import { access, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { ChapterTwoStore } from "../chapter-two/types";
import type { ActorContext } from "../domain/types";

type GlobalRegistry = { assets:Array<{assetId:string;manufacturer:string;model:string;assetKind:string;status:string;sourcePageUrl:string;currentVersion:number;currentChecksumSha256:string;versions:Array<{version:number;originalUri:string}>;approvalHistory:Array<{version?:number;status:string}>}> };
type PipelineRegistry = { assets:Array<{id:string;status:string;source?:{checksum:string};outputs?:Record<string,string>}> };
type Product = Awaited<ReturnType<ChapterTwoStore["snapshot"]>>["products"][number];
type Resolution = {assetId:string;manufacturer:string;model:string;version:number;checksum:string;sourceUrl:string;originalUri:string;logicalId:string;masterPublicUrl:string};

const normalize=(value:string)=>value.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const safe=(value:string)=>value.replace(/[^a-zA-Z0-9_-]/g,"-");
const digest=(value:Buffer)=>createHash("sha256").update(value).digest("hex");

/** Connects an exact approved product asset to Business without ever guessing media. */
export class ProductMediaAutomation {
  constructor(private readonly store:ChapterTwoStore,private readonly root=process.cwd(),private readonly now=()=>new Date(),private readonly id=()=>randomUUID()){}

  async associate(actor:ActorContext,productId:string){
    const state=await this.store.snapshot(),product=state.products.find(item=>item.id===productId&&item.tenantId===actor.tenantId&&item.companyId===actor.companyId);
    if(!product)throw new Error("product_not_found");
    const resolution=await this.resolve(product);
    if(!resolution)return this.recordPending(actor,product,"exact-approved-asset-not-found");
    const derivatives=await this.compose(actor,product,resolution);
    return this.store.transact(draft=>{
      const current=draft.products.find(item=>item.id===product.id&&item.tenantId===actor.tenantId&&item.companyId===actor.companyId);
      if(!current)throw new Error("product_not_found");
      const at=this.now().toISOString(),record=draft.productMedia.find(item=>item.productId===product.id&&item.companyId===actor.companyId);
      const history=[...(record?.derivatives??[]).filter(item=>!derivatives.some(next=>next.id===item.id)),...derivatives];
      const value={id:record?.id??this.id(),tenantId:actor.tenantId,companyId:actor.companyId,productId:product.id,assetId:resolution.assetId,manufacturer:resolution.manufacturer,model:resolution.model,status:"associated" as const,master:{uri:resolution.originalUri,checksum:resolution.checksum,version:resolution.version,sourceUrl:resolution.sourceUrl},derivatives:history,createdAt:record?.createdAt??at,updatedAt:at};
      if(record)Object.assign(record,value);else draft.productMedia.push(value);
      const request=draft.mediaAcquisitionRequests.find(item=>item.productId===product.id&&item.tenantId===actor.tenantId&&item.companyId===actor.companyId);if(request){request.status="approved";request.providerId="global-asset-registry";request.candidateReference=resolution.assetId;request.sourcePageUrl=resolution.sourceUrl;request.licenseStatus="approved-published";request.updatedAt=at;}
      current.mediaReference=`${resolution.assetId}:v${resolution.version}:${resolution.checksum}`;
      current.imageUrl=derivatives.find(item=>item.purpose==="carousel")?.url??resolution.masterPublicUrl;
      draft.audit.push({id:this.id(),tenantId:actor.tenantId,companyId:actor.companyId,userId:actor.userId,action:"product.media.associated",entityId:product.id,traceId:actor.traceId,at});
      return value;
    });
  }

  async imagesFor(actor:ActorContext,productId:string){
    const media=await this.associate(actor,productId);
    if(media.status!=="associated")return [];
    const latest=media.derivatives.filter(item=>item.status==="approved"&&item.purpose!=="promotion").reduce<typeof media.derivatives>((selected,item)=>{const prior=selected.find(entry=>entry.purpose===item.purpose);if(!prior||item.version>prior.version)return[...selected.filter(entry=>entry.purpose!==item.purpose),item];return selected},[]).sort((left,right)=>["carousel","card","detail"].indexOf(left.purpose)-["carousel","card","detail"].indexOf(right.purpose));
    return latest.map((item,order)=>({url:item.url,alt:`${media.manufacturer} ${media.model} — ${item.purpose}`,order,assetReference:`${media.assetId}:v${media.master.version}`,checksum:item.checksum,version:item.version,purpose:item.purpose,tool:item.tool}));
  }

  private async recordPending(actor:ActorContext,product:Product,reason:string){return this.store.transact(draft=>{const at=this.now().toISOString(),record=draft.productMedia.find(item=>item.productId===product.id&&item.companyId===actor.companyId),value={id:record?.id??this.id(),tenantId:actor.tenantId,companyId:actor.companyId,productId:product.id,manufacturer:product.brand,model:product.model,status:"pending" as const,reason,master:{},derivatives:[],createdAt:record?.createdAt??at,updatedAt:at};if(record)Object.assign(record,value);else draft.productMedia.push(value);const request=draft.mediaAcquisitionRequests.find(item=>item.productId===product.id&&item.tenantId===actor.tenantId&&item.companyId===actor.companyId);if(product.brand?.trim()&&product.model?.trim()){const acquisition={id:request?.id??this.id(),tenantId:actor.tenantId,companyId:actor.companyId,productId:product.id,manufacturer:product.brand.trim(),model:product.model.trim(),assetKind:"product-image" as const,status:"queued" as const,reason,createdAt:request?.createdAt??at,updatedAt:at};if(request)Object.assign(request,acquisition);else draft.mediaAcquisitionRequests.push(acquisition);}draft.audit.push({id:this.id(),tenantId:actor.tenantId,companyId:actor.companyId,userId:actor.userId,action:"product.media.pending",entityId:product.id,traceId:actor.traceId,at});if(product.brand?.trim()&&product.model?.trim())draft.audit.push({id:this.id(),tenantId:actor.tenantId,companyId:actor.companyId,userId:actor.userId,action:"asset-intelligence.acquisition-requested",entityId:product.id,traceId:actor.traceId,at});return value;});}

  private async resolve(product:Product):Promise<Resolution|undefined>{
    const global=JSON.parse(await readFile(path.join(this.root,"assets","asset-intelligence","global-asset-registry.json"),"utf8")) as GlobalRegistry;
    const pipeline=JSON.parse(await readFile(path.join(this.root,"assets","lf-printer","official","media-registry.json"),"utf8")) as PipelineRegistry;
    const explicitModel=normalize(product.model??"");
    const name=normalize(product.name),brand=normalize(product.brand??"");
    const candidates=global.assets.filter(asset=>asset.assetKind==="product-image"&&asset.status==="published"&&asset.approvalHistory.some(event=>event.status==="approved"&&(!event.version||event.version===asset.currentVersion))).filter(asset=>{
      const exactModel=normalize(asset.model),exactManufacturer=normalize(asset.manufacturer);
      const modelMatches=explicitModel?explicitModel===exactModel:name.split(" ").join("-").includes(exactModel.split(" ").join("-"));
      const manufacturerMatches=brand?brand===exactManufacturer:name.includes(exactManufacturer);
      return modelMatches&&manufacturerMatches;
    });
    if(candidates.length!==1)return undefined;
    const asset=candidates[0],logicalId=normalize(asset.model).replace(/ /g,"-"),published=pipeline.assets.find(item=>item.id===logicalId&&item.status==="published"&&item.source?.checksum===asset.currentChecksumSha256),version=asset.versions.find(item=>item.version===asset.currentVersion);
    if(!published?.outputs||!version)return undefined;
    return{assetId:asset.assetId,manufacturer:asset.manufacturer,model:asset.model,version:asset.currentVersion,checksum:asset.currentChecksumSha256,sourceUrl:asset.sourcePageUrl,originalUri:version.originalUri,logicalId,masterPublicUrl:`/assets/lf-printer/official/printers/${published.outputs.hero}`};
  }

  private async compose(actor:ActorContext,product:Product,asset:Resolution){
    const source=path.join(this.root,"public","assets","lf-printer","official","printers",`${asset.logicalId}-transparent.png`);
    await access(source);
    const version=5,folder=path.join(this.root,"public","assets","lf-printer","commercial","products",safe(actor.companyId),safe(product.id),`${asset.assetId}-v${asset.version}`);await mkdir(folder,{recursive:true});
    const specs=[{purpose:"carousel" as const,width:1600,height:1000},{purpose:"card" as const,width:900,height:900},{purpose:"detail" as const,width:1600,height:1200}];
    return Promise.all(specs.map(async spec=>{
      const file=`${spec.purpose}-v${version}-${asset.checksum.slice(0,12)}.webp`,absolute=path.join(folder,file),publicUrl=`/${path.relative(path.join(this.root,"public"),absolute).split(path.sep).join("/")}`;
      try{await access(absolute);}catch{
        const transparent={r:0,g:0,b:0,alpha:0},productBuffer=await sharp(source).resize({width:Math.round(spec.width*.86),height:Math.round(spec.height*.84),fit:"contain",withoutEnlargement:true,background:transparent}).png().toBuffer(),meta=await sharp(productBuffer).metadata();
        await sharp({create:{width:spec.width,height:spec.height,channels:4,background:transparent}}).composite([{input:productBuffer,left:Math.round((spec.width-(meta.width??0))/2),top:Math.round((spec.height-(meta.height??0))/2)}]).webp({quality:90,alphaQuality:100}).toFile(absolute);
      }
      const bytes=await readFile(absolute);return{id:`${asset.assetId}:${product.id}:${spec.purpose}:v${version}`,purpose:spec.purpose,url:publicUrl,checksum:digest(bytes),version,tool:"laex-sharp-product-derivative",transformation:`authentic-product-only;contain;clean-background;transparent-background;${spec.width}x${spec.height};webp-q90-alpha100`,createdAt:this.now().toISOString(),status:"approved" as const};
    }));
  }
}
