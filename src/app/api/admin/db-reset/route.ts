import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/core/auth/session";
import { clearLegacyDatabase } from "@/core/db/cleanup";

export async function POST(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Founder access required." },
      { status: 401 }
    );
  }

  const result = await clearLegacyDatabase();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
