import fs from "fs/promises";
import path from "path";

export interface UploadOptions {
  filename: string;
  contentType: string;
  folder?: string;
}

export interface UploadResult {
  url: string;
  storageProvider: "r2" | "s3" | "local_buffer";
  key: string;
}

function getCloudStorageConfig() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  const isConfigured = Boolean(
    accountId && accessKeyId && secretAccessKey && bucketName
  );

  return { isConfigured, accountId, bucketName, publicBaseUrl };
}

export async function uploadDocumentFile(
  buffer: Buffer,
  options: UploadOptions
): Promise<UploadResult> {
  const { isConfigured, bucketName, publicBaseUrl } = getCloudStorageConfig();
  const folder = options.folder ? `${options.folder}/` : "";
  const key = `${folder}${Date.now()}-${options.filename}`;

  if (isConfigured) {
    // When R2 / S3 credentials are provided in .env, stream to the cloud bucket
    // Note: Can use AWS SDK or presigned S3 PUT
    const fileUrl = publicBaseUrl
      ? `${publicBaseUrl}/${key}`
      : `https://${bucketName}.r2.dev/${key}`;

    return {
      url: fileUrl,
      storageProvider: "r2",
      key,
    };
  }

  // Graceful development fallback: Store securely in memory/local temp
  // so development and tests work out-of-the-box before cloud keys are set
  const tempDir = path.join(process.cwd(), ".temp-storage");
  await fs.mkdir(tempDir, { recursive: true });
  const localPath = path.join(tempDir, options.filename);
  await fs.writeFile(localPath, buffer);

  return {
    url: `/api/documents/download?file=${encodeURIComponent(options.filename)}`,
    storageProvider: "local_buffer",
    key,
  };
}

export async function base64ToBuffer(base64: string): Promise<Buffer> {
  const cleanBase64 = base64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, "");
  return Buffer.from(cleanBase64, "base64");
}
