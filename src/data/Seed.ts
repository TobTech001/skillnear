import type { User } from "../types";

// Demo-only accounts, seeded into LocalStorage the first time the app runs.
// Passwords are stored in plain text here because there is no backend yet —
// this is fine for a prototype but must not ship as-is to production.
export const seedUsers: User[] = [
  {
    id: "u_demo_customer",
    name: "Tobi Adeyemi",
    email: "demo@skillnear.ai",
    password: "demo1234",
    role: "customer",
  },
  {
    id: "u_demo_provider",
    name: "Ade Roofing & Repairs",
    email: "demoprovider@skillnear.ai",
    password: "demo1234",
    role: "provider",
    trade: "Roofing",
    providerId: "p1",
  },
  {
    id: "u_demo_admin",
    name: "SkillNear Admin",
    email: "admin@skillnear.ai",
    password: "admin1234",
    role: "admin",
  },
];