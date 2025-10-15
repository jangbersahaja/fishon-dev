# 🐟 Fishon.my — Malaysia’s First Fishing Charter Marketplace

Fishon.my is an **e-commerce marketplace for recreational fishing charters**, connecting **anglers** with **licensed boat captains** across Malaysia.  
It’s built with **Next.js 15**, **React 19**, **Prisma ORM**, and **PostgreSQL**, featuring a modern UI, secure booking workflows, and future-ready integrations like chat, reviews, and payments.

---

## 🚀 Features

- 🎣 **Charter Bookings** — real-time listings, trip availability, instant booking & confirmation flow
- 👤 **User Accounts** — anglers (frontend) + captains (backend) with distinct dashboards
- 💬 **Chat System (coming soon)** — instant communication between anglers & captains
- 💳 **Secure Payments** — SenangPay / Stripe integration for deposits and transactions
- ⭐ **Reviews & Ratings** — transparent feedback after completed trips
- 📰 **Blog Platform** — CMS-style dashboard, comments, newsletter, and social sharing
- 📱 **PWA Ready** — add-to-home-screen support on mobile
- ☁️ **Deployed on Vercel** — auto-scaling, serverless functions, and CI/CD built-in

---

## 🧱 Tech Stack

| Layer               | Technology                                              |
| ------------------- | ------------------------------------------------------- |
| **Framework**       | Next.js 15 (App Router)                                 |
| **Language**        | TypeScript / React 19                                   |
| **Database**        | PostgreSQL (via Prisma ORM)                             |
| **UI & Styling**    | Tailwind CSS, Geist Font                                |
| **API Integration** | Fishon Captain Backend (read-only), future Chat Service |
| **Deployment**      | Vercel + Neon Postgres                                  |
| **Version Control** | GitHub                                                  |
| **CI/CD**           | GitHub Actions                                          |

---

## 🧩 Project Architecture

```text
Fishon.my (Next.js frontend)
├── app/                 # Next.js App Router pages & layouts
├── components/          # Reusable UI components
├── lib/                 # Prisma client, helpers, API utilities
├── prisma/              # Prisma schema & migrations
├── public/              # Static assets, icons, PWA manifest
├── docs/                # Technical documentation
└── DOCS/DB_ARCHITECTURE.md  # Canonical database guide
```

### Related Services

| Service                   | Repo                 | Responsibility                              |
| ------------------------- | -------------------- | ------------------------------------------- |
| `fishon-captain`          | Backend API          | Captain registration, management, analytics |
| `fishon-market`           | Frontend marketplace | Angler experience, bookings, payments       |
| `fishon-chat` _(planned)_ | Real-time chat       | Messaging & notifications                   |
| `fishon-schemas`          | Shared package       | Zod schemas for event validation            |

---

## ⚙️ Environment Configuration

Create an `.env.local` file (copy from `.env.example`):

```bash
cp .env.example .env.local
```

### Required Variables

| Key                               | Description                                |
| --------------------------------- | ------------------------------------------ |
| `DATABASE_URL`                    | PostgreSQL connection string               |
| `NEXT_PUBLIC_SITE_URL`            | Base site URL                              |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps integration                    |
| `FISHON_CAPTAIN_API_URL`          | Optional: backend API URL for captain data |
| `FISHON_CAPTAIN_API_KEY`          | Optional: API key for secured requests     |
| `SENTRY_DSN`                      | Optional: error tracking via Sentry        |

---

## 🗄️ Database Setup (Prisma)

This project uses Prisma ORM for schema management and migrations.

### Local setup

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

### Deploy migrations (Vercel)

In Build & Development Settings add:

```bash
npm run prisma:migrate-deploy && npm run build
```

---

## 🧠 Development Workflow

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the dev server

   ```bash
   npm run dev
   ```

3. Visit <http://localhost:3000>.

### Scripts

| Command                   | Description                  |
| ------------------------- | ---------------------------- |
| `npm run dev`             | Start local dev server       |
| `npm run build`           | Build for production         |
| `npm run start`           | Run production build locally |
| `npm run lint`            | Lint code                    |
| `npm run prisma:migrate`  | Run local migrations         |
| `npm run prisma:generate` | Regenerate Prisma client     |

---

## 🌐 Deployment

### Vercel + Neon Postgres

1. Provision a Vercel Postgres database.
2. Add environment variables (DATABASE_URL, etc.) in Vercel dashboard.
3. Set Build Command → `npm run prisma:migrate-deploy && npm run build`.
4. Deploy to production — Vercel handles the rest.

### CI/CD (GitHub Actions)

Every push/PR triggers:

- Lint → Typecheck → Build → Prisma Validate → Test

Workflow file: `.github/workflows/ci.yml`

---

## 📰 Blog Module

The integrated blog system supports:

- Rich-text editor
- Comments & moderation
- Author profiles
- Reading progress indicator
- Newsletter subscription

See:

- `BLOG_IMPLEMENTATION_SUMMARY.md`
- `docs/BLOG_FEATURES_IMPLEMENTATION.md`

---

## 🧭 Documentation Index

| Doc                           | Description                        |
| ----------------------------- | ---------------------------------- |
| `DOCS/DB_ARCHITECTURE.md`     | Full database & migration guide    |
| `CONTRIBUTING.md`             | How to develop, branch, and deploy |
| `DEPLOY_CHECKLIST.md`         | Production deployment checklist    |
| `docs/BACKEND_INTEGRATION.md` | Backend API and data flow          |
| `@fishon/schemas`             | Shared Zod event schemas           |

---

## 🧪 Testing

Basic testing uses Jest (or Vitest if enabled).

Run:

```bash
npm test
```

Integration tests will be added for:

- Booking lifecycle
- Payment webhooks
- Chat event flow

---

## 🔐 Security & Compliance

- All sensitive data in .env (never committed).
- Captain DB is additive-only (no column removals).
- HTTPS enforced in production.
- PDPA-ready: data export & deletion endpoints planned.

---

## 🧰 Tooling & Automation

- Dependabot — weekly dependency updates
- ESLint + Prettier — code style enforcement
- Sentry (optional) — runtime error monitoring
- GitHub Actions — CI validation and migrations
- PWA manifest — offline & installable experience

---

## 👥 Contributing

We welcome contributions!

> "See CONTRIBUTING.md for development workflow and contribution guidelines."

Quick summary:

```bash
git checkout -b feat/new-feature
git commit -m "feat(blog): add search filters"
git push origin feat/new-feature
```

Then open a Pull Request on GitHub.

---

## 📄 License

© 2025 Kartel Motion Ventures.
All rights reserved.
Unauthorized copying or redistribution is prohibited without permission.

---

## 🧩 Contact

| Role                | Contact                             |
| ------------------- | ----------------------------------- |
| **Support**         | <support@fishon.my>                 |
| **Website**         | <https://www.fishon.my>             |
| **Captains Portal** | <https://fishon-captain.vercel.app> |
