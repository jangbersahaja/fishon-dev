# Contributing to Fishon

## 🧭 Welcome

This document explains how we work on Fishon projects — issues, branches, pull requests, and workflows.
It's both a quick reference for new contributors and a checklist for our own discipline.

---

## 🧩 Repositories Overview

| Repo                    | Role                                  | DB Owner                     |
| ----------------------- | ------------------------------------- | ---------------------------- |
| `fishon-captain`        | Captain management backend            | Captain DB (Captain Service) |
| `fishon-market`         | Public booking platform               | Market DB (Market Service)   |
| `fishon-chat` (planned) | Real-time chat                        | Chat DB (Chat Service)       |
| `fishon-schemas`        | Shared Zod/TypeScript event contracts | — (Shared)                   |

---

## 🧱 Development Workflow

### 1. Fork & Clone

Fork the repo (if external) and clone it locally.

```bash
git clone https://github.com/<org>/<repo>.git
cd <repo>
npm install
```

### 2. Branching

Use the pattern:

```text
<type>/<short-description>
```

Examples:

- `feat/booking-endpoints`
- `fix/pwa-manifest`
- `chore/add-env-example`

Types: `feat`, `fix`, `chore`, `docs`, `ci`, `refactor`, `test`.

### 3. Creating Issues

Every task starts with an Issue.

- Go to Issues → New issue
- Paste from the prepared issue list (see project docs)
- Add labels: `priority:high`, `effort:small`, etc.
- Assign to yourself or Copilot.

This ensures each PR maps to a single issue.

### 4. Projects Board

We use a shared GitHub Project board called **Fishon Platform**.

Columns:

- To-Do
- In Progress
- Review
- Done

Drag issues between columns as work progresses.

---

## 🧪 Pull Requests

### PR Template

When opening a PR, GitHub shows the checklist automatically:

#### Summary

Explain what changed and why.

#### Checklist

- [ ] Lint passes locally
- [ ] Typecheck passes
- [ ] Build passes
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] If Captain DB migration: confirm it's additive (no DROP)

### PR Naming

```text
<type>: <summary>
```

Example:

```text
feat(booking): add accept/decline endpoints
```

### Linking Issues

Link your PR to an issue using:

```text
fixes #123
```

When merged, GitHub auto-closes the issue.

---

## 🧰 Continuous Integration

Every repo has `.github/workflows/ci.yml` which runs on PRs and pushes:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npx prisma validate` (if Prisma present)
- `npm test`

All checks must pass before merging.

### Captain DB Special Rule

- Captain DB cannot remove columns.
- All migrations must be additive (`ALTER TABLE ADD COLUMN` only).
- A CI job called `migration-lint` fails PRs with `DROP COLUMN` or `DROP TABLE`.

---

## 🧾 Environment & Deploys

### Local Env

Use `.env.example` as a reference.

```bash
cp .env.example .env
```

### Deployment Checklist

See `DEPLOY_CHECKLIST.md` for:

- required environment variables
- Prisma migration commands
- Vercel/production settings
- rollback plan

---

## 🧠 Coding Standards

### TypeScript

- Use strict mode (`"strict": true` in tsconfig).
- Prefer explicit types for function returns.
- No `any` unless you annotate why (`// TODO: refine type`).

### Linting

Run `npm run lint` before every commit.
Use Prettier for formatting.

### Commits

Follow Conventional Commits:

```text
type(scope?): message
```

Examples:

```text
feat(chat): add message schema validation
fix(api): correct booking status check
```

---

## 🧩 Database & Migrations

### Market / Chat DB

- Run `npx prisma migrate dev` locally to apply schema changes.
- Commit generated migration files.
- CI validates schema with `npx prisma validate`.

### Captain DB

- Additive migrations only.
- To deprecate a column, mark it in docs but don't drop it.

---

## 🪶 Event Schemas (@fishon/schemas)

Shared runtime/compile-time validation for event payloads (Zod).
Used by Market, Captain, and Chat services.

Install:

```bash
npm i git+https://github.com/yourorg/fishon-schemas.git
```

Usage:

```typescript
import { BookingPayload } from "@fishon/schemas";
const parsed = BookingPayload.safeParse(payload);
if (!parsed.success) console.error(parsed.error);
```

---

## 🔐 Secrets Management

- Never commit `.env` files.
- Use GitHub Encrypted Secrets for workflows.
- Use Vercel / Neon / Supabase environment settings for production.

---

## 🔭 Observability

- Sentry or similar is integrated for runtime errors.
- Log structured JSON (with `trace_id`, `user_id`).
- Avoid printing raw secrets in logs.

---

## 🧹 Cleanup & Housekeeping

### Dependabot

Auto-opens PRs weekly for dependency updates.
Label: `dependencies`.

### Backups

Each database has its own backup schedule (daily + WAL retention).
See `DOCS/DB_ARCHITECTURE.md` for policies.

---

## 🗓 Release Rhythm

- Merge small, frequent PRs.
- Tag releases:

```bash
git tag -a v1.2.0 -m "Release notes"
git push origin v1.2.0
```

- Production deploys happen automatically on merge to `main` (Vercel / Docker).

---

## 🧩 Learning Path

| Skill         | Goal          | Learn by doing                   |
| ------------- | ------------- | -------------------------------- |
| GitHub Issues | Track work    | Create one for each task         |
| Pull Requests | Code review   | Open PRs early                   |
| Workflows     | Automation    | Add a new YAML step              |
| Prisma        | DB migrations | Run local `migrate dev`          |
| Events        | Cross-service | Use `@fishon/schemas` validators |

---

## 🏁 Definition of Done

- Code builds and passes CI.
- Tests green.
- Docs updated.
- Migrations applied successfully.
- PR merged → Issue closed → Board moved to Done.

---

## 🐛 Reporting Bugs

1. Create an issue using Bug Report template.
2. Include reproduction steps and expected vs actual behavior.
3. Label `bug`, `priority:medium`.
4. Assign to dev or Copilot.

---
