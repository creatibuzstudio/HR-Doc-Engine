import { connectDB } from "../db/connection";
import { HrHiringNotice, IHrHiringNotice } from "../db/models/HrHiringNotice";
import {
  ContractualAgreement,
  IContractualAgreement,
} from "../db/models/ContractualAgreement";
import { JobOffer, IJobOffer } from "../db/models/JobOffer";
import { DocumentRegistryItem } from "@/types";

export async function findDocumentById(id: string) {
  await connectDB();
  const normalized = decodeURIComponent(id).trim();

  const hiring = await HrHiringNotice.findOne({
    $or: [{ noticeId: normalized }, { refId: normalized }],
  });
  if (hiring) return { type: "hiring" as const, data: hiring.toObject() };

  const contract = await ContractualAgreement.findOne({
    $or: [{ agreementId: normalized }, { contractorId: normalized }],
  });
  if (contract) return { type: "contract" as const, data: contract.toObject() };

  const offer = await JobOffer.findOne({
    $or: [{ offerId: normalized }, { employeeId: normalized }],
  });
  if (offer) return { type: "job-offer" as const, data: offer.toObject() };

  return null;
}

export async function signDocument(
  id: string,
  signatureImg: string
): Promise<boolean> {
  await connectDB();
  const normalized = decodeURIComponent(id).trim();

  const contract = await ContractualAgreement.findOne({
    $or: [{ agreementId: normalized }, { contractorId: normalized }],
  });
  if (contract) {
    contract.secondParty.signatureImg = signatureImg;
    contract.contractorSigned = true;
    contract.status = "FULLY_EXECUTED";
    contract.signedAt = new Date();
    await contract.save();
    return true;
  }

  const offer = await JobOffer.findOne({
    $or: [{ offerId: normalized }, { employeeId: normalized }],
  });
  if (offer) {
    offer.secondParty.signatureImg = signatureImg;
    offer.employeeSigned = true;
    offer.status = "ACCEPTED_AND_SIGNED";
    offer.signedAt = new Date();
    await offer.save();
    return true;
  }

  return false;
}

export async function listAllDocuments(): Promise<DocumentRegistryItem[]> {
  await connectDB();

  const [hiringDocs, contractDocs, offerDocs] = await Promise.all([
    HrHiringNotice.find().sort({ createdAt: -1 }).lean(),
    ContractualAgreement.find().sort({ createdAt: -1 }).lean(),
    JobOffer.find().sort({ createdAt: -1 }).lean(),
  ]);

  const items: DocumentRegistryItem[] = [];

  for (const doc of hiringDocs as unknown as IHrHiringNotice[]) {
    items.push({
      id: doc.noticeId,
      type: "hiring",
      title: doc.title,
      recipientName: doc.recipient.name,
      recipientEmail: doc.recipient.email,
      status: doc.status,
      createdAt: new Date(doc.createdAt).toISOString(),
      pdfUrl: doc.pdfUrl,
    });
  }

  for (const doc of contractDocs as unknown as IContractualAgreement[]) {
    items.push({
      id: doc.agreementId,
      type: "contract",
      title: doc.projectTerms?.projectName || "Contractual Agreement",
      recipientName: doc.secondParty?.fullName || "",
      recipientEmail: doc.secondParty?.email || "",
      status: doc.status,
      createdAt: new Date(doc.createdAt).toISOString(),
      signedAt: doc.signedAt ? new Date(doc.signedAt).toISOString() : undefined,
      pdfUrl: doc.pdfUrl,
    });
  }

  for (const doc of offerDocs as unknown as IJobOffer[]) {
    items.push({
      id: doc.offerId,
      type: "job-offer",
      title: `${doc.employmentTerms?.designation || "Offer"} Letter`,
      recipientName: doc.secondParty?.fullName || "",
      recipientEmail: doc.secondParty?.email || "",
      status: doc.status,
      createdAt: new Date(doc.createdAt).toISOString(),
      signedAt: doc.signedAt ? new Date(doc.signedAt).toISOString() : undefined,
      pdfUrl: doc.pdfUrl,
    });
  }

  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
