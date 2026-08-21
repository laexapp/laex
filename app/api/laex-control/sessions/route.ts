import { NextRequest,NextResponse } from "next/server";
import { CONTROL_COOKIE,requireControl } from "@/modules/business-engine/platform/ControlPlaneIdentity";
import { getBusinessRuntime } from "@/modules/business-engine/server/runtime";
import type { CompanyId } from "@/modules/business-engine/domain/types";
const local=(r:NextRequest)=>["localhost","127.0.0.1","::1"].includes(r.nextUrl.hostname);
export async function DELETE(request:NextRequest){try{requireControl(request.cookies.get(CONTROL_COOKIE)?.value,local(request));const{companyId,reason}=await request.json()as{companyId:string;reason?:string};return NextResponse.json(await getBusinessRuntime().businessIdentity.revokeCompanySessions(companyId as CompanyId,"laex-platform-admin",reason??"platform_security"));}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"revocation_failed"},{status:400});}}
