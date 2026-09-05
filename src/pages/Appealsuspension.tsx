import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingButton from "../components/loadingbutton";
import { useLoadingAction } from "../hooks/Useloadingaction";
import { addComplaint } from "../services/Complaintsservice";

export default function AppealSuspension() {
  const [searchParams] = useSearchParams();
  const { loading, run } = useLoadingAction();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-green/10 font-display text-xl text-signal-green">
            &#10003;
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
            Appeal submitted
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            SkillNear's admin team will review your account and get back to
            you. If your suspension is lifted, you'll be able to sign in
            again with your existing email and password.
          </p>
          <Link
            to="/login"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Back to sign in
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || message.trim().length < 10) {
      setError("Fill in your name, email, and a few sentences explaining why your account should be reinstated.");
      return;
    }
    run(() => {
      addComplaint({
        id: `c_${Date.now()}`,
        fromName: name.trim(),
        fromEmail: email.trim().toLowerCase(),
        subject: "Account suspension appeal",
        message: message.trim(),
        status: "Open",
        createdAt: new Date().toISOString().slice(0, 10),
      });
      setSubmitted(true);
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg px-6 py-10">
        <Link
          to="/login"
          className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary hover:underline"
        >
          &larr; Back to sign in
        </Link>

        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Appeal a suspended account
        </h1>
        <p className="mt-2 font-body text-sm text-ink/55">
          If your account was suspended and you believe this was a mistake,
          explain your situation below. An admin will review it \u2014 you
          don't need to sign in to submit this.
        </p>

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
              Email on the suspended account
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
              Why should your account be reinstated?
            </span>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain what happened and why you believe the suspension should be lifted."
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
            loadingLabel="Submitting..."
            className="mt-1 rounded-lg bg-primary px-5 py-3 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Submit appeal
          </LoadingButton>
        </form>
      </div>
    </Layout>
  );
}