export interface FirstParty {
  companyName: string;
  representedBy: string;
  role: string;
  ceoName: string;
  ceoMobile: string;
  cooName: string;
  cooMobile: string;
  hrName?: string;
  hrMobile?: string;
  currentAddress: string;
  permanentAddress: string;
  mobileNumber: string;
  nidNumber: string;
  email: string;
  website: string;
  signatureImg: string;
}

export interface SecondParty {
  partnerId: string;
  partnerIdSerial?: string;
  fullName: string;
  email: string;
  guardianName: string;
  guardianRelation: string;
  mobileNumber: string;
  guardianMobile: string;
  presentAddress: string;
  permanentAddress: string;
  dob: string;
  nidNumber: string;
  position: string;
  bloodGroup: string;
  photoUrl?: string;
  signatureImg: string;
  department?: string;
  performanceGrade?: string;
}

export type AgreementTemplate =
  | "contractual"
  | "internship"
  | "hrHiringNotice"
  | "internCertificate";

export interface DocSettings {
  date: string;
  minimumServicePeriod?: number;
  equityShare?: number;
  noticePeriod?: number;
  refId?: string;
  refIdSerial?: string;
  agreementTemplate?: AgreementTemplate;
  // ── Internship-specific ──────────────────────────────────────────────────
  internId?: string;
  internIdSerial?: string;
  internRefId?: string;
  internRefIdSerial?: string;
  internshipDuration?: string;
  isPaid?: boolean;
  internExpiryDate?: string;
  // ── HR Hiring Notice-specific ────────────────────────────────────────────
  hrNoticeId?: string;
  hrNoticeIdSerial?: string;
  hrNoticeRefId?: string;
  hrNoticeRefIdSerial?: string;
  hrRecipientRole?: string;
  hrRecipientRoleCustom?: string;
  hrRecipientName?: string;
  hrRecipientEmail?: string;
  hrNoticeTitle?: string;
  hrSubject?: string;
  hrPositionName?: string;
  hrVacancies?: number;
  hrDepartment?: string;
  hrEmploymentType?: string;
  hrWorkMode?: string;
  hrLocation?: string;
  hrRecruitmentStartDate?: string;
  hrRecruitmentEndDate?: string;
  hrRequiredSkills?: string[];
  hrExperienceRequired?: string;
  hrExperienceNote?: string;
  hrPreparedByName?: string;
  hrPreparedByDesignation?: string;
  hrOrganization?: string;
  // ── Certificate-specific ─────────────────────────────────────────────────
  certId?: string;
  certIdSerial?: string;
  certRefId?: string;
  certRefIdSerial?: string;
  certStartDate?: string;
  certEndDate?: string;
  certPerformanceGrade?: string;
  certOriginalAgreementId?: string;
  certInternId?: string;
  certificateGenerated?: boolean;
  // ── Contractual-specific ─────────────────────────────────────────────────
  contractRef?: string;
  contractRefIdSerial?: string;
  employmentType?: "Project-Based Contract" | "Full-Time Contract";
  contractSubject?: string;
  scopeOfWork?: string;
  compensationDetails?: string;
  confidentialityTerms?: string;
  ipOwnershipTerms?: string;
  partnerSignedDate?: string;
}

/** Which document types the HR is generating in this session */
export type DocType =
  | "Contractual Offer Letter & Work Agreement (Featured)"
  | "Internship"
  | "HR Hiring Notice"
  | "Intern Certificate"
  | string;

export type AppState =
  | "home"
  | "login"
  | "docTypeSelect"
  | "form"
  | "workspace"
  | "candidatePortal"
  | "adminDashboard";

export type AgreementStatus =
  | "PENDING_PARTNER_SIGNATURE"
  | "FULLY_EXECUTED";

export interface AgreementSummary {
  agreementId: string;
  partnerId: string;
  docType: string;
  agreementTemplate?: AgreementTemplate;
  status: AgreementStatus;
  founderSigned: boolean;
  partnerSigned: boolean;
  signedAt?: string;
  createdAt: string;
  partnerName: string;
  partnerEmail: string;
  companyName: string;
  position: string;
  hrRecipientName?: string;
  hrRecipientEmail?: string;
  hasPdf?: boolean;
}

// ─── Strict Domain Types for Contractual Offers (Creatibuz Studio) ───────────
export interface CompanyDetails {
  companyName: string;
  founderCEO: string;
  ceoMobile: string;
  coFounderCOO: string;
  cooMobile: string;
  officeAddress: string;
  contactNumber: string;
  email: string;
  website: string;
  signatureImg: string;
}

export interface CandidateDetails {
  employeeId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  livingAddress: string;
  position: string;
  signatureImg?: string;
  signatureDate?: Date | string | null;
}

export interface ContractualOfferData {
  _id?: string;
  docType: "Contractual Offer";
  issueDate: string;
  contractRef: string;
  employmentType: string;
  contractSubject: string;
  candidateDetails: CandidateDetails;
  companyDetails?: CompanyDetails;
  isFounderSigned: boolean;
  isCandidateSigned: boolean;
  status: "PENDING_CANDIDATE_SIGNATURE" | "FINALISED";
  letterPDFdata?: string;
  isFinalletterSentToBoth?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

