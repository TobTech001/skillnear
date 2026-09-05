import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingButton from "../components/loadingbutton";
import { useAuth } from "../hooks/Useauth";
import { useLoadingAction } from "../hooks/Useloadingaction";
import { useLoadingKeys } from "../hooks/Useloadingkeys";
import type { UserRole } from "../types";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trade, setTrade] = useState("Generator repair");
  const [error, setError] = useState<string | null>(null);
  const { loading, run } = useLoadingAction();
  const roleToggle = useLoadingKeys();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    run(() => {
      const result = register({ name, email, password, role, trade });
      if (!result.ok || !result.user) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      setError(null);
      navigate(role === "provider" ? "/dashboard/provider" : "/dashboard/customer");
    });
  };

  return (
    <Layout>
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            Get started
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            Tell us who you are so we can set up the right dashboard.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border border-line bg-paper-dim/60 p-1">
            <LoadingButton
              type="button"
              loading={roleToggle.isLoading("customer")}
              spinnerClassName="h-3.5 w-3.5"
              onClick={() => roleToggle.run("customer", () => setRole("customer"))}
              className={
                "rounded-md py-2 font-body text-sm font-medium transition " +
                (role === "customer"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink/50 hover:text-ink")
              }
            >
              I need a service
            </LoadingButton>
            <LoadingButton
              type="button"
              loading={roleToggle.isLoading("provider")}
              spinnerClassName="h-3.5 w-3.5"
              onClick={() => roleToggle.run("provider", () => setRole("provider"))}
              className={
                "rounded-md py-2 font-body text-sm font-medium transition " +
                (role === "provider"
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink/50 hover:text-ink")
              }
            >
              I'm a technician
            </LoadingButton>
          </div>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Full name
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tobi Adeyemi"
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
              />
            </label>

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

            {role === "provider" && (
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-sm font-medium text-ink/70">
                  Primary trade
                </span>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink focus:border-primary"
                >
                  <option>Generator repair</option>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Roofing</option>
                  <option>Barber</option>
                  <option>AC repair</option>
                  <option>Carpentry</option>
                  <option>Painting</option>
                  <option>Cleaning</option>
                  <option>Phone Repair</option>
                </select>
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-signal-red/10 px-3 py-2 font-body text-xs text-signal-red">
                {error}
              </p>
            )}

            <LoadingButton
              type="submit"
              loading={loading}
              loadingLabel="Creating account"
              className="mt-1 rounded-lg bg-primary px-4 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep cursor-pointer"
            >
              {role === "provider" ? "Create provider account" : "Create account"}
            </LoadingButton>
          </form>

          <p className="mt-6 text-center font-body text-sm text-ink/55">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}