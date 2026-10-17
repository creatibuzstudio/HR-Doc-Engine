import dbConnect from "./mongodb";
import { getAllAgreementModels } from "./models/Agreement";
import * as fileStore from "./fileAgreementStore";

async function tryMongo<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    await dbConnect();
    return await fn();
  } catch (err: unknown) {
    console.warn(
      "[idGenerators] MongoDB unavailable, using local file store:",
      (err as Error).message,
    );
    return null;
  }
}

function extractMaxSeq(
  items: { agreementId?: string; contractRef?: string }[],
  prefix: string,
): number {
  let max = 0;
  for (const item of items) {
    const val = item.contractRef || item.agreementId;
    if (typeof val === "string" && val.startsWith(prefix)) {
      const parts = val.split(/[-/]/);
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq > max) max = seq;
    }
  }
  return max;
}

async function generatePrefixedIdPair(refPrefix: string, entityPrefix: string) {
  const escapedPrefix = refPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const mongoResult = await tryMongo(async () => {
    const models = getAllAgreementModels();
    const results = await Promise.all(
      models.map(({ model }) =>
        model.find(
          {
            $or: [
              { contractRef: new RegExp(`^${escapedPrefix}`) },
              { agreementId: new RegExp(`^${escapedPrefix}`) },
            ],
          },
          "contractRef agreementId",
        ),
      ),
    );
    const docs = results.flat();
    const maxSeq = extractMaxSeq(docs, refPrefix);
    const seq = (maxSeq + 1).toString().padStart(3, "0");
    return {
      refId: `${refPrefix}${seq}`,
      id: `${entityPrefix}${seq}`,
    };
  });

  if (mongoResult) {
    return { ...mongoResult, storage: "mongodb" as const };
  }

  const fileList = await fileStore.fileListAgreements();
  const maxSeq = extractMaxSeq(fileList, refPrefix);
  const seq = (maxSeq + 1).toString().padStart(3, "0");
  return {
    refId: `${refPrefix}${seq}`,
    id: `${entityPrefix}${seq}`,
    storage: "file" as const,
  };
}

export async function generateContractualIds() {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const pair = await generatePrefixedIdPair(
    `CBS/REF-${currentYearStr}/`,
    `CBS-EMP-`,
  );
  return {
    contractRef: pair.refId,
    employeeId: pair.id,
    contractualId: pair.id,
    contractualRefId: pair.refId,
    agreementId: pair.refId,
    partnerId: pair.id,
    storage: pair.storage,
  };
}

export async function generateInternIds() {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const pair = await generatePrefixedIdPair(
    `JVX-INT-REF-${currentYearStr}-`,
    `JVX-INT-${currentYearStr}-`,
  );
  return {
    internId: pair.id,
    internRefId: pair.refId,
    storage: pair.storage,
  };
}

export async function generateHrHiringIds() {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const pair = await generatePrefixedIdPair(
    `JVX-HR-REF-${currentYearStr}-`,
    `JVX-HR-${currentYearStr}-`,
  );
  return {
    hrNoticeRefId: pair.refId,
    hrNoticeId: pair.id,
    storage: pair.storage,
  };
}

export async function generateCertificateIds() {
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const pair = await generatePrefixedIdPair(
    `JVX-CRT-REF-${currentYearStr}-`,
    `JVX-CRT-${currentYearStr}-`,
  );
  return {
    certId: pair.id,
    certRefId: pair.refId,
    storage: pair.storage,
  };
}

// Fallback alias for contractual
export const generateAgreementIds = generateContractualIds;
