import assert from 'node:assert/strict';
import test from 'node:test';
import { StrictEpsonPublicConnector } from '../../modules/asset-intelligence/providers/epson/StrictEpsonPublicConnector';
import type { AssetSearchRequest, OfficialAssetCandidate } from '../../modules/asset-intelligence/domain/types';

test('el filtro estricto evita registrar logos genéricos como imágenes de producto',async()=>{
  const request:AssetSearchRequest={projectId:'lf-printer',manufacturer:'epson',model:'L3250',assetKind:'product-image',minimumLongestSide:2000};
  const generic={originalUrl:'https://mediaserver.goepson.com/logo_epson.png'} as OfficialAssetCandidate;
  const strict=new StrictEpsonPublicConnector({id:'epson-public',manufacturers:['epson'],async search(){return[generic];},async acquire(){throw new Error('not used');}});
  assert.deepEqual(await strict.search(request),[]);
});
