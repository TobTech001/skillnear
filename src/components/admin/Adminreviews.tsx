import type { Review } from "../../types";
import LoadingButton from "../loadingbutton";
import { useLoadingKeys } from "../../hooks/Useloadingkeys";
import { deleteReview } from "../../services/Reviewsservice";

interface Props {
  reviews: Review[];
  onChange: () => void;
}

export default function AdminReviews({ reviews, onChange }: Props) {
  const actions = useLoadingKeys();

  const remove = (id: string) => {
    actions.run(id, () => {
      deleteReview(id);
      onChange();
    });
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">
        Manage reviews
      </h2>
      <p className="mt-1 font-body text-sm text-ink/55">
        Remove reviews that violate guidelines. Removing one recalculates
        that provider's rating.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-sm font-semibold text-ink">
                  {r.author}
                </p>
                <p className="font-mono text-xs text-ink/45">
                  {r.rating.toFixed(1)} &middot; {r.date} &middot; on{" "}
                  {r.providerId}
                </p>
              </div>
              <LoadingButton
                loading={actions.isLoading(r.id)}
                spinnerClassName="h-3 w-3"
                onClick={() => remove(r.id)}
                className="shrink-0 rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 hover:border-signal-red/40 hover:text-signal-red"
              >
                Remove
              </LoadingButton>
            </div>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink/60">
              {r.comment}
            </p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="font-body text-sm text-ink/45">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}