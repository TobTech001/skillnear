import type { ProviderVerification, VerificationStatus } from "../types";
import { readStorage, writeStorage, STORAGE_KEYS } from "./Storage";
import { updateProvider } from "./Providersservice";

function loadAll(): ProviderVerification[] {
  return readStorage<ProviderVerification[]>(STORAGE_KEYS.verifications, []);
}

export function getVerifications(): ProviderVerification[] {
  return loadAll();
}

export function getVerificationForProvider(
  providerId: string
): ProviderVerification | undefined {
  return loadAll().find((v) => v.providerId === providerId);
}

export function getVerificationForUser(
  userId: string
): ProviderVerification | undefined {
  return loadAll().find((v) => v.providerUserId === userId);
}

/** Creates or replaces the verification record for a given provider. */
export function saveVerification(
  record: ProviderVerification
): ProviderVerification[] {
  const all = loadAll();
  const existingIndex = all.findIndex((v) => v.providerId === record.providerId);
  const updated =
    existingIndex >= 0
      ? all.map((v, i) => (i === existingIndex ? record : v))
      : [...all, record];
  writeStorage(STORAGE_KEYS.verifications, updated);
  return updated;
}

export function updateVerificationStatus(
  id: string,
  status: VerificationStatus,
  adminNote?: string
): ProviderVerification[] {
  const all = loadAll().map((v) =>
    v.id === id
      ? {
          ...v,
          status,
          adminNote: adminNote ?? v.adminNote,
          reviewedAt: new Date().toISOString().slice(0, 10),
        }
      : v
  );
  writeStorage(STORAGE_KEYS.verifications, all);

  // Approving verification also flips the public-facing verified badge on
  // the provider's listing, so Search/ProviderProfile reflect it immediately.
  if (status === "verified") {
    const record = all.find((v) => v.id === id);
    if (record) updateProvider(record.providerId, { verified: true });
  }
  return all;
}