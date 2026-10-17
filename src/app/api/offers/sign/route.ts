import { NextResponse } from "next/server";
import {
  findAgreementById,
  updateAgreement,
} from "@/lib/agreementStore";
import {
  getFounderNotificationRecipients,
  getResendFromAddress,
  getResendClient,
} from "@/lib/emailConfig";
import { buildFinalExecutedEmailHtml } from "@/lib/emailTemplates";

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

export async function POST(request: Request) {
  try {
    const rawText = await request.text();
    const body = (rawText ? JSON.parse(rawText) : {}) as Record<string, unknown>;

    const { searchParams } = new URL(request.url);
    const offerId = (
      (body.offerId as string) ||
      (body.id as string) ||
      searchParams.get("id") ||
      searchParams.get("offerId") ||
      ""
    ).trim();

    if (!offerId) {
      return NextResponse.json(
        { error: "offerId is required." },
        { status: 400 },
      );
    }

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

    const agreement = await findAgreementById(offerId);
    if (!agreement) {
      return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    }

    const updatedSecondParty = {
      ...(agreement.secondParty || {}),
      ...(signatureImg ? { signatureImg } : {}),
    };

    // ── Signature-only draft save ────────────────────────────────────────────
    if (!isFinalizing) {
      const updated = await updateAgreement(offerId, {
        secondParty: updatedSecondParty,
        signatureImg,
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
    console.log(`[Next.js API] Finalizing offer: ${offerId}`);

    const updated = await updateAgreement(offerId, {
      secondParty: updatedSecondParty,
      signatureImg,
      status: "FINALISED",
      isCandidateSigned: true,
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
        const candidateDetails = (agreement.candidateDetails || {}) as Record<string, any>;
        const secondParty = (agreement.secondParty || {}) as Record<string, any>;
        const firstParty = (agreement.firstParty || {}) as Record<string, any>;

        const founderRecipients = getFounderNotificationRecipients(
          process.env.FOUNDER_EMAIL,
          firstParty.email,
        );
        const partnerEmail = (
          candidateDetails.email ||
          secondParty.email ||
          ""
        ).trim();
        const founderName =
          firstParty.representedBy ||
          firstParty.ceoName ||
          "Md. Abdul Hakim";
        const partnerName =
          candidateDetails.fullName ||
          secondParty.fullName ||
          "Candidate";
        const company =
          firstParty.companyName || "Creatibuz Studio";
        const position =
          candidateDetails.position ||
          secondParty.position ||
          "Team Member";
        const contractRef =
          agreement.contractRef ||
          agreement.agreementId ||
          offerId;
        const employeeId =
          candidateDetails.employeeId ||
          secondParty.partnerId ||
          secondParty.contractualId ||
          "";

        const safeFilenameRef = contractRef.replace(/[/\\?%*:|"<>]/g, "-");
        const attachments = [
          {
            filename: `${safeFilenameRef}-executed-document.pdf`,
            content: normalizedLetterPdf,
          },
        ];

        // 1. Founder Email
        const founderSubject = `Document Executed & Signed — ${partnerName} (${contractRef})`;
        const founderText = `Dear ${founderName},\n\nThe document for ${partnerName} (Ref: ${contractRef}) has been fully executed with both signatures. Please find the finalized PDF attached.\n\nBest regards,\n${company}`;

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

        // 2. Candidate Appreciating & Celebratory Email
        if (partnerEmail && EMAIL_PATTERN.test(partnerEmail)) {
          const partnerSubject = `🎉 Document Finalized & Executed — ${company}`;
          const partnerHtml = buildFinalExecutedEmailHtml({
            candidateName: partnerName,
            companyName: company,
            position,
            contractRef,
            employeeId,
            firstParty: firstParty as any,
          });
          const partnerText = `Dear ${partnerName},\n\nCongratulations! Your document with ${company} (Ref: ${contractRef}) has been fully executed with both signatures. Please find your official signed copy attached.\n\nBest regards,\n${company}`;

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

        await updateAgreement(offerId, {
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
