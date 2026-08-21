import { NextRequest } from "next/server";
import { businessCommandResponse, businessSnapshotResponse } from "@/modules/business-engine/server/BusinessRequestHandlers";
export const runtime = "nodejs";
export async function GET(request: NextRequest) { return businessSnapshotResponse(request); }
export async function POST(request: NextRequest) { return businessCommandResponse(request); }
