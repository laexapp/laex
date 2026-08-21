import { NextRequest } from "next/server";
import { loginResponse, logoutResponse } from "@/modules/business-engine/server/BusinessRequestHandlers";
export const runtime = "nodejs";
export async function POST(request: NextRequest) { return loginResponse(request); }
export async function DELETE() { return logoutResponse(); }
