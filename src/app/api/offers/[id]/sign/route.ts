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
import { buildFinalExecutedEmailHtml } from "../../../../../lib/emailTemplates";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendWithRetry(
  payload: Parameters<ReturnType<typeof getResendClient>["emails"]["send"]>[0],
) {
  const resend = getResendClient();
  let result = await resend.emails.send(payload);
  if (!result.error) return result;
  console.warn("[sign] Email delivery failed; retrying once:", result.error);
  result = await resend.emails.send(payload);
  return result;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const rawText = await request.text();
    const body = JSON.parse(rawText) as Record<string, unknown>;

    const {
      signatureImg,
      letterPDFdata: rawLetterPdf,
    } = body;

    const normalizedLetterPdf =
      typeof rawLetterPdf === "string"
        ? rawLetterPdf.replace(
            /^data:application\/pdf(?:;filename=[^;]+)?;base64,/,
            "",
          )
        : "";

    const isFinalizing = normalizedLetterPdf.length > 0;

    const agreement = await findAgreementById(id);
    if (!agreement) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const updatedSecondParty = {
      ...agreement.secondParty,
      ...(signatureImg ? { signatureImg } : {}),
    };

    // ── Signature-only draft save ────────────────────────────────────────────
    if (!isFinalizing) {
      const updated = await updateAgreement(id, {
        secondParty: updatedSecondParty,
      });

      if (!updated) {
        return NextResponse.json(
          { error: "Failed to update signature." },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true, message: "Signature saved." });
    }

    // ── Finalizing: apply signature, mark executed, and send emails ─────────
    console.log(`[Next.js API] Finalizing offer: ${id}`);

    const updated = await updateAgreement(id, {
      secondParty: updatedSecondParty,
      status: "FULLY_EXECUTED",
      partnerSigned: true,
      signedAt: new Date().toISOString(),
      letterPDFdata: normalizedLetterPdf,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update agreement." },
        { status: 500 },
      );
    }

    // ── Send finalized PDF email to founder and candidate ───────────────────
    let founderEmailSent = false;
    let partnerEmailSent = false;

    if (process.env.RESEND_API_KEY && normalizedLetterPdf) {
      try {
        const founderRecipients = getFounderNotificationRecipients(
          process.env.FOUNDER_EMAIL,
          agreement.firstParty.email,
        );
        const partnerEmail = agreement.secondParty?.email?.trim();
        const founderName =
          agreement.firstParty.representedBy ||
          agreement.firstParty.ceoName ||
          "Founder";
        const partnerName = agreement.secondParty?.fullName || "Candidate";
        const company =
          agreement.firstParty.companyName || "Creatibuz Studio";

        const attachments = [
          {
            filename: `${id}-executed-document.pdf`,
            content: normalizedLetterPdf,
          },
        ];

        const position =
          agreement.secondParty?.position ||
          "Team Member";
        const contractRef =
          agreement.contractRef ||
          agreement.agreementId ||
          id;
        const employeeId =
          agreement.candidateDetails?.employeeId ||
          agreement.secondParty?.partnerId ||
          agreement.secondParty?.contractualId ||
          "";

        const founderSubject = `Document Executed & Signed — ${partnerName} (${contractRef})`;
        const founderText = `Dear ${founderName},\n\nThe document for ${partnerName} (Ref: ${contractRef}) has been fully executed with both signatures. Please find the finalized PDF attached.\n\nBest regards,\n${company}`;

        const partnerSubject = `🎉 Document Finalized & Executed — ${company}`;
        const partnerHtml = buildFinalExecutedEmailHtml({
          candidateName: partnerName,
          companyName: company,
          position,
          contractRef,
          employeeId,
          firstParty: agreement.firstParty,
        });
        const partnerText = `Dear ${partnerName},\n\nCongratulations! Your document with ${company} (Ref: ${contractRef}) has been fully executed with both signatures. Please find your official signed copy attached.\n\nBest regards,\n${company}`;

        if (founderRecipients.length > 0) {
          const fRes = await sendWithRetry({
            from: getResendFromAddress(),
            to: founderRecipients,
            subject: founderSubject,
            text: founderText,
            attachments,
          });
          founderEmailSent = !fRes.error;
        }

        if (partnerEmail && EMAIL_PATTERN.test(partnerEmail)) {
          const pRes = await sendWithRetry({
            from: getResendFromAddress(),
            to: [partnerEmail],
            subject: partnerSubject,
            html: partnerHtml,
            text: partnerText,
            attachments,
          });
          partnerEmailSent = !pRes.error;
        }

        await updateAgreement(id, {
          isFinalletterSentToBoth: founderEmailSent && partnerEmailSent,
          letterSentToBoth: founderEmailSent && partnerEmailSent,
        });
      } catch (mailErr) {
        console.error("[sign] Failed to dispatch finalized emails:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Signature applied and document finalized successfully!",
      delivery: { founder: founderEmailSent, partner: partnerEmailSent },
    });
  } catch (err: unknown) {
    console.error("[Next.js API] Error signing offer:", err);
    return NextResponse.json(
      { error: "Failed to apply signature and finalize." },
      { status: 500 },
    );
  }
}
