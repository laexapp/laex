import { NextRequest, NextResponse } from "next/server";
import { CompanyResolver } from "@/modules/business-engine/platform/CompanyResolver";
import { apiError } from "@/modules/business-engine/server/ApiErrors";
import { getBusinessRuntime } from "@/modules/business-engine/server/runtime";

async function context(companyValue:string){const runtime=getBusinessRuntime(),company=await new CompanyResolver(runtime.store).bySlugOrHost(companyValue);return{runtime,company}}
export async function GET(_:NextRequest,{params}:{params:Promise<{company:string}>}){try{const{runtime,company}=await context((await params).company);return NextResponse.json({methods:await runtime.commercePayments.publicMethods(company.id)})}catch(error){return apiError(error,"payment_methods_failed")}}
export async function POST(request:NextRequest,{params}:{params:Promise<{company:string}>}){try{const{runtime,company}=await context((await params).company),body=await request.json();return NextResponse.json(await runtime.commercePayments.submit(company.id,request.headers.get("idempotency-key")??"",body),{status:201,headers:{"cache-control":"no-store"}})}catch(error){return apiError(error,"payment_submission_failed")}}
