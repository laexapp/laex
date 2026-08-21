import { NextRequest,NextResponse } from 'next/server';
import { createCanvaServerIntegration } from '@/modules/commercial-composition/providers/canva/server/factory';
import { CANVA_OAUTH_COOKIE,createCanvaAuthorization } from '@/modules/commercial-composition/providers/canva/server/pkce';
import { sealServerData } from '@/modules/commercial-composition/providers/canva/server/sealed-data';

export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request:NextRequest){try{const{config}=createCanvaServerIntegration();const returnTo=request.nextUrl.searchParams.get('returnTo')??'/configuracion';const{url,transaction}=createCanvaAuthorization(config,returnTo);const response=NextResponse.redirect(url);response.cookies.set(CANVA_OAUTH_COOKIE,sealServerData(transaction,config.oauthCookieSecret),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/api/integrations/canva',maxAge:10*60,priority:'high'});return response;}catch{return NextResponse.json({error:'canva_not_configured'},{status:503});}}
