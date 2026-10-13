import { NextResponse } from "next/server";
import { generateHiringNoticeIds } from "@/core/utils/idGenerator";
import { HrHiringNotice } from "@/core/db/models/HrHiringNotice";
import { connectDB } from "@/core/db/connection";
import { isAuthorizedRequest } from "@/core/auth/session";

export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const ids = await generateHiringNoticeIds();
  return NextResponse.json({ success: true, ...ids });
}

export async function POST(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const doc = new HrHiringNotice(body);
    await doc.save();

    return NextResponse.json({
      success: true,
      noticeId: doc.noticeId,
      document: doc.toObject(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
