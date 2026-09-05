import type { Provider } from "../../types";
import LoadingButton from "../loadingbutton";
import { useLoadingKeys } from "../../hooks/Useloadingkeys";
import { deleteProvider } from "../../services/Providersservice";
import { nairaRange } from "../../utils/Format";

interface Props {
  providers: Provider[];
  onChange: () => void;
}

export default function AdminProviders({ providers, onChange }: Props) {
  const actions = useLoadingKeys();

  const remove = (p: Provider) => {
    actions.run(`${p.id}-remove`, () => {
      deleteProvider(p.id);
      onChange();
    });
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">
        Providers
      </h2>
      <p className="mt-1 font-body text-sm text-ink/55">
        The verified badge is granted through the Verifications tab. From
        here you can remove a listing entirely.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {providers.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-sm font-semibold text-ink">
                {p.name}
                {p.verified && (
                  <span className="ml-2 rounded-full bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary-deep">
                    VERIFIED
                  </span>
                )}
              </p>
              <p className="mt-0.5 font-body text-xs text-ink/50">
                {p.service} &middot; {p.location} &middot;{" "}
                {nairaRange(p.priceFrom, p.priceTo)}
              </p>
              <p className="mt-0.5 font-mono text-xs text-ink/40">
                {p.rating.toFixed(1)} rating &middot; {p.reviews} reviews
              </p>
            </div>
            <div className="flex items-center gap-2">
              <LoadingButton
                loading={actions.isLoading(`${p.id}-remove`)}
                spinnerClassName="h-3 w-3"
                onClick={() => remove(p)}
                className="rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 hover:border-signal-red/40 hover:text-signal-red"
              >
                Remove listing
              </LoadingButton>
            </div>
          </div>
        ))}
        {providers.length === 0 && (
          <p className="font-body text-sm text-ink/45">No providers listed yet.</p>
        )}
      </div>
    </div>
  );
}