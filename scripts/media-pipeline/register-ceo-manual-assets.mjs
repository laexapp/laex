import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const approvedModels=new Map([
  ['l1250','L1250'],
  ['wf-4830','WF-4830'],
  ['wf-4834','WF-4834'],
  ['wf-c4810','WF-C4810'],
  ['wf-7820','WF-7820'],
  ['wf-7840','WF-7840'],
  ['xp-4105','XP-4105'],
  ['xp-4205','XP-4205'],
]);
const root=process.cwd(),globalFile=path.join(root,'assets','asset-intelligence','global-asset-registry.json'),pipelineFile=path.join(root,'assets','lf-printer','official','media-registry.json');
const global=JSON.parse(await fs.readFile(globalFile,'utf8')),pipeline=JSON.parse(await fs.readFile(pipelineFile,'utf8')),at=new Date().toISOString();
const nextId=()=>`LAEX-ASSET-${String(global.nextSequence++).padStart(7,'0')}`;

for(const [logicalId,model] of approvedModels){
  const media=pipeline.assets.find(item=>item.id===logicalId&&item.status==='published');
  if(!media?.source?.checksum)throw new Error(`${logicalId}: Media Pipeline no lo ha publicado.`);
  const current=global.assets.find(item=>item.manufacturer?.toLowerCase()==='epson'&&item.model?.toUpperCase()===model);
  if(current?.currentChecksumSha256===media.source.checksum&&current.status==='published')continue;
  const version=(current?.currentVersion??0)+1,assetId=current?.assetId??nextId(),originalUri=media.source.uri;
  const versionRecord={version,checksumSha256:media.source.checksum,originalUri,sourceUrl:'urn:laex:source:lf-printer-ceo-manual',acquiredAt:at,format:`image/${media.source.format}`,dimensions:{width:media.source.width,height:media.source.height}};
  const approval={id:`${assetId}:approval:${crypto.randomUUID()}`,kind:'approval',at,actor:'CEO LF-PRINTER',projectId:'lf-printer',version,status:'approved',reference:'CEO-manual-temporary-2026-08',notes:'Activo suministrado y aprobado manualmente por el CEO para uso temporal; pendiente de sustitucion por fuente manufacturer-authorized.'};
  const publication={id:`${assetId}:publication:${crypto.randomUUID()}`,kind:'publication',at,actor:'media-pipeline',projectId:'lf-printer',version,status:'published',reference:'temporary-manual',notes:'Publicado por el Media Pipeline oficial con coincidencia exacta de modelo.'};
  const processing={id:`${assetId}:processing:${crypto.randomUUID()}`,kind:'processing',at,actor:'media-pipeline',projectId:'lf-printer',version,status:'published',provider:'laex-media-pipeline'};
  if(current){
    current.currentVersion=version;current.currentChecksumSha256=media.source.checksum;current.status='published';current.sourcePageUrl='urn:laex:source:lf-printer-ceo-manual';current.updatedAt=at;
    current.versions=[...(current.versions??[]),versionRecord];current.approvalHistory=[...(current.approvalHistory??[]),approval];current.publicationHistory=[...(current.publicationHistory??[]),publication];current.processingHistory=[...(current.processingHistory??[]),processing];
    current.replacementHistory=[...(current.replacementHistory??[]),{id:`${assetId}:replacement:${crypto.randomUUID()}`,kind:'replacement',at,actor:'CEO LF-PRINTER',projectId:'lf-printer',fromVersion:version-1,toVersion:version,reason:'CEO supplied an exact manually approved temporary image.'}];
  }else{
    global.assets.push({assetId,manufacturer:'epson',model,owner:'LF-PRINTER CEO-supplied temporary asset',assetKind:'product-image',status:'published',license:{name:'Autorizacion manual temporal LF-PRINTER',summary:'Activo suministrado y aprobado por el CEO para la tienda LF-PRINTER.',legalStatus:'permission-required',allowsCommercialUse:null,allowsModification:null,requiresWrittenAuthorization:true},legalStatus:'permission-required',sourcePageUrl:'urn:laex:source:lf-printer-ceo-manual',currentVersion:version,currentChecksumSha256:media.source.checksum,usages:[{projectId:'lf-printer',contexts:['showroom','product-microsite'],firstReferencedAt:at,lastReferencedAt:at}],versions:[versionRecord],processingHistory:[processing],publicationHistory:[publication],replacementHistory:[],approvalHistory:[approval],createdAt:at,updatedAt:at});
  }
}
global.updatedAt=at;
await fs.writeFile(globalFile,JSON.stringify(global,null,2)+'\n');
console.log(`Registrados ${approvedModels.size} activos manuales aprobados por CEO.`);
