import type { Payment } from "../types";
import { readStorage, writeStorage, STORAGE_KEYS } from "./Storage";

function loadAll(): Payment[] {
  return readStorage<Payment[]>(STORAGE_KEYS.payments, []);
}

export function getPayments(): Payment[] {
  return loadAll();
}

export function getPaymentForBooking(bookingId: string): Payment | undefined {
  return loadAll().find((p) => p.bookingId === bookingId);
}

export function getPaymentsForProvider(providerId: string): Payment[] {
  return loadAll().filter((p) => p.providerId === providerId);
}

export function getPaymentsForCustomer(customerEmail: string): Payment[] {
  return loadAll().filter((p) => p.customerEmail === customerEmail);
}

/** Customer pays into escrow. There's no real payment gateway here \u2014
 * this instantly marks the payment "Paid" and held, same as the rest of
 * this prototype simulates external services it doesn't have. */
export function createPayment(
  payment: Omit<Payment, "status" | "customerConfirmedCompletion" | "paidAt">
): Payment[] {
  const full: Payment = {
    ...payment,
    status: "Paid",
    customerConfirmedCompletion: false,
    paidAt: new Date().toISOString().slice(0, 10),
  };
  const all = [...loadAll(), full];
  writeStorage(STORAGE_KEYS.payments, all);
  return all;
}

export function confirmCustomerCompletion(bookingId: string): Payment[] {
  const all = loadAll().map((p) =>
    p.bookingId === bookingId ? { ...p, customerConfirmedCompletion: true } : p
  );
  writeStorage(STORAGE_KEYS.payments, all);
  return all;
}

export function releasePayment(bookingId: string): Payment[] {
  const all = loadAll().map((p) =>
    p.bookingId === bookingId
      ? {
          ...p,
          status: "Released" as const,
          releasedAt: new Date().toISOString().slice(0, 10),
        }
      : p
  );
  writeStorage(STORAGE_KEYS.payments, all);
  return all;
}

export function refundPayment(bookingId: string): Payment[] {
  const all = loadAll().map((p) =>
    p.bookingId === bookingId
      ? {
          ...p,
          status: "Refunded" as const,
          refundedAt: new Date().toISOString().slice(0, 10),
        }
      : p
  );
  writeStorage(STORAGE_KEYS.payments, all);
  return all;
}