import { connectDB } from "../db/connection";
import { HrHiringNotice } from "../db/models/HrHiringNotice";
import { ContractualAgreement } from "../db/models/ContractualAgreement";
import { JobOffer } from "../db/models/JobOffer";

function getYearSuffix(): string {
  return new Date().getFullYear().toString().slice(-2);
}

function parseNextSeq(lastId?: string): string {
  if (!lastId) return "001";
  const parts = lastId.split("-");
  const num = parseInt(parts[parts.length - 1], 10);
  if (isNaN(num)) return "001";
  return (num + 1).toString().padStart(3, "0");
}

export async function generateHiringNoticeIds() {
  await connectDB();
  const year = getYearSuffix();
  const prefix = `JVX-HR-${year}-`;

  const latest = await HrHiringNotice.findOne({
    noticeId: new RegExp(`^${prefix}`),
  })
    .sort({ createdAt: -1 })
    .select("noticeId");

  const seq = parseNextSeq(latest?.noticeId);
  return {
    noticeId: `${prefix}${seq}`,
    refId: `JVX-HR-REF-${year}-${seq}`,
  };
}

export async function generateContractAgreementIds() {
  await connectDB();
  const year = getYearSuffix();
  const prefix = `JVX-PRJ-${year}-`;

  const latest = await ContractualAgreement.findOne({
    agreementId: new RegExp(`^${prefix}`),
  })
    .sort({ createdAt: -1 })
    .select("agreementId");

  const seq = parseNextSeq(latest?.agreementId);
  return {
    agreementId: `${prefix}${seq}`,
    contractorId: `JVX-CON-${year}-${seq}`,
  };
}

export async function generateJobOfferIds() {
  await connectDB();
  const year = getYearSuffix();
  const prefix = `JVX-OFF-${year}-`;

  const latest = await JobOffer.findOne({
    offerId: new RegExp(`^${prefix}`),
  })
    .sort({ createdAt: -1 })
    .select("offerId");

  const seq = parseNextSeq(latest?.offerId);
  return {
    offerId: `${prefix}${seq}`,
    employeeId: `JVX-EMP-${year}-${seq}`,
  };
}
