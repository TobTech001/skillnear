import type { ServiceCategory } from "../types";
import { categories as mockCategories } from "../data/categories";
import { readStorage, writeStorage, STORAGE_KEYS } from "./Storage";

function loadAll(): ServiceCategory[] {
  const existing = window.localStorage.getItem(STORAGE_KEYS.categories);
  if (existing === null) {
    writeStorage(STORAGE_KEYS.categories, mockCategories);
    return mockCategories;
  }
  return readStorage<ServiceCategory[]>(STORAGE_KEYS.categories, mockCategories);
}

export function getCategories(): ServiceCategory[] {
  return loadAll();
}

export function addCategory(category: ServiceCategory): ServiceCategory[] {
  const all = [...loadAll(), category];
  writeStorage(STORAGE_KEYS.categories, all);
  return all;
}

export function updateCategory(
  id: string,
  patch: Partial<ServiceCategory>
): ServiceCategory[] {
  const all = loadAll().map((c) => (c.id === id ? { ...c, ...patch } : c));
  writeStorage(STORAGE_KEYS.categories, all);
  return all;
}

export function deleteCategory(id: string): ServiceCategory[] {
  const all = loadAll().filter((c) => c.id !== id);
  writeStorage(STORAGE_KEYS.categories, all);
  return all;
}