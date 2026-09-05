import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/Useauth";
import { useLoadingAction } from "../hooks/Useloadingaction";
import LoadingButton from "./loadingbutton";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { loading, run } = useLoadingAction();

  const handleLogout = () => {
    run(() => {
      logout();
      navigate("/");
    });
  };

  const dashboardPath =
    currentUser?.role === "provider" ? "/dashboard/provider" : "/dashboard/customer";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-paper">
            S
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            SkillNear <span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm text-ink/60 md:flex">
          <Link to="/search" className="transition hover:text-ink">
            Find a technician
          </Link>
          <Link to="/assistant" className="transition hover:text-ink">
            AI Assistant
          </Link>
          <Link to={dashboardPath} className="transition hover:text-ink">
            {currentUser?.role === "provider" ? "My dashboard" : "For providers"}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                to={dashboardPath}
                className="hidden font-body text-sm font-medium text-ink/60 transition hover:text-ink sm:block"
              >
                {currentUser.name.split(" ")[0]}
              </Link>
              <LoadingButton
                onClick={handleLogout}
                loading={loading}
                loadingLabel="Signing out...."
                spinnerClassName="h-3.5 w-3.5"
                className="rounded-lg border border-line px-4 py-2 font-body text-sm font-medium text-ink/70 transition hover:border-signal-red/40 hover:text-signal-red"
              >
                Sign out
              </LoadingButton>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                target="_blank"
                className="hidden font-body text-sm font-medium text-ink/60 transition hover:text-ink sm:block"
              >
                Sign in
              </Link>
              <Link
                to="/search"
                className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-medium text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
              >
                Describe a problem
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}