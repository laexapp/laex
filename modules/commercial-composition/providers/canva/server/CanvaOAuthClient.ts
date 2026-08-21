import 'server-only';
import { z } from 'zod';
import type { CanvaServerConfiguration } from './config';

const tokenSchema=z.object({access_token:z.string().min(1),refresh_token:z.string().min(1),token_type:z.string(),expires_in:z.number().positive(),scope:z.string().optional()});
const introspectionSchema=z.object({active:z.boolean().optional(),user_id:z.string().optional(),team_id:z.string().optional(),scope:z.string().optional()}).passthrough();
export type CanvaTokenResponse=z.infer<typeof tokenSchema>;

export class CanvaOAuthClient{
  constructor(private readonly config:CanvaServerConfiguration,private readonly request:typeof fetch=fetch){}
  exchangeCode(code:string,codeVerifier:string){return this.tokenRequest(new URLSearchParams({grant_type:'authorization_code',code,code_verifier:codeVerifier,redirect_uri:this.config.redirectUri}));}
  refresh(refreshToken:string){return this.tokenRequest(new URLSearchParams({grant_type:'refresh_token',refresh_token:refreshToken}));}
  async introspect(token:string){const response=await this.formRequest('https://api.canva.com/rest/v1/oauth/introspect',new URLSearchParams({token}));return introspectionSchema.parse(await response.json());}
  async revoke(token:string){await this.formRequest('https://api.canva.com/rest/v1/oauth/revoke',new URLSearchParams({token}));}
  private async tokenRequest(body:URLSearchParams){const response=await this.formRequest('https://api.canva.com/rest/v1/oauth/token',body);return tokenSchema.parse(await response.json());}
  private async formRequest(url:string,body:URLSearchParams){const basic=Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');const response=await this.request(url,{method:'POST',headers:{authorization:`Basic ${basic}`,'content-type':'application/x-www-form-urlencoded',accept:'application/json'},body,cache:'no-store',signal:AbortSignal.timeout(20_000)});if(!response.ok){const requestId=response.headers.get('x-request-id');throw new Error(`Canva OAuth rechazó la solicitud (${response.status})${requestId?` [${requestId}]`:''}.`);}return response;}
}
