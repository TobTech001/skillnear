import type { ServiceCategory } from "../types";

export const categories: ServiceCategory[] = [
  { id: "c1", code: "GEN", label: "Generator repair", description: "Won't start, smoking, low power" },
  { id: "c2", code: "PLB", label: "Plumbing", description: "Leaks, blocked drains, tank fittings" },
  { id: "c3", code: "ELE", label: "Electrical", description: "Wiring faults, sockets, tripping breakers" },
  { id: "c4", code: "ROF", label: "Roofing", description: "Leaks, sheet damage, gutter repair" },
  { id: "c5", code: "AC", label: "AC repair", description: "Not cooling, gas refill, servicing" },
  { id: "c6", code: "CLN", label: "Cleaning", description: "Move-in, post-construction, fumigation" },
  { id: "c7", code: "CRP", label: "Carpentry", description: "Doors, furniture, cabinets" },
  { id: "c8", code: "PNT", label: "Painting", description: "Interior, exterior, touch-ups" },
];