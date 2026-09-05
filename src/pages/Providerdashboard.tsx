import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import StatusBadge from "../components/Statusbadge";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/Useauth";
import { useLoadingKeys } from "../hooks/Useloadingkeys";
import {
  getBookingsForProvider,
  updateBookingStatus,
  updateBooking,
} from "../services/Bookingsservice";
import { getReviewsForProvider } from "../services/Reviewsservice";
import { getProviderById } from "../services/Providersservice";
import { getVerificationForProvider } from "../services/VerificationService";
import { getPaymentForBooking, getPaymentsForProvider } from "../services/Paymentsservice";
import { naira, formatDate } from "../utils/Format";
import type { BookingStatus } from "../types";

export default function ProviderDashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sign in to view your dashboard
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            Manage new requests, upcoming jobs and reviews from your provider
            account.
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

  if (currentUser.role !== "provider") {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            This account isn't a provider account
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            Sign in with a technician account, or register a new one, to see
            a provider dashboard.
          </p>
          <Link
            to="/login"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Back to sign in
          </Link>
        </div>
      </Layout>
    );
  }

  if (!currentUser.providerId) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Set up your provider profile
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            You're signed in as a technician, but you haven't published a
            listing yet. Add your trade, price range and availability so
            customers can find and book you.
          </p>
          <Link
            to="/provider/create"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Create my listing
          </Link>
        </div>
      </Layout>
    );
  }
  
  if (!getProviderById(currentUser.providerId)) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Your listing was removed
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            An admin removed your previous listing. You can publish a new
            one to start receiving requests again.
          </p>
          <Link
            to="/provider/create"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Create a new listing
          </Link>
        </div>
      </Layout>
    );
  }

  return <ProviderDashboardContent providerId={currentUser.providerId} providerName={currentUser.name} />;
}

