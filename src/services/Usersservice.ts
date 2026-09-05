import type { User } from "../types";
import { seedUsers } from "../data/Seed";
import { readStorage, writeStorage, STORAGE_KEYS } from "./Storage";

function loadAll(): User[] {
  const existing = window.localStorage.getItem(STORAGE_KEYS.users);
  if (existing === null) {
    writeStorage(STORAGE_KEYS.users, seedUsers);
    return seedUsers;
  }
  const stored = readStorage<User[]>(STORAGE_KEYS.users, seedUsers);
  const missing = seedUsers.filter(
    (seed) => !stored.some((u) => u.id === seed.id)
  );
  if (missing.length > 0) {
    const merged = [...stored, ...missing];
    writeStorage(STORAGE_KEYS.users, merged);
    return merged;
  }
  return stored;
}

export function getUsers(): User[] {
  return loadAll();
}

export function setUserSuspended(id: string, suspended: boolean): User[] {
  const all = loadAll().map((u) => (u.id === id ? { ...u, suspended } : u));
  writeStorage(STORAGE_KEYS.users, all);
  return all;
}

export function deleteUser(id: string): User[] {
  const all = loadAll().filter((u) => u.id !== id);
  writeStorage(STORAGE_KEYS.users, all);
  return all;
}