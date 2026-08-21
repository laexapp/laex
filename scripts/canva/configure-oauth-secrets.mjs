import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const envFile=path.resolve('.env.local');
const requiredCredentials=['CANVA_CLIENT_ID','CANVA_CLIENT_SECRET','CANVA_REDIRECT_URI'];
const scopes='asset:read asset:write design:content:read design:content:write design:meta:read brandtemplate:meta:read brandtemplate:content:read';
const randomSecret=()=>crypto.randomBytes(32).toString('base64url');
const escapeValue=value=>`"${value.replaceAll('\\','\\\\').replaceAll('"','\\"')}"`;

let source;
try{source=await fs.readFile(envFile,'utf8');}catch(error){if(error.code==='ENOENT')throw new Error('.env.local no existe. Configure primero las credenciales Canva.');throw error;}
const lines=source.split(/\r?\n/),values=new Map();
for(const line of lines){const match=line.match(/^\s*([A-Z0-9_]+)=(.*)$/);if(match)values.set(match[1],match[2].trim().replace(/^"|"$/g,''));}
for(const name of requiredCredentials)if(!values.get(name))throw new Error(`Falta ${name} en .env.local.`);
const additions=[];
if(!values.get('CANVA_TOKEN_ENCRYPTION_KEY'))additions.push(`CANVA_TOKEN_ENCRYPTION_KEY=${escapeValue(randomSecret())}`);
if(!values.get('CANVA_OAUTH_COOKIE_SECRET'))additions.push(`CANVA_OAUTH_COOKIE_SECRET=${escapeValue(randomSecret())}`);
if(!values.get('CANVA_SCOPES'))additions.push(`CANVA_SCOPES=${escapeValue(scopes)}`);
if(additions.length){const next=`${source.trimEnd()}\n\n# Canva Connect OAuth — server-only\n${additions.join('\n')}\n`,temporary=`${envFile}.${process.pid}.tmp`;await fs.writeFile(temporary,next,{encoding:'utf8',mode:0o600});await fs.rename(temporary,envFile);}
console.log(JSON.stringify({configured:true,credentialsPresent:true,generated:additions.map(line=>line.slice(0,line.indexOf('=')))}));
