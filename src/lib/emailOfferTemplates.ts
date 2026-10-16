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
  signatureHtml,
}: OfferEmailParams): string {
  return `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; color: #0f172a;">
  <div style="background-color: #0d0d0d; border-radius: 14px; padding: 22px 20px; text-align: left; margin-bottom: 25px; border-bottom: 4px solid #FF5722;">
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div>
        <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">Creatibuz Studio</h2>
        <p style="margin: 3px 0 0; font-size: 10px; color: #A1A1AA; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">DESIGN &middot; DEVELOP &middot; TRANSFORM</p>
      </div>
    </div>
    <div style="margin-top: 14px; border-top: 1px solid #27272A; padding-top: 12px;">
      <h3 style="color: #ffffff; margin: 0; font-size: 17px; font-weight: 700;">Joining Offer Letter &amp; Work Agreement</h3>
      <p style="margin: 4px 0 0; font-size: 12px; color: #E4E4E7;">Role: <strong>${secondParty.position || "Developer / Designer"}</strong> &bull; ${docSettings.employmentType || "Project-Based Contract"}</p>
    </div>
  </div>

  <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">Dear ${candidateName},</p>
  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 14px;">
    We are pleased to offer you a <strong>${docSettings.employmentType || "Project-Based Contract"}</strong> at <strong>${firstParty.companyName || "Creatibuz Studio"}</strong> as <strong>${secondParty.position || "Team Member"}</strong>.
  </p>
  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
    We appreciate your skills, professional potential, and look forward to collaborating with you on client projects and delivering high-quality design and development solutions.
  </p>

  <div style="background-color: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; padding: 15px 20px; margin: 20px 0;">
    <h4 style="margin: 0 0 10px 0; color: #C2410C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800;">Engagement Highlights</h4>
    <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Role / Position:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${secondParty.position || "Developer"}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Contract Model:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #FF5722;">${docSettings.employmentType || "Project-Based Contract"}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; font-weight: 600;">Issue Date:</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #0f172a;">${docSettings.date || "Immediate"}</td>
      </tr>
    </table>
  </div>

  <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 22px;">
    Please review the terms of this offer and apply your digital signature. You can view and sign the agreement directly through the secure portal below:
  </p>

  <div style="margin: 30px 0; text-align: center;">
    <a href="${ctaLink}" target="_blank"
       style="background-color: #FF5722; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 14px rgba(255,87,34,0.3);">
      View &amp; Sign Offer Letter &rarr;
    </a>
  </div>
  <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 24px;">
    Both parties will receive the finalized, dual-signed PDF copy once submitted.
  </p>
  ${signatureHtml}
</div>`;
}
