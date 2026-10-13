import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "mock_key");
const FROM_EMAIL = process.env.RESEND_FROM_ADDRESS || "JEVXO <info@jevxo.com>";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export interface SendInvitationParams {
  toEmail: string;
  recipientName: string;
  documentTitle: string;
  documentId: string;
}

export async function sendSigningInvitationEmail({
  toEmail,
  recipientName,
  documentTitle,
  documentId,
}: SendInvitationParams) {
  const signingLink = `${BASE_URL}/portal/${encodeURIComponent(documentId)}`;

  if (!process.env.RESEND_API_KEY) {
    console.warn("[EmailService] RESEND_API_KEY not configured. Skipping email dispatch.");
    return { success: true, mocked: true, link: signingLink };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `Action Required: Review & Sign ${documentTitle} - JEVXO`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #FE5A00; margin-bottom: 8px;">JEVXO Document Delivery</h2>
          <p>Dear <strong>${recipientName}</strong>,</p>
          <p>Your official documentation for <strong>${documentTitle}</strong> (Reference: <code>${documentId}</code>) is ready for your digital signature and review.</p>
          <p>Please click the button below to review your terms and sign securely:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${signingLink}" style="background-color: #FE5A00; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Review & Sign Document
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">If the button does not work, copy and paste this URL into your browser:<br/>${signingLink}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 11px; color: #94a3b8;">JEVXO • Global Digital Ecosystem • info@jevxo.com</p>
        </div>
      `,
    });

    return { success: true, data, link: signingLink };
  } catch (error) {
    console.error("[EmailService] Failed to send email:", error);
    return { success: false, error: (error as Error).message, link: signingLink };
  }
}
