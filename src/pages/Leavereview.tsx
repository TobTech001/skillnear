import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingButton from "../components/loadingbutton";
import { useAuth } from "../hooks/Useauth";
import { useLoadingAction } from "../hooks/Useloadingaction";
import {
  getBookings,
  updateBooking,
} from "../services/Bookingsservice";
import { addReview } from "../services/Reviewsservice";

export default function LeaveReview() {
  const { bookingId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { loading, run } = useLoadingAction();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const booking = getBookings().find((b) => b.id === bookingId);

  if (!currentUser) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sign in to leave a review
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

  if (
    !booking ||
    booking.customerEmail !== currentUser.email ||
    booking.status !== "Completed"
  ) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Can't review this booking
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            This booking either isn't yours or hasn't been marked completed
            yet. You can only review jobs after they're finished.
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

  if (booking.reviewed) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            You've already reviewed this job
          </h1>
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
    if (comment.trim().length < 5) {
      setError("Add a few words about how the job went.");
      return;
    }
    run(() => {
      addReview({
        id: `r_${Date.now()}`,
        providerId: booking.providerId,
        bookingId: booking.id,
        author: currentUser.name,
        authorEmail: currentUser.email,
        rating,
        comment: comment.trim(),
        date: "Just now",
      });
      updateBooking(booking.id, { reviewed: true });
      navigate("/dashboard/customer");
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
          Review {booking.providerName}
        </h1>
        <p className="mt-2 font-body text-sm text-ink/55">
          {booking.service} &middot; completed {booking.date}
        </p>

        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <span className="font-body text-sm font-medium text-ink/70">
              How would you rate the job?
            </span>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={
                    "flex h-10 w-10 items-center justify-center rounded-lg border font-mono text-sm font-semibold transition " +
                    (n <= rating
                      ? "border-primary bg-primary text-paper"
                      : "border-line text-ink/40 hover:border-primary/40")
                  }
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-ink/70">
              Tell other customers about your experience
            </span>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What went well, and anything they could improve on."
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
            loadingLabel="Submitting..."
            className="mt-1 rounded-lg bg-primary px-5 py-3 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Submit review
          </LoadingButton>
        </form>
      </div>
    </Layout>
  );
}