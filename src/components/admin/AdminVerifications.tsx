import { useState } from "react";
import type { ProviderVerification, VerificationStatus } from "../../types";
import LoadingButton from "../loadingbutton";
import { useLoadingKeys } from "../../hooks/Useloadingkeys";
import { updateVerificationStatus } from "../../services/VerificationService";

interface Props {
  verifications: ProviderVerification[];
  onChange: () => void;
}

const STATUS_LABEL: Record<VerificationStatus, string> = {
  draft: "Draft",
  pending: "Pending review",
  verified: "Verified",
  rejected: "Rejected",
  more_information: "More info requested",
};

const STATUS_STYLE: Record<VerificationStatus, string> = {
  draft: "text-ink/40 border-line bg-paper-dim",
  pending: "text-signal-amber border-signal-amber/25 bg-signal-amber/5",
  verified: "text-signal-green border-signal-green/25 bg-signal-green/5",
  rejected: "text-signal-red border-signal-red/25 bg-signal-red/5",
  more_information: "text-primary border-primary/25 bg-accent-soft",
};

export default function AdminVerifications({ verifications, onChange }: Props) {
  const actions = useLoadingKeys();
  const [openId, setOpenId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const pending = verifications.filter((v) => v.status === "pending");
  const others = verifications.filter((v) => v.status !== "pending");

  const decide = (v: ProviderVerification, status: VerificationStatus) => {
    actions.run(`${v.id}-${status}`, () => {
      updateVerificationStatus(v.id, status, noteDraft.trim() || undefined);
      setNoteDraft("");
      setOpenId(null);
      onChange();
    });
  };

  const renderCard = (v: ProviderVerification) => {
    const open = openId === v.id;
    return (
      <div key={v.id} className="rounded-xl border border-line bg-white p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              {v.personalInfo.fullName || "(no name provided)"}
            </p>
            <p className="mt-0.5 font-body text-xs text-ink/50">
              {v.professional.category || "No category"} &middot;{" "}
              {v.professional.yearsExperience} yrs experience
            </p>
            {v.submittedAt && (
              <p className="mt-0.5 font-mono text-[11px] text-ink/40">
                Submitted {v.submittedAt}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] " +
                STATUS_STYLE[v.status]
              }
            >
              {STATUS_LABEL[v.status]}
            </span>
            <button
              onClick={() => setOpenId(open ? null : v.id)}
              className="rounded-lg border border-line px-3 py-1.5 font-body text-xs font-medium text-ink/60 transition hover:border-primary"
            >
              {open ? "Close" : "View application"}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-5 border-t border-line pt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Section title="Personal information">
                <Row label="Full name" value={v.personalInfo.fullName} />
                <Row label="Phone" value={v.personalInfo.phone} />
                <Row label="Email" value={v.personalInfo.email} />
                <Row label="Address" value={`${v.personalInfo.address}, ${v.personalInfo.lga}, ${v.personalInfo.state}`} />
              </Section>
              <Section title="Identity">
                <Row label="ID type" value={v.identity.idType} />
                <Row label="ID number" value={v.identity.idNumber} />
                <Row label="ID document" value={v.identity.idDocumentFileName ?? "Not provided"} />
                <Row label="Selfie" value={v.identity.selfieFileName ?? "Not provided"} />
                <Row label="Self-confirmed" value={v.identity.confirmed ? "Yes" : "No"} />
              </Section>
              <Section title="Professional">
                <Row label="Category" value={v.professional.category} />
                <Row label="Title" value={v.professional.professionalTitle || "\u2014"} />
                <Row label="Services offered" value={v.professional.servicesOffered.join(", ") || "\u2014"} />
                <Row label="Description" value={v.professional.description || "\u2014"} />
              </Section>
              <Section title="Experience & skills">
                <Row label="Skills" value={v.experience.skills.join(", ") || "\u2014"} />
                <Row label="Previous experience" value={v.experience.previousExperience || "\u2014"} />
                <Row label="Certificate" value={v.experience.certificateFileName ?? "Not provided"} />
                <Row label="License" value={v.experience.licenseFileName ?? "Not provided"} />
              </Section>
              <Section title={`Portfolio (${v.portfolio.length})`}>
                {v.portfolio.length === 0 ? (
                  <p className="font-body text-xs text-ink/40">No portfolio items submitted.</p>
                ) : (
                  v.portfolio.map((p) => (
                    <Row key={p.id} label={p.title} value={p.description ?? p.fileName ?? "\u2014"} />
                  ))
                )}
              </Section>
              <Section title="Service area & pricing">
                <Row label="Location" value={`${v.serviceArea.city}, ${v.serviceArea.state}`} />
                <Row label="Areas served" value={v.serviceArea.areas.join(", ") || "\u2014"} />
                <Row label="Radius" value={`${v.serviceArea.radiusKm} km`} />
                <Row label="Starting price" value={`\u20a6${v.serviceArea.startingPrice.toLocaleString()}`} />
              </Section>
            </div>

            <div className="mt-5">
              <label className="flex flex-col gap-1.5">
                <span className="font-body text-sm font-medium text-ink/70">
                  Admin note (shown to the provider for reject / more info)
                </span>
                <textarea
                  rows={2}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="e.g. Your uploaded ID photo is unreadable — please re-upload a clearer scan."
                  className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <LoadingButton
                loading={actions.isLoading(`${v.id}-verified`)}
                spinnerClassName="h-3 w-3"
                onClick={() => decide(v, "verified")}
                className="rounded-lg bg-primary px-4 py-2 font-body text-xs font-semibold text-paper hover:bg-primary-deep"
              >
                Verify
              </LoadingButton>
              <LoadingButton
                loading={actions.isLoading(`${v.id}-rejected`)}
                spinnerClassName="h-3 w-3"
                onClick={() => decide(v, "rejected")}
                className="rounded-lg border border-line px-4 py-2 font-body text-xs font-medium text-ink/60 hover:border-signal-red/40 hover:text-signal-red"
              >
                Reject
              </LoadingButton>
              <LoadingButton
                loading={actions.isLoading(`${v.id}-more_information`)}
                spinnerClassName="h-3 w-3"
                onClick={() => decide(v, "more_information")}
                className="rounded-lg border border-line px-4 py-2 font-body text-xs font-medium text-ink/60 hover:border-primary/40 hover:text-primary"
              >
                Request more information
              </LoadingButton>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">
        Provider verification
      </h2>
      <p className="mt-1 font-body text-sm text-ink/55">
        Review full applications and approve, reject, or ask for more information.
      </p>

      <div className="mt-5">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
          Pending ({pending.length})
        </h3>
        <div className="mt-3 flex flex-col gap-3">
          {pending.map(renderCard)}
          {pending.length === 0 && (
            <p className="font-body text-sm text-ink/45">No applications waiting for review.</p>
          )}
        </div>
      </div>

      {others.length > 0 && (
        <div className="mt-8">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/40">
            Reviewed
          </h3>
          <div className="mt-3 flex flex-col gap-3">{others.map(renderCard)}</div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-xs font-semibold uppercase tracking-[0.04em] text-primary">
        {title}
      </p>
      <div className="mt-2 flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-body text-xs text-ink/45">{label}</span>
      <span className="font-body text-xs text-ink text-right">{value}</span>
    </div>
  );
}