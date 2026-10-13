import { NextResponse } from "next/server";
import { generateJobOfferIds } from "@/core/utils/idGenerator";
import { JobOffer } from "@/core/db/models/JobOffer";
import { connectDB } from "@/core/db/connection";
import { isAuthorizedRequest } from "@/core/auth/session";

export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const ids = await generateJobOfferIds();
  return NextResponse.json({ success: true, ...ids });
}

export async function POST(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const doc = new JobOffer(body);
    await doc.save();

    return NextResponse.json({
      success: true,
      offerId: doc.offerId,
      employeeId: doc.employeeId,
      document: doc.toObject(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
