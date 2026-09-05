# SkillNear AI

An AI-assisted local service marketplace connecting customers in Ibadan with nearby technicians — generator repair, plumbing, electrical, roofing, and more. Customers describe a problem in plain language, get matched to the right trade via Gemini, compare and book a provider, pay into escrow, and release payment once the job is confirmed done. Admins oversee the whole marketplace from a control panel.

This is a client-only prototype: **React + TypeScript + Tailwind**, with **browser LocalStorage** standing in for a backend/database, and the **Gemini API** for AI diagnosis.

---

## Features

### Customers
- Search and filter providers by trade, distance (via Geolocation API), rating, price, and availability
- AI Assistant — describe a problem in plain text, get matched to a service category
- Book a provider and propose a budget
- Pay into escrow once the provider accepts
- Confirm job completion to release payment
- Leave reviews, file complaints, track bookings from a dashboard

### Providers
- Register and publish a listing (trade, price range, location, availability)
- Receive and accept/reject customer budget offers
- Complete an 8-step identity verification flow to earn a **Verified** badge
- Mark jobs completed, view earnings (based on *released* payments, not just completed jobs)
- View customer reviews

### Admins
- **Overview** — live analytics: users, providers, bookings by status, escrow totals, ratings, open complaints
- **Verifications** — review provider applications, verify / reject / request more info
- **Payments** — release escrowed payments once both sides confirm, or refund the customer
- **Providers** — remove listings
- **Users** — suspend/unsuspend, delete accounts
- **Bookings** — view and manage all bookings
- **Reviews** — moderate/delete
- **Complaints** — mark open/resolved
- **Categories** — add/edit/delete service categories

---

## Tech stack

| Layer | Technology |
|---|---|
| UI | React + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router |
| AI diagnosis | Gemini API (`gemini-flash-latest`), with local keyword-match fallback |
| Location | Browser Geolocation API + Haversine distance |
| Persistence | Browser LocalStorage (no backend) |
| Build tool | Vite |

---

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Enabling live AI diagnosis (optional)

Without an API key, the AI Assistant falls back to local keyword matching automatically — the app works either way.

To enable real Gemini responses:

1. Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Create a `.env` file in the project root:
   ```
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```
3. Restart `npm run dev`

`.env` is git-ignored — never commit your key.

---

## Demo accounts

All data is seeded into LocalStorage on first run.

| Role | Email | Password |
|---|---|---|
| Customer | `demo@skillnear.ai` | `demo1234` |
| Provider | `demoprovider@skillnear.ai` | `demo1234` |
| Admin | `admin@skillnear.ai` | `admin1234` |

To start fresh, clear your browser's LocalStorage for this site.

---

## Project structure

```
src/
├── pages/              Route-level screens (Home, Login, Search, dashboards, etc.)
├── components/         Reusable UI pieces
│   └── admin/          Admin dashboard panels (Overview, Payments, Users, etc.)
├── context/            AuthContext — session/login/register state
├── hooks/              useAuth, useGeolocation, useLoadingAction, useLoadingKeys
├── services/           Data access layer (LocalStorage-backed, mirrors a REST API shape)
├── data/               Seed/mock data
├── types/              Shared TypeScript interfaces
└── utils/              Formatting helpers (currency, dates, distance)
```

Each `services/*.ts` file exposes `get`/`add`/`update` functions over a single LocalStorage key — swapping in a real backend later means rewriting the inside of these files, not the pages or components that call them.

---

## Known limitations

This is a prototype scoped for demonstrating the full product flow end-to-end, not a production system.

- **No real backend or database** — all data lives in the browser's LocalStorage and is lost if it's cleared, and isn't shared across devices/browsers
- **Passwords stored in plain text** — not hashed; a real deployment needs server-side auth (bcrypt/argon2 + sessions)
- **No real payment gateway** — the Payment page simulates a card charge; no money actually moves
- **No real email/SMS delivery** — OTP codes and notifications are shown on-screen instead of sent
- **Gemini API key is called from the browser** — visible in network requests; production needs a backend proxy to keep it secret
- **File uploads are simulated** — verification documents/photos capture only the filename, not the actual file (no file storage backend)
- **Single seeded admin account** — no multi-admin or invite flow
- **Distance is self-reported** — computed from the browser's own Geolocation, not independently verified

## Future work

- Migrate to a real backend with hashed, server-side authentication
- Integrate a real payment gateway (e.g. Paystack, Stripe)
- Real email/SMS delivery for OTPs and notifications
- Real file storage for verification documents and portfolio images
- Automated tests (Jest, React Testing Library)
- Multi-admin support with an invite/promotion flow