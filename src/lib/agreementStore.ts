import dbConnect from "./mongodb";
import { getAgreementModel, getAllAgreementModels } from "./models/Agreement";
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

function normalizeDoc(doc: Record<string, any> | null): Record<string, any> | null {
  if (!doc) return null;

  // 1. If it has strict contractual offer properties
  if (doc.contractRef || doc.candidateDetails) {
    const candidate = doc.candidateDetails || doc.secondParty || {};
    const ds = doc.docSettings || {};
    return {
      _id: doc._id,
      docType: doc.docType || "Contractual Offer",
      issueDate: doc.issueDate || ds.date || "",
      contractRef: doc.contractRef || doc.agreementId,
      employmentType: doc.employmentType || ds.employmentType || "Project-Based Contract",
      contractSubject: doc.contractSubject || ds.contractSubject || "",
      candidateDetails: {
        employeeId: candidate.employeeId || candidate.partnerId || doc.partnerId || "",
        fullName: candidate.fullName || candidate.name || "",
        email: candidate.email || "",
        contactNumber: candidate.contactNumber || candidate.mobileNumber || "",
        livingAddress: candidate.livingAddress || candidate.presentAddress || "",
        position: candidate.position || "",
        signatureImg: candidate.signatureImg || "",
        signatureDate: candidate.signatureDate || doc.signedAt || null,
      },
      isFounderSigned: doc.isFounderSigned ?? doc.founderSigned ?? true,
      isCandidateSigned: doc.isCandidateSigned ?? doc.partnerSigned ?? false,
      status:
        doc.status ||
        (doc.isCandidateSigned || doc.partnerSigned
          ? "FINALISED"
          : "PENDING_CANDIDATE_SIGNATURE"),
      letterPDFdata: doc.letterPDFdata || "",
      isFinalletterSentToBoth: doc.isFinalletterSentToBoth ?? doc.letterSentToBoth ?? false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      agreementId: doc.agreementId || doc.contractRef,
      partnerId: candidate.employeeId || candidate.partnerId || doc.partnerId,
      secondParty: doc.secondParty,
      firstParty: doc.firstParty,
      docSettings: doc.docSettings,
    };
  }

  // 2. If it's a legacy contractual offer (e.g. from docsAgreement collection)
  const docTypeStr = String(doc.docType || "").toLowerCase();
  const tmplStr = String(
    doc.docSettings?.agreementTemplate || doc.agreementTemplate || "",
  ).toLowerCase();
  const isContractualLegacy =
    docTypeStr.includes("contractual") ||
    docTypeStr.includes("joining offer") ||
    tmplStr === "contractual";

  if (isContractualLegacy) {
    const candidate = doc.secondParty || doc.candidateDetails || {};
    const ds = doc.docSettings || {};
    return {
      _id: doc._id,
      docType: "Contractual Offer",
      issueDate: doc.issueDate || ds.date || "",
      contractRef: doc.contractRef || doc.agreementId || ds.contractRef,
      employmentType: doc.employmentType || ds.employmentType || "Project-Based Contract",
      contractSubject: doc.contractSubject || ds.contractSubject || "",
      candidateDetails: {
        employeeId: candidate.employeeId || candidate.partnerId || doc.partnerId || "",
        fullName: candidate.fullName || candidate.name || "",
        email: candidate.email || "",
        contactNumber: candidate.contactNumber || candidate.mobileNumber || "",
        livingAddress: candidate.livingAddress || candidate.presentAddress || "",
        position: candidate.position || "",
        signatureImg: candidate.signatureImg || "",
        signatureDate: candidate.signatureDate || doc.signedAt || null,
      },
      isFounderSigned: doc.isFounderSigned ?? doc.founderSigned ?? true,
      isCandidateSigned: doc.isCandidateSigned ?? doc.partnerSigned ?? false,
      status:
        doc.status === "FULLY_EXECUTED" || doc.partnerSigned || doc.isCandidateSigned
          ? "FINALISED"
          : doc.status || "PENDING_CANDIDATE_SIGNATURE",
      letterPDFdata: doc.letterPDFdata || "",
      isFinalletterSentToBoth: doc.isFinalletterSentToBoth ?? doc.letterSentToBoth ?? false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      agreementId: doc.agreementId || doc.contractRef,
      partnerId: candidate.employeeId || candidate.partnerId || doc.partnerId,
      secondParty: doc.secondParty,
      firstParty: doc.firstParty,
      docSettings: doc.docSettings,
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

export async function syncFileToMongoIfMissing(fileDoc: Record<string, any>) {
  if (!fileDoc) return;
  const ref = fileDoc.contractRef || fileDoc.agreementId;
  if (!ref) return;

  await tryMongo(async () => {
    const models = getAllAgreementModels();
    for (const { model } of models) {
      const existing = await model.findOne({
        $or: [
          { contractRef: ref },
          { agreementId: ref },
          { "candidateDetails.employeeId": ref },
        ],
      });
      if (existing) return;
    }
    const Model = getAgreementModel(fileDoc.docType || fileDoc.agreementTemplate);
    const doc = new Model(fileDoc);
    await doc.save();
    console.log(`[sync] Successfully synced local offer to MongoDB: ${ref}`);
  });
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

  const fileDoc = await fileStore.fileFindAgreement(normalized);
  if (fileDoc) {
    syncFileToMongoIfMissing(fileDoc).catch((err) =>
      console.warn("[sync] Background sync failed:", err.message),
    );
    return normalizeDoc(fileDoc);
  }
  return null;
}

export async function listAgreements() {
  const fileList = await fileStore.fileListAgreements();

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

    const seenIds = new Set<string>();
    const deduplicated: Record<string, any>[] = [];
    for (const d of combined) {
      const obj = d.toObject ? d.toObject() : d;
      const ref = (
        obj.contractRef ||
        obj.agreementId ||
        obj._id?.toString() ||
        ""
      ).trim();
      if (!ref || !seenIds.has(ref)) {
        if (ref) seenIds.add(ref);
        const normalized = normalizeDoc(obj);
        if (normalized) deduplicated.push(normalized);
      }
    }
    return deduplicated;
  });

  if (mongoList) {
    // If local files exist that are missing from MongoDB, sync them
    const mongoIds = new Set(
      mongoList
        .map((m) => m.contractRef || m.agreementId)
        .filter(Boolean),
    );

    for (const f of fileList) {
      const fId = f.contractRef || f.agreementId;
      if (fId && !mongoIds.has(fId)) {
        syncFileToMongoIfMissing(f).catch(() => {});
        const normalized = normalizeDoc(f);
        if (normalized) mongoList.push(normalized);
      }
    }

    return mongoList;
  }

  console.warn(
    "[listAgreements] MongoDB unavailable — serving local file store.",
  );
  return fileList
    .map(
      ({ letterPDFdata: _letter, cardPDFdata: _card, ...rest }) =>
        normalizeDoc({
          ...rest,
          hasPdf: Boolean(_letter || rest.hasPdf),
        }),
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
    agreement.docType === "Contractual Offer" ||
    Boolean(agreement.contractRef) ||
    (agreement.docSettings as any)?.agreementTemplate === "contractual" ||
    agreement.agreementTemplate === "contractual";

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
      status:
        ((agreement.status as string) ||
          (agreement.isCandidateSigned
            ? "FINALISED"
            : "PENDING_CANDIDATE_SIGNATURE")) as any,
      founderSigned: (agreement.isFounderSigned ?? true) as boolean,
      partnerSigned: (agreement.isCandidateSigned ?? false) as boolean,
      signedAt: candidate.signatureDate || (agreement.signedAt as Date | undefined),
      createdAt: agreement.createdAt,
      partnerName: candidate.fullName || "",
      partnerEmail: candidate.email || "",
      companyName: "Creatibuz Studio",
      position: candidate.position || "",
      hasPdf: Boolean(
        agreement.hasPdf ||
        agreement.letterPDFdata ||
        agreement.status === "FINALISED" ||
        agreement.isCandidateSigned,
      ),
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
  const idVariants = Array.from(
    new Set([
      normalized,
      normalized.replace(/\//g, "-"),
      normalized.replace(/-/g, "/"),
    ]),
  );

  const orConditions: Record<string, any>[] = [
    { contractRef: { $in: idVariants } },
    { agreementId: { $in: idVariants } },
    { "candidateDetails.employeeId": { $in: idVariants } },
    { partnerId: { $in: idVariants } },
  ];

  try {
    const mongoose = await import("mongoose");
    if (mongoose.default.Types.ObjectId.isValid(normalized)) {
      orConditions.push({
        _id: new mongoose.default.Types.ObjectId(normalized),
      });
    }
  } catch {}

  const mongoDeleted = await tryMongo(async () => {
    const models = getAllAgreementModels();
    for (const { model } of models) {
      try {
        const res = await model.deleteOne({ $or: orConditions });
        if (res && res.deletedCount > 0) return true;
      } catch {}
    }
    return false;
  });

  const fileDeleted = await fileStore.fileDeleteAgreement(normalized);
  if (mongoDeleted || fileDeleted) return true;
  return false;
}
