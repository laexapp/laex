import { NextRequest, NextResponse } from "next/server";
import { CompanyResolver } from "@/modules/business-engine/platform/CompanyResolver";
import { apiError } from "@/modules/business-engine/server/ApiErrors";
import { getBusinessRuntime } from "@/modules/business-engine/server/runtime";

export async function POST(request:NextRequest,{params}:{params:Promise<{company:string}>}){
  try{
    const runtime=getBusinessRuntime(),company=await new CompanyResolver(runtime.store).bySlugOrHost((await params).company),body=await request.json() as{publicId?:string;phone?:string};
    return NextResponse.json(await runtime.commercePayments.track(company.id,{publicId:body.publicId??"",phone:body.phone??""}),{headers:{"cache-control":"no-store"}});
  }catch(error){return apiError(error,"order_tracking_failed")}
}
