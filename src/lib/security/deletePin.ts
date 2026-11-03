import bcrypt from "bcryptjs";

// One-way 12-round bcrypt hash of the authorized security PIN (never stored in plain text)
const DEFAULT_PIN_HASH =
  "$2b$12$Ux5zAD7vbrTf6Z.guBp/AedLXRJSJfEipqE4Nx.rQxV0lbNSf/YXS";

// In-memory rate limiting against brute-force attacks from the web
interface AttemptTracker {
  count: number;
  lockedUntil: number;
}

const failedAttempts = new Map<string, AttemptTracker>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout after 5 failures

/**
 * Validates the deletion PIN with multi-layer security:
 * 1. Checks brute-force lockouts per client identifier.
 * 2. Uses constant-time bcrypt verification (no plain text in codebase).
 * 3. Supports optional environment override via ADMIN_DELETE_PIN or ADMIN_DELETE_PIN_HASH.
 */
export async function verifyDeletePin(
  pin: string,
  clientId = "global",
): Promise<{ valid: boolean; error?: string }> {
  if (!pin || typeof pin !== "string" || !pin.trim()) {
    return { valid: false, error: "A valid security PIN is required." };
  }

  const now = Date.now();
  const tracker = failedAttempts.get(clientId);

  if (tracker && tracker.lockedUntil > now) {
    const minutesLeft = Math.ceil((tracker.lockedUntil - now) / 60000);
    return {
      valid: false,
      error: `Too many failed attempts. Security PIN locked for ${minutesLeft} minute(s).`,
    };
  }

  const cleanPin = pin.trim();

  // Environment hash or fallback hash
  const targetHash = process.env.ADMIN_DELETE_PIN_HASH || DEFAULT_PIN_HASH;

  let isMatch = false;

  // 1. Primary check: Cryptographic bcrypt comparison against hash
  try {
    isMatch = await bcrypt.compare(cleanPin, targetHash);
  } catch {
    isMatch = false;
  }

  // 2. Optional env plain-text override if explicitly set in .env
  if (!isMatch && process.env.ADMIN_DELETE_PIN) {
    isMatch = cleanPin === process.env.ADMIN_DELETE_PIN.trim();
  }

  if (!isMatch) {
    const current =
      tracker && tracker.lockedUntil <= now
        ? { count: 0, lockedUntil: 0 }
        : tracker || { count: 0, lockedUntil: 0 };
    current.count += 1;

    if (current.count >= MAX_ATTEMPTS) {
      current.lockedUntil = now + LOCKOUT_MS;
      failedAttempts.set(clientId, current);
      return {
        valid: false,
        error: "Too many failed attempts. Security PIN locked for 15 minutes.",
      };
    }

    failedAttempts.set(clientId, current);
    const remaining = MAX_ATTEMPTS - current.count;
    return {
      valid: false,
      error: `Forbidden: Invalid security PIN. (${remaining} attempt${remaining === 1 ? "" : "s"} remaining)`,
    };
  }

  // Reset tracker on successful verification
  failedAttempts.delete(clientId);
  return { valid: true };
}

