import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContractualAgreement extends Document {
  agreementId: string; // e.g. JVX-PRJ-26-001
  contractorId: string; // e.g. JVX-CON-26-001
  firstParty: {
    companyName: string;
    representedBy: string;
    role: string;
    email: string;
    mobileNumber: string;
    currentAddress: string;
    signatureImg?: string;
  };
  secondParty: {
    fullName: string;
    email: string;
    mobileNumber: string;
    nidNumber: string;
    presentAddress: string;
    position: string;
    signatureImg?: string;
  };
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
  status: "PENDING_SIGNATURE" | "FULLY_EXECUTED" | "TERMINATED";
  founderSigned: boolean;
  contractorSigned: boolean;
  signedAt?: Date;
  pdfUrl?: string;
  cardPdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContractualAgreementSchema = new Schema<IContractualAgreement>(
  {
    agreementId: { type: String, required: true, unique: true, index: true },
    contractorId: { type: String, required: true, index: true },
    firstParty: {
      companyName: { type: String, required: true, default: "JEVXO" },
      representedBy: { type: String, required: true },
      role: { type: String, default: "Founder & CEO" },
      email: { type: String, default: "info@jevxo.com" },
      mobileNumber: { type: String, default: "01405749386" },
      currentAddress: { type: String, default: "Rajshahi, Bangladesh" },
      signatureImg: { type: String },
    },
    secondParty: {
      fullName: { type: String, required: true },
      email: { type: String, required: true, index: true },
      mobileNumber: { type: String, required: true },
      nidNumber: { type: String, required: true },
      presentAddress: { type: String, required: true },
      position: { type: String, required: true },
      signatureImg: { type: String },
    },
    projectTerms: {
      projectName: { type: String, required: true },
      projectScope: { type: String, required: true },
      duration: { type: String, required: true },
      remunerationAmount: { type: Number, required: true },
      currency: { type: String, default: "BDT" },
      paymentMilestones: { type: String, default: "50% On Milestone, 50% On Completion" },
      noticePeriodDays: { type: Number, default: 15 },
      effectiveDate: { type: String, required: true },
      expiryDate: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["PENDING_SIGNATURE", "FULLY_EXECUTED", "TERMINATED"],
      default: "PENDING_SIGNATURE",
      index: true,
    },
    founderSigned: { type: Boolean, default: true },
    contractorSigned: { type: Boolean, default: false },
    signedAt: { type: Date },
    pdfUrl: { type: String },
    cardPdfUrl: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "contractual_agreements",
  }
);

export const ContractualAgreement: Model<IContractualAgreement> =
  mongoose.models.ContractualAgreement ||
  mongoose.model<IContractualAgreement>(
    "ContractualAgreement",
    ContractualAgreementSchema
  );

export default ContractualAgreement;
