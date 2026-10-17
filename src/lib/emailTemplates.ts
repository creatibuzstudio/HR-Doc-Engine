import { FirstParty, SecondParty, DocSettings } from "@/types";
import { buildEmailSignature } from "./emailSignature";
import {
  renderHrHiringNoticeEmail,
  renderCertificateEmail,
  renderInternshipEmail,
  renderContractualEmail,
  renderFinalExecutedEmail,
} from "./emailOfferTemplates";

export { buildEmailSignature } from "./emailSignature";
export type { SignatureParams } from "./emailSignature";
export { renderFinalExecutedEmail } from "./emailOfferTemplates";

export interface EmailHtmlParams {
  candidateName: string;
  firstParty: FirstParty;
  secondParty: SecondParty;
  docSettings: DocSettings;
  ctaLink: string;
  isContractual: boolean;
  isInternship: boolean;
  isHrHiring: boolean;
  isCertificate: boolean;
}

export function buildEmailHtml({
  candidateName,
  firstParty,
  secondParty,
  docSettings,
  ctaLink,
  isInternship,
  isHrHiring,
  isCertificate,
}: EmailHtmlParams): string {
  const website = (firstParty.website || "www.creatibuzstudio.com").replace(
    /^https?:\/\//,
    "",
  );
  const address = firstParty.currentAddress || "Delduar Road, Tangail Shadar, Dhaka";

  const ceoSignature = buildEmailSignature({
    name: firstParty.representedBy || "Md. Abdul Hakim",
    title: `${firstParty.role || "Founder & CEO"} &bull; ${firstParty.companyName || "Creatibuz Studio"}`,
    email: firstParty.email || "info@creatibuzstudio.com",
    phone: firstParty.mobileNumber || "+8801968657353",
    website,
    address,
    accentColor: "#FF5722",
  });

  if (isHrHiring) {
    const hrSignature = buildEmailSignature({
      name:
        docSettings.hrPreparedByName ||
        firstParty.hrName ||
        firstParty.representedBy,
      title: `${docSettings.hrPreparedByDesignation || "Head of HR Department"} &bull; ${firstParty.companyName}`,
      email: firstParty.email || "info@creatibuzstudio.com",
      phone: firstParty.hrMobile || firstParty.mobileNumber || "",
      website,
      address,
      accentColor: "#7c3aed",
    });
    return renderHrHiringNoticeEmail({
      candidateName,
      firstParty,
      docSettings,
      signatureHtml: hrSignature,
    });
  }

  if (isCertificate) {
    return renderCertificateEmail({
      candidateName,
      firstParty,
      secondParty,
      docSettings,
      signatureHtml: ceoSignature,
    });
  }

  if (isInternship) {
    return renderInternshipEmail({
      candidateName,
      firstParty,
      secondParty,
      docSettings,
      ctaLink,
      signatureHtml: ceoSignature,
    });
  }

  // Contractual Offer & Work Agreement (Featured default)
  return renderContractualEmail({
    candidateName,
    firstParty,
    secondParty,
    docSettings,
    ctaLink,
    signatureHtml: ceoSignature,
  });
}

export interface FinalExecutedHtmlParams {
  candidateName: string;
  companyName: string;
  position: string;
  contractRef: string;
  employeeId?: string;
  firstParty?: FirstParty;
}

export function buildFinalExecutedEmailHtml({
  candidateName,
  companyName,
  position,
  contractRef,
  employeeId,
  firstParty,
}: FinalExecutedHtmlParams): string {
  const fp = firstParty || ({} as FirstParty);
  const website = (fp.website || "www.creatibuzstudio.com").replace(
    /^https?:\/\//,
    "",
  );
  const address = fp.currentAddress || "Delduar Road, Tangail Shadar, Dhaka";

  const ceoSignature = buildEmailSignature({
    name: fp.representedBy || "Md. Abdul Hakim",
    title: `${fp.role || "Founder & CEO"} &bull; ${companyName || "Creatibuz Studio"}`,
    email: fp.email || "info@creatibuzstudio.com",
    phone: fp.mobileNumber || "+8801968657353",
    website,
    address,
    accentColor: "#FF5722",
  });

  return renderFinalExecutedEmail({
    candidateName,
    companyName: companyName || "Creatibuz Studio",
    position: position || "Team Member",
    contractRef,
    employeeId,
    signatureHtml: ceoSignature,
  });
}
