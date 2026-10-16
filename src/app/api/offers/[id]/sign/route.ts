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
import { uploadPdfToStorage } from "@/services/storage.service";

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

    let pdfUrl: string | undefined;
    if (normalizedLetterPdf) {
      const uploadRes = await uploadPdfToStorage(id, normalizedLetterPdf);
      if (uploadRes.url) {
        pdfUrl = uploadRes.url;
      }
    }

    const updated = await updateAgreement(id, {
      secondParty: updatedSecondParty,
      status: "FULLY_EXECUTED",
      partnerSigned: true,
      signedAt: new Date().toISOString(),
      letterPDFdata: normalizedLetterPdf,
      ...(pdfUrl ? { pdfUrl } : {}),
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

        const founderSubject = `Document Executed & Signed — ${partnerName} (${id})`;
        const founderText = `Dear ${founderName},\n\nThe document for ${partnerName} (ID: ${id}) has been fully executed with both signatures. Please find the finalized PDF attached.\n\nBest regards,\n${company}`;

        const partnerSubject = `Your Signed Document — ${company}`;
        const partnerText = `Dear ${partnerName},\n\nCongratulations! Your document with ${company} has been fully executed. Please find your official signed copy attached.\n\nBest regards,\n${company}`;

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
            text: partnerText,
            attachments,
          });
          partnerEmailSent = !pRes.error;
        }

        await updateAgreement(id, {
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
