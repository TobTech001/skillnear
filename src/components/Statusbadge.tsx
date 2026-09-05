import type { BookingStatus } from "../types";

const STYLES: Record<BookingStatus, string> = {
  Pending: "text-signal-amber border-signal-amber/25 bg-signal-amber/5",
  Accepted: "text-primary border-primary/25 bg-accent-soft",
  Completed: "text-signal-green border-signal-green/25 bg-signal-green/5",
  Cancelled: "text-ink/40 border-line bg-paper-dim",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={
        "w-fit rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] " +
        STYLES[status]
      }
    >
      {status}
    </span>
  );
}