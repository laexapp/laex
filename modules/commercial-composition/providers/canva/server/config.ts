import 'server-only';
import { z } from 'zod';

const configurationSchema=z.object({clientId:z.string().min(1),clientSecret:z.string().min(1),redirectUri:z.string().url(),tokenEncryptionKey:z.string().min(43),oauthCookieSecret:z.string().min(43),scopes:z.array(z.string().min(1)).min(1)});
export type CanvaServerConfiguration=z.infer<typeof configurationSchema>;

const defaultScopes=['asset:read','asset:write','design:content:read','design:content:write','design:meta:read','brandtemplate:meta:read','brandtemplate:content:read'];
export function getCanvaServerConfiguration():CanvaServerConfiguration{
  const config=configurationSchema.parse({clientId:process.env.CANVA_CLIENT_ID,clientSecret:process.env.CANVA_CLIENT_SECRET,redirectUri:process.env.CANVA_REDIRECT_URI,tokenEncryptionKey:process.env.CANVA_TOKEN_ENCRYPTION_KEY,oauthCookieSecret:process.env.CANVA_OAUTH_COOKIE_SECRET,scopes:(process.env.CANVA_SCOPES??defaultScopes.join(' ')).split(/\s+/).filter(Boolean)});
  const redirect=new URL(config.redirectUri);if(redirect.protocol!=='https:'&&!(redirect.protocol==='http:'&&redirect.hostname==='127.0.0.1'))throw new Error('CANVA_REDIRECT_URI debe usar HTTPS o 127.0.0.1 durante desarrollo.');
  return config;
}
