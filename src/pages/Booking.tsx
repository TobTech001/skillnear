import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { getProviders } from "../services/Providersservice";
import { nairaRange, naira } from "../utils/Format";
import { useAuth } from "../hooks/Useauth";
import { useLoadingAction } from "../hooks/Useloadingaction";
import { addBooking } from "../services/Bookingsservice";
import type { Booking as BookingType } from "../types";

export default function Booking() {
  const { providerId } = useParams();
  const providers = getProviders();
  const provider = providers.find((p) => p.id === providerId) ?? providers[0];
  const { currentUser } = useAuth();
  const { loading, run } = useLoadingAction();

  const [confirmed, setConfirmed] = useState(false);
  const [problem, setProblem] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");

  // Not signed in: prompt to log in before booking, instead of letting the
  // form submit with no account to attach the booking to.
  if (!currentUser) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sign in to book {provider.name}
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            Create a free account or sign in to send a booking request and
            track it from your dashboard.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/login"
              className="rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-line px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:border-primary"
            >
              Create account
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (confirmed) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-green/10 font-display text-xl text-signal-green">
            &#10003;
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
            Booking request sent
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            {provider.name} has been notified of your offer. You'll get a
            confirmation once they accept or decline it, usually within a
            few minutes.
          </p>
          <Link
            to="/dashboard/customer"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            View my bookings
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => {
      const booking: BookingType = {
        id: `b_${Date.now()}`,
        providerId: provider.id,
        providerName: provider.name,
        service: provider.service,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        phone,
        problemDescription: problem,
        date,
        time,
        status: "Pending",
        price: provider.priceFrom,
        customerBudget: Number(budget),
        address,
      };
      addBooking(booking);
      setConfirmed(true);
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          to={`/providers/${provider.id}`}
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary hover:underline"
        >
          &larr; Back to profile
        </Link>

        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Book {provider.name}
        </h1>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_260px]">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Describe the problem
              </span>
              <textarea
                required
                rows={4}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. Generator won't start and smells of fuel"
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-sm font-medium text-ink/70">
                  Date
                </span>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-sm font-medium text-ink/70">
                  Preferred time
                </span>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink focus:border-primary"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Address
              </span>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House number, street, area"
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Phone number
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="080X XXX XXXX"
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Your budget for this job (₦)
              </span>
              <input
                type="number"
                min={0}
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={`e.g. ${provider.priceFrom}`}
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
              />
              <span className="font-body text-xs text-ink/45">
                {provider.name} will see this and can accept it, or decline
                if it doesn't work for them.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep disabled:opacity-70"
            >
              {loading && <Spinner />}
              {loading ? "Sending request..." : "Confirm booking request"}
            </button>
          </form>

          <aside className="h-fit rounded-xl border border-line bg-white p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
              Booking summary
            </p>
            <p className="mt-2 font-display text-sm font-semibold text-ink">
              {provider.name}
            </p>
            <p className="mt-0.5 font-body text-xs text-ink/50">
              {provider.service} &middot; {provider.location}
            </p>
            <div className="mt-4 h-px w-full bg-line" />
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-body text-xs text-ink/50">
                Provider's typical range
              </span>
              <span className="font-mono text-sm text-ink">
                {nairaRange(provider.priceFrom, provider.priceTo)}
              </span>
            </div>
            {budget && (
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-body text-xs text-ink/50">
                  Your offer
                </span>
                <span className="font-mono text-sm font-semibold text-primary">
                  {naira(Number(budget))}
                </span>
              </div>
            )}
            <p className="mt-3 font-body text-xs leading-relaxed text-ink/40">
              The provider can accept your offer as-is, or decline if it's
              outside what they can do the job for.
            </p>
          </aside>
        </div>
      </div>
    </Layout>
  );
}