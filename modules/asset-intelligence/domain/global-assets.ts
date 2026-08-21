import type { GlobalAssetEvent, GlobalAssetEventKind, GlobalAssetId } from './types';

export const formatGlobalAssetId=(sequence:number):GlobalAssetId=>{
  if(!Number.isSafeInteger(sequence)||sequence<1)throw new Error('La secuencia global debe ser un entero positivo.');
  return`LAEX-ASSET-${String(sequence).padStart(7,'0')}`;
};

export const isGlobalAssetId=(value:string):value is GlobalAssetId=>/^LAEX-ASSET-\d{7,}$/.test(value);

export const historyKey=(kind:GlobalAssetEventKind):keyof Pick<{processingHistory:GlobalAssetEvent[];publicationHistory:GlobalAssetEvent[];replacementHistory:GlobalAssetEvent[];approvalHistory:GlobalAssetEvent[]},'processingHistory'|'publicationHistory'|'replacementHistory'|'approvalHistory'>=>`${kind}History` as const;
