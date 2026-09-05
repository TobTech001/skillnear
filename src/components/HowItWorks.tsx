const STEPS = [
  {
    tag: "01",
    title: "Describe the problem",
    body: "Type it the way you'd explain it to a neighbour. No technical terms needed.",
  },
  {
    tag: "02",
    title: "AI works out the trade",
    body: "SkillNear reads the request and matches it to a service category \u2014 generator, plumbing, electrical, and more.",
  },
  {
    tag: "03",
    title: "Compare nearby providers",
    body: "See technicians ranked by distance, rating, price range and who can come today.",
  },
  {
    tag: "04",
    title: "Book and track the job",
    body: "Confirm a provider, then follow the job from accepted to completed from your dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line bg-paper-dim/60">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 max-w-lg">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            How it works
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            One request, four steps to a fixed problem.
          </h2>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li
              key={step.tag}
              className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-6 transition hover:border-primary/30 hover:shadow-md hover:shadow-primary/[0.06]"
            >
              <span className="font-mono text-xs font-medium text-accent">
                {step.tag}
              </span>
              <h3 className="font-display text-base font-semibold text-ink">
                {step.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-ink/55">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}