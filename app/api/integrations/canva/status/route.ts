import { NextResponse } from 'next/server';
import { createCanvaServerIntegration } from '@/modules/commercial-composition/providers/canva/server/factory';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){try{const{adapter}=createCanvaServerIntegration();return NextResponse.json(await adapter.connectionStatus(),{headers:{'cache-control':'no-store'}});}catch{return NextResponse.json({provider:'canva',connected:false,configured:false,scopes:[]},{headers:{'cache-control':'no-store'}});}}
