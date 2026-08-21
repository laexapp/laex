import 'server-only';
import { CanvaCompositionAdapter } from '../CanvaCompositionAdapter';
import { CanvaOAuthClient } from './CanvaOAuthClient';
import { CanvaTokenManager } from './CanvaTokenManager';
import { getCanvaServerConfiguration } from './config';
import { defaultCanvaTokenFile,FileCanvaTokenStore } from './FileCanvaTokenStore';

export function createCanvaServerIntegration(){const config=getCanvaServerConfiguration(),store=new FileCanvaTokenStore(defaultCanvaTokenFile(),config.tokenEncryptionKey),oauth=new CanvaOAuthClient(config),tokens=new CanvaTokenManager(store,oauth),adapter=new CanvaCompositionAdapter(tokens);return{config,store,oauth,tokens,adapter};}
