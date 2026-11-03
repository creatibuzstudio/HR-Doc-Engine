import { NextResponse } from "next/server";
import { findAgreementByVerifyId } from "../../../../lib/verify";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agreement = await findAgreementByVerifyId(id);

    if (!agreement) {
      return NextResponse.json(
        {
          valid: false,
          status: "NOT_FOUND",
          message: "No matching document was found in the Creatibuz Studio registry.",
        },
        { status: 404 }
      );
    }

    const candidate =
      agreement.candidateDetails || agreement.secondParty || {};

    const isExecuted =
      agreement.status === "FULLY_EXECUTED" ||
      agreement.status === "FINALISED" ||
      Boolean(agreement.isCandidateSigned);

    const refId = agreement.contractRef || agreement.agreementId || id;
    const empId = candidate.employeeId || agreement.partnerId || "";

    const signedAtDate = candidate.signatureDate || agreement.signedAt;
    const createdAtDate = agreement.createdAt;

    return NextResponse.json({
      valid: isExecuted,
      status: agreement.status,
      agreementId: refId,
      partnerId: empId,
      docType: agreement.docType || "Contractual Offer",
      agreementTemplate:
        agreement.docSettings?.agreementTemplate ||
        (agreement.contractRef ? "contractual" : "contractual"),
      companyName: agreement.firstParty?.companyName || "Creatibuz Studio",
      partnerName: candidate.fullName || "",
      position: candidate.position || "",
      signedAt: signedAtDate
        ? new Date(signedAtDate).toISOString()
        : null,
      createdAt: createdAtDate
        ? new Date(createdAtDate).toISOString()
        : null,
      founderSigned: Boolean(agreement.isFounderSigned ?? agreement.founderSigned ?? true),
      partnerSigned: Boolean(agreement.isCandidateSigned ?? agreement.partnerSigned),
      message: isExecuted
        ? "This document is authentic and fully executed."
        : "This document exists but is not yet fully executed.",
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Verification error:", err);
    return NextResponse.json(
      { valid: false, status: "ERROR", message: "Verification service unavailable." },
      { status: 500 }
    );
  }
}
