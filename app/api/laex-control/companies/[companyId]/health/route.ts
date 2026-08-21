import { NextRequest,NextResponse } from "next/server";
import { CONTROL_COOKIE,requireControl } from "@/modules/business-engine/platform/ControlPlaneIdentity";
import { PlatformOperationsService } from "@/modules/business-engine/platform/PlatformOperationsService";
import { getBusinessRuntime } from "@/modules/business-engine/server/runtime";
import type { CompanyId } from "@/modules/business-engine/domain/types";
const local=(r:NextRequest)=>["localhost","127.0.0.1","::1"].includes(r.nextUrl.hostname);
export async function GET(request:NextRequest,{params}:{params:Promise<{companyId:string}>}){try{requireControl(request.cookies.get(CONTROL_COOKIE)?.value,local(request));const runtime=getBusinessRuntime();return NextResponse.json(await new PlatformOperationsService(runtime.store,runtime.businessIdentity).health((await params).companyId as CompanyId));}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"unauthorized"},{status:401});}}
