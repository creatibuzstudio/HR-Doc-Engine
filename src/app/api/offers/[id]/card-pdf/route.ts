import { NextResponse } from "next/server";
import {
  findAgreementById,
  updateAgreement,
} from "../../../../../lib/agreementStore";
import {
  getFounderNotificationRecipients,
  getResendFromAddress,
  getResendClient,
} from "../../../../../lib/emailConfig";

// Increase body size — card PDF base64 can be several MB
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendWithRetry(payload: Parameters<ReturnType<typeof getResendClient>["emails"]["send"]>[0]) {
  const resend = getResendClient();
  let result = await resend.emails.send(payload);
  if (!result.error) return result;

  console.warn("[card-pdf] Email delivery failed; retrying once:", result.error);
  result = await resend.emails.send(payload);
  return result;
}


/**
 * POST /api/offers/[id]/card-pdf
 * Receives the client-generated ID card PDF (captured with the candidate's own
 * photo), saves it to the DB, then sends ONE combined email to both parties
 * containing the appointment letter + the correct ID card.
 *
 * This is the SOLE email dispatch point for the candidate-signing flow.
 * /sign intentionally skips email so that both parties receive a single,
 * complete email rather than two separate ones (the first of which would have
 * the pre-generated photo-less founder card).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // Read raw body as text to bypass Next.js built-in body-size limit (413).
    const rawText = await request.text();
    const body = JSON.parse(rawText) as Record<string, unknown>;

    const rawCardPdf: string = (body.cardPDFdata as string) || "";
    const cardPDFdata = rawCardPdf.replace(
      /^data:application\/pdf(?:;[^;]*)?;base64,/,
      "",
    );

    const agreement = await findAgreementById(id);
    if (!agreement) {
      return NextResponse.json(
        { error: "Agreement not found." },
        { status: 404 },
      );
    }

    const template = (agreement.docSettings as Record<string, string> | undefined)?.agreementTemplate;
    const isContractual = template === "contractual" || agreement.docType === "contractual" || agreement.docType?.toLowerCase().includes("contract");
    const isInternship = template === "internship";

    if (!isContractual && !cardPDFdata) {
      return NextResponse.json(
        { error: "No card PDF data provided." },
        { status: 400 },
      );
    }

    const salesType = (agreement.docSettings as Record<string, unknown> | undefined)
      ?.salesAgreementType as string | undefined;
    const isCountrySales = salesType === "countrySales";
    const isSalesAgent   = salesType === "salesAgent";
    const isSalesAgreement = isCountrySales || isSalesAgent;

    // Resolve the correct partner/agent ID to show in emails
    const resolvedPartnerId = isSalesAgreement
      ? (agreement.secondParty as Record<string, string> | undefined)?.salesPartnerId ||
        (agreement.docSettings as Record<string, string> | undefined)?.salesPartnerId ||
        (agreement.secondParty as Record<string, string> | undefined)?.partnerId
      : (agreement.secondParty as Record<string, string> | undefined)?.contractualId ||
        (agreement.secondParty as Record<string, string> | undefined)?.partnerId;

    // Pull the appointment letter that /sign already saved to the DB
    const letterPDFdata =
      typeof agreement.letterPDFdata === "string"
        ? agreement.letterPDFdata.replace(
            /^data:application\/pdf(?:;[^;]*)?;base64,/,
            "",
          )
        : "";

    // Save the correct (candidate-photo) card PDF to DB if present
    if (cardPDFdata) {
      await updateAgreement(id, {
        cardPDFdata,
        idCardGenerated: true,
      });
    }

    let founderEmailSent = false;
    let partnerEmailSent = false;

    if (process.env.RESEND_API_KEY) {
      const founderRecipients = getFounderNotificationRecipients(
        process.env.FOUNDER_EMAIL,
        agreement.firstParty.email,
      );
      const partnerEmail = agreement.secondParty.email?.trim();
      const founderName = agreement.firstParty.representedBy || agreement.firstParty.name || "Md. Abdul Hakim";
      const partnerName = agreement.secondParty.fullName || agreement.secondParty.name || "Candidate";
      const partnerID = resolvedPartnerId || id;
      const company = agreement.firstParty.companyName || agreement.firstParty.company || "Creatibuz Studio";

      console.log(
        `[card-pdf] Sending combined emails — founder: ${founderRecipients.join(", ")}, partner: ${partnerEmail}`,
      );

      // Build attachments — add letter if available, and card if available
      const docLabel = isContractual
        ? "contractual-offer-agreement"
        : isInternship
        ? "internship-offer"
        : isCountrySales
        ? "sales-partner-agreement"
        : isSalesAgent
        ? "sales-agent-agreement"
        : "appointment";
      const attachments: { filename: string; content: string }[] = [];
      if (letterPDFdata) {
        attachments.push({
          filename: `${id}-${docLabel}.pdf`,
          content: letterPDFdata,
        });
      }
      if (cardPDFdata) {
        attachments.push({
          filename: `${id}-id-card.pdf`,
          content: cardPDFdata,
        });
      }

      // ── Per-template email copy ─────────────────────────────────────────────
      const founderSubject = isContractual
        ? `Joining Offer Letter & Work Agreement Signed — ${partnerName}`
        : isInternship
        ? `Internship Offer Signed — ${partnerName}`
        : isCountrySales
        ? `Country Sales Partner Agreement Signed — ${partnerName}`
        : isSalesAgent
        ? `Sales Agent Agreement Signed — ${partnerName}`
        : `Appointment Letter Fully Executed — ${partnerName}`;

      const founderText = isContractual
        ? `Dear ${founderName},\n\nThe Joining Offer Letter & Work Agreement for ${partnerName} (Ref: ${partnerID}) has been fully executed with both signatures. Please find the finalized PDF document attached.\n\nBest regards,\n${company} Team`
        : isInternship
        ? `Dear ${founderName},\n\nThe internship offer letter and ID card for ${partnerName} (ID: ${partnerID}) have been fully executed. Please find the attached documents.\n\nBest,\n${company} HR System`
        : isCountrySales
        ? `Dear ${founderName},\n\nThe Country Sales Partner Agreement and ID card for ${partnerName} (ID: ${partnerID}) have been fully executed. Please find the attached documents.\n\nBest,\n${company} HR System`
        : isSalesAgent
        ? `Dear ${founderName},\n\nThe Sales Agent Agreement and ID card for ${partnerName} (ID: ${partnerID}) have been fully executed. Please find the attached documents.\n\nBest,\n${company} HR System`
        : `Dear ${founderName},\n\nThe appointment letter for ${partnerName} (ID: ${partnerID}) has been fully executed. Please find the attached documents.\n\nBest,\n${company} HR System`;

      const partnerSubject = isContractual
        ? `Your Executed Joining Offer Letter & Work Agreement — ${company}`
        : isInternship
        ? `Your ${company} Internship Offer Letter & ID Card`
        : isCountrySales
        ? `Your ${company} Country Sales Partner Agreement & ID Card`
        : isSalesAgent
        ? `Your ${company} Sales Agent Agreement & ID Card`
        : `Your Appointment Letter & ID Card from ${company}`;

      const partnerText = isContractual
        ? `Dear ${partnerName},\n\nCongratulations and welcome aboard! Your Joining Offer Letter & Work Agreement with ${company} has been fully executed by both parties. Please find your official signed copy attached.\n\nBest regards,\n${company}`
        : isInternship
        ? `Dear ${partnerName},\n\nWelcome aboard! Your signed internship offer letter and ${company} ID card are attached.\n\nBest,\n${company}`
        : isCountrySales
        ? `Dear ${partnerName},\n\nWelcome to ${company}! Your signed Country Sales Partner Agreement and ID card are attached.\n\nBest,\n${company}`
        : isSalesAgent
        ? `Dear ${partnerName},\n\nWelcome to ${company}! Your signed Sales Agent Agreement and ID card are attached.\n\nBest,\n${company}`
        : `Dear ${partnerName},\n\nYour appointment letter and ID card from ${company} are attached.\n\nBest,\n${company}`;

      const founderResult = founderRecipients.length > 0
        ? await sendWithRetry({
          from: getResendFromAddress(),
          to: founderRecipients,
          subject: founderSubject,
          text: founderText,
          attachments,
        })
        : { error: { message: "No valid founder notification recipient configured." } };
      const cspEmail = isSalesAgent ? (agreement.docSettings as Record<string, any>)?.salesPartner?.email?.trim() : undefined;
      const partnerRecipients = [partnerEmail];
      if (cspEmail && EMAIL_PATTERN.test(cspEmail)) {
        partnerRecipients.push(cspEmail);
      }
      
      const partnerResult = partnerEmail && EMAIL_PATTERN.test(partnerEmail)
        ? await sendWithRetry({
          from: getResendFromAddress(),
          to: partnerRecipients,
          subject: partnerSubject,
          text: partnerText,
          attachments,
        })
        : { error: { message: "A valid partner email address is required before final delivery." } };

      if (founderResult.error)
        console.error("[card-pdf] Founder email failed:", founderResult.error);
      else {
        founderEmailSent = true;
        console.log(`[card-pdf] Founder email sent: ${founderResult.data?.id}`);
      }

      if (partnerResult.error)
        console.error("[card-pdf] Partner email failed:", partnerResult.error);
      else {
        partnerEmailSent = true;
        console.log(`[card-pdf] Partner email sent: ${partnerResult.data?.id}`);
      }
    }

    const sentToBoth = founderEmailSent && partnerEmailSent;
    await updateAgreement(id, {
      letterSentToBoth: sentToBoth,
    });

    return NextResponse.json({
      success: true,
      delivery: { founder: founderEmailSent, partner: partnerEmailSent },
      message: sentToBoth
        ? "The fully executed documents have been emailed to you and the Founder."
        : "Documents generated, but at least one email delivery failed.",
    });
  } catch (err: unknown) {
    console.error("[card-pdf] Error:", err);
    return NextResponse.json(
      { error: "Failed to process card PDF." },
      { status: 500 },
    );
  }
}
