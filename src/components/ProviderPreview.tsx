import { providers } from "../data/providers";

function nairaRange(from: number, to: number) {
  const fmt = (n: number) => `\u20a6${(n / 1000).toFixed(0)}k`;
  return `${fmt(from)}\u2013${fmt(to)}`;
}

const AVAILABILITY_STYLE: Record<string, string> = {
  "Available now": "text-signal-green border-signal-green/25 bg-signal-green/5",
  "Available today": "text-signal-amber border-signal-amber/25 bg-signal-amber/5",
  "Booked until tomorrow": "text-ink/40 border-line bg-paper-dim",
};

export default function ProviderPreview() {
  return (
    <section id="providers" className="border-b border-line bg-paper-dim/60">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 max-w-lg">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            Recommended for you
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Ranked by distance, rating, price and who's free.
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm shadow-primary/[0.04]">
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-line bg-paper-dim/50 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40 sm:grid">
            <span>Provider</span>
            <span>Distance</span>
            <span>Rating</span>
            <span>Price range</span>
            <span>Status</span>
          </div>

          {providers.map((p, i) => (
            <div
              key={p.id}
              className={
                "grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] sm:items-center sm:gap-4 " +
                (i !== providers.length - 1 ? "border-b border-line" : "")
              }
            >
              <div className="col-span-2 sm:col-span-1">
                <p className="font-display text-sm font-semibold text-ink">
                  {p.name}
                  {p.verified && (
                    <span className="ml-2 rounded-full bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary-deep">
                      VERIFIED
                    </span>
                  )}
                </p>
                <p className="mt-0.5 font-body text-xs text-ink/45">
                  {p.service} &middot; {p.location}
                </p>
              </div>

              <span className="font-mono text-sm text-ink/65">
                {p.distanceKm}km
              </span>
              <span className="font-mono text-sm text-ink/65">
                {p.rating.toFixed(1)} &middot;{" "}
                <span className="text-ink/35">{p.reviews}</span>
              </span>
              <span className="font-mono text-sm text-ink/65">
                {nairaRange(p.priceFrom, p.priceTo)}
              </span>
              <span
                className={
                  "w-fit rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] " +
                  AVAILABILITY_STYLE[p.availability]
                }
              >
                {p.availability}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}