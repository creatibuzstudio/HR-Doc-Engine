import {
  DocSettings,
  AgreementTemplate,
  SecondParty,
} from "@/types";
import { DEFAULT_COMPANY_DETAILS } from "@/data/defaults";

export function getTemplateSelectionConfig(
  type:
    | "contractual"
    | "internship"
    | "hrHiringNotice"
    | "internCertificate",
  prev: DocSettings,
  secondParty: SecondParty,
): {
  agreementTemplate: AgreementTemplate;
  docType: string;
  docSettings: DocSettings;
} {
  if (type === "internship") {
    return {
      agreementTemplate: "internship",
      docType: "both",
      docSettings: {
        ...prev,
        agreementTemplate: "internship",
      },
    };
  }

  if (type === "internCertificate") {
    return {
      agreementTemplate: "internCertificate",
      docType: "doc",
      docSettings: {
        ...prev,
        agreementTemplate: "internCertificate",
        certPerformanceGrade: "Outstanding",
        certStartDate: "",
        certEndDate: "",
        certId: "",
        certRefId: "",
      },
    };
  }

  if (type === "hrHiringNotice") {
    return {
      agreementTemplate: "hrHiringNotice",
      docType: "both",
      docSettings: {
        ...prev,
        agreementTemplate: "hrHiringNotice",
        hrPreparedByName:
          prev.hrPreparedByName ||
          DEFAULT_COMPANY_DETAILS.coFounderCOO ||
          "Juwel Khan Shanto",
        hrPreparedByDesignation:
          prev.hrPreparedByDesignation || "Head of HR Department",
        hrOrganization:
          prev.hrOrganization ||
          DEFAULT_COMPANY_DETAILS.companyName ||
          "Creatibuz Studio",
        hrVacancies: prev.hrVacancies ?? 1,
        hrEmploymentType: prev.hrEmploymentType || "Full-Time",
        hrWorkMode: prev.hrWorkMode || "Onsite",
        hrLocation: prev.hrLocation || "Rajshahi",
        hrRecipientRole: prev.hrRecipientRole || "CEO",
      },
    };
  }

  // Default: contractual
  return {
    agreementTemplate: "contractual",
    docType: "doc",
    docSettings: {
      ...prev,
      agreementTemplate: "contractual",
      employmentType: prev.employmentType || "Project-Based Contract",
      contractSubject:
        prev.contractSubject ||
        `Subject: ${secondParty.position || "Full Stack Developer"} For A ${prev.employmentType || "Project-Based Contract"
        }`,
      scopeOfWork:
        prev.scopeOfWork ||
        "All deliverables must be completed strictly in accordance with the approved project scope. Any substantial modifications to the scope, timeline, or deliverables require prior mutual written approval from both parties.",
      compensationDetails:
        prev.compensationDetails ||
        "The Agency will issue payments strictly in accordance with the mutually agreed schedule, milestones, and written acceptance criteria. Furthermore, any approved out-of-scope work will be evaluated and compensated separately.",
      confidentialityTerms:
        prev.confidentialityTerms ||
        "All confidential information, client data, credentials, and project assets must remain strictly protected and non-disclosed to unauthorized parties during and after the engagement, per applicable law.",
      ipOwnershipTerms:
        prev.ipOwnershipTerms ||
        "Ownership of deliverables transfers upon receipt of full payment for the relevant work. Pre-existing tools, third-party assets, and licensed materials remain subject to their respective rights and licenses.",
    },
  };
}
