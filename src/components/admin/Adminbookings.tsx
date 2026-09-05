import { useState } from "react";
import type { Booking, BookingStatus } from "../../types";
import StatusBadge from "../Statusbadge";
import LoadingButton from "../loadingbutton";
import { useLoadingKeys } from "../../hooks/Useloadingkeys";
import { updateBookingStatus, deleteBooking } from "../../services/Bookingsservice";
import { naira, formatDate } from "../../utils/Format";

interface Props {
  bookings: Booking[];
  onChange: () => void;
}

const FILTERS: ("All" | BookingStatus)[] = [
  "All",
  "Pending",
  "Accepted",
  "Completed",
  "Cancelled",
];

export default function AdminBookings({ bookings, onChange }: Props) {
  const [filter, setFilter] = useState<"All" | BookingStatus>("All");
  const actions = useLoadingKeys();

  const shown = filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  const cancel = (id: string) => {
    actions.run(`${id}-cancel`, () => {
      updateBookingStatus(id, "Cancelled");
      onChange();
    });
  };

  const remove = (id: string) => {
    actions.run(`${id}-delete`, () => {
      deleteBooking(id);
      onChange();
    });
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">
        Manage bookings
      </h2>
      <p className="mt-1 font-body text-sm text-ink/55">
        All bookings across every customer and provider.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-full px-3 py-1 font-body text-xs transition " +
              (filter === f
                ? "bg-primary text-paper"
                : "bg-paper-dim text-ink/60 hover:text-ink")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {shown.map((b) => (
          <div
            key={b.id}
            className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-sm font-semibold text-ink">
                {b.customerName} &rarr; {b.providerName}
              </p>
              <p className="mt-0.5 font-body text-xs text-ink/50">
                {b.service} &middot; {formatDate(b.date)} at {b.time}
              </p>
              <p className="mt-0.5 font-body text-xs text-ink/40">{b.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-ink/70">{naira(b.price)}</span>
              <StatusBadge status={b.status} />
              {b.status !== "Cancelled" && b.status !== "Completed" && (
                <LoadingButton
                  loading={actions.isLoading(`${b.id}-cancel`)}
                  spinnerClassName="h-3 w-3"
                  onClick={() => cancel(b.id)}
                  className="rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 hover:border-signal-red/40 hover:text-signal-red"
                >
                  Cancel
                </LoadingButton>
              )}
              <LoadingButton
                loading={actions.isLoading(`${b.id}-delete`)}
                spinnerClassName="h-3 w-3"
                onClick={() => remove(b.id)}
                className="rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 hover:border-signal-red/40 hover:text-signal-red"
              >
                Delete
              </LoadingButton>
            </div>
          </div>
        ))}
        {shown.length === 0 && (
          <p className="font-body text-sm text-ink/45">No bookings match this filter.</p>
        )}
      </div>
    </div>
  );
}