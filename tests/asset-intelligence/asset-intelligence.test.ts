import assert from 'node:assert/strict';
import test from 'node:test';
import { AssetIntelligenceService } from '../../modules/asset-intelligence/application/AssetIntelligenceService';
import { InMemoryAcquisitionRegistry } from '../../modules/asset-intelligence/infrastructure/InMemoryAcquisitionRegistry';
import { InMemoryGlobalAssetRegistry } from '../../modules/asset-intelligence/infrastructure/InMemoryGlobalAssetRegistry';
import { MediaPipelineReviewBridge } from '../../modules/asset-intelligence/infrastructure/MediaPipelineReviewBridge';
import { EpsonAssetProvider } from '../../modules/asset-intelligence/providers/epson/EpsonAssetProvider';
import type { AssetSearchRequest, DownloadedOfficialAsset, OfficialAssetCandidate } from '../../modules/asset-intelligence/domain/types';

const request:AssetSearchRequest={projectId:'future-project',manufacturer:'epson',model:'WF-7840',assetKind:'product-image',minimumLongestSide:2000};
const bytes=new Uint8Array([1,2,3]);
const downloaded:DownloadedOfficialAsset={bytes,contentType:'image/jpeg',fileName:'wf-7840.jpg',dimensions:{width:4000,height:3500},acquiredAt:'2026-08-04T20:00:00.000Z'};
const candidate:OfficialAssetCandidate={id:'epson-wf-7840',providerId:'epson-official',manufacturer:'epson',model:'WF-7840',assetKind:'product-image',owner:'Epson',sourceKind:'manufacturer-newsroom',sourcePageUrl:'https://news.epson.com/file/wf-7840',originalUrl:'https://news.epson.com/file/wf-7840.jpg',format:'jpeg',dimensions:{width:4000,height:3500},license:{name:'Epson newsroom evaluation',summary:'Evaluaci?n interna; modificaci?n pendiente de autorizaci?n.',legalStatus:'permission-required',allowsCommercialUse:null,allowsModification:null,requiresWrittenAuthorization:true},access:'public',discoveredAt:'2026-08-04T20:00:00.000Z',metadata:{}};

function fixture(pipelineStatus='review-required'){
  const registry=new InMemoryAcquisitionRegistry();
  const provider={id:'epson-official',manufacturers:['epson'],async search(){return[candidate];},async acquire(){return downloaded;}};
  const mediaPipeline=new MediaPipelineReviewBridge({async stageOfficialOriginal(){},async processOne(){return{status:pipelineStatus,candidateUri:'review/wf-7840.png',provider:'photoroom'};}});
  const globalAssets=new InMemoryGlobalAssetRegistry();
  const service=new AssetIntelligenceService({providers:[provider],registry,globalAssets,originals:{async preserve(){return{uri:'official-originals/wf-7840.jpg'};}},checksum:{async sha256(){return'a'.repeat(64);}},mediaPipeline,clock:{now(){return'2026-08-04T20:00:00.000Z';}}});
  return{service,registry,globalAssets};
}

test('la procedencia ambigua queda bloqueada en revisi?n jur?dica',async()=>{
  const{service}=fixture();
  const record=await service.registerCandidate({request,logicalAssetId:'wf-7840',candidate});
  assert.equal(record.status,'rights-review');
  assert.equal(record.requiresWrittenAuthorization,true);
  await assert.rejects(()=>service.authorize(record.id,{grantedBy:'CEO',grantedAt:'2026-08-04T20:00:00.000Z',scope:'commercial-use'}),/referencia de/);
});

