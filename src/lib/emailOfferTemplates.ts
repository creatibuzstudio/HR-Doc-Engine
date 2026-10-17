import { FirstParty, SecondParty, DocSettings } from "@/types";

interface OfferEmailParams {
  candidateName: string;
  firstParty: FirstParty;
  secondParty: SecondParty;
  docSettings: DocSettings;
  ctaLink: string;
  signatureHtml: string;
}

export function renderHrHiringNoticeEmail({
  candidateName,
  firstParty,
  docSettings,
  signatureHtml,
}: Pick<OfferEmailParams, "candidateName" | "firstParty" | "docSettings" | "signatureHtml">): string {
  const hrPosition = docSettings.hrPositionName || "Open Position";
  const hrVacancies = docSettings.hrVacancies ?? 1;
  const hrStartDate = docSettings.hrRecruitmentStartDate || "—";
  const hrEndDate = docSettings.hrRecruitmentEndDate || "—";
  const hrPreparedBy = docSettings.hrPreparedByName || firstParty.hrName || firstParty.representedBy;
  const hrDesig = docSettings.hrPreparedByDesignation || "Head of HR Department";
  const hrContact = firstParty.email || firstParty.mobileNumber || "info@creatibuzstudio.com";

  return `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #7c3aed; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">Creatibuz Studio</h2>
    <div style="height: 3px; background: linear-gradient(to right, transparent, #7c3aed, transparent); margin-top: 12px; width: 100%;"></div>
    <p style="font-size: 11px; color: #94a3b8; margin-top: 6px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">HR Department &middot; Official Notice</p>
  </div>

  <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">I hope this email finds you well.</p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    This is to formally notify you that kindly find attached the official
    <strong style="color: #7c3aed;">HR Hiring Notice</strong> for the recruitment of
    <strong>${hrPosition}</strong> (${hrVacancies} ${hrVacancies === 1 ? "vacancy" : "vacancies"}),
    scheduled between <strong>${hrStartDate}</strong> and <strong>${hrEndDate}</strong>.
  </p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    This notice has been prepared and issued by <strong>${hrPreparedBy}</strong>,
    ${hrDesig} to support our upcoming operational demands and project commitments.
  </p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    Kindly review the attached PDF for the full position breakdown and required skill set.
    If you have any questions or feedback, feel free to reach out to us at
    <strong>${hrContact}</strong>.
  </p>
  ${signatureHtml}
</div>`;
}

export function renderCertificateEmail({
  candidateName,
  firstParty,
  secondParty,
  docSettings,
  signatureHtml,
}: Pick<OfferEmailParams, "candidateName" | "firstParty" | "secondParty" | "docSettings" | "signatureHtml">): string {
  return `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #2563eb; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">Creatibuz Studio</h2>
    <div style="height: 3px; background: linear-gradient(to right, transparent, #2563eb, transparent); margin-top: 12px; width: 100%;"></div>
    <p style="font-size: 11px; color: #94a3b8; margin-top: 6px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Internship Completion Certificate</p>
  </div>

  <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">Congratulations on completing your internship!</p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    On behalf of <strong>${firstParty.companyName}</strong>, we are pleased to congratulate you on successfully completing your internship as a <strong>${secondParty.position}</strong>.
  </p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    We want to thank you for your commitment, hard work, and contributions to our growth during your tenure. Your performance grade was evaluated as <strong style="color: #2563eb;">${docSettings.certPerformanceGrade || "Outstanding"}</strong>.
  </p>
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
    Kindly find attached your official, digitally-signed <strong>Certificate of Internship Completion</strong>. We wish you the absolute best in all your future endeavors.
  </p>
  ${signatureHtml}
</div>`;
}

