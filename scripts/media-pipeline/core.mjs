import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import{createBackgroundRemovalProvider}from'./providers.mjs';

const sha256=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const exists=async file=>fs.access(file).then(()=>true,()=>false);
const validId=id=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
const portable=file=>path.relative(process.cwd(),file).replaceAll('\\','/');
const minimumFor=(project,id)=>project.temporaryManualPolicy?.assetIds?.includes(id)?project.temporaryManualPolicy.minimumLongestSide:project.minimumLongestSide;
const qualityFor=(project,id,longestSide=0)=>project.temporaryManualPolicy?.assetIds?.includes(id)&&longestSide<project.minimumLongestSide?{state:'temporary-manual',label:project.temporaryManualPolicy.label,replacementRequired:true}:{state:'definitive',replacementRequired:false};

async function readRegistry(project){
  if(!(await exists(project.paths.registry)))return new Map();
  try{const data=JSON.parse(await fs.readFile(project.paths.registry,'utf8'));return new Map((data.assets??[]).map(asset=>[asset.id,asset]));}catch{return new Map();}
}

async function inspectSource(file){
  const metadata=await sharp(file,{failOn:'error'}).metadata();
  if(!['png','webp'].includes(metadata.format))throw new Error(`formato interno ${metadata.format??'desconocido'}; solo PNG o WebP`);
  if(!metadata.width||!metadata.height)throw new Error('no fue posible determinar la resolucion');
  return metadata;
}

async function validateTransparentPng(file,minimum){
  const image=sharp(file,{failOn:'error'}),metadata=await image.metadata();
  if(metadata.format!=='png')throw new Error('el candidato procesado no es PNG');
  if(!metadata.width||!metadata.height||Math.max(metadata.width,metadata.height)<minimum)throw new Error(`resolucion ${metadata.width??0}x${metadata.height??0}; se requieren al menos ${minimum} px en el lado mayor`);
  if(!metadata.hasAlpha||metadata.channels!==4)throw new Error('no tiene canal alfa RGBA real');
  const alpha=await image.ensureAlpha().extractChannel('alpha').stats();
  if(alpha.channels[0]?.min!==0)throw new Error('no contiene pixeles 100% transparentes');
  const corners=await Promise.all([[0,0],[metadata.width-1,0],[0,metadata.height-1],[metadata.width-1,metadata.height-1]].map(([left,top])=>sharp(file).extract({left,top,width:1,height:1}).ensureAlpha().raw().toBuffer()));
  if(corners.some(pixel=>pixel[3]!==0))throw new Error('una o mas esquinas no son 100% transparentes');
  return metadata;
}

async function sourceCandidates(project,id){
  const candidates=[];
  for(const extension of ['png','webp']){
    const file=path.join(project.paths.source,`${id}-transparent.${extension}`);
    if(await exists(file)){const metadata=await inspectSource(file);candidates.push({file,extension,metadata,longestSide:Math.max(metadata.width,metadata.height)});}
  }
  return candidates.sort((a,b)=>b.longestSide-a.longestSide||(a.extension==='png'?-1:1));
}

async function archiveOriginal(project,id,source){
  const bytes=await fs.readFile(source.file),checksum=sha256(bytes),folder=path.join(project.paths.archive,id);
  await fs.mkdir(folder,{recursive:true});
  const target=path.join(folder,`${checksum}.${source.metadata.format}`);if(!(await exists(target)))await fs.copyFile(source.file,target);
  return checksum;
}

async function normalizedPng(project,id,source){
  const target=path.join(project.paths.working,`${id}-input.png`);
  await sharp(source.file,{failOn:'error'}).png({compressionLevel:9}).toFile(target);
  return target;
}

async function normalizeCandidateAlpha(project,id,candidate){
  const original=await fs.readFile(candidate),checksum=sha256(original),rawFolder=path.join(project.paths.review,'raw');
  await fs.mkdir(rawFolder,{recursive:true});
  const archived=path.join(rawFolder,`${id}-${checksum}.png`);if(!(await exists(archived)))await fs.copyFile(candidate,archived);
  const{data,info}=await sharp(candidate).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let index=3;index<data.length;index+=4)if(data[index]<=1)data[index]=0;
  const temporary=path.join(project.paths.working,`${id}-candidate-normalized.png`);
  await sharp(data,{raw:info}).png({compressionLevel:9}).toFile(temporary);await fs.copyFile(temporary,candidate);
  return archived;
}

