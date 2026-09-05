import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/Useauth";
import { addProvider, getProviderById, initialsFrom } from "../services/Providersservice";
import { getCategories } from "../services/Categoriesservice";
import { useGeolocation } from "../hooks/Usegeolocation";
import { useLoadingAction } from "../hooks/Useloadingaction";
import type { Provider } from "../types";

export default function CreateProviderProfile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const geo = useGeolocation();
  const { loading, run } = useLoadingAction();
  const categories = getCategories();

  const [service, setService] = useState(currentUser?.trade ?? categories[0].label);
  const [location, setLocation] = useState("");
  const [priceFrom, setPriceFrom] = useState("5000");
  const [priceTo, setPriceTo] = useState("20000");
  const [yearsExperience, setYearsExperience] = useState("1");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] =
    useState<Provider["availability"]>("Available today");
  const [error, setError] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sign in to set up your provider profile
          </h1>
          <Link
            to="/login"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Sign in
          </Link>
        </div>
      </Layout>
    );
  }

  if (currentUser.providerId && getProviderById(currentUser.providerId)) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            You already have a provider profile
          </h1>
          <Link
            to="/dashboard/provider"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Go to my dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const from = Number(priceFrom);
    const to = Number(priceTo);
    if (Number.isNaN(from) || Number.isNaN(to) || from <= 0 || to < from) {
      setError("Enter a valid price range, with the maximum at or above the minimum.");
      return;
    }
    if (!location.trim()) {
      setError("Add the area you work in so customers know you're nearby.");
      return;
    }

    run(() => {
      const newProvider: Provider = {
        id: `p_${Date.now()}`,
        name: currentUser.name,
        service,
        location: location.trim(),
        distanceKm: 1.5, // fallback estimate; liveDistanceKm on Search overrides this once lat/lng below is set
        latitude: geo.latitude,
        longitude: geo.longitude,
        rating: 0,
        reviews: 0,
        priceFrom: from,
        priceTo: to,
        availability,
        verified: false,
        initials: initialsFrom(currentUser.name),
        yearsExperience: Number(yearsExperience) || undefined,
        bio: bio.trim() || undefined,
      };

      addProvider(newProvider);
      updateCurrentUser({ providerId: newProvider.id, trade: service });
      navigate("/dashboard/provider");
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-6 py-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
          Set up your listing
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Create your provider profile
        </h1>
        <p className="mt-2 font-body text-sm text-ink/55">
          This is what customers see when SkillNear matches a job to you.
          You can update it any time from your dashboard.
        </p>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-ink/70">
              Primary trade
            </span>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-ink/70">
              Area you work in
            </span>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bodija, Ibadan"
              className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
            />
            <div className="mt-1">
              {geo.status === "granted" ? (
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-signal-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
                  Using your current coordinates
                </span>
              ) : (
                <button
                  type="button"
                  onClick={geo.requestLocation}
                  disabled={geo.status === "locating"}
                  className="flex items-center gap-1.5 font-body text-xs font-medium text-primary hover:underline disabled:opacity-60"
                >
                  {geo.status === "locating" && (
                    <Spinner className="h-3.5 w-3.5 text-primary" />
                  )}
                  {geo.status === "locating"
                    ? "Locating..."
                    : "Share my current location for accurate distance matching"}
                </button>
              )}
              {geo.status === "denied" && (
                <p className="mt-1 font-body text-xs text-ink/40">
                  Location blocked we'll use an approximate central
                  Ibadan position instead. You can adjust this later.
                </p>
              )}
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Price from (₦)
              </span>
              <input
                type="number"
                min={0}
                required
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Price to (₦)
              </span>
              <input
                type="number"
                min={0}
                required
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink focus:border-primary"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Years of experience
              </span>
              <input
                type="number"
                min={0}
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-body text-sm font-medium text-ink/70">
                Availability
              </span>
              <select
                value={availability}
                onChange={(e) =>
                  setAvailability(e.target.value as Provider["availability"])
                }
                className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink focus:border-primary"
              >
                <option>Available now</option>
                <option>Available today</option>
                <option>Booked until tomorrow</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="font-body text-sm font-medium text-ink/70">
              Bio (optional)
            </span>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What you specialise in, how you work, what customers should expect."
              className="rounded-lg border border-line bg-white px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/35 focus:border-primary"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-signal-red/10 px-3 py-2 font-body text-xs text-signal-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep disabled:opacity-70"
          >
            {loading && <Spinner />}
            {loading ? "Publishing..." : "Publish my listing"}
          </button>
        </form>
      </div>
    </Layout>
  );
}