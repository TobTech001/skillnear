import { useState } from "react";
import Spinner from "./Spinner";
import { useLoadingKeys } from "../hooks/Useloadingkeys";

const FAQS = [
  {
    q: "How does SkillNear decide which trade I need?",
    a: "You describe the problem in plain language and our AI reads it to work out the right category \u2014 generator, plumbing, electrical, and so on \u2014 the same way you'd explain it to a neighbour. You can also just pick a category yourself from the Services page.",
  },
  {
    q: "Is it free to search for a technician?",
    a: "Yes. Searching, comparing providers and viewing profiles doesn't require an account. You only need to sign in when you're ready to send a booking request, so we can attach it to your account and let you track it.",
  },
  {
    q: "How are providers verified?",
    a: "Verified providers have confirmed their identity and trade with SkillNear and have a track record of completed jobs and reviews on the platform. The verified badge appears next to their name wherever they're listed.",
  },
  {
    q: "What happens after I send a booking request?",
    a: "The provider gets notified and can accept or decline. If they accept, you'll see it move to \"Accepted\" in your dashboard along with their contact details. Final pricing is usually confirmed after they inspect the job on-site.",
  },
  {
    q: "Can I list my own service on SkillNear?",
    a: "Provider sign-up is part of registration \u2014 choose \"I'm a technician\" when creating an account. Full profile setup (photos, service area, pricing) is still being built out.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { isLoading, run } = useLoadingKeys();

  return (
    <section className="border-b border-line bg-paper-dim/60">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="mb-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            FAQ
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Common questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const key = String(i);
            const loading = isLoading(key);
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl border border-line bg-paper"
              >
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => run(key, () => setOpen(isOpen ? null : i))}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left disabled:opacity-60"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-sm font-semibold text-ink">
                    {item.q}
                  </span>
                  {loading ? (
                    <Spinner className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <span
                      className={
                        "shrink-0 font-mono text-lg text-primary transition-transform duration-200 " +
                        (isOpen ? "rotate-45" : "")
                      }
                    >
                      +
                    </span>
                  )}
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 font-body text-sm leading-relaxed text-ink/60">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}