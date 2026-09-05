// Thin, typed wrapper around window.localStorage.
// Centralising this here means every other file reads/writes through the
// same JSON-safe interface instead of calling localStorage directly.

export const STORAGE_KEYS = {
  users: "skillnear_users",
  currentUserId: "skillnear_current_user_id",
  bookings: "skillnear_bookings",
  favorites: "skillnear_favorites",
  passwordResets: "skillnear_password_resets",
  providers: "skillnear_providers",
  categories: "skillnear_categories",
  reviews: "skillnear_reviews",
  complaints: "skillnear_complaints",
  verifications: "skillnear_verifications",
  payments: "skillnear_payments",
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt or unavailable storage (e.g. private browsing) -> fall back
    // rather than crash the app.
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently, the UI still works
    // in-memory for the current session.
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op
  }
}