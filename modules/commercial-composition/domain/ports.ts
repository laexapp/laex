import type { CommercialCompositionConnectionStatus,StoredCanvaConnection } from './types';

export interface CommercialCompositionProvider { readonly id:string; connectionStatus():Promise<CommercialCompositionConnectionStatus>; disconnect():Promise<void> }
export interface CanvaTokenStore { read():Promise<StoredCanvaConnection|undefined>; write(connection:StoredCanvaConnection):Promise<void>; delete():Promise<void> }
