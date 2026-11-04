import fs from "fs/promises";
import path from "path";
import os from "os";

function resolveDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "cbs-agreements");
  }
  return path.join(process.cwd(), "data", "agreements");
}

const DATA_DIR = resolveDataDir();

async function ensureDir(): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

function toSafeFilename(id: string): string {
  return `${id.replace(/[/\\?%*:|"<>]/g, "_")}.json`;
}

export async function fileSaveAgreement(agreement: Record<string, unknown>) {
  try {
    const ok = await ensureDir();
    if (!ok) return agreement;
    const id =
      (agreement.contractRef as string) ||
      (agreement.agreementId as string) ||
      "unknown";
    const filePath = path.join(DATA_DIR, toSafeFilename(id));
    const payload = {
      ...agreement,
      createdAt: agreement.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf-8");
    return payload;
  } catch (err: unknown) {
    console.warn("[fileStore] Local persistence skipped:", (err as Error).message);
    return agreement;
  }
}

export async function fileFindAgreement(id: string) {
  try {
    const ok = await ensureDir();
    if (!ok) return null;
    try {
      const filePath = path.join(DATA_DIR, toSafeFilename(id));
      const raw = await fs.readFile(filePath, "utf-8");
      return JSON.parse(raw);
    } catch {
      const all = await fileListAgreements();
      return (
        all.find(
          (a) =>
            a.contractRef === id ||
            a.agreementId === id ||
            a.partnerId === id ||
            a.candidateDetails?.employeeId === id,
        ) || null
      );
    }
  } catch {
    return null;
  }
}

export async function fileListAgreements(): Promise<any[]> {
  try {
    const ok = await ensureDir();
    if (!ok) return [];
    const files = await fs.readdir(DATA_DIR);
    const agreements = [];
    for (const file of files.filter((f) => f.endsWith(".json"))) {
      try {
        const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
        agreements.push(JSON.parse(raw));
      } catch {
        /* skip corrupt files */
      }
    }
    return agreements.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  } catch {
    return [];
  }
}

export async function fileUpdateAgreement(
  agreementId: string,
  updates: Record<string, unknown>
) {
  try {
    const existing = await fileFindAgreement(agreementId);
    if (!existing) return null;
    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    await fileSaveAgreement(merged);
    return merged;
  } catch {
    return null;
  }
}

export async function fileGenerateIds() {
  const agreements = await fileListAgreements();
  const currentYearStr = new Date().getFullYear().toString().slice(-2);
  const yearPrefix = `JVX-AGR-${currentYearStr}-`;
  let nextSequence = 1;

  for (const a of agreements) {
    if (a.agreementId?.startsWith(yearPrefix)) {
      const parts = a.agreementId.split("-");
      const seq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(seq) && seq >= nextSequence) nextSequence = seq + 1;
    }
  }

  const sequenceStr = nextSequence.toString().padStart(3, "0");
  return {
    agreementId: `${yearPrefix}${sequenceStr}`,
    partnerId: `JVX-PT-${currentYearStr}-${sequenceStr}`,
  };
}

export async function fileDeleteAgreement(id: string): Promise<boolean> {
  try {
    const ok = await ensureDir();
    if (!ok) return false;
    try {
      const filePath = path.join(DATA_DIR, `${id}.json`);
      await fs.unlink(filePath);
      return true;
    } catch {
      try {
        const all = await fileListAgreements();
        const match = all.find((a) => a.agreementId === id || a.partnerId === id);
        if (match && match.agreementId) {
          const filePath = path.join(DATA_DIR, `${match.agreementId}.json`);
          await fs.unlink(filePath);
          return true;
        }
      } catch {}
      return false;
    }
  } catch {
    return false;
  }
}