export function renderInternshipEmail({
  candidateName,
  firstParty,
  secondParty,
  docSettings,
  ctaLink,
  signatureHtml,
}: OfferEmailParams): string {
  return `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #0ea5e9; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">Creatibuz Studio</h2>
    <div style="height: 3px; background: linear-gradient(to right, transparent, #0ea5e9, transparent); margin-top: 12px; width: 100%;"></div>
  </div>

  <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
    On behalf of <strong>${firstParty.companyName}</strong>, we are pleased to extend to you our official
    <strong>Internship Offer</strong> for the position of
    <strong style="color: #0ea5e9;">${secondParty.position}</strong>.
  </p>
  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
    This internship is a hands-on opportunity to grow your skills in a fast-moving tech environment.
    You will collaborate with our core team on real projects that shape our platform.
  </p>

  <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 15px 20px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #0369a1; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Offer Summary</h4>
    <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Duration:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0ea5e9;">${docSettings.internshipDuration || "—"} Months</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Compensation:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${docSettings.isPaid ? "Paid" : "Unpaid"}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Internee ID:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${secondParty.partnerId || "—"}</td>
      </tr>
    </table>
  </div>

  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 8px;">To complete your onboarding:</p>
  <ol style="font-size: 13px; color: #475569; padding-left: 20px; margin: 0 0 20px 0; line-height: 1.8;">
    <li>Review the internship offer letter terms.</li>
    <li>Apply your digital signature.</li>
    <li>Press <strong>Confirm</strong> once everything looks correct.</li>
  </ol>

  <div style="margin: 30px 0; text-align: center;">
    <a href="${ctaLink}" target="_blank"
       style="background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(14,165,233,0.25);">
      View &amp; Sign Internship Offer
    </a>
  </div>
  ${signatureHtml}
</div>`;
}

