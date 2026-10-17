import dbConnect from "./mongodb";
import { getAgreementModel, getAllAgreementModels } from "./models/Agreement";
import * as fileStore from "./fileAgreementStore";
import { DEFAULT_FIRST_PARTY, DEFAULT_SECOND_PARTY } from "@/data/defaults";

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

function normalizeDoc(doc: Record<string, any> | null): Record<string, any> | null {
  if (!doc) return null;

  // If it's a strict contractual offer document
  if (doc.contractRef || doc.candidateDetails) {
    const candidate = doc.candidateDetails || {};
    return {
      ...doc,
      // Provide compatibility fields for UI/PDF rendering
      agreementId: doc.contractRef,
      partnerId: candidate.employeeId,
      docType: doc.docType || "Contractual Offer",
      status: doc.status || "PENDING_PARTNER_SIGNATURE",
      founderSigned: doc.isFounderSigned ?? true,
      partnerSigned: doc.isCandidateSigned ?? false,
      signedAt: candidate.signatureDate,
      firstParty: DEFAULT_FIRST_PARTY,
      secondParty: {
        ...DEFAULT_SECOND_PARTY,
        partnerId: candidate.employeeId,
        fullName: candidate.fullName || "",
        email: candidate.email || "",
        mobileNumber: candidate.contactNumber || "",
        presentAddress: candidate.livingAddress || "",
        position: candidate.position || "",
        signatureImg: candidate.signatureImg || "",
      },
      docSettings: {
        agreementTemplate: "contractual",
        contractualRefId: doc.contractRef,
        contractualId: candidate.employeeId,
        employmentType: doc.employmentType || "Project-Based Contract",
        contractSubject: doc.contractSubject || "",
        date: doc.issueDate || "",
      },
      letterPDFdata: doc.letterPDFdata || "",
    };
  }

  return doc;
}

export async function saveAgreement(data: Record<string, unknown>) {
  const ds = data.docSettings as Record<string, unknown> | undefined;
  const docTypeOrTemplate =
    (data.docType as string) ||
    (data.agreementTemplate as string) ||
    (ds?.agreementTemplate as string);
  const Model = getAgreementModel(docTypeOrTemplate);

  const mongoDoc = await tryMongo(async () => {
    const doc = new Model(data);
    await doc.save();
    return doc.toObject();
  });

  if (mongoDoc) return { agreement: normalizeDoc(mongoDoc), storage: "mongodb" as const };

  const fileDoc = await fileStore.fileSaveAgreement(data);
  return { agreement: normalizeDoc(fileDoc), storage: "file" as const };
}

export async function findAgreementById(id: string) {
  const normalized = decodeURIComponent(id).trim();

  const mongoDoc = await tryMongo(async () => {
    const models = getAllAgreementModels();
    for (const { model } of models) {
      const agreement = await model.findOne({
        $or: [
          { contractRef: normalized },
          { "candidateDetails.employeeId": normalized },
          { agreementId: normalized },
          { partnerId: normalized },
        ],
      });
      if (agreement) return agreement.toObject();
    }
    return null;
  });

  if (mongoDoc) return normalizeDoc(mongoDoc);
  return normalizeDoc(await fileStore.fileFindAgreement(normalized));
}

export async function listAgreements() {
  const mongoList = await tryMongo(async () => {
    const models = getAllAgreementModels();
    const results = await Promise.all(
      models.map(({ model }) =>
        model
          .find({}, "-letterPDFdata -cardPDFdata")
          .sort({ createdAt: -1 })
          .limit(200)
          .exec(),
      ),
    );
    const combined = results.flat();
    combined.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    return combined
      .map((d) => normalizeDoc(d.toObject()))
      .filter((d): d is Record<string, any> => d !== null);
  });

  if (mongoList) return mongoList;

  console.warn(
    "[listAgreements] MongoDB unavailable — serving local file store.",
  );
  const fileList = await fileStore.fileListAgreements();
  return fileList
    .map(
      ({ letterPDFdata: _letter, cardPDFdata: _card, ...rest }) =>
        normalizeDoc(rest),
    )
    .filter((d): d is Record<string, any> => d !== null);
}

