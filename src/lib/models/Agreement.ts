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

  // Appointment letter
  letterPDFdata?: string; // base64 — renamed from pdfData
  letterSentToBoth?: boolean;

  // PDF storage URL (Firebase / Cloud Storage)
  pdfUrl?: string;

  // Certificate properties
  isCertificateIssued?: boolean;
  certificateId?: string;
  certificatePdfUrl?: string;
}

const AgreementSchema: Schema = new Schema(
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

    // Appointment letter
    letterPDFdata: { type: String },
    letterSentToBoth: { type: Boolean, default: false },
    pdfUrl: { type: String },

    // Certificate properties
    isCertificateIssued: { type: Boolean, default: false },
    certificateId: { type: String },
    certificatePdfUrl: { type: String },
  },
  { timestamps: true, versionKey: false },
);

AgreementSchema.index({ createdAt: -1 });

export default mongoose.models.Agreement ||
  mongoose.model<IAgreement>("Agreement", AgreementSchema, "docsAgreement");