async function publish(project,id,input,metadata,checksum,source){
  const minimum=minimumFor(project,id),quality=qualityFor(project,id,Math.max(metadata.width??0,metadata.height??0));
  await fs.copyFile(input,path.join(project.paths.published,`${id}-transparent.png`));
  for(const rendition of project.renditions)await sharp(input).resize({width:rendition.width,height:rendition.width,fit:'inside',withoutEnlargement:true}).webp({quality:rendition.quality,alphaQuality:100}).toFile(path.join(project.paths.published,`${id}-${rendition.name}.webp`));
  await fs.copyFile(path.join(project.paths.published,`${id}-desktop.webp`),path.join(project.paths.published,`${id}-hero.webp`));
  return{id,status:'published',quality,source:{uri:portable(source.file),format:source.metadata.format,width:source.metadata.width,height:source.metadata.height,checksum},publishedAt:new Date().toISOString(),outputs:{transparent:`${id}-transparent.png`,hero:`${id}-hero.webp`,desktop:`${id}-desktop.webp`,tablet:`${id}-tablet.webp`,mobile:`${id}-mobile.webp`},validation:{status:'passed',width:metadata.width,height:metadata.height,requiredLongestSide:minimum,withoutEnlargement:true}};
}

const pendingImprovement=(project,id,source,checksum)=>{const minimum=minimumFor(project,id);return{id,status:'pending-improvement',quality:qualityFor(project,id,source.longestSide),source:{uri:portable(source.file),format:source.metadata.format,width:source.metadata.width,height:source.metadata.height,checksum},validation:{status:'failed',code:'insufficient-resolution',foundResolution:`${source.metadata.width}x${source.metadata.height}`,foundLongestSide:source.longestSide,requiredLongestSide:minimum,reason:`Resolucion ${source.metadata.width}x${source.metadata.height}; se requieren al menos ${minimum} px en el lado mayor.`,suggestion:'Volver a procesar cuando exista una version autorizada de mayor calidad. No ampliar artificialmente.'},updatedAt:new Date().toISOString()}};

async function approveCandidate(project,id,registry){
  if(!validId(id))throw new Error(`Identificador de activo no valido: ${id}`);
  const candidate=path.join(project.paths.review,`${id}-transparent.png`);
  if(!(await exists(candidate)))throw new Error(`No existe candidato en revision para ${project.id}/${id}.`);
  const minimum=minimumFor(project,id),metadata=await validateTransparentPng(candidate,minimum),sources=await sourceCandidates(project,id);
  if(!sources.length)throw new Error(`No existe fuente maestra para ${project.id}/${id}.`);
  const source=sources[0],checksum=await archiveOriginal(project,id,source);
  registry.set(id,await publish(project,id,candidate,metadata,checksum,source));
  console.log(`APROBADO ${project.id}/${id}: candidato publicado; fuente maestra preservada.`);
}

