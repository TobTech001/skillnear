import type { Complaint } from "../types";

export const complaints: Complaint[] = [
  {
    id: "c1",
    fromName: "Ngozi Eze",
    fromEmail: "ngozi@example.com",
    aboutProviderId: "p1",
    aboutProviderName: "Ade Roofing & Repairs",
    subject: "Arrived very late",
    message:
      "Technician was booked for 11am but only showed up after 3pm with no warning. Work was fine once started but the wait was frustrating.",
    status: "Open",
    createdAt: "2026-08-08",
  },
  {
    id: "c2",
    fromName: "Wale Kuti",
    fromEmail: "wale@example.com",
    aboutProviderId: "p4",
    aboutProviderName: "Blessing Electricals",
    subject: "Overcharged compared to quote",
    message:
      "Was quoted \u20a68,000 on the phone but charged \u20a612,500 on completion with no clear explanation for the difference.",
    status: "Resolved",
    createdAt: "2026-07-22",
  },
];