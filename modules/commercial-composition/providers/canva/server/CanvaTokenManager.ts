import 'server-only';
import type { CanvaTokenStore } from '../../../domain/ports';
import type { StoredCanvaConnection } from '../../../domain/types';
import { CanvaOAuthClient,type CanvaTokenResponse } from './CanvaOAuthClient';

export class CanvaTokenManager{
  private refreshInFlight?:Promise<StoredCanvaConnection>;
  constructor(private readonly store:CanvaTokenStore,private readonly oauth:CanvaOAuthClient,private readonly refreshBufferMs=5*60*1000){}
  async saveAuthorization(tokens:CanvaTokenResponse){const identity=await this.oauth.introspect(tokens.access_token);if(identity.active===false)throw new Error('Canva devolvió un token inactivo.');const connection=this.toConnection(tokens,identity.user_id,identity.team_id);await this.store.write(connection);return connection;}
  async validConnection(){const current=await this.store.read();if(!current)throw new Error('Canva no está conectado.');if(Date.parse(current.expiresAt)-Date.now()>this.refreshBufferMs)return current;if(!this.refreshInFlight)this.refreshInFlight=this.rotate(current).finally(()=>{this.refreshInFlight=undefined;});return this.refreshInFlight;}
  async disconnect(){const current=await this.store.read();if(current)await this.oauth.revoke(current.refreshToken);await this.store.delete();}
  async status(){const current=await this.store.read();return current?{provider:'canva' as const,connected:true,expiresAt:current.expiresAt,scopes:current.scopes,canvaUserId:current.canvaUserId,updatedAt:current.updatedAt}:{provider:'canva' as const,connected:false,scopes:[]};}
  private async rotate(current:StoredCanvaConnection){const tokens=await this.oauth.refresh(current.refreshToken),next=this.toConnection(tokens,current.canvaUserId,current.canvaTeamId,current.scopes);await this.store.write(next);return next;}
  private toConnection(tokens:CanvaTokenResponse,userId?:string,teamId?:string,fallbackScopes:string[]=[]):StoredCanvaConnection{const refreshedScopes=(tokens.scope??'').split(/\s+/).filter(Boolean);return{accessToken:tokens.access_token,refreshToken:tokens.refresh_token,expiresAt:new Date(Date.now()+tokens.expires_in*1000).toISOString(),scopes:refreshedScopes.length?refreshedScopes:fallbackScopes,canvaUserId:userId,canvaTeamId:teamId,updatedAt:new Date().toISOString()};}
}
