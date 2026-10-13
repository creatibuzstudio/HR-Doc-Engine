export type DocumentType = "hiring" | "contract" | "job-offer";

export interface CompanyInfo {
  companyName: string;
  representedBy: string;
  role: string;
  email: string;
  mobileNumber: string;
  currentAddress: string;
  website?: string;
  signatureImg?: string;
}

export interface CandidateInfo {
  fullName: string;
  email: string;
  mobileNumber: string;
  nidNumber: string;
  presentAddress: string;
  permanentAddress?: string;
  position: string;
  bloodGroup?: string;
  signatureImg?: string;
}

export interface HiringNoticePayload {
  noticeId: string;
  refId: string;
  title: string;
  department: string;
  vacancies: number;
  employmentType: "Full-Time" | "Contractual" | "Internship";
  workMode: "Remote" | "Onsite" | "Hybrid";
  location: string;
  skills: string[];
  experienceRequired: string;
  experienceNote?: string;
  startDate: string;
  endDate: string;
  preparedBy: {
    name: string;
    designation: string;
  };
  recipient: {
    role: string;
    name: string;
    email: string;
  };
}

export interface ContractAgreementPayload {
  agreementId: string;
  contractorId: string;
  firstParty: CompanyInfo;
  secondParty: CandidateInfo;
  projectTerms: {
    projectName: string;
    projectScope: string;
    duration: string;
    remunerationAmount: number;
    currency: string;
    paymentMilestones: string;
    noticePeriodDays: number;
    effectiveDate: string;
    expiryDate: string;
  };
}

export interface JobOfferPayload {
  offerId: string;
  employeeId: string;
  firstParty: CompanyInfo;
  secondParty: CandidateInfo;
  employmentTerms: {
    designation: string;
    department: string;
    joiningDate: string;
    grossSalaryMonthly: number;
    currency: string;
    probationPeriodMonths: number;
    noticePeriodDays: number;
    workMode: "Remote" | "Onsite" | "Hybrid";
  };
}

export interface DocumentRegistryItem {
  id: string; // agreementId / noticeId / offerId
  type: DocumentType;
  title: string;
  recipientName: string;
  recipientEmail: string;
  status: string;
  createdAt: string;
  signedAt?: string;
  pdfUrl?: string;
}