export async function updateAgreement(
  agreementId: string,
  updates: Record<string, unknown>,
) {
  const normalizedId = decodeURIComponent(agreementId).trim();
  const mongoDoc = await tryMongo(async () => {
    const models = getAllAgreementModels();
    for (const { model } of models) {
      const agreement = await model.findOne({
        $or: [
          { contractRef: normalizedId },
          { "candidateDetails.employeeId": normalizedId },
          { agreementId: normalizedId },
          { partnerId: normalizedId },
        ],
      });

      if (agreement) {
        // If it's a ContractualOffer document
        if (agreement.contractRef || agreement.candidateDetails) {
          if (updates.candidateDetails) {
            Object.assign(agreement.candidateDetails, updates.candidateDetails);
            agreement.markModified("candidateDetails");
          } else if (updates.secondParty) {
            const sp = updates.secondParty as Record<string, any>;
            if (sp.signatureImg) agreement.candidateDetails.signatureImg = sp.signatureImg;
            if (sp.fullName) agreement.candidateDetails.fullName = sp.fullName;
            if (sp.email) agreement.candidateDetails.email = sp.email;
            if (sp.mobileNumber) agreement.candidateDetails.contactNumber = sp.mobileNumber;
            if (sp.presentAddress) agreement.candidateDetails.livingAddress = sp.presentAddress;
            if (sp.position) agreement.candidateDetails.position = sp.position;
            agreement.markModified("candidateDetails");
          }

          if (updates.signatureImg && typeof updates.signatureImg === "string") {
            agreement.candidateDetails.signatureImg = updates.signatureImg;
            agreement.candidateDetails.signatureDate = new Date();
            agreement.isCandidateSigned = true;
            agreement.status = "FINALISED";
            agreement.markModified("candidateDetails");
          }

          if (updates.isCandidateSigned !== undefined) {
            agreement.isCandidateSigned = updates.isCandidateSigned;
          } else if (updates.partnerSigned !== undefined) {
            agreement.isCandidateSigned = updates.partnerSigned;
          }

          if (updates.status) {
            agreement.status =
              updates.status === "FULLY_EXECUTED" ? "FINALISED" : (updates.status as string);
          }

          if (updates.signedAt) {
            agreement.candidateDetails.signatureDate = new Date(updates.signedAt as string);
            agreement.markModified("candidateDetails");
          }

          if (updates.letterPDFdata) {
            agreement.letterPDFdata = updates.letterPDFdata as string;
          }

          if (updates.isFinalletterSentToBoth !== undefined) {
            agreement.isFinalletterSentToBoth = Boolean(updates.isFinalletterSentToBoth);
          } else if (updates.letterSentToBoth !== undefined) {
            agreement.isFinalletterSentToBoth = Boolean(updates.letterSentToBoth);
          }

          await agreement.save();
          return agreement.toObject();
        }

        // Standard legacy agreement model
        if (updates.letterPDFdata) {
          updates.hasPdf = true;
        }
        Object.assign(agreement, updates);
        if (updates.secondParty) agreement.markModified("secondParty");
        if (updates.docSettings) agreement.markModified("docSettings");
        await agreement.save();
        return agreement.toObject();
      }
    }
    return null;
  });

  if (mongoDoc) return normalizeDoc(mongoDoc);
  return normalizeDoc(await fileStore.fileUpdateAgreement(normalizedId, updates));
}

export function toAgreementSummary(agreement: Record<string, unknown>) {
  const isContractual =
    agreement.docType === "Contractual Offer" || Boolean(agreement.contractRef);

  if (isContractual) {
    const candidate =
      (agreement.candidateDetails as Record<string, any>) ||
      (agreement.secondParty as Record<string, any>) ||
      {};

    return {
      agreementId: (agreement.contractRef as string) || (agreement.agreementId as string),
      partnerId: candidate.employeeId || candidate.partnerId || (agreement.partnerId as string),
      docType: "Contractual Offer",
      agreementTemplate: "contractual",
      status: (agreement.status as string) || "PENDING_PARTNER_SIGNATURE",
      founderSigned: (agreement.isFounderSigned ?? agreement.founderSigned ?? true) as boolean,
      partnerSigned: (agreement.isCandidateSigned ?? agreement.partnerSigned ?? false) as boolean,
      signedAt: candidate.signatureDate || agreement.signedAt,
      createdAt: agreement.createdAt,
      partnerName: candidate.fullName || "",
      partnerEmail: candidate.email || "",
      companyName: "Creatibuz Studio",
      position: candidate.position || "",
      hasPdf: Boolean(agreement.letterPDFdata),
    };
  }

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
    hasPdf: Boolean(agreement.hasPdf || agreement.letterPDFdata),
  };
}

export async function deleteAgreement(id: string): Promise<boolean> {
  const normalized = decodeURIComponent(id).trim();

  const mongoDeleted = await tryMongo(async () => {
    const models = getAllAgreementModels();
    for (const { model } of models) {
      const res = await model.deleteOne({
        $or: [
          { contractRef: normalized },
          { "candidateDetails.employeeId": normalized },
          { agreementId: normalized },
          { partnerId: normalized },
        ],
      });
      if (res.deletedCount > 0) return true;
    }
    return false;
  });

  if (mongoDeleted !== null) return mongoDeleted;
  return fileStore.fileDeleteAgreement(normalized);
}
