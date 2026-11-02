(function(root){
'use strict';
function matrix(text){return root.LabelQR.create(text,{errorCorrectionLevel:'M'}).modules;}
function drawQR(canvas,text){const m=matrix(text),n=m.size+8;canvas.width=canvas.height=n*8;const c=canvas.getContext('2d');c.fillStyle='white';c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle='black';for(let r=0;r<m.size;r++)for(let x=0;x<m.size;x++)if(m.get(r,x))c.fillRect((x+4)*8,(r+4)*8,8,8);}
function pdf(data,width,height,logo){
 if(width<100||width>150||height<75||height>200)throw Error('Tamaño de etiqueta no admitido.');
 const mm=72/25.4,W=width*mm,H=height*mm,m=matrix(data.qr),ops=[];
 const num=n=>Number(n.toFixed(3)),literal=s=>String(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
 function txt(value,x,y,size=9,bold=false){if([...value].some(c=>c.charCodeAt(0)>255))throw Error('El texto de etiqueta contiene caracteres no imprimibles.');ops.push(`BT /${bold?'F2':'F1'} ${size} Tf ${num(x*mm)} ${num(H-y*mm)} Td (${literal(value)}) Tj ET`);}
 function lines(value,x,y,maxWidth,size=8){const count=Math.floor(maxWidth*mm/(size*.57));const chunks=[];while(value.length){chunks.push(value.slice(0,count));value=value.slice(count);}chunks.forEach((v,i)=>txt(v,x,y+i*3.8,size));return y+chunks.length*3.8+1;}
 ops.push('0 0 0 rg');ops.push(`q ${num(11*mm)} 0 0 ${num(11*mm)} ${num(4*mm)} ${num(H-15*mm)} cm /Logo Do Q`);
 txt('OJO DE HALC\u00d3N',18,9,12,true);txt('ACTIVO FINANCIADO - DEMO',18,14,8,true);
 ops.push(`0.5 w ${num(4*mm)} ${num(H-18*mm)} m ${num(W-4*mm)} ${num(H-18*mm)} l S`);
 txt(data.model,4,24,11,true);let y=31;const left=width-40;
 y=lines('Inventario: '+data.code,4,y,left);y=lines('Inversion: '+data.investmentId,4,y,left);y=lines('Inversionista: '+data.investorCode,4,y,left);y=lines('Capital: US$ '+(data.capital/100).toFixed(2),4,y,left);
 const d=new Date(data.start);y=lines('Inicio: '+[d.getDate(),d.getMonth()+1,d.getFullYear()].join('/'),4,y,left);
 const side=28,qx=width-34,qy=height-38,cell=side/(m.size+8);
 for(let r=0;r<m.size;r++)for(let c=0;c<m.size;c++)if(m.get(r,c))ops.push(`${num((qx+(c+4)*cell)*mm)} ${num(H-(qy+(r+5)*cell)*mm)} ${num(cell*mm+.01)} ${num(cell*mm+.01)} re f`);
 txt('Ficha local autorizada',qx,height-7,6.8);
 if(y>height-8)throw Error('Contenido demasiado largo para este tamaño. Aumenta el alto de la etiqueta.');
 txt(data.provisional?'PROVISIONAL - serie/recepcion pendiente':'RECEPCION VERIFICADA - DEMO',4,height-3,7.2,true);
 const binary=s=>Uint8Array.from(s,c=>c.charCodeAt(0)&255),join=parts=>{const n=parts.reduce((n,p)=>n+p.length,0),b=new Uint8Array(n);let o=0;for(const p of parts){b.set(p,o);o+=p.length;}return b;};
 const stream=binary(ops.join('\n'));
 const objects=[binary('<< /Type /Catalog /Pages 2 0 R >>'),binary('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),binary(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(W)} ${num(H)}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /XObject << /Logo 7 0 R >> >> /Contents 6 0 R >>`),binary('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'),binary('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'),join([binary('<< /Length '+stream.length+' >>\nstream\n'),stream,binary('\nendstream')]),join([binary('<< /Type /XObject /Subtype /Image /Width 96 /Height 96 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+logo.length+' >>\nstream\n'),logo,binary('\nendstream')])];
 const parts=[binary('%PDF-1.4\n%OJO DE HALCON DEMO\n')],offsets=[0];let offset=parts[0].length;
 objects.forEach((obj,i)=>{const b=join([binary((i+1)+' 0 obj\n'),obj,binary('\nendobj\n')]);offsets.push(offset);parts.push(b);offset+=b.length;});
 parts.push(binary('xref\n0 8\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n'+offset+'\n%%EOF'));
 return join(parts);
}
root.InvestLabels={matrix,drawQR,pdf};
})(globalThis);
