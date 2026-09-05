import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DispatchTicker from "./DispatchTicker";
import LoadingButton from "./loadingbutton";
import { useLoadingAction } from "../hooks/Useloadingaction";

const STATS = [
  { value: "4", label: "trades live in Ibadan" },
  { value: "485+", label: "jobs completed" },
  { value: "4.8", label: "average rating" },
  { value: "<20min", label: "typical response" },
];

export default function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { loading, run } = useLoadingAction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => {
      const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
      navigate(`/search${params}`);
    });
  };

  return (
    <section id="request" className="border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-24">
        <div>
          <span className="inline-block rounded-full border border-primary/20 bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-primary-deep">
            Ibadan &middot; verified technicians nearby
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-[3.4rem]">
            Something broke.
            <br />
            <span className="text-primary">Tell us what happened</span>
            <br />
            &mdash; we'll find who fixes it.
          </h1>

          <p className="mt-5 max-w-md font-body text-base text-ink/60">
            Describe the problem in your own words. SkillNear's AI works out
            the right trade, then ranks nearby technicians by distance,
            rating, price and who's free right now.
          </p>

          <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. My generator is smoking and won't start"
              className="w-full flex-1 rounded-lg border border-line bg-white px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-primary"
            />
            <LoadingButton
              type="submit"
              loading={loading}
              loadingLabel="Searching\u2026"
              className="shrink-0 rounded-lg bg-accent px-5 py-3 font-body text-sm font-semibold text-primary-deep shadow-sm shadow-accent/30 transition hover:bg-accent/90"
            >
              Find a technician
            </LoadingButton>
          </form>

          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink/35">
            No sign-up needed to search &middot; 4 trades live in Ibadan
          </p>
        </div>

        <DispatchTicker />
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-6 pb-10">
        <div className="grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 font-body text-xs text-ink/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}