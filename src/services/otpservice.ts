import { readStorage, writeStorage, STORAGE_KEYS } from "./Storage";

interface ResetRecord {
  code: string;
  expiresAt: number; // epoch ms
}

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

function loadAll(): Record<string, ResetRecord> {
  return readStorage<Record<string, ResetRecord>>(STORAGE_KEYS.passwordResets, {});
}

function saveAll(records: Record<string, ResetRecord>): void {
  writeStorage(STORAGE_KEYS.passwordResets, records);
}

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Generates a 6-digit OTP for the given email and stores it with a 10
 * minute expiry. There's no real email/SMS backend here, so the code is
 * returned directly \u2014 the UI shows it in a "demo" panel the same way
 * the seeded login credentials are shown on the Login page.
 */
export function generateOtp(email: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const records = loadAll();
  records[normalize(email)] = { code, expiresAt: Date.now() + OTP_TTL_MS };
  saveAll(records);
  return code;
}

export function verifyOtp(
  email: string,
  code: string
): { ok: boolean; error?: string } {
  const records = loadAll();
  const record = records[normalize(email)];

  if (!record) {
    return { ok: false, error: "Request a new code first." };
  }
  if (Date.now() > record.expiresAt) {
    return { ok: false, error: "This code has expired. Request a new one." };
  }
  if (record.code !== code.trim()) {
    return { ok: false, error: "That code doesn't match. Check and try again." };
  }
  return { ok: true };
}

export function clearOtp(email: string): void {
  const records = loadAll();
  delete records[normalize(email)];
  saveAll(records);
}