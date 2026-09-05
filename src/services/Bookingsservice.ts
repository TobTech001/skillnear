import type { Booking, BookingStatus } from "../types";
import { bookings as mockBookings } from "../data/Bookings";
import { readStorage, writeStorage, STORAGE_KEYS } from "./Storage";

function loadAll(): Booking[] {
  // First run: nothing in LocalStorage yet, so seed it with the mock
  // bookings and persist them. Every run after that reads from storage.
  const existing = window.localStorage.getItem(STORAGE_KEYS.bookings);
  if (existing === null) {
    writeStorage(STORAGE_KEYS.bookings, mockBookings);
    return mockBookings;
  }
  return readStorage<Booking[]>(STORAGE_KEYS.bookings, mockBookings);
}

export function getBookings(): Booking[] {
  return loadAll();
}

export function getBookingsForCustomer(email: string): Booking[] {
  return loadAll().filter((b) => b.customerEmail === email);
}

export function getBookingsForProvider(providerId: string): Booking[] {
  return loadAll().filter((b) => b.providerId === providerId);
}

export function addBooking(booking: Booking): Booking[] {
  const all = [...loadAll(), booking];
  writeStorage(STORAGE_KEYS.bookings, all);
  return all;
}

export function updateBooking(
  id: string,
  patch: Partial<Booking>
): Booking[] {
  const all = loadAll().map((b) => (b.id === id ? { ...b, ...patch } : b));
  writeStorage(STORAGE_KEYS.bookings, all);
  return all;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus
): Booking[] {
  const all = loadAll().map((b) => (b.id === id ? { ...b, status } : b));
  writeStorage(STORAGE_KEYS.bookings, all);
  return all;
}

export function deleteBooking(id: string): Booking[] {
  const all = loadAll().filter((b) => b.id !== id);
  writeStorage(STORAGE_KEYS.bookings, all);
  return all;
}