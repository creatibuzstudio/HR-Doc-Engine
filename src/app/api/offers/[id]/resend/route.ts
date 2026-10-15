import { NextResponse } from "next/server";
import { findAgreementById } from "../../../../../lib/agreementStore";
import { getBaseUrl, getResendFromAddress, getResendClient } from "../../../../../lib/emailConfig";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agreement = await findAgreementById(id);
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found." }, { status: 404 });
    }

    if (agreement.status === "FULLY_EXECUTED") {
      return NextResponse.json(
        { error: "This agreement is already fully executed." },
        { status: 400 }
      );
    }

    const { firstParty, secondParty, docSettings } = agreement;
    const ctaLink = `${getBaseUrl()}/?candidateView=${id}`;
    const company = firstParty.companyName || "Creatibuz Studio";

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #FF5722; margin: 0; font-size: 26px; font-weight: 800;">${company}</h2>
          <p style="margin: 4px 0 0; font-size: 11px; letter-spacing: 1px; color: #64748b; font-weight: 700; text-transform: uppercase;">DESIGN · DEVELOP · TRANSFORM</p>
        </div>
        <p style="font-size: 16px; font-weight: 700;">Dear ${secondParty.fullName},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          This is a reminder to review and sign your document from <strong>${company}</strong>.
        </p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${ctaLink}" style="background-color: #FF5722; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
            View & Sign Offer Letter
          </a>
        </div>
        <p style="font-size: 12px; color: #64748b;">Ref: ${id}</p>
      </div>
    `;

    const resend = getResendClient();
    const emailResult = await resend.emails.send({
      from: getResendFromAddress(),
      to: [secondParty.email],
      subject: `Reminder: ${company} Offer Letter Pending Signature`,
      html: emailHtml,
    });

    if (emailResult.error) {
      return NextResponse.json({ error: emailResult.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, messageId: emailResult.data?.id });
  } catch (err: unknown) {
    console.error("[Next.js API] Error resending offer link:", err);
    return NextResponse.json({ error: "Failed to resend offer link." }, { status: 500 });
  }
}

