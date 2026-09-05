import type { Review } from "../types";
import { reviews as mockReviews } from "../data/Reviews";
import { readStorage, writeStorage, STORAGE_KEYS } from "./Storage";
import { updateProvider } from "./Providersservice";

function loadAll(): Review[] {
  const existing = window.localStorage.getItem(STORAGE_KEYS.reviews);
  if (existing === null) {
    writeStorage(STORAGE_KEYS.reviews, mockReviews);
    return mockReviews;
  }
  return readStorage<Review[]>(STORAGE_KEYS.reviews, mockReviews);
}

export function getReviews(): Review[] {
  return loadAll();
}

export function getReviewsForProvider(providerId: string): Review[] {
  return loadAll().filter((r) => r.providerId === providerId);
}

function recalculateProviderRating(providerId: string, allReviews: Review[]) {
  const forProvider = allReviews.filter((r) => r.providerId === providerId);
  const avg =
    forProvider.length > 0
      ? forProvider.reduce((sum, r) => sum + r.rating, 0) / forProvider.length
      : 0;
  updateProvider(providerId, {
    rating: Math.round(avg * 10) / 10,
    reviews: forProvider.length,
  });
}

export function addReview(review: Review): Review[] {
  const all = [...loadAll(), review];
  writeStorage(STORAGE_KEYS.reviews, all);
  recalculateProviderRating(review.providerId, all);
  return all;
}

export function deleteReview(id: string): Review[] {
  const target = loadAll().find((r) => r.id === id);
  const all = loadAll().filter((r) => r.id !== id);
  writeStorage(STORAGE_KEYS.reviews, all);
  if (target) recalculateProviderRating(target.providerId, all);
  return all;
}