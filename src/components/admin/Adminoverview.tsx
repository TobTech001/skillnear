import type { Booking, Provider, Review, User, Complaint, Payment } from "../../types";
import { naira } from "../../utils/Format";

interface Props {
  users: User[];
  providers: Provider[];
  bookings: Booking[];
  reviews: Review[];
  complaints: Complaint[];
  payments: Payment[];
}

const STATUS_ORDER: Booking["status"][] = [
  "Pending",
  "Accepted",
  "Completed",
  "Cancelled",
];

const STATUS_COLOR: Record<Booking["status"], string> = {
  Pending: "bg-signal-amber",
  Accepted: "bg-primary",
  Completed: "bg-signal-green",
  Cancelled: "bg-ink/25",
};

export default function AdminOverview({
  users,
  providers,
  bookings,
  reviews,
  complaints,
  payments,
}: Props) {
  const customers = users.filter((u) => u.role === "customer").length;
  const providerAccounts = users.filter((u) => u.role === "provider").length;
  const verifiedProviders = providers.filter((p) => p.verified).length;
  const heldInEscrow = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const released = payments
    .filter((p) => p.status === "Released")
    .reduce((sum, p) => sum + p.amount, 0);
  const openComplaints = complaints.filter((c) => c.status === "Open").length;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const byStatus = STATUS_ORDER.map((status) => ({
    status,
    count: bookings.filter((b) => b.status === status).length,
  }));
  const maxCount = Math.max(1, ...byStatus.map((s) => s.count));

  const categoryTotals = new Map<string, number>();
  providers.forEach((p) =>
    categoryTotals.set(p.service, (categoryTotals.get(p.service) ?? 0) + 1)
  );

  const stats = [
    { label: "Customers", value: customers },
    { label: "Providers", value: providerAccounts },
    { label: "Verified providers", value: `${verifiedProviders}/${providers.length}` },
    { label: "Total bookings", value: bookings.length },
    { label: "Held in escrow", value: naira(heldInEscrow) },
    { label: "Released to providers", value: naira(released) },
    { label: "Average rating", value: avgRating > 0 ? avgRating.toFixed(1) : "\u2014" },
    { label: "Open complaints", value: openComplaints },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-white p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
              {s.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-5">
          <h3 className="font-display text-sm font-semibold text-ink">
            Bookings by status
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            {byStatus.map((s) => (
              <div key={s.status}>
                <div className="mb-1 flex items-center justify-between font-body text-xs text-ink/60">
                  <span>{s.status}</span>
                  <span className="font-mono">{s.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-paper-dim">
                  <div
                    className={`h-full rounded-full ${STATUS_COLOR[s.status]}`}
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-5">
          <h3 className="font-display text-sm font-semibold text-ink">
            Providers by trade
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            {[...categoryTotals.entries()].map(([label, count]) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between font-body text-xs text-ink/60">
                  <span>{label}</span>
                  <span className="font-mono">{count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-paper-dim">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(count / providers.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {categoryTotals.size === 0 && (
              <p className="font-body text-xs text-ink/45">No providers listed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}