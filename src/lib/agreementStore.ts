import dbConnect from "./mongodb";
import Agreement from "./models/Agreement";
import * as fileStore from "./fileAgreementStore";

export { TOTAL_DOCUMENT_PAGES } from "./documentConstants";
export * from "./idGenerators";

async function tryMongo<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    await dbConnect();
    return await fn();
  } catch (err: unknown) {
    console.warn(
      "[agreementStore] MongoDB unavailable, using local file store:",
      (err as Error).message,
    );
    return null;
  }
}

export async function saveAgreement(data: Record<string, unknown>) {
  const mongoDoc = await tryMongo(async () => {
    const doc = new Agreement(data);
    await doc.save();
    return doc.toObject();
  });

  if (mongoDoc) return { agreement: mongoDoc, storage: "mongodb" as const };

  const fileDoc = await fileStore.fileSaveAgreement(data);
  return { agreement: fileDoc, storage: "file" as const };
}

export async function findAgreementById(id: string) {
  const normalized = decodeURIComponent(id).trim();

  const mongoDoc = await tryMongo(async () => {
    let agreement = await Agreement.findOne({ agreementId: normalized });
    if (!agreement) {
      agreement = await Agreement.findOne({ partnerId: normalized });
    }
    return agreement?.toObject() || null;
  });

  if (mongoDoc) return mongoDoc;
  return fileStore.fileFindAgreement(normalized);
}

export async function listAgreements() {
  const mongoList = await tryMongo(async () => {
    const docs = await Agreement.find({}, "-letterPDFdata -cardPDFdata")
      .sort({ createdAt: -1 })
      .limit(500);
    return docs.map((d) => d.toObject());
  });

  if (mongoList) return mongoList;

  console.warn(
    "[listAgreements] MongoDB unavailable — serving local file store.",
  );
  const fileList = await fileStore.fileListAgreements();
  return fileList.map(
    ({ letterPDFdata: _letter, cardPDFdata: _card, ...rest }) => rest,
  );
}

export async function updateAgreement(
  agreementId: string,
  updates: Record<string, unknown>,
) {
  const mongoDoc = await tryMongo(async () => {
    const agreement = await Agreement.findOne({ agreementId });
    if (!agreement) return null;

    Object.assign(agreement, updates);
    if (updates.secondParty) agreement.markModified("secondParty");
    if (updates.docSettings) agreement.markModified("docSettings");
    await agreement.save();
    return agreement.toObject();
  });

  if (mongoDoc) return mongoDoc;
  return fileStore.fileUpdateAgreement(agreementId, updates);
}

export function toAgreementSummary(agreement: Record<string, unknown>) {
  const ds = agreement.docSettings as Record<string, unknown> | undefined;
  const sp = agreement.secondParty as Record<string, string> | undefined;
  const isHrHiring =
    ds?.agreementTemplate === "hrHiringNotice" ||
    agreement.docType === "HR Hiring Notice";

  return {
    agreementId: agreement.agreementId,
    partnerId: agreement.partnerId,
    docType: agreement.docType || "contractual",
    agreementTemplate:
      (ds as Record<string, string> | undefined)?.agreementTemplate ||
      undefined,
    status: agreement.status,
    founderSigned: agreement.founderSigned,
    partnerSigned: agreement.partnerSigned,
    signedAt: agreement.signedAt,
    createdAt: agreement.createdAt,
    partnerName: isHrHiring
      ? (ds?.hrRecipientName as string) || sp?.fullName || sp?.name || ""
      : sp?.fullName || sp?.name || "",
    partnerEmail: isHrHiring
      ? (ds?.hrRecipientEmail as string) || sp?.email || ""
      : sp?.email || "",
    companyName:
      (agreement.firstParty as Record<string, string> | undefined)
        ?.companyName ||
      (agreement.firstParty as Record<string, string> | undefined)?.company ||
      "Creatibuz Studio",
    position: sp?.position || sp?.role || "",
    hrRecipientName: isHrHiring
      ? (ds?.hrRecipientName as string) || ""
      : undefined,
    hrRecipientEmail: isHrHiring
      ? (ds?.hrRecipientEmail as string) || ""
      : undefined,
  };
}

export async function deleteAgreement(id: string): Promise<boolean> {
  const normalized = decodeURIComponent(id).trim();

  const mongoDeleted = await tryMongo(async () => {
    let res = await Agreement.deleteOne({ agreementId: normalized });
    if (res.deletedCount === 0) {
      res = await Agreement.deleteOne({ partnerId: normalized });
    }
    return res.deletedCount > 0;
  });

  if (mongoDeleted !== null) return mongoDeleted;
  return fileStore.fileDeleteAgreement(normalized);
}
