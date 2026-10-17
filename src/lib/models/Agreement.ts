import mongoose, { Schema, Document } from "mongoose";
import { DocSettings, FirstParty, SecondParty } from "@/types";

export interface IAgreement extends Document {
  agreementId: string;
  partnerId: string;
  docType: string;
  status: "PENDING_PARTNER_SIGNATURE" | "FULLY_EXECUTED";
  founderSigned: boolean;
  partnerSigned: boolean;
  signedAt?: Date;

  firstParty: FirstParty;
  secondParty: SecondParty;
  docSettings: DocSettings;

  letterPDFdata?: string;
  hasPdf?: boolean;
  letterSentToBoth?: boolean;
  pdfUrl?: string;

  isCertificateIssued?: boolean;
  certificateId?: string;
  certificatePdfUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ContractualCandidateDetailsSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, default: "" },
    livingAddress: { type: String, default: "" },
    position: { type: String, default: "" },
    signatureImg: { type: String, default: "" },
    signatureDate: { type: Date, default: null },
  },
  { _id: false, strict: true },
);

export const ContractualOfferSchema: Schema = new Schema(
  {
    docType: { type: String, default: "Contractual Offer" },
    issueDate: { type: String, required: true },
    contractRef: { type: String, required: true, unique: true },
    employmentType: { type: String, default: "Project-Based Contract" },
    contractSubject: { type: String, default: "" },
    candidateDetails: {
      type: ContractualCandidateDetailsSchema,
      required: true,
    },
    isFounderSigned: { type: Boolean, default: true },
    isCandidateSigned: { type: Boolean, default: false },
    status: { type: String, default: "PENDING_PARTNER_SIGNATURE" },
    letterPDFdata: { type: String, default: "" },
    isFinalletterSentToBoth: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  },
);

ContractualOfferSchema.index({ createdAt: -1 });
ContractualOfferSchema.index({ contractRef: 1 });
ContractualOfferSchema.index({ "candidateDetails.employeeId": 1 });

export const AgreementSchema: Schema = new Schema(
  {
    agreementId: { type: String, required: true, unique: true },
    partnerId: { type: String, required: true },
    docType: { type: String, default: "contractual" },
    status: { type: String, default: "PENDING_PARTNER_SIGNATURE" },
    founderSigned: { type: Boolean, default: true },
    partnerSigned: { type: Boolean, default: false },
    signedAt: { type: Date },

    firstParty: { type: Schema.Types.Mixed, required: true },
    secondParty: { type: Schema.Types.Mixed, required: true },
    docSettings: { type: Schema.Types.Mixed, required: true },

    letterPDFdata: { type: String },
    hasPdf: { type: Boolean, default: false },
    letterSentToBoth: { type: Boolean, default: false },
    pdfUrl: { type: String },

    isCertificateIssued: { type: Boolean, default: false },
    certificateId: { type: String },
    certificatePdfUrl: { type: String },
  },
  { timestamps: true, versionKey: false },
);

AgreementSchema.index({ createdAt: -1 });

/**
 * Clean collection names per document type within the HR-Doc-Engine_CBS database.
 */
export const COLLECTION_MAP = {
  contractual: "contractual_offers",
  internship: "internship_offers",
  hrHiringNotice: "hr_hiring_notices",
  internCertificate: "intern_certificates",
} as const;

export type SupportedDocTypeKey = keyof typeof COLLECTION_MAP;

export function resolveCollectionName(docTypeOrTemplate?: string): string {
  const normalized = (docTypeOrTemplate || "").toLowerCase();
  if (normalized.includes("internship") || normalized === "internship") {
    return COLLECTION_MAP.internship;
  }
  if (
    normalized.includes("hiring") ||
    normalized.includes("notice") ||
    normalized === "hrhiringnotice"
  ) {
    return COLLECTION_MAP.hrHiringNotice;
  }
  if (
    normalized.includes("certificate") ||
    normalized === "interncertificate"
  ) {
    return COLLECTION_MAP.internCertificate;
  }
  return COLLECTION_MAP.contractual;
}

export function getAgreementModel(
  docTypeOrTemplate?: string,
): mongoose.Model<any> {
  const collectionName = resolveCollectionName(docTypeOrTemplate);
  const isContractual = collectionName === COLLECTION_MAP.contractual;
  const modelName = isContractual ? "ContractualOffer" : `Agreement_${collectionName}`;
  const schema = isContractual ? ContractualOfferSchema : AgreementSchema;

  return (
    mongoose.models[modelName] ||
    mongoose.model(modelName, schema, collectionName)
  );
}

export function getAllAgreementModels(): {
  docTypeKey: string;
  collectionName: string;
  model: mongoose.Model<any>;
}[] {
  return Object.entries(COLLECTION_MAP).map(([docTypeKey, collectionName]) => {
    const isContractual = collectionName === COLLECTION_MAP.contractual;
    const modelName = isContractual ? "ContractualOffer" : `Agreement_${collectionName}`;
    const schema = isContractual ? ContractualOfferSchema : AgreementSchema;
    const model =
      mongoose.models[modelName] ||
      mongoose.model(modelName, schema, collectionName);
    return { docTypeKey, collectionName, model };
  });
}

// Default export uses the contractual_offers collection model
export default getAgreementModel("contractual");
