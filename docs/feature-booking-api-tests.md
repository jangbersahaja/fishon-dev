---
type: feature
status: draft
updated: 2025-10-20
feature: booking-tests
author: system
labels:
  - marketplace
  - testing
  - vitest
impact: low
version-introduced: 0.2.0
---

# Booking API Tests: Overlap Logic and Expiry

## Summary

This document describes the test setup and coverage for the booking API, focusing on:

- Unit validation of the multi-day overlap predicate, including start-time specific conflicts
- API-level tests for `POST /api/bookings/create` (validation and conflicts)
- API-level tests for `POST /api/bookings/expire` (secret header and expiry updates)

## What's in this plan

- [x] Configure Vitest runner with Node environment and path aliases
- [x] Fix PostCSS plugin config to avoid Vitest errors
- [x] Add unit test for overlap predicate
- [x] Add API tests for create route (auth, startTime requirement, success, conflict)
- [x] Add API tests for expire route (401 and success)
- [ ] Extract overlap predicate to shared util and reuse in route and tests (WIP)

## Implementation

### 1) Test Runner Setup

- Files:
  - `vitest.config.ts` — Node environment, TSX loader, `@/` alias
  - `postcss.config.mjs` — import `@tailwindcss/postcss` and export via variable to satisfy tooling
- `package.json` scripts:
  - `npm run test` → `vitest run`
  - `npm run test:watch` → `vitest`

### 2) Unit Test: Overlap Predicate

- File: `src/app/api/bookings/__tests__/create-route.test.ts`
- Covers cases:
  - No overlap on different days
  - Overlap on same day when not using startTimes
  - Multi-day range overlap logic
  - Start-time specific conflict when using startTimes
  - No conflict for different start times on the same day

### 3) API Tests: Create Route

- File: `src/app/api/bookings/__tests__/create-api.test.ts`
- Mocks:
  - `@/lib/auth` — returns session or null
  - `@/lib/prisma` — `booking.findMany`, `booking.create`
  - `@/lib/charter-service` — `getCharterById`
- Cases:
  - 401 when unauthenticated
  - 400 when `startTime` not provided for a trip that requires it
  - 201 on success, returns booking id
  - 409 on conflict when same time overlaps

### 4) API Tests: Expire Route

- File: `src/app/api/bookings/__tests__/expire-api.test.ts`
- Mocks:
  - `@/lib/prisma` — `booking.updateMany`
- Cases:
  - 401 when `x-expire-secret` missing/invalid
  - 200 on success with `{ expired: count }`

## How to run

```bash
# run once
npm run test

# watch mode
npm run test:watch
```

## Review Notes

- Tests avoid touching the real DB by mocking Prisma and services.
- Consider extracting the overlap predicate to `src/lib/booking/overlap.ts` for single-source-of-truth and import in both route and tests.

## Archive / Legacy Notes

- No prior automated tests existed for the booking API in this repo.
