import type { Complaint } from "../../types";
import LoadingButton from "../loadingbutton";
import { useLoadingKeys } from "../../hooks/Useloadingkeys";
import { updateComplaintStatus } from "../../services/Complaintsservice";

interface Props {
  complaints: Complaint[];
  onChange: () => void;
}

export default function AdminComplaints({ complaints, onChange }: Props) {
  const actions = useLoadingKeys();

  const toggleStatus = (c: Complaint) => {
    actions.run(c.id, () => {
      updateComplaintStatus(c.id, c.status === "Open" ? "Resolved" : "Open");
      onChange();
    });
  };

  const sorted = [...complaints].sort((a, b) =>
    a.status === b.status ? 0 : a.status === "Open" ? -1 : 1
  );

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">
        Handle complaints
      </h2>
      <p className="mt-1 font-body text-sm text-ink/55">
        Issues customers have reported about bookings or providers.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {sorted.map((c) => (
          <div key={c.id} className="rounded-xl border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm font-semibold text-ink">
                  {c.subject}
                </p>
                <p className="mt-0.5 font-body text-xs text-ink/50">
                  From {c.fromName} ({c.fromEmail})
                  {c.aboutProviderName ? ` \u2014 about ${c.aboutProviderName}` : ""}{" "}
                  &middot; {c.createdAt}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={
                    "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] " +
                    (c.status === "Open"
                      ? "border-signal-amber/25 bg-signal-amber/5 text-signal-amber"
                      : "border-signal-green/25 bg-signal-green/5 text-signal-green")
                  }
                >
                  {c.status}
                </span>
                <LoadingButton
                  loading={actions.isLoading(c.id)}
                  spinnerClassName="h-3 w-3"
                  onClick={() => toggleStatus(c)}
                  className={
                    "rounded-lg px-3 py-1.5 font-body text-xs font-medium transition " +
                    (c.status === "Open"
                      ? "bg-primary text-paper hover:bg-primary-deep"
                      : "border border-line text-ink/60 hover:border-primary/40 hover:text-primary")
                  }
                >
                  {c.status === "Open" ? "Mark resolved" : "Reopen"}
                </LoadingButton>
              </div>
            </div>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink/60">
              {c.message}
            </p>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="font-body text-sm text-ink/45">No complaints filed.</p>
        )}
      </div>
    </div>
  );
}