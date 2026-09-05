import type { Review } from "../types";

export const reviews: Review[] = [
  {
    id: "r1",
    providerId: "p1",
    author: "Funmi O.",
    rating: 5,
    comment:
      "Came within the hour and fixed the leak properly, not just a patch. Explained everything before starting.",
    date: "2026-08-12",
  },
  {
    id: "r2",
    providerId: "p1",
    author: "Segun A.",
    rating: 5,
    comment: "Fair pricing and cleaned up after the job. Would call again.",
    date: "2026-07-30",
  },
  {
    id: "r3",
    providerId: "p1",
    author: "Chioma N.",
    rating: 4,
    comment: "Good work, arrived a bit later than the time we agreed.",
    date: "2026-07-02",
  },
  {
    id: "r4",
    providerId: "p3",
    author: "Bode I.",
    rating: 5,
    comment: "Diagnosed the fault over a phone call and confirmed it on arrival. Fixed in 40 minutes.",
    date: "2026-08-20",
  },
  {
    id: "r5",
    providerId: "p3",
    author: "Aisha K.",
    rating: 5,
    comment: "Very knowledgeable about Mikano generators specifically. Highly recommend.",
    date: "2026-08-05",
  },
];