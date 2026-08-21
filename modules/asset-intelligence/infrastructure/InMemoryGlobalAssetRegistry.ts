import { formatGlobalAssetId, historyKey } from '../domain/global-assets';
import type { GlobalAssetRegistry } from '../domain/ports';
import type { GlobalAsset, GlobalAssetEvent, GlobalAssetId, RegisterGlobalAssetInput } from '../domain/types';

const clone=<T>(value:T):T=>structuredClone(value);
const identityOf=(input:Pick<RegisterGlobalAssetInput,'manufacturer'|'model'|'assetKind'>)=>`${input.manufacturer.toLowerCase()}:${input.model.toLowerCase()}:${input.assetKind}`;

export function registerInGlobalCollection(assets:GlobalAsset[],input:RegisterGlobalAssetInput,nextId:()=>GlobalAssetId){
  const now=input.version.acquiredAt;
  let asset=assets.find(item=>item.versions.some(version=>version.checksumSha256===input.version.checksumSha256));
  if(asset){asset=addUsageToAsset(asset,input.projectId,input.usageContext,now);replaceIn(assets,asset);return{asset,created:false};}
  asset=assets.find(item=>identityOf(item)===identityOf(input));
  if(asset){
    const priorVersion=asset.currentVersion;
    const nextVersion=Math.max(...asset.versions.map(version=>version.version))+1;
    const version={...input.version,version:nextVersion,replacedVersion:priorVersion};
    asset={...asset,status:input.status,license:input.license,legalStatus:input.legalStatus,sourcePageUrl:input.sourcePageUrl,currentVersion:nextVersion,currentChecksumSha256:version.checksumSha256,versions:[...asset.versions,version],replacementHistory:[...asset.replacementHistory,{id:`${asset.assetId}:replacement:${nextVersion}`,kind:'replacement',at:now,actor:'laex-asset-intelligence',projectId:input.projectId,version:nextVersion,status:'superseded',reference:`v${priorVersion} -> v${nextVersion}`}],updatedAt:now};
    asset=addUsageToAsset(asset,input.projectId,input.usageContext,now);replaceIn(assets,asset);return{asset,created:false};
  }
  const assetId=nextId();
  asset={assetId,manufacturer:input.manufacturer,model:input.model,owner:input.owner,assetKind:input.assetKind,status:input.status,license:input.license,legalStatus:input.legalStatus,sourcePageUrl:input.sourcePageUrl,currentVersion:input.version.version,currentChecksumSha256:input.version.checksumSha256,usages:[{projectId:input.projectId,contexts:[input.usageContext],firstReferencedAt:now,lastReferencedAt:now}],versions:[input.version],processingHistory:[],publicationHistory:[],replacementHistory:[],approvalHistory:[],createdAt:now,updatedAt:now};
  assets.push(asset);return{asset,created:true};
}

export function addUsageToAsset(asset:GlobalAsset,projectId:string,context:string,at:string){
  const usage=asset.usages.find(item=>item.projectId===projectId);
  const usages=usage?asset.usages.map(item=>item.projectId===projectId?{...item,contexts:item.contexts.includes(context)?item.contexts:[...item.contexts,context],lastReferencedAt:at}:item):[...asset.usages,{projectId,contexts:[context],firstReferencedAt:at,lastReferencedAt:at}];
  return{...asset,usages,updatedAt:at};
}

export function appendGlobalEvent(asset:GlobalAsset,event:GlobalAssetEvent){const key=historyKey(event.kind);return{...asset,[key]:[...asset[key],event],status:event.kind==='publication'&&event.status==='published'?'published':asset.status,updatedAt:event.at};}
const replaceIn=(assets:GlobalAsset[],asset:GlobalAsset)=>{const index=assets.findIndex(item=>item.assetId===asset.assetId);if(index>=0)assets[index]=asset;};

export class InMemoryGlobalAssetRegistry implements GlobalAssetRegistry {
  private assets:GlobalAsset[]=[];private sequence=1;
  async registerOrReference(input:RegisterGlobalAssetInput){const result=registerInGlobalCollection(this.assets,input,()=>formatGlobalAssetId(this.sequence++));return clone(result);}
  async findById(assetId:GlobalAssetId){const asset=this.assets.find(item=>item.assetId===assetId);return asset?clone(asset):undefined;}
  async findByChecksum(checksum:string){const asset=this.assets.find(item=>item.versions.some(version=>version.checksumSha256===checksum));return asset?clone(asset):undefined;}
  async addUsage(assetId:GlobalAssetId,projectId:string,context:string,at:string){const asset=this.required(assetId),updated=addUsageToAsset(asset,projectId,context,at);replaceIn(this.assets,updated);return clone(updated);}
  async appendEvent(assetId:GlobalAssetId,event:GlobalAssetEvent){const updated=appendGlobalEvent(this.required(assetId),event);replaceIn(this.assets,updated);return clone(updated);}
  async list(){return clone(this.assets);}
  private required(assetId:GlobalAssetId){const asset=this.assets.find(item=>item.assetId===assetId);if(!asset)throw new Error(`Asset ID global inexistente: ${assetId}`);return asset;}
}
