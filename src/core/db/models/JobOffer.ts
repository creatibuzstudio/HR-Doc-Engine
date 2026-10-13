import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobOffer extends Document {
  offerId: string; // e.g. JVX-OFF-26-001
  employeeId: string; // e.g. JVX-EMP-26-001
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
    permanentAddress: string;
    bloodGroup?: string;
    signatureImg?: string;
  };
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
  status: "PENDING_ACCEPTANCE" | "ACCEPTED_AND_SIGNED" | "DECLINED";
  founderSigned: boolean;
  employeeSigned: boolean;
  signedAt?: Date;
  pdfUrl?: string;
  cardPdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobOfferSchema = new Schema<IJobOffer>(
  {
    offerId: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, required: true, index: true },
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
      permanentAddress: { type: String, required: true },
      bloodGroup: { type: String },
      signatureImg: { type: String },
    },
    employmentTerms: {
      designation: { type: String, required: true },
      department: { type: String, required: true },
      joiningDate: { type: String, required: true },
      grossSalaryMonthly: { type: Number, required: true },
      currency: { type: String, default: "BDT" },
      probationPeriodMonths: { type: Number, default: 3 },
      noticePeriodDays: { type: Number, default: 30 },
      workMode: {
        type: String,
        enum: ["Remote", "Onsite", "Hybrid"],
        default: "Onsite",
      },
    },
    status: {
      type: String,
      enum: ["PENDING_ACCEPTANCE", "ACCEPTED_AND_SIGNED", "DECLINED"],
      default: "PENDING_ACCEPTANCE",
      index: true,
    },
    founderSigned: { type: Boolean, default: true },
    employeeSigned: { type: Boolean, default: false },
    signedAt: { type: Date },
    pdfUrl: { type: String },
    cardPdfUrl: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "job_offers",
  }
);

export const JobOffer: Model<IJobOffer> =
  mongoose.models.JobOffer ||
  mongoose.model<IJobOffer>("JobOffer", JobOfferSchema);

export default JobOffer;