test('un original autorizado llega ?nicamente hasta review-required',async()=>{
  const{service,globalAssets}=fixture();
  const registered=await service.registerCandidate({request,logicalAssetId:'wf-7840',candidate});
  await service.authorize(registered.id,{grantedBy:'Arquitecta',grantedAt:'2026-08-04T20:00:00.000Z',scope:'internal-evaluation',writtenAuthorizationReference:'EPSON-TEST-001'});
  await service.acquire(registered.id,2000);
  const review=await service.submitForProcessing(registered.id,2000,'photoroom');
  assert.equal(review.status,'review-required');
  assert.equal(review.checksumSha256,'a'.repeat(64));
  assert.equal(review.originalUri,'official-originals/wf-7840.jpg');
  assert.equal(review.globalAssetId,'LAEX-ASSET-0000001');
  const global=await globalAssets.findById('LAEX-ASSET-0000001');
  assert.equal(global?.processingHistory.length,2);
  assert.equal(global?.publicationHistory.length,0);
  await assert.rejects(()=>service.recordPublication('LAEX-ASSET-0000001',{actor:'publisher',projectId:'future-project',version:1,status:'published',reference:'/asset.webp'}),/registrada para esta/);
  await service.recordApproval('LAEX-ASSET-0000001',{actor:'Arquitecta',projectId:'future-project',version:1,decision:'approved'});
  const published=await service.recordPublication('LAEX-ASSET-0000001',{actor:'publisher',projectId:'future-project',version:1,status:'published',reference:'/asset.webp'});
  assert.equal(published.approvalHistory.length,1);
  assert.equal(published.publicationHistory.length,1);
});

test('el mismo checksum se comparte entre proyectos y un reemplazo conserva el Asset ID',async()=>{
  const registry=new InMemoryGlobalAssetRegistry();
  const base={manufacturer:'epson',model:'WF-4830',owner:'Epson',assetKind:'product-image' as const,status:'acquired' as const,license:candidate.license,legalStatus:candidate.license.legalStatus,sourcePageUrl:candidate.sourcePageUrl,usageContext:'showroom',version:{version:1,checksumSha256:'1'.repeat(64),originalUri:'original/v1.jpg',sourceUrl:candidate.originalUrl,acquiredAt:'2026-08-04T20:00:00.000Z',format:'image/jpeg',dimensions:{width:2000,height:2000}}};
  const first=await registry.registerOrReference({...base,projectId:'lf-printer'});
  const shared=await registry.registerOrReference({...base,projectId:'marketplace',usageContext:'comparison'});
  assert.equal(first.asset.assetId,'LAEX-ASSET-0000001');
  assert.equal(shared.asset.assetId,first.asset.assetId);
  assert.deepEqual(shared.asset.usages.map(usage=>usage.projectId).sort(),['lf-printer','marketplace']);
  const replacement=await registry.registerOrReference({...base,projectId:'academy',version:{...base.version,checksumSha256:'2'.repeat(64),originalUri:'original/v2.jpg',acquiredAt:'2026-08-05T20:00:00.000Z'}});
  assert.equal(replacement.asset.assetId,first.asset.assetId);
  assert.equal(replacement.asset.currentVersion,2);
  assert.equal(replacement.asset.versions.length,2);
  assert.equal(replacement.asset.replacementHistory.length,1);
  const historicalReuse=await registry.registerOrReference({...base,projectId:'manuals',usageContext:'legacy-manual'});
  assert.equal(historicalReuse.asset.assetId,first.asset.assetId);
  assert.equal(historicalReuse.asset.versions.length,2);
});

test('el puente rechaza cualquier publicaci?n autom?tica',async()=>{
  const{service}=fixture('published');
  const registered=await service.registerCandidate({request,logicalAssetId:'wf-7840',candidate});
  await service.authorize(registered.id,{grantedBy:'Arquitecta',grantedAt:'2026-08-04T20:00:00.000Z',scope:'internal-evaluation',writtenAuthorizationReference:'EPSON-TEST-001'});
  await service.acquire(registered.id,2000);
  await assert.rejects(()=>service.submitForProcessing(registered.id,2000,'photoroom'),/Asset Intelligence nunca permite/);
});

test('el adaptador Epson rechaza dominios no oficiales',async()=>{
  const bad={...candidate,sourcePageUrl:'https://marketplace.example/wf-7840'};
  const provider=new EpsonAssetProvider([bad],{async download(){return downloaded;}});
  await assert.rejects(()=>provider.search(request),/Fuente Epson no autorizada/);
});
