import crypto from "crypto";

const SESSION_SECRET =
  process.env.SESSION_SECRET || "jevxo-secret-salt-2026-production-token-key";
const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL || "info@jevxo.com";
const FOUNDER_PASSWORD = process.env.FOUNDER_PASSWORD || "jevxo2026";

export function validateFounderCredentials(
  email?: string,
  pass?: string
): boolean {
  if (!email || !pass) return false;
  return email.trim() === FOUNDER_EMAIL && pass.trim() === FOUNDER_PASSWORD;
}

export function generateFounderToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${FOUNDER_EMAIL}:${timestamp}`)
    .digest("hex");

  return `${timestamp}.${signature}`;
}

export function verifyFounderToken(token?: string | null): boolean {
  if (!token || !token.includes(".")) return false;

  const [timestamp, signature] = token.split(".");
  const time = parseInt(timestamp, 10);

  // Check expiration: 7 days
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  if (isNaN(time) || Date.now() - time > SEVEN_DAYS_MS) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${FOUNDER_EMAIL}:${timestamp}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "utf-8"),
    Buffer.from(expectedSignature, "utf-8")
  );
}

export function isAuthorizedRequest(request: Request): boolean {
  // Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (verifyFounderToken(token)) return true;
  }

  // Check Cookie header
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/jevxo_session=([^;]+)/);
    if (match && verifyFounderToken(match[1])) return true;
  }

  return false;
}
