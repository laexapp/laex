import type { CommercialCompositionProvider } from '../../domain/ports';
import type { CanvaTokenManager } from './server/CanvaTokenManager';

/** Authentication-only adapter for X-14A. Composition methods arrive in the next phase. */
export class CanvaCompositionAdapter implements CommercialCompositionProvider{
  readonly id='canva';
  constructor(private readonly tokens:CanvaTokenManager){}
  connectionStatus(){return this.tokens.status();}
  disconnect(){return this.tokens.disconnect();}
  async withValidAccessToken<T>(operation:(accessToken:string)=>Promise<T>){const connection=await this.tokens.validConnection();return operation(connection.accessToken);}
}
