import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage, isFirebaseConfigured } from "@/lib/firebase";

export interface UploadResult {
  url: string | null;
  error?: string;
  isFallback: boolean;
}

/**
 * Converts a base64 string (with or without data URI prefix) into a Uint8Array.
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.replace(/^data:[^;]+;base64,/, "");
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(clean, "base64"));
  }
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Uploads a generated PDF to Firebase Storage.
 *
 * If Firebase credentials are not configured in environment variables,
 * it returns `{ url: null, isFallback: true }` gracefully without crashing,
 * allowing the application to store base64 in MongoDB / local files.
 */
export async function uploadPdfToStorage(
  offerId: string,
  pdfBase64: string,
  filename?: string,
): Promise<UploadResult> {
  if (!isFirebaseConfigured()) {
    return {
      url: null,
      isFallback: true,
    };
  }

  const storage = getFirebaseStorage();
  if (!storage) {
    return {
      url: null,
      error: "Firebase Storage instance is unavailable.",
      isFallback: true,
    };
  }

  try {
    const safeFilename = filename || `document-${offerId}.pdf`;
    const storageRef = ref(storage, `documents/${offerId}/${safeFilename}`);
    const bytes = base64ToUint8Array(pdfBase64);

    await uploadBytes(storageRef, bytes, {
      contentType: "application/pdf",
      customMetadata: {
        offerId,
        uploadedAt: new Date().toISOString(),
      },
    });

    const downloadUrl = await getDownloadURL(storageRef);
    return {
      url: downloadUrl,
      isFallback: false,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(
      `[storage.service] Firebase upload failed for offerId ${offerId}, falling back to base64 storage:`,
      message,
    );
    return {
      url: null,
      error: message,
      isFallback: true,
    };
  }
}
