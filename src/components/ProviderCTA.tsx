export default function ProviderCTA() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-primary-deep px-6 py-8 text-paper sm:flex-row sm:items-center sm:px-10 sm:py-10">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent">
              For technicians
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              List your trade. Get matched to jobs nearby.
            </h2>
            <p className="mt-2 max-w-md font-body text-sm text-paper/60">
              Set your price range and availability once. SkillNear brings
              you requests that already match your service and location.
            </p>
          </div>
          <a
            href="/Register"
            target="_blank"
            className="shrink-0 rounded-lg bg-accent px-5 py-3 font-body text-sm font-semibold text-primary-deep shadow-sm shadow-accent/30 transition hover:bg-accent/90"
          >
            Register as a provider
          </a>
        </div>
      </div>
    </section>
  );
}