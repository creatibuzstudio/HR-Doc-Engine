import { NextResponse } from "next/server";
import { findAgreementById } from "@/lib/agreementStore";
import { DEFAULT_COMPANY_DETAILS } from "@/data/defaults";
import {
  getBaseUrl,
  getResendFromAddress,
  getResendClient,
} from "@/lib/emailConfig";
import { buildEmailHtml } from "@/lib/emailTemplates";
import { getSession } from "@/lib/auth";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Only authenticated founders/admins can dispatch offer emails
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login." },
        { status: 401 },
      );
    }

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

    const candidate = agreement.candidateDetails || agreement.secondParty || {};
    const firstParty = agreement.firstParty || {
      companyName: DEFAULT_COMPANY_DETAILS.companyName,
      representedBy: DEFAULT_COMPANY_DETAILS.founderCEO,
      role: "Founder & CEO",
      ceoName: DEFAULT_COMPANY_DETAILS.founderCEO,
      ceoMobile: DEFAULT_COMPANY_DETAILS.ceoMobile,
      cooName: DEFAULT_COMPANY_DETAILS.coFounderCOO,
      cooMobile: DEFAULT_COMPANY_DETAILS.cooMobile,
      hrName: DEFAULT_COMPANY_DETAILS.coFounderCOO,
      hrMobile: DEFAULT_COMPANY_DETAILS.cooMobile,
      currentAddress: DEFAULT_COMPANY_DETAILS.officeAddress,
      permanentAddress: DEFAULT_COMPANY_DETAILS.officeAddress,
      mobileNumber: DEFAULT_COMPANY_DETAILS.contactNumber,
      nidNumber: "2874935543",
      email: DEFAULT_COMPANY_DETAILS.email,
      website: DEFAULT_COMPANY_DETAILS.website,
      signatureImg: DEFAULT_COMPANY_DETAILS.signatureImg,
    };
    const secondParty = {
      partnerId: candidate.employeeId || candidate.partnerId || "",
      fullName: candidate.fullName || "",
      email: candidate.email || "",
      mobileNumber: candidate.contactNumber || candidate.mobileNumber || "",
      presentAddress: candidate.livingAddress || candidate.presentAddress || "",
      permanentAddress: candidate.livingAddress || candidate.permanentAddress || "",
      position: candidate.position || "",
      ...candidate,
    };
    const docSettings = agreement.docSettings || {
      contractRef: agreement.contractRef,
      refId: agreement.contractRef,
      date: agreement.issueDate,
      employmentType: agreement.employmentType,
      contractSubject: agreement.contractSubject,
    };
    const agreementTemplate =
      agreement.agreementTemplate ||
      (agreement.contractRef ? "contractual" : docSettings.agreementTemplate);

    let candidateEmail = candidate.email;
    let candidateName = candidate.fullName || "Candidate";

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

    const ctaLink = `${getBaseUrl()}/?candidateView=${encodeURIComponent(offerId)}`;
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
