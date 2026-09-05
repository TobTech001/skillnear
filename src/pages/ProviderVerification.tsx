import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingButton from "../components/loadingbutton";
import { useAuth } from "../hooks/Useauth";
import { useLoadingAction } from "../hooks/Useloadingaction";
import { getCategories } from "../services/Categoriesservice";
import { getProviderById } from "../services/Providersservice";
import {
  getVerificationForProvider,
  saveVerification,
} from "../services/VerificationService";
import type { PortfolioItem, ProviderVerification } from "../types";

const STEP_LABELS = [
  "Personal Information",
  "Identity Verification",
  "Professional Information",
  "Experience & Skills",
  "Portfolio",
  "Service Area & Pricing",
  "Documents",
  "Review & Submit",
];

const SUGGESTED_SERVICES: Record<string, string[]> = {
  Plumbing: ["Pipe repair", "Toilet installation", "Water tank installation", "Drainage"],
  Electrical: ["Wiring", "Socket & switch repair", "Breaker upgrade", "Inspection"],
  "Generator repair": ["Diagnostics", "Servicing", "Part replacement", "Installation"],
  Roofing: ["Leak repair", "Sheet replacement", "Gutter repair", "Full re-roofing"],
  "AC repair": ["Gas refill", "Servicing", "Installation", "Repair"],
  Carpentry: ["Furniture repair", "Cabinets", "Doors", "Custom builds"],
  Painting: ["Interior", "Exterior", "Touch-ups", "Full repaint"],
  Cleaning: ["Move-in/out", "Post-construction", "Fumigation", "Deep clean"],
};

function emptyForm(currentUser: { name: string; email: string }) {
  return {
    personalInfo: {
      fullName: currentUser.name,
      dateOfBirth: "",
      phone: "",
      email: currentUser.email,
      address: "",
      state: "Oyo",
      lga: "",
      photoFileName: undefined as string | undefined,
    },
    identity: {
      idType: "NIN",
      idNumber: "",
      idDocumentFileName: undefined as string | undefined,
      selfieFileName: undefined as string | undefined,
      confirmed: false,
    },
    professional: {
      category: "",
      servicesOffered: [] as string[],
      professionalTitle: "",
      yearsExperience: 1,
      description: "",
    },
    experience: {
      skills: [] as string[],
      previousExperience: "",
      certificateFileName: undefined as string | undefined,
      licenseFileName: undefined as string | undefined,
    },
    portfolio: [] as PortfolioItem[],
    serviceArea: {
      state: "Oyo",
      city: "Ibadan",
      areas: [] as string[],
      radiusKm: 15,
      startingPrice: 10000,
    },
    documents: {
      additionalDocumentFileName: undefined as string | undefined,
    },
  };
}

const inputClass =
  "rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary";
const labelClass = "font-body text-sm font-medium text-ink/70";

