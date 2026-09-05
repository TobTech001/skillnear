const TESTIMONIALS = [
  {
    quote:
      "Our generator broke down at 9pm and I typed exactly that into SkillNear. Had a technician's number within two minutes and he was here by 10.",
    author: "Funmi Okafor",
    context: "Bodija, Ibadan",
  },
  {
    quote:
      "I liked that I could see price ranges and ratings before calling anyone. No more guessing who's reliable.",
    author: "Bode Ipaye",
    context: "Ring Road, Ibadan",
  },
  {
    quote:
      "As a provider, the jobs coming through already match what I do. I'm not fielding calls for work I don't handle anymore.",
    author: "Ade, Ade Roofing & Repairs",
    context: "SkillNear provider since 2025",
  },
];

export default function Testimonials() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 max-w-lg">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            What people say
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            From homeowners and technicians using SkillNear.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.author}
              className="flex flex-col justify-between rounded-xl border border-line bg-white p-6"
            >
              <blockquote className="font-body text-sm leading-relaxed text-ink/70">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4">
                <p className="font-display text-sm font-semibold text-ink">
                  {t.author}
                </p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/40">
                  {t.context}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}