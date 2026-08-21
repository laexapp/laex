import assert from 'node:assert/strict';
import test from 'node:test';
import { AssetIntelligenceService } from '../../modules/asset-intelligence/application/AssetIntelligenceService';
import { EpsonAcquisitionCoordinator } from '../../modules/asset-intelligence/application/EpsonAcquisitionCoordinator';
import { InMemoryAcquisitionRegistry } from '../../modules/asset-intelligence/infrastructure/InMemoryAcquisitionRegistry';
import { InMemoryGlobalAssetRegistry } from '../../modules/asset-intelligence/infrastructure/InMemoryGlobalAssetRegistry';
import { MediaPipelineReviewBridge } from '../../modules/asset-intelligence/infrastructure/MediaPipelineReviewBridge';
import { EpsonPartnerPortalConnector } from '../../modules/asset-intelligence/providers/epson/EpsonPartnerPortalConnector';
import { EpsonPublicConnector } from '../../modules/asset-intelligence/providers/epson/EpsonPublicConnector';
import type { AssetDimensions, AssetSearchRequest, DownloadedOfficialAsset, OfficialAssetCandidate } from '../../modules/asset-intelligence/domain/types';

const request:AssetSearchRequest={projectId:'lf-printer',manufacturer:'epson',model:'XP-4205',assetKind:'product-image',minimumLongestSide:2000};

test('el conector público descubre y ordena imágenes oficiales por resolución',async()=>{
  const dimensions=new Map([['https://mediaserver.goepson.com/small.jpg',{width:522,height:405}],['https://mediaserver.goepson.com/large.png',{width:2400,height:1800}]]);
  const connector=new EpsonPublicConnector([{model:'XP-4205',url:'https://epson.com/product/xp-4205'}],{
    async getText(){return{finalUrl:'https://epson.com/product/xp-4205',body:'<meta property="og:image" content="https://mediaserver.goepson.com/small.jpg"><img data-zoom-image="https://mediaserver.goepson.com/large.png">'};},
    async inspectImage(url){return{finalUrl:url,contentType:url.endsWith('.png')?'image/png':'image/jpeg',fileName:url.split('/').at(-1)!,dimensions:dimensions.get(url)!};},
    async downloadImage(){throw new Error('not used');},
  });
  const found=await connector.search(request);
  assert.equal(found.length,2);assert.deepEqual(found[0].dimensions,{width:2400,height:1800});assert.equal(found[0].metadata.qualityState,'definitive');assert.equal(found[1].metadata.qualityState,'temporary-pending-replacement');
});

test('el conector público rechaza páginas y medios no oficiales',async()=>{
  const connector=new EpsonPublicConnector([{model:'XP-4205',url:'https://marketplace.example/xp-4205'}],{async getText(){throw new Error('not used');},async inspectImage(){throw new Error('not used');},async downloadImage(){throw new Error('not used');}});
  await assert.rejects(()=>connector.search(request),/Fuente Epson no autorizada/);
});

test('Partner Portal permanece bloqueado sin secreto y autorización formal',async()=>{
  const connector=new EpsonPartnerPortalConnector({enabled:false,accessToken:'',authorizationReference:''},{async search(){return[];},async acquire(){throw new Error('not used');}});
  await assert.rejects(()=>connector.search(request),/permanece deshabilitado/);
});

test('un temporal recorre revisión y su reemplazo premium conserva Asset ID',async()=>{
  let dimensions:AssetDimensions={width:690,height:460};
  const license={name:'Epson authorized test',summary:'Prueba',legalStatus:'manufacturer-authorized' as const,allowsCommercialUse:true,allowsModification:true,requiresWrittenAuthorization:false};
  const provider={id:'epson-public-official',manufacturers:['epson'] as const,async search(){const candidate:OfficialAssetCandidate={id:`xp-${dimensions.width}`,providerId:this.id,manufacturer:'epson',model:'XP-4205',assetKind:'product-image',owner:'Epson',sourceKind:'manufacturer-product-page',sourcePageUrl:'https://epson.com/xp-4205',originalUrl:`https://mediaserver.goepson.com/xp-${dimensions.width}.jpg`,format:'image/jpeg',dimensions,license,access:'public',discoveredAt:'2026-08-05T00:00:00.000Z',metadata:{}};return[candidate];},async acquire(candidate:OfficialAssetCandidate){return{bytes:new Uint8Array([dimensions.width===690?1:2]),contentType:'image/jpeg',fileName:`${candidate.id}.jpg`,dimensions,acquiredAt:'2026-08-05T00:00:00.000Z'} satisfies DownloadedOfficialAsset;}};
  const registry=new InMemoryAcquisitionRegistry(),globalAssets=new InMemoryGlobalAssetRegistry();
  const service=new AssetIntelligenceService({providers:[provider],registry,globalAssets,originals:{async preserve(input){return{uri:`originals/${input.checksumSha256}.jpg`};}},checksum:{async sha256(bytes){return String(bytes[0]).repeat(64);}},mediaPipeline:new MediaPipelineReviewBridge({async stageOfficialOriginal(){},async processOne(){return{status:'review-required',candidateUri:'review/xp-4205.png'};}}),clock:{now(){return'2026-08-05T00:00:00.000Z';}}});
  const coordinator=new EpsonAcquisitionCoordinator(service);
  const temporary=await coordinator.registerBest(request,'xp-4205');assert.equal(temporary.state,'temporary-pending-replacement');assert.equal(temporary.record.providerMetadata.qualityLabel,'Temporal manual LF-PRINTER - Pendiente de sustitución');
  const acquiredTemporary=await coordinator.acquire(temporary.record.id);const review=await coordinator.submitForReview(temporary.record.id);assert.equal(review.status,'review-required');
  dimensions={width:2400,height:1800};const premium=await coordinator.registerBest(request,'xp-4205');assert.equal(premium.state,'definitive');const acquiredPremium=await coordinator.acquire(premium.record.id);
  assert.equal(acquiredPremium.globalAssetId,acquiredTemporary.globalAssetId);const global=await globalAssets.findById(acquiredPremium.globalAssetId!);assert.equal(global?.versions.length,2);assert.equal(global?.replacementHistory.length,1);assert.equal(global?.currentVersion,2);
});
