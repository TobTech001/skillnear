import type { Payment } from "../../types";
import LoadingButton from "../loadingbutton";
import { useLoadingKeys } from "../../hooks/Useloadingkeys";
import { getBookings } from "../../services/Bookingsservice";
import { releasePayment, refundPayment } from "../../services/Paymentsservice";
import { naira, formatDate } from "../../utils/Format";

interface Props {
  payments: Payment[];
  onChange: () => void;
}

export default function AdminPayments({ payments, onChange }: Props) {
  const actions = useLoadingKeys();
  const bookings = getBookings();

  const held = payments.filter((p) => p.status === "Paid");
  const settled = payments.filter((p) => p.status !== "Paid");

  const release = (p: Payment) => {
    actions.run(`${p.id}-release`, () => {
      releasePayment(p.bookingId);
      onChange();
    });
  };

  const refund = (p: Payment) => {
    actions.run(`${p.id}-refund`, () => {
      refundPayment(p.bookingId);
      onChange();
    });
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">Payments</h2>
      <p className="mt-1 font-body text-sm text-ink/55">
        Release payment once both the provider and customer have confirmed a
        job is complete, or refund the customer if something went wrong.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {held.length === 0 && (
          <p className="font-body text-sm text-ink/45">
            No payments currently held in escrow.
          </p>
        )}
        {held.map((p) => {
          const booking = bookings.find((b) => b.id === p.bookingId);
          const providerConfirmed = booking?.status === "Completed";
          const bothConfirmed = providerConfirmed && p.customerConfirmedCompletion;

          return (
            <div
              key={p.id}
              className="rounded-xl border border-line bg-white p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-sm font-semibold text-ink">
                    {p.providerName}
                    <span className="ml-1 font-body font-normal text-ink/40">
                      &middot; {p.customerName}
                    </span>
                  </p>
                  <p className="mt-0.5 font-body text-xs text-ink/50">
                    {p.service} &middot; paid {formatDate(p.paidAt)}
                  </p>
                </div>
                <span className="font-mono text-sm font-semibold text-ink">
                  {naira(p.amount)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={
                    "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] " +
                    (providerConfirmed
                      ? "bg-signal-green/10 text-signal-green"
                      : "bg-paper-dim text-ink/40")
                  }
                >
                  {providerConfirmed ? "Provider confirmed \u2713" : "Provider: awaiting completion"}
                </span>
                <span
                  className={
                    "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] " +
                    (p.customerConfirmedCompletion
                      ? "bg-signal-green/10 text-signal-green"
                      : "bg-paper-dim text-ink/40")
                  }
                >
                  {p.customerConfirmedCompletion ? "Customer confirmed \u2713" : "Customer: awaiting confirmation"}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <LoadingButton
                  loading={actions.isLoading(`${p.id}-release`)}
                  spinnerClassName="h-3 w-3"
                  disabled={!bothConfirmed}
                  title={!bothConfirmed ? "Both sides must confirm completion first" : undefined}
                  onClick={() => release(p)}
                  className="rounded-lg bg-primary px-3 py-1.5 font-body text-xs font-semibold text-paper transition hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Release payment
                </LoadingButton>
                <LoadingButton
                  loading={actions.isLoading(`${p.id}-refund`)}
                  spinnerClassName="h-3 w-3"
                  onClick={() => refund(p)}
                  className="rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 transition hover:border-signal-red/40 hover:text-signal-red"
                >
                  Refund customer
                </LoadingButton>
              </div>
            </div>
          );
        })}
      </div>

      {settled.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-sm font-semibold text-ink">
            Settled payments
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {settled.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3"
              >
                <p className="font-body text-sm text-ink">
                  {p.providerName} &middot; {p.customerName}
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-ink/70">
                    {naira(p.amount)}
                  </span>
                  <span
                    className={
                      "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] " +
                      (p.status === "Released"
                        ? "bg-signal-green/10 text-signal-green"
                        : "bg-signal-red/10 text-signal-red")
                    }
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}