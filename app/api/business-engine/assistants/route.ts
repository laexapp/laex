import { NextRequest } from "next/server";
import { assistantCommandResponse, assistantHistoryResponse } from "@/modules/business-engine/server/BusinessRequestHandlers";
export const runtime = "nodejs";
export async function GET(request: NextRequest) { return assistantHistoryResponse(request); }
export async function POST(request: NextRequest) { return assistantCommandResponse(request); }
