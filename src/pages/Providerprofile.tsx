import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getProviders } from "../services/Providersservice";
import { reviews } from "../data/Reviews";
import { nairaRange } from "../utils/Format";

const AVAILABILITY_STYLE: Record<string, string> = {
  "Available now": "text-signal-green border-signal-green/25 bg-signal-green/5",
  "Available today": "text-signal-amber border-signal-amber/25 bg-signal-amber/5",
  "Booked until tomorrow": "text-ink/40 border-line bg-paper-dim",
};

export default function ProviderProfile() {
  const { id } = useParams();
  const providers = getProviders();
  const provider = providers.find((p) => p.id === id) ?? providers[0];
  const providerReviews = reviews.filter((r) => r.providerId === provider.id);

  return (
    <Layout>
      <div className="border-b border-line bg-paper-dim/40">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <Link
            to="/search"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary hover:underline"
          >
            &larr; Back to search
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {provider.name}
                </h1>
                {provider.verified && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-medium text-primary-deep">
                    VERIFIED
                  </span>
                )}
              </div>
              <p className="mt-1 font-body text-sm text-ink/55">
                {provider.service} &middot; {provider.location} &middot;{" "}
                {provider.distanceKm}km away
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm text-ink/70">
                  {provider.rating.toFixed(1)}{" "}
                  <span className="text-ink/40">
                    ({provider.reviews} reviews)
                  </span>
                </span>
                <span
                  className={
                    "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] " +
                    AVAILABILITY_STYLE[provider.availability]
                  }
                >
                  {provider.availability}
                </span>
                {provider.yearsExperience && (
                  <span className="font-mono text-xs text-ink/45">
                    {provider.yearsExperience} yrs experience
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white p-4 sm:min-w-[220px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
                Typical price
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">
                {nairaRange(provider.priceFrom, provider.priceTo)}
              </p>
              <Link
                to={`/booking/${provider.id}`}
                className="mt-3 block rounded-lg bg-primary px-4 py-2.5 text-center font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
              >
                Book this provider
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">About</h2>
          <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-ink/60">
            {provider.bio ??
              "This provider hasn't added a bio yet, but their rating and completed jobs speak for the quality of their work."}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">
            Reviews ({providerReviews.length})
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {providerReviews.length === 0 && (
              <p className="font-body text-sm text-ink/45">
                No reviews yet for this provider.
              </p>
            )}
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