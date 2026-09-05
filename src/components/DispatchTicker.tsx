import { useEffect, useState } from "react";
import type { DispatchEntry } from "../types";

const ENTRIES: DispatchEntry[] = [
  {
    id: "d1",
    request: "\u201cGenerator producing smoke and a knocking sound\u201d",
    category: "GEN \u2014 Generator repair",
    matched: "Kola Generator Clinic \u00b7 3.4km",
    etaMinutes: 22,
  },
  {
    id: "d2",
    request: "\u201cCeiling leaking near the bathroom after rain\u201d",
    category: "ROF \u2014 Roofing",
    matched: "Ade Roofing & Repairs \u00b7 1.2km",
    etaMinutes: 15,
  },
  {
    id: "d3",
    request: "\u201cSockets in the sitting room stopped working\u201d",
    category: "ELE \u2014 Electrical",
    matched: "Blessing Electricals \u00b7 0.9km",
    etaMinutes: 18,
  },
  {
    id: "d4",
    request: "\u201cKitchen sink draining very slowly\u201d",
    category: "PLB \u2014 Plumbing",
    matched: "Searching nearby providers\u2026",
    etaMinutes: 0,
  },
];

const STAGE_LABELS = ["Request received", "AI diagnosis", "Provider matched"] as const;

export default function DispatchTicker() {
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStage((s) => (s + 1) % 3);
    }, 1100);
    return () => clearInterval(stageTimer);
  }, []);

  useEffect(() => {
    if (stage !== 0) return;
    const entryTimer = setTimeout(() => {
      setActive((a) => (a + 1) % ENTRIES.length);
    }, 0);
    return () => clearTimeout(entryTimer);
  }, [stage]);

  const entry = ENTRIES[active];

  return (
    <div className="w-full rounded-2xl border border-line bg-paper p-1 shadow-xl shadow-primary/[0.06]">
      <div className="rounded-xl bg-primary-deep text-paper">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">
            Dispatch status
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Live
          </span>
        </div>

        <div className="px-5 py-5 font-mono text-sm">
          <div className="mb-4 flex gap-2 text-[10px] uppercase tracking-[0.08em] text-paper/40">
            {STAGE_LABELS.map((label, i) => (
              <span
                key={label}
                className={
                  "rounded-full border px-2.5 py-1 transition-colors duration-300 " +
                  (i <= stage
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-white/10 text-paper/30")
                }
              >
                {label}
              </span>
            ))}
          </div>

          <p className="font-body leading-relaxed text-paper/90">
            {entry.request}
          </p>

          <div className="mt-4 h-px w-full bg-white/10" />

          <div className="mt-4 flex flex-col gap-2">
            <div
              className={
                "flex items-baseline justify-between transition-opacity duration-300 " +
                (stage >= 1 ? "opacity-100" : "opacity-25")
              }
            >
              <span className="font-body text-paper/45">category</span>
              <span className="text-paper">{entry.category}</span>
            </div>
            <div
              className={
                "flex items-baseline justify-between transition-opacity duration-300 " +
                (stage >= 2 ? "opacity-100" : "opacity-25")
              }
            >
              <span className="font-body text-paper/45">matched</span>
              <span className="text-accent">{entry.matched}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}