function ProviderDashboardContent({
  providerId,
  providerName,
}: {
  providerId: string;
  providerName: string;
}) {
  const [jobs, setJobs] = useState(getBookingsForProvider(providerId));
  const jobActions = useLoadingKeys();

  const updateStatus = (id: string, status: BookingStatus) => {
    const updated = updateBookingStatus(id, status);
    setJobs(updated.filter((j) => j.providerId === providerId));
  };

  const acceptOffer = (job: (typeof jobs)[number]) => {
    const updated = updateBooking(job.id, {
      status: "Accepted",
      price: job.customerBudget ?? job.price,
    });
    setJobs(updated.filter((j) => j.providerId === providerId));
  };

  const pending = jobs.filter((j) => j.status === "Pending");
  const upcoming = jobs.filter((j) => j.status === "Accepted");
  const completed = jobs.filter((j) => j.status === "Completed");
  const providerPayments = getPaymentsForProvider(providerId);
  const earnings = providerPayments
    .filter((p) => p.status === "Released")
    .reduce((sum, p) => sum + p.amount, 0);
  const providerReviews = getReviewsForProvider(providerId);
  const provider = getProviderById(providerId);
  const verification = getVerificationForProvider(providerId);

  const stats = [
    { label: "New requests", value: pending.length },
    { label: "Upcoming jobs", value: upcoming.length },
    { label: "Completed jobs", value: completed.length },
    { label: "Earnings", value: naira(earnings) },
  ];

  return (
    <Layout>
      <div className="border-b border-line bg-paper-dim/40">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            Provider dashboard
          </span>
          <h1 className="mt-2 flex items-center gap-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {providerName}
            {provider?.verified && (
              <span className="flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[11px] font-medium text-primary-deep">
                <span aria-hidden="true">&#10003;</span> VERIFIED
              </span>
            )}
          </h1>
          <p className="mt-1 font-body text-sm text-ink/55">
            {providerReviews.length > 0 &&
              `${(
                providerReviews.reduce((s, r) => s + r.rating, 0) /
                providerReviews.length
              ).toFixed(1)} rating from ${providerReviews.length} reviews`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {!provider?.verified && (
          <div className="mb-8 rounded-xl border border-line bg-white p-5">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-sm font-semibold text-ink">
                  {verification?.status === "pending"
                    ? "Verification under review"
                    : verification?.status === "rejected"
                    ? "Verification application rejected"
                    : verification?.status === "more_information"
                    ? "Admin requested more information"
                    : "Get the Verified badge"}
                </p>
                <p className="mt-1 font-body text-xs text-ink/55">
                  {verification
                    ? verification.status === "pending"
                      ? "Our admin team is reviewing your application."
                      : "Update your application and resubmit for review."
                    : "Verified listings get more customer trust and better placement in search."}
                </p>
              </div>
              <Link
                to="/provider/verification"
                className="shrink-0 rounded-lg bg-primary px-4 py-2 font-body text-sm font-medium text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
              >
                {verification ? "View verification" : "Start verification"}
              </Link>
            </div>

            {(verification?.status === "more_information" ||
              verification?.status === "rejected") &&
              verification.adminNote && (
                <div className="mt-4 rounded-lg bg-signal-amber/5 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-signal-amber">
                    Note from admin
                  </p>
                  <p className="mt-1 font-body text-sm text-ink">
                    {verification.adminNote}
                  </p>
                </div>
              )}
          </div>
        )}

        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-line bg-white p-5"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
                {s.label}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            New requests
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {pending.length === 0 && (
              <p className="font-body text-sm text-ink/45">
                No new requests right now.
              </p>
            )}
            {pending.map((j) => (
              <div
                key={j.id}
                className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-sm font-semibold text-ink">
                    {j.customerName}
                  </p>
                  <p className="mt-0.5 font-body text-xs text-ink/50">
                    {j.service} &middot; {formatDate(j.date)} at {j.time}
                  </p>
                  <p className="mt-0.5 font-body text-xs text-ink/40">
                    {j.address}
                  </p>
                  {j.problemDescription && (
                    <p className="mt-1 font-body text-xs italic text-ink/50">
                      &ldquo;{j.problemDescription}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="mr-2 text-right">
                    <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-ink/40">
                      Customer's offer
                    </p>
                    <p className="font-mono text-sm font-semibold text-primary">
                      {naira(j.customerBudget ?? j.price)}
                    </p>
                  </div>
                  <button
                    disabled={jobActions.isLoading(`${j.id}-decline`)}
                    onClick={() =>
                      jobActions.run(`${j.id}-decline`, () =>
                        updateStatus(j.id, "Cancelled")
                      )
                    }
                    className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 transition hover:border-signal-red/40 hover:text-signal-red disabled:opacity-60"
                  >
                    {jobActions.isLoading(`${j.id}-decline`) && (
                      <Spinner className="h-3 w-3" />
                    )}
                    Reject offer
                  </button>
                  <button
                    disabled={jobActions.isLoading(`${j.id}-accept`)}
                    onClick={() =>
                      jobActions.run(`${j.id}-accept`, () => acceptOffer(j))
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-body text-xs font-medium text-paper transition hover:bg-primary-deep disabled:opacity-70"
                  >
                    {jobActions.isLoading(`${j.id}-accept`) && (
                      <Spinner className="h-3 w-3" />
                    )}
                    Accept offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">
            Upcoming jobs
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {upcoming.length === 0 && (
              <p className="font-body text-sm text-ink/45">
                No upcoming jobs.
              </p>
            )}
            {upcoming.map((j) => {
              const payment = getPaymentForBooking(j.id);
              return (
                <div
                  key={j.id}
                  className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">
                      {j.customerName}
                    </p>
                    <p className="mt-0.5 font-body text-xs text-ink/50">
                      {j.service} &middot; {formatDate(j.date)} at {j.time}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em]">
                      {payment ? (
                        <span className="text-signal-green">
                          Payment received &middot; held in escrow
                        </span>
                      ) : (
                        <span className="text-signal-amber">
                          Waiting for customer payment
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={j.status} />
                    <button
                      disabled={jobActions.isLoading(`${j.id}-complete`) || !payment}
                      title={!payment ? "Waiting for the customer to pay first" : undefined}
                      onClick={() =>
                        jobActions.run(`${j.id}-complete`, () =>
                          updateStatus(j.id, "Completed")
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 transition hover:border-signal-green/40 hover:text-signal-green disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {jobActions.isLoading(`${j.id}-complete`) && (
                        <Spinner className="h-3 w-3" />
                      )}
                      Mark completed
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">
            Completed jobs
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {completed.length === 0 && (
              <p className="font-body text-sm text-ink/45">
                No completed jobs yet.
              </p>
            )}
            {completed.map((j) => {
              const payment = getPaymentForBooking(j.id);
              return (
                <div
                  key={j.id}
                  className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">
                      {j.customerName}
                    </p>
                    <p className="mt-0.5 font-body text-xs text-ink/50">
                      {j.service} &middot; {formatDate(j.date)}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em]">
                      {!payment && (
                        <span className="text-ink/35">No payment recorded</span>
                      )}
                      {payment?.status === "Paid" && !payment.customerConfirmedCompletion && (
                        <span className="text-signal-amber">
                          Waiting for customer to confirm completion
                        </span>
                      )}
                      {payment?.status === "Paid" && payment.customerConfirmedCompletion && (
                        <span className="text-signal-amber">
                          Confirmed by both sides &middot; awaiting admin release
                        </span>
                      )}
                      {payment?.status === "Released" && (
                        <span className="text-signal-green">
                          Payment released &#10003;
                        </span>
                      )}
                      {payment?.status === "Refunded" && (
                        <span className="text-signal-red">
                          Payment refunded to customer
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-ink/70">
                    {naira(j.price)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">
            Recent reviews
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {providerReviews.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-line bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-ink">
                    {r.author}
                  </span>
                  <span className="font-mono text-xs text-ink/45">
                    {r.rating.toFixed(1)} &middot; {r.date}
                  </span>
                </div>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink/60">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}