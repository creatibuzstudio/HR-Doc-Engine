import { FirstParty, SecondParty, DocSettings } from "@/types";
import { buildEmailSignature } from "./emailSignature";
import {
  renderHrHiringNoticeEmail,
  renderCertificateEmail,
  renderInternshipEmail,
  renderContractualEmail,
} from "./emailOfferTemplates";

export { buildEmailSignature } from "./emailSignature";
export type { SignatureParams } from "./emailSignature";

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
