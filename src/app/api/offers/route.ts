import { NextResponse } from "next/server";
import {
  generateInternIds,
  generateHrHiringIds,
  generateContractualIds,
  listAgreements,
  saveAgreement,
  toAgreementSummary,
} from "@/lib/agreementStore";

export async function GET() {
  try {
    const agreements = await listAgreements();
    return NextResponse.json({
      success: true,
      agreements: agreements.map(toAgreementSummary),
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error listing agreements:", err);
    return NextResponse.json(
      { error: "Failed to list agreements." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstParty,
      secondParty,
      docSettings,
      docType = "contractual",
      agreementTemplate,
    } = body;

    const resolvedTemplate =
      agreementTemplate || docSettings?.agreementTemplate || "contractual";
    const isInternship = resolvedTemplate === "internship";
    const isHrHiring = resolvedTemplate === "hrHiringNotice";
    const isContractual = resolvedTemplate === "contractual";

    let agreementId: string;
    let partnerId: string;
    let storage: string;

    if (isHrHiring) {
      const generated = await generateHrHiringIds();
      agreementId = docSettings?.hrNoticeRefId || generated.hrNoticeRefId;
      partnerId = docSettings?.hrNoticeId || generated.hrNoticeId;
      storage = generated.storage;
    } else if (isInternship) {
      const generated = await generateInternIds();
      agreementId = docSettings?.internRefId || generated.internRefId;
      partnerId = docSettings?.internId || generated.internId;
      storage = generated.storage;
    } else {
      const generated = await generateContractualIds();
      agreementId =
        docSettings?.contractualRefId || generated.contractualRefId;
      partnerId = docSettings?.contractualId || generated.contractualId;
      storage = generated.storage;
    }

    let resolvedDocType: string = docType;
    if (isContractual) {
      resolvedDocType = "Contractual Offer";
    } else if (isHrHiring) {
      resolvedDocType = "HR Hiring Notice";
    } else if (isInternship) {
      resolvedDocType = "Intern Offer Letter";
    }

    const updatedSecondParty = isContractual
      ? { ...secondParty, contractualId: partnerId, partnerId }
      : { ...secondParty, partnerId };

    const updatedDocSettings = {
      ...docSettings,
      agreementTemplate: resolvedTemplate,
      ...(isContractual
        ? { contractualRefId: agreementId, contractualId: partnerId }
        : isHrHiring
          ? { hrNoticeRefId: agreementId, hrNoticeId: partnerId }
          : { internRefId: agreementId, internId: partnerId }),
    };

    await saveAgreement({
      agreementId,
      partnerId,
      docType: resolvedDocType,
      status: "PENDING_PARTNER_SIGNATURE",
      founderSigned: true,
      partnerSigned: false,
      firstParty,
      secondParty: updatedSecondParty,
      docSettings: updatedDocSettings,
    });

    console.log(`[Next.js API] Agreement saved (${storage}): ${agreementId}`);
    return NextResponse.json({
      success: true,
      agreementId,
      partnerId,
      storage,
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error saving agreement:", err);
    return NextResponse.json(
      {
        error: "Failed to save agreement.",
        details:
          process.env.NODE_ENV === "development"
            ? (err as Error).message
            : undefined,
      },
      { status: 500 },
    );
  }
}
