import { NextResponse } from "next/server";
import { findAgreementById } from "@/lib/agreementStore";
import {
  getBaseUrl,
  getResendFromAddress,
  getResendClient,
} from "@/lib/emailConfig";
import { buildEmailHtml } from "@/lib/emailTemplates";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { offerId, pdfBase64 } = await request.json();
    if (!offerId) {
      return NextResponse.json(
        { error: "offerId is required" },
        { status: 400 },
      );
    }

    const agreement = await findAgreementById(offerId);
    if (!agreement) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const firstParty = agreement.firstParty || {};
    const secondParty = agreement.secondParty || {};
    const docSettings = agreement.docSettings || {};
    const agreementTemplate =
      agreement.agreementTemplate || docSettings.agreementTemplate;

    let candidateEmail = secondParty.email;
    let candidateName = secondParty.fullName || "Candidate";

    const isContractual = agreementTemplate === "contractual";
    const isInternship = agreementTemplate === "internship";
    const isHrHiring = agreementTemplate === "hrHiringNotice";
    const isCertificate = agreementTemplate === "internCertificate";

    // HR Hiring Notice: send to recipient email
    if (isHrHiring) {
      const hrEmail = docSettings.hrRecipientEmail;
      const hrName = docSettings.hrRecipientName;
      if (hrEmail) candidateEmail = hrEmail;
      if (hrName) candidateName = hrName;
    }

    const ctaLink = `${getBaseUrl()}/?candidateView=${offerId}`;
    const sender = getResendFromAddress();

    const subject = isContractual
      ? `Joining Offer Letter & Work Agreement — ${firstParty.companyName || "Creatibuz Studio"}`
      : isInternship
        ? `Internship Offer Letter — ${firstParty.companyName || "Creatibuz Studio"}`
        : isHrHiring
          ? `HR Hiring Notice: ${docSettings.hrPositionName || "Open Position"}`
          : isCertificate
            ? `Certificate of Internship Completion — ${firstParty.companyName || "Creatibuz Studio"}`
            : `Joining Offer Letter & Work Agreement — ${firstParty.companyName || "Creatibuz Studio"}`;

    const emailHtml = buildEmailHtml({
      candidateName,
      firstParty,
      secondParty,
      docSettings,
      ctaLink,
      isContractual,
      isInternship,
      isHrHiring,
      isCertificate,
    });

    const attachments: { filename: string; content: string }[] = [];
    if (pdfBase64) {
      const filename = isHrHiring
        ? `${docSettings.hrNoticeTitle?.trim() || "HR Hiring Notice"} - ${docSettings.hrNoticeRefId || "CREATIBUZ"}.pdf`
        : isCertificate
          ? `${candidateName} - Internship Certificate.pdf`
          : `Creatibuz-Studio-Document-${offerId}.pdf`;
      attachments.push({ filename, content: pdfBase64 });
    }

    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [candidateEmail],
      subject,
      html: emailHtml,
      ...(attachments.length > 0 ? { attachments } : {}),
    });

    if (error) {
      console.error("[send-offer-email] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to dispatch email", details: error },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (err: unknown) {
    console.error("[send-offer-email] Fatal error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
