import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingButton from "../components/loadingbutton";
import { useAuth } from "../hooks/Useauth";
import { useLoadingAction } from "../hooks/Useloadingaction";
import { generateOtp, verifyOtp, clearOtp } from "../services/otpservice";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPassword() {
  const { userExists, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { loading, run } = useLoadingAction();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => {
      if (!userExists(email)) {
        setError("No account found with that email.");
        return;
      }
      const code = generateOtp(email);
      setDevOtp(code); // no real email backend — shown here like the demo login credentials
      setError(null);
      setStep("otp");
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => {
      const result = verifyOtp(email, otp);
      if (!result.ok) {
        setError(result.error ?? "Couldn't verify that code.");
        return;
      }
      setError(null);
      setStep("reset");
    });
  };

  const handleResendCode = () => {
    run(() => {
      const code = generateOtp(email);
      setDevOtp(code);
      setOtp("");
      setError(null);
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    run(() => {
      const result = resetPassword(email, newPassword);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      clearOtp(email);
      setError(null);
      setStep("done");
    });
  };

  return (
    <Layout>
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {step === "email" && (
            <>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
                Forgot password
              </span>
              <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Reset your password
              </h1>
              <p className="mt-2 font-body text-sm text-ink/55">
                Enter the email on your account and we'll send a 6-digit
                code to verify it's you.
              </p>

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleSendCode}>
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

                {error && (
                  <p className="rounded-lg bg-signal-red/10 px-3 py-2 font-body text-xs text-signal-red">
                    {error}
                  </p>
                )}

                <LoadingButton
                  type="submit"
                  loading={loading}
                  loadingLabel="Sending code..."
                  className="mt-1 rounded-lg bg-primary px-4 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
                >
                  Send code
                </LoadingButton>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
                Step 2 of 3
              </span>
              <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Enter the code
              </h1>
              <p className="mt-2 font-body text-sm text-ink/55">
                We sent a 6-digit code to <span className="text-ink">{email}</span>.
                It expires in 10 minutes.
              </p>

              {devOtp && (
                <div className="mt-4 rounded-lg border border-line bg-paper-dim/50 px-4 py-3 font-body text-xs leading-relaxed text-ink/55">
                  No email service is wired up in this prototype, so your
                  code is shown here instead of being emailed:{" "}
                  <span className="font-mono text-sm font-semibold text-ink">
                    {devOtp}
                  </span>
                </div>
              )}

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleVerifyOtp}>
                <label className="flex flex-col gap-1.5">
                  <span className="font-body text-sm font-medium text-ink/70">
                    6-digit code
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="rounded-lg border border-line bg-white px-4 py-2.5 text-center font-mono text-lg tracking-[0.3em] text-ink placeholder:text-ink/25 focus:border-primary"
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
                  loadingLabel="Verifying..."
                  disabled={otp.length !== 6}
                  className="mt-1 rounded-lg bg-primary px-4 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
                >
                  Verify code
                </LoadingButton>

                <LoadingButton
                  type="button"
                  loading={loading}
                  loadingLabel="Resending..."
                  onClick={handleResendCode}
                  className="font-body text-xs font-medium text-primary hover:underline"
                >
                  Didn't get it? Resend code
                </LoadingButton>
              </form>
            </>
          )}

          {step === "reset" && (
            <>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
                Step 3 of 3
              </span>
              <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Create a new password
              </h1>
              <p className="mt-2 font-body text-sm text-ink/55">
                Your email is verified. Choose a new password for{" "}
                <span className="text-ink">{email}</span>.
              </p>

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleResetPassword}>
                <label className="flex flex-col gap-1.5">
                  <span className="font-body text-sm font-medium text-ink/70">
                    New password
                  </span>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-body text-sm font-medium text-ink/70">
                    Confirm new password
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
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
                  loadingLabel="Updating password..."
                  className="mt-1 rounded-lg bg-primary px-4 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
                >
                  Reset password
                </LoadingButton>
              </form>
            </>
          )}

          {step === "done" && (
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-signal-green/10 font-display text-xl text-signal-green">
                &#10003;
              </span>
              <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
                Password updated
              </h1>
              <p className="mt-2 font-body text-sm text-ink/55">
                You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
              >
                Back to sign in
              </button>
            </div>
          )}

          {step !== "done" && (
            <p className="mt-6 text-center font-body text-sm text-ink/55">
              Remembered it?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}