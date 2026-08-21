import 'server-only';
import crypto from 'node:crypto';
import type { CanvaServerConfiguration } from './config';

export const CANVA_OAUTH_COOKIE='laex_canva_oauth';
export type CanvaOAuthTransaction={state:string;codeVerifier:string;createdAt:number;returnTo:string};
const base64url=(bytes:Buffer)=>bytes.toString('base64url');
export function createCanvaAuthorization(config:CanvaServerConfiguration,returnTo='/configuracion'){
  const codeVerifier=base64url(crypto.randomBytes(64)),state=base64url(crypto.randomBytes(32)),codeChallenge=base64url(crypto.createHash('sha256').update(codeVerifier).digest()),transaction:CanvaOAuthTransaction={state,codeVerifier,createdAt:Date.now(),returnTo:returnTo.startsWith('/')&&!returnTo.startsWith('//')?returnTo:'/configuracion'};
  const url=new URL('https://www.canva.com/api/oauth/authorize');url.searchParams.set('code_challenge',codeChallenge);url.searchParams.set('code_challenge_method','s256');url.searchParams.set('scope',config.scopes.join(' '));url.searchParams.set('response_type','code');url.searchParams.set('client_id',config.clientId);url.searchParams.set('state',state);url.searchParams.set('redirect_uri',config.redirectUri);return{url,transaction};
}
