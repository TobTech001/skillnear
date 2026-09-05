import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingButton from "../components/loadingbutton";
import { useAuth } from "../hooks/Useauth";
import { useLoadingAction } from "../hooks/Useloadingaction";
import { getBookings } from "../services/Bookingsservice";
import { addComplaint } from "../services/Complaintsservice";

export default function FileComplaint() {
  const { bookingId } = useParams();
  const { currentUser } = useAuth();
  const { loading, run } = useLoadingAction();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const booking = bookingId
    ? getBookings().find((b) => b.id === bookingId)
    : undefined;

  if (!currentUser) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sign in to file a complaint
          </h1>
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

  if (submitted) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-green/10 font-display text-xl text-signal-green">
            &#10003;
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
            Complaint submitted
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            SkillNear's team will look into this and follow up if needed.
          </p>
          <Link
            to="/dashboard/customer"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Back to my bookings
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || message.trim().length < 10) {
      setError("Add a subject and a few sentences describing what happened.");
      return;
    }
    run(() => {
      addComplaint({
        id: `c_${Date.now()}`,
        fromName: currentUser.name,
        fromEmail: currentUser.email,
        aboutProviderId: booking?.providerId,
        aboutProviderName: booking?.providerName,
        subject: subject.trim(),
        message: message.trim(),
        status: "Open",
        createdAt: new Date().toISOString().slice(0, 10),
      });
      setSubmitted(true);
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg px-6 py-10">
        <Link
          to="/dashboard/customer"
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary hover:underline"
        >
          &larr; Back to my bookings
        </Link>

        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Report an issue
        </h1>
        <p className="mt-2 font-body text-sm text-ink/55">
          {booking
            ? `About your booking with ${booking.providerName} (${booking.service}, ${booking.date}).`
            : "Tell us what happened and our team will follow up."}
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-ink/70">
              Subject
            </span>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Technician arrived very late"
              className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-ink/70">
              What happened?
            </span>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Give as much detail as you can — dates, times, what was agreed vs what happened."
              className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-signal-red/10 px-3 py-2 font-body text-xs text-signal-red">
              {error}
            </p>
          )}

          <LoadingButton
            type="submit"
            loading={loading}
            loadingLabel="Submitting…"
            className="mt-1 rounded-lg bg-primary px-5 py-3 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Submit complaint
          </LoadingButton>
        </form>
      </div>
    </Layout>
  );
}