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
        `Subject: ${secondParty.position || "Full Stack Developer"} For A ${
          prev.employmentType || "Project-Based Contract"
        }`,
      scopeOfWork:
        prev.scopeOfWork ||
        "You Agree To Complete The Assigned Tasks, Deliverables, Revisions, And Documentation Specified In The Approved Project Scope. Any Substantial Change To The Scope, Timeline, Or Deliverables Must Be Approved By Both Parties Before Implementation.",
      compensationDetails:
        prev.compensationDetails ||
        "The Agency Will Pay The Agreed Project Fee According To The Payment Schedule Specified In This Offer. Payment Milestones, Acceptance Criteria, And Any Applicable Deductions Must Be Agreed Upon In Writing. Approved Additional Work May Be Compensated Separately.",
      confidentialityTerms:
        prev.confidentialityTerms ||
        "You Must Protect All Confidential Information, Client Data, Credentials, Business Documents, Project Files, And Internal Communications. Such Information Must Not Be Disclosed, Misused, Or Shared With Unauthorized Individuals During Or After The Engagement, Subject To Applicable Law.",
      ipOwnershipTerms:
        prev.ipOwnershipTerms ||
        "Ownership And Transfer Of Project Deliverables, Including Designs, Source Files, Code, And Other Work Products, Will Be Governed By The Written Agreement And Applicable Law. Unless Otherwise Agreed, The Transfer Of Ownership To The Agency Or Its Client Will Take Effect Upon Receipt Of The Agreed Payment For The Relevant Deliverables. Pre-Existing Tools, Third-Party Assets, And Properly Licensed Materials Remain Subject To Their Applicable Rights And Licenses.",
    },
  };
}
