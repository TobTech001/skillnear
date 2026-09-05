import type { User } from "../../types";
import LoadingButton from "../loadingbutton";
import { useLoadingKeys } from "../../hooks/Useloadingkeys";
import { setUserSuspended, deleteUser } from "../../services/Usersservice";

interface Props {
  users: User[];
  onChange: () => void;
}

const ROLE_STYLE: Record<User["role"], string> = {
  customer: "bg-paper-dim text-ink/60",
  provider: "bg-accent-soft text-primary-deep",
  admin: "bg-primary text-paper",
};

export default function AdminUsers({ users, onChange }: Props) {
  const actions = useLoadingKeys();

  const toggleSuspended = (u: User) => {
    actions.run(`${u.id}-suspend`, () => {
      setUserSuspended(u.id, !u.suspended);
      onChange();
    });
  };

  const remove = (u: User) => {
    actions.run(`${u.id}-delete`, () => {
      deleteUser(u.id);
      onChange();
    });
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">
        Manage users
      </h2>
      <p className="mt-1 font-body text-sm text-ink/55">
        Suspend an account to block sign-in, or remove it entirely.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
                {u.name}
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.04em] ${ROLE_STYLE[u.role]}`}
                >
                  {u.role}
                </span>
                {u.suspended && (
                  <span className="rounded-full bg-signal-red/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.04em] text-signal-red">
                    Suspended
                  </span>
                )}
              </p>
              <p className="mt-0.5 font-mono text-xs text-ink/45">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {u.role !== "admin" && (
                <>
                  <LoadingButton
                    loading={actions.isLoading(`${u.id}-suspend`)}
                    spinnerClassName="h-3 w-3"
                    onClick={() => toggleSuspended(u)}
                    className={
                      "rounded-lg px-3 py-1.5 font-body text-xs font-medium transition " +
                      (u.suspended
                        ? "bg-signal-green/10 text-signal-green hover:bg-signal-green/20"
                        : "border border-line text-ink/60 hover:border-signal-amber/40 hover:text-signal-amber")
                    }
                  >
                    {u.suspended ? "Unsuspend" : "Suspend"}
                  </LoadingButton>
                  <LoadingButton
                    loading={actions.isLoading(`${u.id}-delete`)}
                    spinnerClassName="h-3 w-3"
                    onClick={() => remove(u)}
                    className="rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 hover:border-signal-red/40 hover:text-signal-red"
                  >
                    Delete
                  </LoadingButton>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}