export async function runMediaPipeline(project,{processExternal=false,reviewExisting=false,assetId,approve}={}){
  await Promise.all([project.paths.source,project.paths.archive,project.paths.review,project.paths.working,project.paths.published,path.dirname(project.paths.registry)].map(folder=>fs.mkdir(folder,{recursive:true})));
  if(processExternal){
    if(!assetId)throw new Error('El procesamiento externo exige --id para impedir lotes accidentales.');
    if(!project.externalTrialAssetIds.includes(assetId))throw new Error(`Prueba externa bloqueada para ${project.id}/${assetId}. Activo autorizado: ${project.externalTrialAssetIds.join(', ')}.`);
  }
  const registry=await readRegistry(project),errors=[];
  if(approve){await approveCandidate(project,approve,registry);await writeRegistry(project,registry);return;}
  if(reviewExisting){
    if(!assetId)throw new Error('La revision existente exige --id.');
    const candidate=path.join(project.paths.review,`${assetId}-transparent.png`),sources=await sourceCandidates(project,assetId);
    if(!(await exists(candidate))||!sources.length)throw new Error(`Falta candidato o fuente maestra para ${project.id}/${assetId}.`);
    const minimum=minimumFor(project,assetId),rawProviderOutput=await normalizeCandidateAlpha(project,assetId,candidate),metadata=await validateTransparentPng(candidate,minimum),source=sources[0],checksum=await archiveOriginal(project,assetId,source);
    registry.set(assetId,{id:assetId,status:'review-required',quality:qualityFor(project,assetId,Math.max(metadata.width??0,metadata.height??0)),source:{uri:portable(source.file),format:source.metadata.format,width:source.metadata.width,height:source.metadata.height,checksum},candidate:{uri:portable(candidate),format:'png',width:metadata.width,height:metadata.height},rawProviderOutput:portable(rawProviderOutput),provider:'photoroom',validation:{status:'passed',requiredLongestSide:minimum,alphaFloorNormalized:'0-1 -> 0',withoutEnlargement:true},suggestion:'Revisar fidelidad absoluta del modelo antes de aprobar la publicacion.',updatedAt:new Date().toISOString()});
    await writeRegistry(project,registry);console.log(`REVISION ${project.id}/${assetId}: candidato existente validado. No fue publicado.`);return;
  }
  const discovered=(await fs.readdir(project.paths.source)).map(name=>name.match(/^([a-z0-9]+(?:-[a-z0-9]+)*)-transparent\.(?:png|webp)$/)?.[1]).filter(Boolean);
  const assetIds=assetId?[assetId]:[...new Set([...project.requiredAssetIds,...discovered])];
  for(const id of assetIds){
    if(!validId(id)){errors.push(`${id}: identificador no valido`);continue;}
    let sources;try{sources=await sourceCandidates(project,id);}catch(error){errors.push(`${id}: ${error.message}`);continue;}
    if(!sources.length){const message=`falta ${id}-transparent.png o ${id}-transparent.webp en ${portable(project.paths.source)}`;if(assetId)errors.push(`${id}: ${message}`);else console.log(`PENDIENTE ${id}: ${message}`);continue;}
    const source=sources[0],checksum=await archiveOriginal(project,id,source);
    const minimum=minimumFor(project,id);
    if(source.longestSide<minimum){const state=pendingImprovement(project,id,source,checksum);registry.set(id,state);console.log(`PENDIENTE DE MEJORA ${project.id}/${id}: ${state.validation.reason} ${state.validation.suggestion}`);continue;}
    const existing=registry.get(id);
    if(existing?.status==='review-required'&&existing.source?.checksum===checksum){console.log(`REVISION PENDIENTE ${project.id}/${id}: candidato validado; falta auditoria humana.`);continue;}
    const input=await normalizedPng(project,id,source);
    try{
      const metadata=await validateTransparentPng(input,minimum);
      registry.set(id,await publish(project,id,input,metadata,checksum,source));console.log(`PUBLICADO ${project.id}/${id}: fuente oficial transparente validada.`);
    }catch(error){
      if(processExternal){
        try{const provider=createBackgroundRemovalProvider(),candidate=path.join(project.paths.review,`${id}-transparent.png`);await provider.removeBackground(input,candidate);const rawProviderOutput=await normalizeCandidateAlpha(project,id,candidate),metadata=await validateTransparentPng(candidate,minimum);registry.set(id,{id,status:'review-required',quality:qualityFor(project,id,Math.max(metadata.width??0,metadata.height??0)),source:{uri:portable(source.file),format:source.metadata.format,width:source.metadata.width,height:source.metadata.height,checksum},candidate:{uri:portable(candidate),format:'png',width:metadata.width,height:metadata.height},rawProviderOutput:portable(rawProviderOutput),provider:provider.name,validation:{status:'passed',requiredLongestSide:minimum,alphaFloorNormalized:'0-1 -> 0',withoutEnlargement:true},suggestion:'Revisar fidelidad absoluta del modelo antes de aprobar la publicacion.',updatedAt:new Date().toISOString()});console.log(`REVISION ${project.id}/${id}: ${provider.name} genero un candidato valido. No fue publicado.`);}
        catch(providerError){errors.push(`${id}: ${providerError.message}`);}
      }else{
        const previous=registry.get(id);
        if(previous?.status==='review-required'&&previous.source?.checksum===checksum){console.log(`REVISION PENDIENTE ${project.id}/${id}: candidato validado; falta auditoria humana.`);}
        else{registry.set(id,{id,status:'pending-processing',quality:qualityFor(project,id,source.longestSide),source:{uri:portable(source.file),format:source.metadata.format,width:source.metadata.width,height:source.metadata.height,checksum},validation:{status:'passed',requiredLongestSide:minimum,withoutEnlargement:true},reason:'La fuente autorizada cumple resolucion, pero requiere eliminacion de fondo.',suggestion:'Ejecutar npm run media:process cuando el proveedor aprobado este disponible.',updatedAt:new Date().toISOString()});console.log(`PENDIENTE DE PROCESAMIENTO ${project.id}/${id}: fuente ${source.metadata.format.toUpperCase()} ${source.metadata.width}x${source.metadata.height}; requiere eliminacion de fondo.`);}
      }
    }
  }
  await writeRegistry(project,registry);
  if(errors.length){console.error('\nVALIDACION FALLIDA\n- '+errors.join('\n- '));process.exitCode=1;}
}

async function writeRegistry(project,registry){
  const data={schemaVersion:2,projectId:project.id,generatedAt:new Date().toISOString(),assets:[...registry.values()].sort((a,b)=>a.id.localeCompare(b.id))};
  await fs.writeFile(project.paths.registry,JSON.stringify(data,null,2)+'\n');
}
