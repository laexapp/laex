import 'server-only';
import crypto from 'node:crypto';

function keyFrom(value:string){const key=Buffer.from(value,'base64url');if(key.length!==32)throw new Error('El secreto de cifrado Canva debe contener exactamente 32 bytes en Base64URL.');return key;}
export function sealServerData(value:unknown,secret:string){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',keyFrom(secret),iv);const encrypted=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64url');}
export function openServerData<T>(value:string,secret:string):T{const bytes=Buffer.from(value,'base64url');if(bytes.length<29)throw new Error('Datos OAuth inválidos.');const iv=bytes.subarray(0,12),tag=bytes.subarray(12,28),encrypted=bytes.subarray(28),decipher=crypto.createDecipheriv('aes-256-gcm',keyFrom(secret),iv);decipher.setAuthTag(tag);return JSON.parse(Buffer.concat([decipher.update(encrypted),decipher.final()]).toString('utf8')) as T;}
