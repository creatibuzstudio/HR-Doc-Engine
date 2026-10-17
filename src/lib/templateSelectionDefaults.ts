import {
  DocSettings,
  AgreementTemplate,
  SecondParty,
} from "@/types";
import { DEFAULT_FIRST_PARTY } from "@/data/defaults";

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
          DEFAULT_FIRST_PARTY.hrName ||
          "Juwel Khan Shanto",
        hrPreparedByDesignation:
          prev.hrPreparedByDesignation || "Head of HR Department",
        hrOrganization:
          prev.hrOrganization ||
          DEFAULT_FIRST_PARTY.companyName ||
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
        "Assigned deliverables will be completed per the approved project scope. Substantial scope, timeline, or deliverable changes require prior mutual approval.",
      compensationDetails:
        prev.compensationDetails ||
        "The Agency will issue payments per the agreed schedule, milestones, and written acceptance criteria. Approved out-of-scope work will be compensated separately.",
      confidentialityTerms:
        prev.confidentialityTerms ||
        "All confidential information, client data, credentials, and project assets must remain strictly protected and non-disclosed to unauthorized parties during and after the engagement, per applicable law.",
      ipOwnershipTerms:
        prev.ipOwnershipTerms ||
        "Ownership of deliverables transfers upon receipt of full payment for the relevant work. Pre-existing tools, third-party assets, and licensed materials remain subject to their respective rights and licenses.",
    },
  };
}
