import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingButton from "../components/loadingbutton";
import { getProviders } from "../services/Providersservice";
import { categories } from "../data/categories";
import { nairaRange } from "../utils/Format";
import { useGeolocation } from "../hooks/Usegeolocation";
import { useLoadingKeys } from "../hooks/Useloadingkeys";
import { haversineKm } from "../utils/Distance";

const AVAILABILITY_STYLE: Record<string, string> = {
  "Available now": "text-signal-green border-signal-green/25 bg-signal-green/5",
  "Available today": "text-signal-amber border-signal-amber/25 bg-signal-amber/5",
  "Booked until tomorrow": "text-ink/40 border-line bg-paper-dim",
};

type SortKey = "distance" | "rating" | "price";

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [maxDistance, setMaxDistance] = useState(10);
  const [sort, setSort] = useState<SortKey>("distance");
  const [availableOnly, setAvailableOnly] = useState(false);
  const providers = useMemo(() => getProviders(), []);
  const geo = useGeolocation();
  const categoryFilter = useLoadingKeys();

  // Live distance from the customer's actual coordinates when a provider
  // has lat/lng on record; otherwise fall back to the provider's static
  // estimate so older/mock records still work.
  const withDistance = useMemo(
    () =>
      providers.map((p) => ({
        ...p,
        liveDistanceKm:
          p.latitude !== undefined && p.longitude !== undefined
            ? haversineKm(geo.latitude, geo.longitude, p.latitude, p.longitude)
            : p.distanceKm,
      })),
    [providers, geo.latitude, geo.longitude]
  );

  const results = useMemo(() => {
    let list = withDistance.filter((p) => p.liveDistanceKm <= maxDistance);

    if (category !== "All") {
      list = list.filter((p) => p.service === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.service.toLowerCase().includes(q)
      );
    }
    if (availableOnly) {
      list = list.filter((p) => p.availability !== "Booked until tomorrow");
    }

    return [...list].sort((a, b) => {
      if (sort === "distance") return a.liveDistanceKm - b.liveDistanceKm;
      if (sort === "rating") return b.rating - a.rating;
      return a.priceFrom - b.priceFrom;
    });
  }, [withDistance, category, query, maxDistance, sort, availableOnly]);

  return (
    <Layout>
      <div className="border-b border-line bg-paper-dim/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            Search
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Find a technician near you.
          </h1>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or trade, e.g. 'plumbing'"
            className="mt-5 w-full max-w-lg rounded-lg border border-line bg-white px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-primary"
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {geo.status === "granted" ? (
              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-signal-green">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
                Using your location
              </span>
            ) : (
              <LoadingButton
                onClick={geo.requestLocation}
                loading={geo.status === "locating"}
                loadingLabel="Locating\u2026"
                spinnerClassName="h-3.5 w-3.5 text-primary-deep"
                className="rounded-full border border-primary/25 bg-accent-soft px-3 py-1.5 font-body text-xs font-medium text-primary-deep transition hover:border-primary/50"
              >
                Use my location for accurate distances
              </LoadingButton>
            )}
            {geo.status === "denied" && (
              <span className="font-body text-xs text-ink/45">
                Location blocked \u2014 showing distances from central Ibadan.
              </span>
            )}
            {geo.status === "unsupported" && (
              <span className="font-body text-xs text-ink/45">
                Your browser doesn't support location \u2014 showing distances
                from central Ibadan.
              </span>
            )}
            {geo.status === "idle" && (
              <span className="font-body text-xs text-ink/45">
                Showing approximate distances from central Ibadan.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[220px_1fr]">
        <aside className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-sm font-semibold text-ink">
              Category
            </h2>
            <div className="mt-3 flex flex-col gap-1.5">
              <LoadingButton
                loading={categoryFilter.isLoading("All")}
                spinnerClassName="h-3 w-3"
                onClick={() => categoryFilter.run("All", () => setCategory("All"))}
                className={
                  "w-fit rounded-full px-3 py-1 text-left font-body text-xs transition " +
                  (category === "All"
                    ? "bg-primary text-paper"
                    : "bg-paper-dim text-ink/60 hover:text-ink")
                }
              >
                All trades
              </LoadingButton>
              {categories.map((c) => (
                <LoadingButton
                  key={c.id}
                  loading={categoryFilter.isLoading(c.label)}
                  spinnerClassName="h-3 w-3"
                  onClick={() =>
                    categoryFilter.run(c.label, () => setCategory(c.label))
                  }
                  className={
                    "w-fit rounded-full px-3 py-1 text-left font-body text-xs transition " +
                    (category === c.label
                      ? "bg-primary text-paper"
                      : "bg-paper-dim text-ink/60 hover:text-ink")
                  }
                >
                  {c.label}
                </LoadingButton>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold text-ink">
              Distance
            </h2>
            <div className="mt-3">
              <input
                type="range"
                min={1}
                max={10}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="mt-1 font-mono text-xs text-ink/50">
                Within {maxDistance}km
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold text-ink">
              Sort by
            </h2>
            <div className="mt-3 flex flex-col gap-1.5">
              {(
                [
                  ["distance", "Closest first"],
                  ["rating", "Highest rated"],
                  ["price", "Lowest price"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 font-body text-xs text-ink/65"
                >
                  <input
                    type="radio"
                    name="sort"
                    checked={sort === key}
                    onChange={() => setSort(key)}
                    className="accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 font-body text-xs text-ink/65">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="accent-primary"
            />
            Available now or today only
          </label>
        </aside>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.08em] text-ink/40">
            {results.length} technician{results.length !== 1 ? "s" : ""} found
          </p>

          <div className="flex flex-col gap-3">
            {results.map((p) => (
              <Link
                key={p.id}
                to={`/providers/${p.id}`}
                className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 transition hover:border-primary/30 hover:shadow-md hover:shadow-primary/[0.06] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-display text-sm font-semibold text-ink">
                    {p.name}
                    {p.verified && (
                      <span className="ml-2 rounded-full bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary-deep">
                        VERIFIED
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 font-body text-xs text-ink/50">
                    {p.service} &middot; {p.location} &middot;{" "}
                    {p.liveDistanceKm.toFixed(1)}km
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-mono text-sm text-ink/70">
                    {p.rating.toFixed(1)}{" "}
                    <span className="text-ink/35">({p.reviews})</span>
                  </span>
                  <span className="font-mono text-sm text-ink/70">
                    {nairaRange(p.priceFrom, p.priceTo)}
                  </span>
                  <span
                    className={
                      "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] " +
                      AVAILABILITY_STYLE[p.availability]
                    }
                  >
                    {p.availability}
                  </span>
                </div>
              </Link>
            ))}

            {results.length === 0 && (
              <div className="rounded-xl border border-dashed border-line p-10 text-center">
                <p className="font-body text-sm text-ink/50">
                  No technicians match those filters. Try widening your
                  distance or clearing a filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}