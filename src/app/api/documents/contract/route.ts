import { NextResponse } from "next/server";
import { generateContractAgreementIds } from "@/core/utils/idGenerator";
import { ContractualAgreement } from "@/core/db/models/ContractualAgreement";
import { connectDB } from "@/core/db/connection";
import { isAuthorizedRequest } from "@/core/auth/session";

export async function GET(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  const ids = await generateContractAgreementIds();
  return NextResponse.json({ success: true, ...ids });
}

export async function POST(request: Request) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const doc = new ContractualAgreement(body);
    await doc.save();

    return NextResponse.json({
      success: true,
      agreementId: doc.agreementId,
      contractorId: doc.contractorId,
      document: doc.toObject(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
