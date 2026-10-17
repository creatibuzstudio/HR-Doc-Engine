import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import dbConnect from "./mongodb";
import Admin from "./models/Admin";

export const SESSION_COOKIE_NAME = "cbs_auth_session";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ||
    "creatibuz_studio_secure_production_jwt_secret_2026_xyz",
);

export interface SessionUser {
  email: string;
  name: string;
  role: string;
}

/**
 * Creates an encrypted JWT session token valid for 7 days
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Cryptographically verifies session token from cookie
 */
export async function verifySessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.email) return null;
    return {
      email: payload.email as string,
      name: (payload.name as string) || "Founder",
      role: (payload.role as string) || "FOUNDER",
    };
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the session from incoming Request headers or cookies
 */
export async function getSession(request?: Request): Promise<SessionUser | null> {
  let token: string | undefined;

  if (request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (match) {
      token = match.split("=")[1];
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Not in a Next.js server context that supports cookies()
    }
  }

  if (!token) return null;
  return await verifySessionToken(token);
}

/**
 * Seeds or verifies the founder in MongoDB Atlas with a secure bcrypt hash
 */
export async function ensureFounderAccount(): Promise<void> {
  await dbConnect();

  const founderEmail = (
    process.env.FOUNDER_EMAIL || "info@creatibuzstudio.com"
  ).trim().toLowerCase();

  const existing = await Admin.findOne({ email: founderEmail });
  if (existing) return;

  // Use the environment password to seed initial bcrypt hash, or default strong password
  const initialPassword = process.env.FOUNDER_PASSWORD || "Hakim@2026";
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(initialPassword, salt);

  await Admin.create({
    email: founderEmail,
    passwordHash,
    name: "Md. Abdul Hakim",
    role: "FOUNDER",
  });

  console.log(`[auth] Initial Founder account secured in MongoDB: ${founderEmail}`);
}

/**
 * Validates credentials against MongoDB Atlas bcrypt hash
 */
export async function authenticateAdmin(
  email: string,
  plainPassword: string,
): Promise<SessionUser | null> {
  await dbConnect();
  await ensureFounderAccount();

  const cleanEmail = email.trim().toLowerCase();
  const admin = await Admin.findOne({ email: cleanEmail });

  if (!admin) {
    return null;
  }

  const isMatch = await bcrypt.compare(plainPassword, admin.passwordHash);
  if (!isMatch) {
    return null;
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  return {
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };
}
