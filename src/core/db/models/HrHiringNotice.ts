import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHrHiringNotice extends Document {
  noticeId: string; // e.g. JVX-HR-26-001
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
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HrHiringNoticeSchema = new Schema<IHrHiringNotice>(
  {
    noticeId: { type: String, required: true, unique: true, index: true },
    refId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    vacancies: { type: Number, required: true, default: 1 },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Contractual", "Internship"],
      default: "Full-Time",
    },
    workMode: {
      type: String,
      enum: ["Remote", "Onsite", "Hybrid"],
      default: "Remote",
    },
    location: { type: String, default: "Rajshahi, Bangladesh" },
    skills: { type: [String], default: [] },
    experienceRequired: { type: String, default: "1+ years" },
    experienceNote: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    preparedBy: {
      name: { type: String, required: true },
      designation: { type: String, required: true },
    },
    recipient: {
      role: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "CLOSED"],
      default: "DRAFT",
    },
    pdfUrl: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "hr_hiring_notices",
  }
);

export const HrHiringNotice: Model<IHrHiringNotice> =
  mongoose.models.HrHiringNotice ||
  mongoose.model<IHrHiringNotice>("HrHiringNotice", HrHiringNoticeSchema);

export default HrHiringNotice;
