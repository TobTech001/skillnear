import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingButton from "../components/loadingbutton";
import { useAuth } from "../hooks/Useauth";
import { useLoadingAction } from "../hooks/Useloadingaction";
import { getBookings } from "../services/Bookingsservice";
import { createPayment, getPaymentForBooking } from "../services/Paymentsservice";
import { naira } from "../utils/Format";

export default function Payment() {
  const { bookingId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { loading, run } = useLoadingAction();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState<string | null>(null);

  const booking = getBookings().find((b) => b.id === bookingId);
  const existingPayment = bookingId ? getPaymentForBooking(bookingId) : undefined;

  if (!currentUser) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sign in to make a payment
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

  if (!booking || booking.customerEmail !== currentUser.email) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Booking not found
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

  if (booking.status !== "Accepted") {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Not ready for payment yet
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            {booking.status === "Pending"
              ? `Payment opens once ${booking.providerName} accepts your booking request.`
              : "This booking isn't awaiting payment."}
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

  if (existingPayment) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-green/10 font-display text-xl text-signal-green">
            &#10003;
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
            Already paid
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            {naira(existingPayment.amount)} is held safely until the job is
            confirmed complete.
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
    if (cardNumber.replace(/\s/g, "").length < 12 || expiry.length < 4 || cvv.length < 3) {
      setError("Enter a valid card number, expiry, and CVV.");
      return;
    }
    run(() => {
      createPayment({
        id: `pay_${Date.now()}`,
        bookingId: booking.id,
        customerEmail: currentUser.email,
        customerName: currentUser.name,
        providerId: booking.providerId,
        providerName: booking.providerName,
        service: booking.service,
        amount: booking.price,
      });
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
          Pay for your booking
        </h1>
        <p className="mt-2 font-body text-sm text-ink/55">
          {booking.providerName} &middot; {booking.service}
        </p>

        <div className="mt-6 rounded-xl border border-line bg-paper-dim/50 p-5">
          <div className="flex items-baseline justify-between">
            <span className="font-body text-sm text-ink/60">Amount due</span>
            <span className="font-display text-2xl font-semibold text-ink">
              {naira(booking.price)}
            </span>
          </div>
          <p className="mt-3 font-body text-xs leading-relaxed text-ink/50">
            Your payment is held safely by SkillNear and only released to{" "}
            {booking.providerName} once you confirm the job is complete. If
            something goes wrong, it can be refunded back to you instead.
          </p>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-ink/70">
              Card number
            </span>
            <input
              type="text"
              inputMode="numeric"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              className="rounded-lg border border-line bg-white px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ink/30 focus:border-primary"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Expiry
              </span>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ink/30 focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                CVV
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ink/30 focus:border-primary"
              />
            </label>
          </div>

          {error && (
            <p className="rounded-lg bg-signal-red/10 px-3 py-2 font-body text-xs text-signal-red">
              {error}
            </p>
          )}

          <LoadingButton
            type="submit"
            loading={loading}
            loadingLabel="Processing payment..."
            className="mt-1 rounded-lg bg-primary px-5 py-3 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Pay {naira(booking.price)}
          </LoadingButton>

          <p className="text-center font-mono text-[10px] uppercase tracking-[0.06em] text-ink/35">
            No real card is charged, This is a simulated payment for
            demo purposes.
          </p>
        </form>
      </div>
    </Layout>
  );
}