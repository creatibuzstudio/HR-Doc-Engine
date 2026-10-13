import { NextResponse } from "next/server";
import { findDocumentById } from "@/core/services/document.service";

interface VerificationDoc {
  status?: string;
  agreementId?: string;
  noticeId?: string;
  offerId?: string;
  firstParty?: { companyName?: string };
  secondParty?: { fullName?: string; position?: string };
  recipient?: { name?: string };
  employmentTerms?: { designation?: string };
  title?: string;
  signedAt?: string;
  createdAt?: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await findDocumentById(id);

    if (!result) {
      return NextResponse.json(
        {
          valid: false,
          status: "NOT_FOUND",
          message: "No matching document found in the JEVXO registry.",
        },
        { status: 404 }
      );
    }

    const doc = result.data as unknown as VerificationDoc;
    const isExecuted =
      doc.status === "FULLY_EXECUTED" ||
      doc.status === "ACCEPTED_AND_SIGNED" ||
      doc.status === "PUBLISHED";

    return NextResponse.json({
      valid: isExecuted,
      status: doc.status,
      id: doc.agreementId || doc.noticeId || doc.offerId,
      docType: result.type,
      companyName: doc.firstParty?.companyName || "JEVXO",
      recipientName: doc.secondParty?.fullName || doc.recipient?.name || "",
      position:
        doc.secondParty?.position ||
        doc.employmentTerms?.designation ||
        doc.title ||
        "",
      signedAt: doc.signedAt || null,
      createdAt: doc.createdAt || null,
      message: isExecuted
        ? "This document is verified and authenticated by JEVXO."
        : "Document found, awaiting final execution signatures.",
    });
  } catch {
    return NextResponse.json(
      { valid: false, status: "ERROR", message: "Verification failed." },
      { status: 500 }
    );
  }
}
