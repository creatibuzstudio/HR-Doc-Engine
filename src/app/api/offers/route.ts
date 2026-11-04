import { NextResponse } from "next/server";
import {
  generateInternIds,
  generateHrHiringIds,
  generateContractualIds,
  listAgreements,
  saveAgreement,
  findAgreementById,
  deleteAgreement,
  toAgreementSummary,
} from "@/lib/agreementStore";
import { getSession } from "@/lib/auth";
import { verifyDeletePin } from "@/lib/security/deletePin";

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

    // Listing all agreements is restricted to authenticated founders
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login." },
        { status: 401 },
      );
    }

    const hasMongoUri = Boolean(process.env.MONGODB_URI);
    if (!hasMongoUri) {
      console.warn(
        "[Next.js API] WARNING: MONGODB_URI is not configured in .env.local! Falling back to local storage.",
      );
    }

    const agreements = await listAgreements();
    const summaries = (agreements || [])
      .map((a) => {
        try {
          return toAgreementSummary(a);
        } catch (e) {
          console.warn("[Next.js API] Failed to summarize agreement:", e);
          return null;
        }
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    return NextResponse.json({
      success: true,
      agreements: summaries,
      meta: {
        mongoConfigured: hasMongoUri,
        count: summaries.length,
      },
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error listing agreements:", err);
    return NextResponse.json(
      {
        error: "Failed to list agreements.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}


export async function POST(request: Request) {
  try {
    // Only authenticated founders/admins can generate and save agreements
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login." },
        { status: 401 },
      );
    }

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
        docSettings?.contractRef ||
        docSettings?.refId ||
        generated.contractRef ||
        generated.contractualRefId;
      partnerId =
        secondParty?.partnerId ||
        generated.employeeId ||
        generated.contractualId;
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
        status: "PENDING_CANDIDATE_SIGNATURE",
        letterPDFdata: letterPDFdata || "",
        isFinalletterSentToBoth: false,
      };

      const saveRes = await saveAgreement(contractualPayload);
      if (saveRes?.storage) storage = saveRes.storage;
    } else {
      const updatedSecondParty = { ...secondParty, partnerId };
      const updatedDocSettings = {
        ...docSettings,
        agreementTemplate: resolvedTemplate,
        ...(isHrHiring
          ? { hrNoticeRefId: agreementId, hrNoticeId: partnerId }
          : { internRefId: agreementId, internId: partnerId }),
      };

      const saveRes = await saveAgreement({
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
      if (saveRes?.storage) storage = saveRes.storage;
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

export async function DELETE(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get("id");

    let pin = "";
    let bodyId = "";
    try {
      const body = await request.json();
      pin = body?.pin || "";
      bodyId = body?.agreementId || body?.id || "";
    } catch {}

    const targetId = (bodyId || queryId || "").trim();
    if (!targetId) {
      return NextResponse.json(
        { error: "Agreement ID is required." },
        { status: 400 }
      );
    }

    const clientIdentifier =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      session.email ||
      "admin-session";

    const pinVerification = await verifyDeletePin(pin, clientIdentifier);
    if (!pinVerification.valid) {
      return NextResponse.json(
        { error: pinVerification.error || "Forbidden: Invalid security PIN." },
        { status: 403 }
      );
    }

    const success = await deleteAgreement(targetId);
    if (!success) {
      return NextResponse.json(
        { error: "Agreement not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Agreement deleted successfully.",
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error deleting agreement:", err);
    return NextResponse.json(
      { error: "Failed to delete agreement." },
      { status: 500 }
    );
  }
}

