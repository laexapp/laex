import { NextRequest,NextResponse } from "next/server";
import { authenticateControl,CONTROL_COOKIE } from "@/modules/business-engine/platform/ControlPlaneIdentity";
const isLocal=(request:NextRequest)=>["localhost","127.0.0.1","::1"].includes(request.nextUrl.hostname);
export async function POST(request:NextRequest){try{const {password}=await request.json();const token=authenticateControl(password??"",isLocal(request));const r=NextResponse.json({authenticated:true});r.cookies.set(CONTROL_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production"&&!isLocal(request),sameSite:"strict",path:"/",maxAge:28800});return r}catch{return NextResponse.json({error:"invalid_credentials"},{status:401})}}
export async function DELETE(){const r=NextResponse.json({authenticated:false});r.cookies.set(CONTROL_COOKIE,"",{httpOnly:true,expires:new Date(0),path:"/"});return r}


