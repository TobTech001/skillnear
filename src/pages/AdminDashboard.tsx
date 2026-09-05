import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/Useauth";
import { useLoadingKeys } from "../hooks/Useloadingkeys";
import Spinner from "../components/Spinner";
import { getUsers } from "../services/Usersservice";
import { getProviders } from "../services/Providersservice";
import { getBookings } from "../services/Bookingsservice";
import { getReviews } from "../services/Reviewsservice";
import { getComplaints } from "../services/Complaintsservice";
import { getCategories } from "../services/Categoriesservice";
import { getVerifications } from "../services/VerificationService";
import { getPayments } from "../services/Paymentsservice";
import AdminOverview from "../components/admin/Adminoverview";
import AdminProviders from "../components/admin/Adminproviders";
import AdminUsers from "../components/admin/Adminusers";
import AdminBookings from "../components/admin/Adminbookings";
import AdminReviews from "../components/admin/Adminreviews";
import AdminComplaints from "../components/admin/Admincomplaints";
import AdminCategories from "../components/admin/Admincategories";
import AdminVerifications from "../components/admin/AdminVerifications";
import AdminPayments from "../components/admin/Adminpayments";

const TABS = [
  "Overview",
  "Verifications",
  "Payments",
  "Providers",
  "Users",
  "Bookings",
  "Reviews",
  "Complaints",
  "Categories",
] as const;

type Tab = (typeof TABS)[number];

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Sign in to view the admin dashboard
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

  if (currentUser.role !== "admin") {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Admin access only
          </h1>
          <p className="mt-2 font-body text-sm text-ink/55">
            This account doesn't have admin permissions.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-body text-sm font-semibold text-paper shadow-sm shadow-primary/20 transition hover:bg-primary-deep"
          >
            Back home
          </Link>
        </div>
      </Layout>
    );
  }

  return <AdminDashboardContent />;
}

function AdminDashboardContent() {
  const [tab, setTab] = useState<Tab>("Overview");
  const tabSwitch = useLoadingKeys();

  // A version counter forces a re-read from LocalStorage whenever any
  // panel below performs an action (verify, suspend, delete, etc.),
  // instead of each panel managing its own duplicate copy of the data.
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);

  const users = getUsers();
  const providers = getProviders();
  const bookings = getBookings();
  const reviews = getReviews();
  const complaints = getComplaints();
  const categories = getCategories();
  const verifications = getVerifications();
  const payments = getPayments();
  void version; // read to satisfy exhaustive-deps intent; re-render triggers re-fetch above

  return (
    <Layout>
      <div className="border-b border-line bg-paper-dim/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
            Admin
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            SkillNear control panel
          </h1>
          <p className="mt-1 font-body text-sm text-ink/55">
            Verify providers, manage accounts, and keep the marketplace healthy.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap gap-2 rounded-lg border border-line bg-paper-dim/60 p-1">
          {TABS.map((t) => (
            <button
              key={t}
              disabled={tabSwitch.isLoading(t)}
              onClick={() => tabSwitch.run(t, () => setTab(t))}
              className={
                "flex items-center gap-1.5 rounded-md px-4 py-1.5 font-body text-sm font-medium transition disabled:opacity-60 " +
                (tab === t
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink/50 hover:text-ink")
              }
            >
              {tabSwitch.isLoading(t) && <Spinner className="h-3.5 w-3.5" />}
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <AdminOverview
            users={users}
            providers={providers}
            bookings={bookings}
            reviews={reviews}
            complaints={complaints}
            payments={payments}
          />
        )}
        {tab === "Verifications" && (
          <AdminVerifications verifications={verifications} onChange={refresh} />
        )}
        {tab === "Payments" && (
          <AdminPayments payments={payments} onChange={refresh} />
        )}
        {tab === "Providers" && (
          <AdminProviders providers={providers} onChange={refresh} />
        )}
        {tab === "Users" && <AdminUsers users={users} onChange={refresh} />}
        {tab === "Bookings" && (
          <AdminBookings bookings={bookings} onChange={refresh} />
        )}
        {tab === "Reviews" && (
          <AdminReviews reviews={reviews} onChange={refresh} />
        )}
        {tab === "Complaints" && (
          <AdminComplaints complaints={complaints} onChange={refresh} />
        )}
        {tab === "Categories" && (
          <AdminCategories categories={categories} onChange={refresh} />
        )}
      </div>
    </Layout>
  );
}