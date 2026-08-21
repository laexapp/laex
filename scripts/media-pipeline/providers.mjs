import fs from 'node:fs/promises';

class DisabledProvider{
  name='disabled';
  async removeBackground(){throw new Error('No hay proveedor externo habilitado. Configure LAEX_MEDIA_PROVIDER cuando exista aprobacion.');}
}

class PhotoroomProvider{
  name='photoroom';
  constructor(apiKey){if(!apiKey)throw new Error('Falta PHOTOROOM_API_KEY. No se enviaron archivos.');this.apiKey=apiKey;}
  async removeBackground(inputPath,outputPath){
    const bytes=await fs.readFile(inputPath),form=new FormData();
    form.append('image_file',new Blob([bytes],{type:'image/png'}),'source.png');
    form.append('format','png');form.append('channels','rgba');form.append('size','full');
    const response=await fetch('https://sdk.photoroom.com/v1/segment',{method:'POST',headers:{'x-api-key':this.apiKey},body:form});
    if(!response.ok)throw new Error(`Photoroom rechazo la imagen (${response.status}).`);
    await fs.writeFile(outputPath,Buffer.from(await response.arrayBuffer()));
  }
}

export function createBackgroundRemovalProvider(){
  const selected=(process.env.LAEX_MEDIA_PROVIDER??'disabled').toLowerCase();
  if(selected==='disabled'||selected==='local')return new DisabledProvider();
  if(selected==='photoroom')return new PhotoroomProvider(process.env.PHOTOROOM_API_KEY);
  throw new Error(`Proveedor no soportado: ${selected}`);
}
