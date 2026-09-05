import { categories } from "../data/categories";

export default function ServiceCategories() {
  return (
    <section id="categories" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
              Trades on SkillNear
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Every trade, tagged and searchable.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#request`}
              className="group flex flex-col gap-2 rounded-xl border border-line bg-paper p-4 transition hover:border-primary/30 hover:shadow-md hover:shadow-primary/[0.06]"
            >
              <span className="w-fit rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-medium tracking-[0.04em] text-primary-deep group-hover:bg-primary group-hover:text-paper">
                {cat.code}
              </span>
              <span className="font-display text-sm font-semibold text-ink">
                {cat.label}
              </span>
              <span className="font-body text-xs leading-snug text-ink/50">
                {cat.description}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}