import { NextRequest,NextResponse } from "next/server";
import { CONTROL_COOKIE,requireControl } from "@/modules/business-engine/platform/ControlPlaneIdentity";
import { PlatformOperationsService } from "@/modules/business-engine/platform/PlatformOperationsService";
import { getBusinessRuntime } from "@/modules/business-engine/server/runtime";
import type { CompanyId } from "@/modules/business-engine/domain/types";
const local=(r:NextRequest)=>["localhost","127.0.0.1","::1"].includes(r.nextUrl.hostname);
export async function POST(request:NextRequest){try{requireControl(request.cookies.get(CONTROL_COOKIE)?.value,local(request));const{companyId}=await request.json()as{companyId?:string},runtime=getBusinessRuntime();return NextResponse.json(await new PlatformOperationsService(runtime.store,runtime.businessIdentity).createBackup(companyId as CompanyId|undefined));}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"backup_failed"},{status:400});}}
