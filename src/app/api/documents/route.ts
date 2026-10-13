import { NextResponse } from "next/server";
import { listAllDocuments } from "@/core/services/document.service";
import { isAuthorizedRequest } from "@/core/auth/session";

export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    const items = await listAllDocuments();
    return NextResponse.json({ success: true, documents: items });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
