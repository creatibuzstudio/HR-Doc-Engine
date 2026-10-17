import { NextResponse } from "next/server";
import {
  generateInternIds,
  generateHrHiringIds,
  generateContractualIds,
  listAgreements,
  saveAgreement,
  findAgreementById,
  toAgreementSummary,
} from "@/lib/agreementStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const agreement = await findAgreementById(id);
      if (!agreement) {
        return NextResponse.json(
          { error: "Agreement not found." },
          { status: 404 },
        );
      }
      return NextResponse.json(agreement);
    }

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
      letterPDFdata,
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

    if (isContractual) {
      const issueDate =
        docSettings?.date?.trim() ||
        new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

      const positionName = secondParty?.position || "Senior Full Stack Developer";
      const employmentModel = docSettings?.employmentType || "Project-Based Contract";
      const contractSubject =
        docSettings?.contractSubject?.trim() ||
        `${positionName} For A ${employmentModel}`;

      // Strictly the user's requested schema — no companyDetails in DB, no extra fields
      const contractualPayload = {
        docType: "Contractual Offer",
        issueDate,
        contractRef: agreementId,
        employmentType: employmentModel,
        contractSubject,
        candidateDetails: {
          employeeId: partnerId,
          fullName: secondParty?.fullName || "",
          email: secondParty?.email || "",
          contactNumber: secondParty?.mobileNumber || "",
          livingAddress: secondParty?.presentAddress || "",
          position: positionName,
          signatureImg: secondParty?.signatureImg || "",
          signatureDate: secondParty?.signatureImg ? new Date() : null,
        },
        isFounderSigned: true,
        isCandidateSigned: false,
        status: "PENDING_PARTNER_SIGNATURE",
        letterPDFdata: letterPDFdata || "",
        isFinalletterSentToBoth: false,
      };

      await saveAgreement(contractualPayload);
    } else {
      const updatedSecondParty = { ...secondParty, partnerId };
      const updatedDocSettings = {
        ...docSettings,
        agreementTemplate: resolvedTemplate,
        ...(isHrHiring
          ? { hrNoticeRefId: agreementId, hrNoticeId: partnerId }
          : { internRefId: agreementId, internId: partnerId }),
      };

      await saveAgreement({
        agreementId,
        partnerId,
        docType: resolvedDocType,
        status: isHrHiring ? "FULLY_EXECUTED" : "PENDING_PARTNER_SIGNATURE",
        founderSigned: true,
        partnerSigned: isHrHiring ? true : false,
        signedAt: isHrHiring ? new Date() : undefined,
        firstParty,
        secondParty: updatedSecondParty,
        docSettings: updatedDocSettings,
        ...(letterPDFdata ? { letterPDFdata } : {}),
      });
    }

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
