import type { Complaint, ComplaintStatus } from "../types";
import { complaints as mockComplaints } from "../data/Complaints";
import { readStorage, writeStorage, STORAGE_KEYS } from "./Storage";

function loadAll(): Complaint[] {
  const existing = window.localStorage.getItem(STORAGE_KEYS.complaints);
  if (existing === null) {
    writeStorage(STORAGE_KEYS.complaints, mockComplaints);
    return mockComplaints;
  }
  return readStorage<Complaint[]>(STORAGE_KEYS.complaints, mockComplaints);
}

export function getComplaints(): Complaint[] {
  return loadAll();
}

export function getComplaintsFromCustomer(email: string): Complaint[] {
  return loadAll().filter((c) => c.fromEmail === email);
}

export function addComplaint(complaint: Complaint): Complaint[] {
  const all = [...loadAll(), complaint];
  writeStorage(STORAGE_KEYS.complaints, all);
  return all;
}

export function updateComplaintStatus(
  id: string,
  status: ComplaintStatus
): Complaint[] {
  const all = loadAll().map((c) => (c.id === id ? { ...c, status } : c));
  writeStorage(STORAGE_KEYS.complaints, all);
  return all;
}

export function deleteComplaint(id: string): Complaint[] {
  const all = loadAll().filter((c) => c.id !== id);
  writeStorage(STORAGE_KEYS.complaints, all);
  return all;
}