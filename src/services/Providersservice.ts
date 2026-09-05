import type { Provider } from "../types";
import { providers as mockProviders } from "../data/providers";
import { readStorage, writeStorage } from "./Storage";

const KEY = "skillnear_providers";

function loadAll(): Provider[] {
  const existing = window.localStorage.getItem(KEY);
  if (existing === null) {
    writeStorage(KEY, mockProviders);
    return mockProviders;
  }
  return readStorage<Provider[]>(KEY, mockProviders);
}

export function getProviders(): Provider[] {
  return loadAll();
}

export function getProviderById(id: string): Provider | undefined {
  return loadAll().find((p) => p.id === id);
}

export function addProvider(provider: Provider): Provider[] {
  const all = [...loadAll(), provider];
  writeStorage(KEY, all);
  return all;
}

export function updateProvider(
  id: string,
  patch: Partial<Provider>
): Provider[] {
  const all = loadAll().map((p) => (p.id === id ? { ...p, ...patch } : p));
  writeStorage(KEY, all);
  return all;
}

export function deleteProvider(id: string): Provider[] {
  const all = loadAll().filter((p) => p.id !== id);
  writeStorage(KEY, all);
  return all;
}

export function initialsFrom(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "SN";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}