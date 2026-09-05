import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/Statusbadge";
import Spinner from "../components/Spinner";
import LoadingButton from "../components/loadingbutton";
import { useAuth } from "../hooks/Useauth";
import { useLoadingKeys } from "../hooks/Useloadingkeys";
import { getBookingsForCustomer } from "../services/Bookingsservice";
import {
  getPaymentForBooking,
  confirmCustomerCompletion,
} from "../services/Paymentsservice";
import { naira, formatDate } from "../utils/Format";
import type { Payment } from "../types";

export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const tabSwitch = useLoadingKeys();
  const paymentActions = useLoadingKeys();
  const [paymentVersion, setPaymentVersion] = useState(0);

  if (!currentUser) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sign in to view your bookings
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            Your bookings are saved to your account so you can track them
            from any visit.
          </p>
          <Link
            to="/login"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Sign in
          </Link>
        </div>
      </Layout>
    );
  }

  const mine = getBookingsForCustomer(currentUser.email);
  const upcoming = mine.filter(
    (b) => b.status === "Pending" || b.status === "Accepted"
  );
  const past = mine.filter(
    (b) => b.status === "Completed" || b.status === "Cancelled"
  );
  const shown = tab === "upcoming" ? upcoming : past;

  // Re-read on every render (including after paymentVersion bumps) so
  // confirming completion reflects immediately without a full reload.
  void paymentVersion;
  const paymentFor = (bookingId: string): Payment | undefined =>
    getPaymentForBooking(bookingId);

  const handleConfirmCompletion = (bookingId: string) => {
    paymentActions.run(`${bookingId}-confirm`, () => {
      confirmCustomerCompletion(bookingId);
      setPaymentVersion((v) => v + 1);
    });
  };

  return (
    <Layout>
      <div className="border-b border-line bg-paper-dim/40">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            My account
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Welcome back, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-1 font-body text-sm text-ink/55">
            Track your bookings and find your next technician.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2 rounded-lg border border-line bg-paper-dim/60 p-1">
            <button
              disabled={tabSwitch.isLoading("upcoming")}
              onClick={() => tabSwitch.run("upcoming", () => setTab("upcoming"))}
              className={
                "flex items-center gap-1.5 rounded-md px-4 py-1.5 font-body text-sm font-medium transition disabled:opacity-60 " +
                (tab === "upcoming"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink/50 hover:text-ink")
              }
            >
              {tabSwitch.isLoading("upcoming") && <Spinner className="h-3.5 w-3.5" />}
              Upcoming ({upcoming.length})
            </button>
            <button
              disabled={tabSwitch.isLoading("past")}
              onClick={() => tabSwitch.run("past", () => setTab("past"))}
              className={
                "flex items-center gap-1.5 rounded-md px-4 py-1.5 font-body text-sm font-medium transition disabled:opacity-60 " +
                (tab === "past"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink/50 hover:text-ink")
              }
            >
              {tabSwitch.isLoading("past") && <Spinner className="h-3.5 w-3.5" />}
              Past ({past.length})
            </button>
          </div>

          <Link
            to="/search"
            className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-medium text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Book a technician
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {shown.map((b) => {
            const payment = paymentFor(b.id);
            return (
              <div
                key={b.id}
                className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    to={`/providers/${b.providerId}`}
                    className="font-display text-sm font-semibold text-ink hover:text-primary"
                  >
                    {b.providerName}
                  </Link>
                  <p className="mt-0.5 font-body text-xs text-ink/50">
                    {b.service} &middot; {formatDate(b.date)} at {b.time}
                  </p>
                  <p className="mt-0.5 font-body text-xs text-ink/40">
                    {b.address}
                  </p>

                  {payment && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.06em]">
                      {payment.status === "Paid" && !payment.customerConfirmedCompletion && (
                        <span className="text-signal-amber">
                          Payment held in escrow
                        </span>
                      )}
                      {payment.status === "Paid" && payment.customerConfirmedCompletion && (
                        <span className="text-signal-amber">
                          Awaiting admin to release payment
                        </span>
                      )}
                      {payment.status === "Released" && (
                        <span className="text-signal-green">
                          Payment released to provider &#10003;
                        </span>
                      )}
                      {payment.status === "Refunded" && (
                        <span className="text-signal-red">
                          Payment refunded to you
                        </span>
                      )}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {b.status === "Accepted" && !payment && (
                      <Link
                        to={`/payment/${b.id}`}
                        className="rounded-lg bg-primary px-3 py-1.5 font-body text-xs font-semibold text-paper transition hover:bg-primary-deep"
                      >
                        Pay now
                      </Link>
                    )}
                    {b.status === "Completed" &&
                      payment?.status === "Paid" &&
                      !payment.customerConfirmedCompletion && (
                        <LoadingButton
                          loading={paymentActions.isLoading(`${b.id}-confirm`)}
                          spinnerClassName="h-3 w-3"
                          onClick={() => handleConfirmCompletion(b.id)}
                          className="rounded-lg bg-primary px-3 py-1.5 font-body text-xs font-semibold text-paper transition hover:bg-primary-deep"
                        >
                          Confirm job completed
                        </LoadingButton>
                      )}
                    {b.status === "Completed" && !b.reviewed && (
                      <Link
                        to={`/leave-review/${b.id}`}
                        className="font-body text-xs font-medium text-primary hover:underline"
                      >
                        Leave a review
                      </Link>
                    )}
                    {b.status === "Completed" && b.reviewed && (
                      <span className="font-body text-xs text-signal-green">
                        Reviewed &#10003;
                      </span>
                    )}
                    {b.status !== "Cancelled" && (
                      <Link
                        to={`/file-complaint/${b.id}`}
                        className="font-body text-xs font-medium text-ink/45 hover:text-signal-red hover:underline"
                      >
                        Report an issue
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-ink/70">
                    {naira(b.price)}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            );
          })}

          {shown.length === 0 && (
            <div className="rounded-xl border border-dashed border-line p-10 text-center">
              <p className="font-body text-sm text-ink/50">
                {tab === "upcoming"
                  ? "No upcoming bookings yet."
                  : "No past bookings yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}