export default function ProviderVerification() {
  const { currentUser } = useAuth();
  const { loading, run } = useLoadingAction();
  const categories = getCategories();

  const provider = currentUser?.providerId
    ? getProviderById(currentUser.providerId)
    : undefined;
  const existing = currentUser?.providerId
    ? getVerificationForProvider(currentUser.providerId)
    : undefined;

  const [step, setStep] = useState(0);
  const [resuming, setResuming] = useState(false);
  const [form, setForm] = useState(() =>
    existing
      ? {
          personalInfo: existing.personalInfo,
          identity: existing.identity,
          professional: existing.professional,
          experience: existing.experience,
          portfolio: existing.portfolio,
          serviceArea: existing.serviceArea,
          documents: existing.documents,
        }
      : emptyForm(currentUser ?? { name: "", email: "" })
  );

  const [skillDraft, setSkillDraft] = useState("");
  const [areaDraft, setAreaDraft] = useState("");
  const [portfolioDraft, setPortfolioDraft] = useState({ title: "", description: "", fileName: "" });
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sign in to start verification
          </h1>
          <Link to="/login" className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep">
            Sign in
          </Link>
        </div>
      </Layout>
    );
  }

  if (!currentUser.providerId || !provider) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Publish your listing first
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            Verification confirms an existing provider listing. Create your listing
            before submitting for verification.
          </p>
          <Link to="/provider/create" className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep">
            Create my listing
          </Link>
        </div>
      </Layout>
    );
  }

  if (existing && !resuming) {
    if (existing.status === "verified") {
      return (
        <Layout>
          <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-green/10 font-display text-xl text-signal-green">&#10003;</span>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">You're verified</h1>
            <p className="mt-2 font-body text-sm text-ink/55">
              Your listing now shows the Verified badge to customers.
            </p>
            <Link to="/dashboard/provider" className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep">
              Back to dashboard
            </Link>
          </div>
        </Layout>
      );
    }
    if (existing.status === "pending") {
      return (
        <Layout>
          <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-amber/10 font-display text-xl text-signal-amber">&#9201;</span>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">Verification in progress</h1>
            <p className="mt-2 font-body text-sm text-ink/55">
              Your application was submitted{existing.submittedAt ? ` on ${existing.submittedAt}` : ""} and is under review by the SkillNear admin team.
            </p>
            <span className="mt-4 rounded-full border border-signal-amber/30 bg-signal-amber/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-signal-amber">
              Under review
            </span>
            <Link to="/dashboard/provider" className="mt-6 rounded-lg border border-line px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:border-primary">
              Back to dashboard
            </Link>
          </div>
        </Layout>
      );
    }
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-red/10 font-display text-xl text-signal-red">!</span>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
            {existing.status === "rejected" ? "Application rejected" : "More information needed"}
          </h1>
          {existing.adminNote && (
            <p className="mt-3 rounded-lg bg-paper-dim/60 px-4 py-3 font-body text-sm text-ink/70">
              {existing.adminNote}
            </p>
          )}
          <button
            onClick={() => setResuming(true)}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Update & resubmit
          </button>
        </div>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-amber/10 font-display text-xl text-signal-amber">&#9201;</span>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">Verification in progress</h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            Your application has been submitted successfully. Our admin team is
            currently reviewing your information.
          </p>
          <span className="mt-4 rounded-full border border-signal-amber/30 bg-signal-amber/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-signal-amber">
            Under review
          </span>
          <Link to="/dashboard/provider" className="mt-6 rounded-lg border border-line px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:border-primary">
            Back to dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const progressPct = Math.round(((step + 1) / STEP_LABELS.length) * 100);

  const toggleService = (label: string) => {
    setForm((f) => ({
      ...f,
      professional: {
        ...f.professional,
        servicesOffered: f.professional.servicesOffered.includes(label)
          ? f.professional.servicesOffered.filter((s) => s !== label)
          : [...f.professional.servicesOffered, label],
      },
    }));
  };

  const addSkill = () => {
    const s = skillDraft.trim();
    if (!s) return;
    setForm((f) => ({ ...f, experience: { ...f.experience, skills: [...f.experience.skills, s] } }));
    setSkillDraft("");
  };
  const removeSkill = (s: string) =>
    setForm((f) => ({ ...f, experience: { ...f.experience, skills: f.experience.skills.filter((x) => x !== s) } }));

  const addArea = () => {
    const a = areaDraft.trim();
    if (!a) return;
    setForm((f) => ({ ...f, serviceArea: { ...f.serviceArea, areas: [...f.serviceArea.areas, a] } }));
    setAreaDraft("");
  };
  const removeArea = (a: string) =>
    setForm((f) => ({ ...f, serviceArea: { ...f.serviceArea, areas: f.serviceArea.areas.filter((x) => x !== a) } }));

  const addPortfolioItem = () => {
    if (!portfolioDraft.title.trim()) return;
    const item: PortfolioItem = {
      id: `pf_${Date.now()}`,
      title: portfolioDraft.title.trim(),
      description: portfolioDraft.description.trim() || undefined,
      fileName: portfolioDraft.fileName || undefined,
    };
    setForm((f) => ({ ...f, portfolio: [...f.portfolio, item] }));
    setPortfolioDraft({ title: "", description: "", fileName: "" });
  };
  const removePortfolioItem = (id: string) =>
    setForm((f) => ({ ...f, portfolio: f.portfolio.filter((p) => p.id !== id) }));

  const next = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    if (!confirmAccurate || !agreeTerms) return;
    run(() => {
      const record: ProviderVerification = {
        id: existing?.id ?? `v_${Date.now()}`,
        providerId: provider.id,
        providerUserId: currentUser.id,
        ...form,
        status: "pending",
        adminNote: undefined,
        submittedAt: new Date().toISOString().slice(0, 10),
        reviewedAt: undefined,
      };
      saveVerification(record);
      setSubmitted(true);
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/dashboard/provider" className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary hover:underline">
          &larr; Back to dashboard
        </Link>

        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Provider Verification
        </h1>

        <div className="mt-5">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.06em] text-ink/45">
            <span>Step {step + 1} of {STEP_LABELS.length}: {STEP_LABELS[step]}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper-dim">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5">
          {step === 0 && (
            <>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Profile photo</span>
                <input type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, photoFileName: e.target.files?.[0]?.name } }))} className="font-body text-sm" />
                {form.personalInfo.photoFileName && <span className="font-body text-xs text-signal-green">Selected: {form.personalInfo.photoFileName}</span>}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Full name</span>
                <input type="text" required value={form.personalInfo.fullName} onChange={(e) => setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, fullName: e.target.value } }))} className={inputClass} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Date of birth</span>
                  <input type="date" required value={form.personalInfo.dateOfBirth} onChange={(e) => setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, dateOfBirth: e.target.value } }))} className={inputClass} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Phone number</span>
                  <input type="tel" required value={form.personalInfo.phone} onChange={(e) => setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, phone: e.target.value } }))} placeholder="080X XXX XXXX" className={inputClass} />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Email address</span>
                <input type="email" required value={form.personalInfo.email} onChange={(e) => setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, email: e.target.value } }))} className={inputClass} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Residential address</span>
                <input type="text" required value={form.personalInfo.address} onChange={(e) => setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, address: e.target.value } }))} className={inputClass} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>State</span>
                  <input type="text" required value={form.personalInfo.state} onChange={(e) => setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, state: e.target.value } }))} className={inputClass} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>LGA</span>
                  <input type="text" required value={form.personalInfo.lga} onChange={(e) => setForm((f) => ({ ...f, personalInfo: { ...f.personalInfo, lga: e.target.value } }))} placeholder="e.g. Ibadan North" className={inputClass} />
                </label>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>ID type</span>
                <select value={form.identity.idType} onChange={(e) => setForm((f) => ({ ...f, identity: { ...f.identity, idType: e.target.value } }))} className={inputClass}>
                  <option>NIN</option>
                  <option>Driver's License</option>
                  <option>Passport</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>ID number</span>
                <input type="text" required value={form.identity.idNumber} onChange={(e) => setForm((f) => ({ ...f, identity: { ...f.identity, idNumber: e.target.value } }))} className={inputClass} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Upload ID</span>
                <input type="file" onChange={(e) => setForm((f) => ({ ...f, identity: { ...f.identity, idDocumentFileName: e.target.files?.[0]?.name } }))} className="font-body text-sm" />
                {form.identity.idDocumentFileName && <span className="font-body text-xs text-signal-green">Selected: {form.identity.idDocumentFileName}</span>}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Selfie / profile verification</span>
                <input type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, identity: { ...f.identity, selfieFileName: e.target.files?.[0]?.name } }))} className="font-body text-sm" />
                {form.identity.selfieFileName && <span className="font-body text-xs text-signal-green">Selected: {form.identity.selfieFileName}</span>}
              </label>
              <label className="flex items-center gap-2 font-body text-sm text-ink/70">
                <input type="checkbox" checked={form.identity.confirmed} onChange={(e) => setForm((f) => ({ ...f, identity: { ...f.identity, confirmed: e.target.checked } }))} className="h-4 w-4 accent-primary" />
                I confirm that the information provided belongs to me.
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Service category</span>
                <select value={form.professional.category} onChange={(e) => setForm((f) => ({ ...f, professional: { ...f.professional, category: e.target.value, servicesOffered: [] } }))} className={inputClass}>
                  <option value="">Select a category</option>
                  {categories.map((c) => <option key={c.id} value={c.label}>{c.label}</option>)}
                </select>
              </label>
              {form.professional.category && (
                <div>
                  <span className={labelClass}>Services offered</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(SUGGESTED_SERVICES[form.professional.category] ?? ["General repair", "Installation", "Maintenance", "Emergency callout"]).map((svc) => {
                      const active = form.professional.servicesOffered.includes(svc);
                      return (
                        <button type="button" key={svc} onClick={() => toggleService(svc)} className={"rounded-full border px-3 py-1.5 font-body text-xs transition " + (active ? "border-primary bg-primary text-paper" : "border-line text-ink/60 hover:border-primary/40")}>
                          {svc}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Professional title</span>
                <input type="text" value={form.professional.professionalTitle} onChange={(e) => setForm((f) => ({ ...f, professional: { ...f.professional, professionalTitle: e.target.value } }))} placeholder="e.g. Professional Plumber" className={inputClass} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Years of experience</span>
                <input type="number" min={0} value={form.professional.yearsExperience} onChange={(e) => setForm((f) => ({ ...f, professional: { ...f.professional, yearsExperience: Number(e.target.value) } }))} className={inputClass} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>About your service</span>
                <textarea rows={3} value={form.professional.description} onChange={(e) => setForm((f) => ({ ...f, professional: { ...f.professional, description: e.target.value } }))} className={inputClass} />
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <span className={labelClass}>Skills</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.experience.skills.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 font-body text-xs text-primary-deep">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="text-primary-deep/60 hover:text-primary-deep">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input type="text" value={skillDraft} onChange={(e) => setSkillDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="e.g. Pipe repair" className={inputClass + " flex-1"} />
                  <button type="button" onClick={addSkill} className="rounded-lg border border-line px-4 font-body text-sm font-medium text-ink/70 hover:border-primary">Add</button>
                </div>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Previous experience</span>
                <textarea rows={3} value={form.experience.previousExperience} onChange={(e) => setForm((f) => ({ ...f, experience: { ...f.experience, previousExperience: e.target.value } }))} className={inputClass} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Certifications (optional)</span>
                <input type="file" onChange={(e) => setForm((f) => ({ ...f, experience: { ...f.experience, certificateFileName: e.target.files?.[0]?.name } }))} className="font-body text-sm" />
                {form.experience.certificateFileName && <span className="font-body text-xs text-signal-green">Selected: {form.experience.certificateFileName}</span>}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Professional license (optional)</span>
                <input type="file" onChange={(e) => setForm((f) => ({ ...f, experience: { ...f.experience, licenseFileName: e.target.files?.[0]?.name } }))} className="font-body text-sm" />
                {form.experience.licenseFileName && <span className="font-body text-xs text-signal-green">Selected: {form.experience.licenseFileName}</span>}
              </label>
            </>
          )}

          {step === 4 && (
            <>
              <p className="rounded-lg bg-paper-dim/60 px-4 py-3 font-body text-xs text-ink/55">
                Optional \u2014 showing past work helps customers trust your listing, but you
                can skip this step and submit without any portfolio items.
              </p>
              <div className="rounded-xl border border-line bg-white p-4">
                <p className="font-display text-sm font-semibold text-ink">Add previous work</p>
                <div className="mt-3 flex flex-col gap-3">
                  <input type="text" value={portfolioDraft.title} onChange={(e) => setPortfolioDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Work title, e.g. Kitchen Sink Installation" className={inputClass} />
                  <textarea rows={2} value={portfolioDraft.description} onChange={(e) => setPortfolioDraft((d) => ({ ...d, description: e.target.value }))} placeholder="Description (optional)" className={inputClass} />
                  <input type="file" accept="image/*" onChange={(e) => setPortfolioDraft((d) => ({ ...d, fileName: e.target.files?.[0]?.name ?? "" }))} className="font-body text-sm" />
                  <button type="button" onClick={addPortfolioItem} className="w-fit rounded-lg border border-line px-4 py-2 font-body text-sm font-medium text-ink/70 hover:border-primary">
                    + Add to portfolio
                  </button>
                </div>
              </div>
              {form.portfolio.length > 0 && (
                <div className="flex flex-col gap-2">
                  {form.portfolio.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3">
                      <div>
                        <p className="font-body text-sm font-medium text-ink">{p.title}</p>
                        {p.description && <p className="font-body text-xs text-ink/50">{p.description}</p>}
                      </div>
                      <button type="button" onClick={() => removePortfolioItem(p.id)} className="font-body text-xs text-signal-red hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>State</span>
                  <input type="text" value={form.serviceArea.state} onChange={(e) => setForm((f) => ({ ...f, serviceArea: { ...f.serviceArea, state: e.target.value } }))} className={inputClass} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>City</span>
                  <input type="text" value={form.serviceArea.city} onChange={(e) => setForm((f) => ({ ...f, serviceArea: { ...f.serviceArea, city: e.target.value } }))} className={inputClass} />
                </label>
              </div>
              <div>
                <span className={labelClass}>Areas you serve</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.serviceArea.areas.map((a) => (
                    <span key={a} className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 font-body text-xs text-primary-deep">
                      {a}
                      <button type="button" onClick={() => removeArea(a)} className="text-primary-deep/60 hover:text-primary-deep">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input type="text" value={areaDraft} onChange={(e) => setAreaDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArea(); } }} placeholder="e.g. Ibadan North" className={inputClass + " flex-1"} />
                  <button type="button" onClick={addArea} className="rounded-lg border border-line px-4 font-body text-sm font-medium text-ink/70 hover:border-primary">Add</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Service radius (km)</span>
                  <input type="number" min={1} value={form.serviceArea.radiusKm} onChange={(e) => setForm((f) => ({ ...f, serviceArea: { ...f.serviceArea, radiusKm: Number(e.target.value) } }))} className={inputClass} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Starting price (\u20a6)</span>
                  <input type="number" min={0} value={form.serviceArea.startingPrice} onChange={(e) => setForm((f) => ({ ...f, serviceArea: { ...f.serviceArea, startingPrice: Number(e.target.value) } }))} className={inputClass} />
                </label>
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <div className="flex flex-col gap-2">
                {[
                  ["Identity document", form.identity.idDocumentFileName],
                  ["Profile photo", form.personalInfo.photoFileName],
                  ["Certificate", form.experience.certificateFileName],
                  ["Proof of experience", form.experience.licenseFileName],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3">
                    <span className="font-body text-sm text-ink">{label}</span>
                    {value ? (
                      <span className="font-mono text-xs text-signal-green">\u2713 Uploaded</span>
                    ) : (
                      <span className="font-mono text-xs text-ink/35">Not provided</span>
                    )}
                  </div>
                ))}
              </div>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Additional document (optional)</span>
                <input type="file" onChange={(e) => setForm((f) => ({ ...f, documents: { additionalDocumentFileName: e.target.files?.[0]?.name } }))} className="font-body text-sm" />
                {form.documents.additionalDocumentFileName && <span className="font-body text-xs text-signal-green">Selected: {form.documents.additionalDocumentFileName}</span>}
              </label>
            </>
          )}

          {step === 7 && (
            <>
              <div className="flex flex-col gap-2 rounded-xl border border-line bg-white p-5">
                {[
                  ["Personal information", !!form.personalInfo.fullName && !!form.personalInfo.phone],
                  ["Identity information", !!form.identity.idNumber && form.identity.confirmed],
                  ["Professional information", !!form.professional.category],
                  ["Experience & skills", form.experience.skills.length > 0],
                  ["Portfolio", form.portfolio.length > 0],
                  ["Service area", form.serviceArea.areas.length > 0],
                  ["Documents", !!form.identity.idDocumentFileName],
                ].map(([label, done]) => (
                  <div key={label as string} className="flex items-center justify-between border-b border-line py-2 last:border-0">
                    <span className="font-body text-sm text-ink">{label}</span>
                    <span className={"font-mono text-xs " + (done ? "text-signal-green" : "text-ink/30")}>
                      {done ? "\u2713" : label === "Portfolio" ? "Skipped" : "\u2014"}
                    </span>
                  </div>
                ))}
              </div>

              <label className="flex items-start gap-2 font-body text-sm text-ink/70">
                <input type="checkbox" checked={confirmAccurate} onChange={(e) => setConfirmAccurate(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
                I confirm that the information provided is accurate.
              </label>
              <label className="flex items-start gap-2 font-body text-sm text-ink/70">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
                I agree to the platform's verification terms.
              </label>
            </>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button type="button" onClick={back} disabled={step === 0} className="rounded-lg border border-line px-5 py-2.5 font-body text-sm font-medium text-ink/70 transition hover:border-primary disabled:opacity-0">
            Back
          </button>
          {step < STEP_LABELS.length - 1 ? (
            <button type="button" onClick={next} className="rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep">
              Save & Continue
            </button>
          ) : (
            <LoadingButton
              type="button"
              loading={loading}
              loadingLabel="Submitting\u2026"
              disabled={!confirmAccurate || !agreeTerms}
              onClick={handleSubmit}
              className="rounded-lg bg-primary px-6 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep disabled:opacity-50"
            >
              Submit for Verification
            </LoadingButton>
          )}
        </div>
      </div>
    </Layout>
  );
}