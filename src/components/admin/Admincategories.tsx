import { useState } from "react";
import type { ServiceCategory } from "../../types";
import LoadingButton from "../loadingbutton";
import { useLoadingAction } from "../../hooks/Useloadingaction";
import { useLoadingKeys } from "../../hooks/Useloadingkeys";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/Categoriesservice";

interface Props {
  categories: ServiceCategory[];
  onChange: () => void;
}

export default function AdminCategories({ categories, onChange }: Props) {
  const [label, setLabel] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { loading: adding, run: runAdd } = useLoadingAction();
  const rowActions = useLoadingKeys();

  const startEdit = (c: ServiceCategory) => {
    setEditingId(c.id);
    setLabel(c.label);
    setCode(c.code);
    setDescription(c.description);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setLabel("");
    setCode("");
    setDescription("");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !code.trim()) {
      setError("Add a label and a short code (e.g. GEN, PLB).");
      return;
    }
    runAdd(() => {
      if (editingId) {
        updateCategory(editingId, {
          label: label.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim(),
        });
      } else {
        addCategory({
          id: `cat_${Date.now()}`,
          label: label.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim(),
        });
      }
      cancelEdit();
      onChange();
    });
  };

  const remove = (id: string) => {
    rowActions.run(id, () => {
      deleteCategory(id);
      onChange();
    });
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">
        Manage service categories
      </h2>
      <p className="mt-1 font-body text-sm text-ink/55">
        These are the trades customers can search and providers can list under.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-3 rounded-xl border border-line bg-white p-5 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="font-body text-xs font-medium text-ink/70">Label</span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Fumigation"
            className="rounded-lg border border-line bg-white px-3 py-2 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
          />
        </label>
        <label className="flex w-24 flex-col gap-1.5">
          <span className="font-body text-xs font-medium text-ink/70">Code</span>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="FUM"
            className="rounded-lg border border-line bg-white px-3 py-2 font-body text-sm uppercase text-ink placeholder:text-ink/35 focus:border-primary"
          />
        </label>
        <label className="flex flex-[1.5] flex-col gap-1.5">
          <span className="font-body text-xs font-medium text-ink/70">
            Description
          </span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description shown on the category card"
            className="rounded-lg border border-line bg-white px-3 py-2 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
          />
        </label>
        <div className="flex gap-2">
          <LoadingButton
            type="submit"
            loading={adding}
            loadingLabel={editingId ? "Saving..." : "Adding..."}
            className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-medium text-paper hover:bg-primary-deep"
          >
            {editingId ? "Save" : "Add"}
          </LoadingButton>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-line px-4 py-2 font-body text-sm font-medium text-ink/60 hover:text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {error && (
        <p className="mt-2 rounded-lg bg-signal-red/10 px-3 py-2 font-body text-xs text-signal-red">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-medium text-primary-deep">
                {c.code}
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-ink">
                  {c.label}
                </p>
                <p className="font-body text-xs text-ink/50">{c.description}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => startEdit(c)}
                className="rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 hover:border-primary/40 hover:text-primary"
              >
                Edit
              </button>
              <LoadingButton
                loading={rowActions.isLoading(c.id)}
                spinnerClassName="h-3 w-3"
                onClick={() => remove(c.id)}
                className="rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 hover:border-signal-red/40 hover:text-signal-red"
              >
                Delete
              </LoadingButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}