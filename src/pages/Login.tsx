import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingButton from "../components/loadingbutton";
import { useAuth } from "../hooks/Useauth";
import { useLoadingAction } from "../hooks/Useloadingaction";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { loading, run } = useLoadingAction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => {
      const result = login(email, password);
      if (!result.ok || !result.user) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      setError(null);
      const destination =
        result.user.role === "admin"
          ? "/dashboard/admin"
          : result.user.role === "provider"
          ? "/dashboard/provider"
          : "/dashboard/customer";
      navigate(destination);
    });
  };

  return (
    <Layout>
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            Welcome back
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Sign in to SkillNear
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            Track your bookings or manage your provider profile.
          </p>

          <div className="mt-4 rounded-lg border border-line bg-paper-dim/50 px-4 py-3 font-body text-xs leading-relaxed text-ink/55">
            Demo customer: <span className="font-mono">demo@skillnear.ai</span> /{" "}
            <span className="font-mono">demo1234</span>
            <br />
            Demo provider: <span className="font-mono">demoprovider@skillnear.ai</span> /{" "}
            <span className="font-mono">demo1234</span>
            <br />
          </div>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
              />
            </label>

            {error && (
              <div className="rounded-lg bg-signal-red/10 px-3 py-2 font-body text-xs text-signal-red">
                <p>{error}</p>
                {error.toLowerCase().includes("suspended") && (
                  <Link
                    to={`/appeal-suspension?email=${encodeURIComponent(email)}`}
                    className="mt-1 inline-block font-medium underline"
                  >
                    Appeal this suspension
                  </Link>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-body text-xs text-ink/55">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-line accent-primary"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-body text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              loadingLabel="Signing in..."
              className="mt-1 rounded-lg bg-primary px-4 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
            >
              Sign in
            </LoadingButton>
          </form>

          <p className="mt-6 text-center font-body text-sm text-ink/55">
            New to SkillNear?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}