export default function Footer() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary font-display text-xs font-bold text-paper">
            S
          </span>
          <span className="font-display text-sm font-semibold text-ink">
            SkillNear AI
          </span>
        </div>
        <p className="font-mono text-[15px] uppercase tracking-[0.08em] text-ink/35">
          Built for Ibadan, expanding city by city
        </p>
      </div>
    </footer>
  );
}