export function renderContractualEmail({
  candidateName,
  firstParty,
  secondParty,
  docSettings,
  ctaLink,
}: OfferEmailParams): string {
  const role = secondParty.position || "Developer / Designer";
  const contractType = docSettings.employmentType || "Project-Based Contract";
  const companyName = firstParty.companyName || "Creatibuz Studio";
  const referenceId =
    docSettings.contractRefId || docSettings.refId || "CBS/REF-26/001";
  const issueDate =
    docSettings.date ||
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const founderName = firstParty.representedBy || "Md. Abdul Hakim";
  const founderPhone = firstParty.mobileNumber || "+8801968657353";
  const companyWebsite = (firstParty.website || "www.creatibuzstudio.com").replace(
    /^https?:\/\//,
    "",
  );
  const companyAddress =
    firstParty.currentAddress || "Delduar Road, Tangail Shadar, Dhaka";
  const logoUrl = "https://i.ibb.co.com/XrYN1wDQ/logo.png";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offer Letter &amp; Work Agreement - Creatibuz Studio</title>
</head>
<body style="margin: 0; padding: 20px 10px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <!-- Main Container -->
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
    
    <!-- Sleek Dark Header with Direct Company Logo -->
    <tr>
      <td style="background-color: #0d0d0d; padding: 24px 24px 20px 24px; border-bottom: 4px solid #FF5722;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td valign="middle">
              <!-- Company Logo -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <img 
                      src="${logoUrl}" 
                      alt="Creatibuz Studio Logo" 
                      width="150" 
                      style="display: block; max-width: 160px; height: auto; border: 0; outline: none; text-decoration: none;"
                      onerror="this.style.display='none'"
                    />
                  </td>
                </tr>
              </table>
            </td>
            <td align="right" valign="top">
              <span style="background-color: rgba(255, 87, 34, 0.15); border: 1px solid rgba(255, 87, 34, 0.4); color: #FF7A50; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                Offer Letter
              </span>
            </td>
          </tr>
        </table>
        
        <!-- Document Type Subheader -->
        <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #27272a;">
          <h2 style="color: #ffffff; margin: 0; font-size: 17px; font-weight: 700;">
            Joining Offer Letter &amp; Work Agreement
          </h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #d4d4d8;">
            Role: <strong style="color: #ffffff;">${role}</strong> &bull; <span style="color: #FF7A50;">${contractType}</span>
          </p>
        </div>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px 24px;">
        <p style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">
          Dear ${candidateName},
        </p>
        
        <p style="font-size: 15px; line-height: 1.65; color: #334155; margin-bottom: 14px;">
          We are genuinely excited to offer you for the position of 
          <strong style="color: #0f172a;">${role}</strong> at <strong>${companyName}</strong>.
        </p>

        <p style="font-size: 14px; line-height: 1.65; color: #334155; margin-bottom: 20px;">
          Our leadership was deeply impressed by your skills, professionalism, and dedication. We believe your contributions will play a vital role in our upcoming client solutions and product development milestones.
        </p>

        <!-- Highlights Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; margin-bottom: 22px;">
          <tr>
            <td style="padding: 16px 18px;">
              <p style="margin: 0 0 10px 0; color: #C2410C; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">
                Engagement Summary
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #475569;">
                <tr>
                  <td style="padding: 5px 0; font-weight: 600;">Position / Role:</td>
                  <td align="right" style="padding: 5px 0; font-weight: 700; color: #0f172a;">${role}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: 600;">Contract Model:</td>
                  <td align="right" style="padding: 5px 0; font-weight: 700; color: #FF5722;">${contractType}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: 600;">Reference No:</td>
                  <td align="right" style="padding: 5px 0; font-weight: 700; color: #0f172a;">${referenceId}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: 600;">Issue Date:</td>
                  <td align="right" style="padding: 5px 0; font-weight: 700; color: #0f172a;">${issueDate}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Quick 3-Step Guide -->
        <div style="background-color: #f8fafc; border-radius: 10px; padding: 14px 16px; margin-bottom: 24px; border-left: 3px solid #FF5722;">
          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">
            Next Steps for Acceptance:
          </p>
          <ol style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
            <li>Tap the button below to open your secure Candidate Portal.</li>
            <li>Review the offer terms and agreement details.</li>
            <li>Apply your digital signature and press <strong>Confirm</strong>.</li>
          </ol>
        </div>

        <!-- Call to Action Button -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 16px 0;">
          <tr>
            <td align="center">
              <a href="${ctaLink}" target="_blank" style="background-color: #FF5722; color: #ffffff; padding: 15px 36px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 15px rgba(255, 87, 34, 0.35); letter-spacing: 0.3px;">
                Review &amp; Sign Offer Letter &rarr;
              </a>
            </td>
          </tr>
        </table>

        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 10px; margin-bottom: 24px;">
          Both parties will automatically receive a dual-signed official PDF upon confirmation.
        </p>

        <!-- Direct Link Fallback -->
        <div style="border-top: 1px dashed #e2e8f0; padding-top: 14px; margin-bottom: 22px;">
          <p style="font-size: 11px; color: #64748b; margin: 0 0 4px 0;">
            Having trouble clicking the button? Copy and paste this link in your browser:
          </p>
          <p style="font-size: 11px; color: #FF5722; margin: 0; word-break: break-all;">
            ${ctaLink}
          </p>
        </div>

        <!-- Support Callout Box -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin-bottom: 22px; border-left: 3px solid #0f172a;">
          <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.6;">
            💬 <strong>Need Help or Support?</strong> If you have any questions or encounter any issues opening or signing the document, please reach out to our dedicated support team at 
            <a href="mailto:support@creatibuzstudio.com" style="color: #FF5722; text-decoration: none; font-weight: 700;">support@creatibuzstudio.com</a>.
          </p>
        </div>

        <!-- CEO Signature Block -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 20px;">
          <tr>
            <td>
              <p style="margin: 0; font-size: 14px; font-weight: 800; color: #0f172a;">${founderName}</p>
              <p style="margin: 2px 0 0; font-size: 12px; color: #64748b; font-weight: 600;">
                Founder &amp; CEO &bull; ${companyName}
              </p>
              <p style="margin: 8px 0 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                📧 <a href="mailto:info@creatibuzstudio.com" style="color: #FF5722; text-decoration: none;">info@creatibuzstudio.com</a><br> 
                📞 ${founderPhone}<br>
                🌐 <a href="https://${companyWebsite}" style="color: #64748b; text-decoration: none;">${companyWebsite}</a><br>
                📍 ${companyAddress}
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 14px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">
          &copy; HR Doc Engine - Creatibuz Studio. All rights reserved. Confidential &amp; Legally Binding Document.
        </p>
      </td>
    </tr>

  </table>

</body>
</html>`;
}

export interface FinalExecutedEmailParams {
  candidateName: string;
  companyName: string;
  position: string;
  contractRef: string;
  employeeId?: string;
  signatureHtml: string;
}

export function renderFinalExecutedEmail({
  candidateName,
  companyName,
  position,
  contractRef,
  employeeId,
  signatureHtml,
}: FinalExecutedEmailParams): string {
  const logoUrl = "https://i.ibb.co.com/XrYN1wDQ/logo.png";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Executed &amp; Finalized - Creatibuz Studio</title>
</head>
<body style="margin: 0; padding: 20px 10px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
    
    <!-- Sleek Header with Celebration Badge & Logo -->
    <tr>
      <td style="background-color: #0d0d0d; padding: 24px 24px 20px 24px; border-bottom: 4px solid #FF5722;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td valign="middle">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <img 
                      src="${logoUrl}" 
                      alt="Creatibuz Studio Logo" 
                      width="150" 
                      style="display: block; max-width: 160px; height: auto; border: 0; outline: none; text-decoration: none;"
                      onerror="this.style.display='none'"
                    />
                  </td>
                </tr>
              </table>
            </td>
            <td align="right" valign="top">
              <span style="background-color: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.4); color: #22c55e; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                &check; Fully Executed
              </span>
            </td>
          </tr>
        </table>

        <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #27272A;">
          <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">
            Official Agreement Executed &amp; Finalized
          </h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #E4E4E7;">
            Congratulations &amp; Welcome Aboard to the Team!
          </p>
        </div>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 28px 24px;">
        <p style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px;">
          Dear ${candidateName},
        </p>

        <p style="font-size: 15px; line-height: 1.7; color: #334155; margin-bottom: 14px;">
          Congratulations! We are thrilled to confirm that your official work agreement with 
          <strong>${companyName}</strong> has been <strong>successfully executed with both signatures</strong>.
        </p>

        <p style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 20px;">
          We deeply appreciate your trust, professionalism, and prompt response throughout the onboarding process. Our leadership and creative engineering teams are eager to collaborate with you on impactful projects, turning bold visions into world-class digital experiences.
        </p>

        <!-- Execution Summary Card -->
        <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 18px 20px; margin: 22px 0;">
          <h4 style="margin: 0 0 12px 0; color: #15803D; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">
            Execution &amp; Verification Details
          </h4>
          <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; font-weight: 600;">Status:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #16A34A;">
                &check; Dual-Signed &amp; Legally Binding
              </td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: 600;">Document Ref:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #0f172a;">
                ${contractRef}
              </td>
            </tr>
            ${
              employeeId
                ? `
            <tr>
              <td style="padding: 5px 0; font-weight: 600;">Candidate ID:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #0f172a;">
                ${employeeId}
              </td>
            </tr>
            `
                : ""
            }
            <tr>
              <td style="padding: 5px 0; font-weight: 600;">Position:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #0f172a;">
                ${position}
              </td>
            </tr>
          </table>
        </div>

        <!-- Attachment Notice Callout -->
        <div style="background-color: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; padding: 16px 18px; margin-bottom: 24px; border-left: 4px solid #FF5722;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td valign="top" style="padding-right: 12px; font-size: 22px; line-height: 1;">
                📎
              </td>
              <td>
                <p style="margin: 0; font-size: 13px; font-weight: 700; color: #C2410C;">
                  Official Signed PDF Attached
                </p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                  Your finalized, dual-signed document has been compiled and attached to this email. Please download and keep it safely in your permanent records.
                </p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Support Callout Box -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin-bottom: 22px; border-left: 3px solid #0f172a;">
          <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.6;">
            💬 <strong>Need Help or Support?</strong> If you have any questions or need assistance regarding your onboarding, please contact our support team at 
            <a href="mailto:support@creatibuzstudio.com" style="color: #FF5722; text-decoration: none; font-weight: 700;">support@creatibuzstudio.com</a>.
          </p>
        </div>

        ${signatureHtml}

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 14px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">
          &copy; HR Doc Engine - Creatibuz Studio. All rights reserved. Confidential &amp; Legally Binding Document.
        </p>
      </td>
    </tr>

  </table>

</body>
</html>`;
}
