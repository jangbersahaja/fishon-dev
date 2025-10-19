# Fishon Development Guide

## Purpose & App Structure

This is the main environment for Fishon E-commerce Website, serving as an online booking platform that connects anglers (customers) with captains and charter operators. Previously, this app was the only entity. Now, Fishon is split into two apps:

- **Fishon.my (this app)**: Acts as the front-end marketplace where anglers find and book fishing trips/charters. All booking transactions happen here.
- **Fishon Captain (fishon-captain.vercel-app)**: A separate management app for captains/charter operators. It handles captain/charter registration, editing, dashboard, and staff/admin management.

## What's Next

- Remove captain registration section from Fishon.my (this app), as registration is now handled by Fishon Captain.
- Add anglers registration to Fishon.my.
- Remove dependency on dummy charter and transaction data; start using real data from the Fishon Captain backend.
- Sync features between both apps to serve both anglers and captains efficiently.

## Project Overview

Fishon.my is Malaysia's first fishing charter booking platform built with Next.js 15, Prisma, and PostgreSQL. The app connects fishing enthusiasts with charter boat captains across Malaysia.

## Architecture & Patterns

### Core Structure

- **Next.js App Router**: All routes in `src/app/` with nested layouts
- **Database**: Prisma ORM with PostgreSQL, singleton client at `src/lib/prisma.ts`
- **Forms**: React Hook Form + Zod validation (see `captains/register/_components/form/`)
- **Components**: Shared UI in `src/components/`, feature-specific in route folders
- **Mock Data**: Rich dummy data in `src/dummy/` for development and prototyping

### Key Conventions

#### Form Architecture Pattern

Complex forms follow a structured pattern (see `captains/register/`):

```
_components/form/
├── charterForm.schema.ts    # Zod validation schemas
├── charterForm.defaults.ts  # Default form values
├── charterForm.draft.ts     # Draft persistence logic
├── constants.ts             # Shared constants & styles
├── types.ts                 # TypeScript definitions
├── utils.ts                 # Form utilities
├── components/              # Reusable form components
├── steps/                   # Multi-step form sections
└── hooks/                   # Form-specific hooks
```

#### Server Actions Pattern

Server actions in `actions.ts` files handle form submissions and database operations:

- Use `"use server"` directive
- Import Prisma client from `src/lib/prisma.ts`
- Include `revalidatePath()` after mutations
- Define TypeScript types for complex data structures

#### Database Patterns

- Models: `User`, `CaptainProfile`, `Charter`, `Boat`, `Trip`, etc.
- Use `cuid()` for IDs, relations via foreign keys
- Enums for `CharterPricingPlan`, `CharterStyle`, `MediaKind`
- Geolocation stored as `Decimal` latitude/longitude

#### Component Patterns

- Use `SafeImage` component for external images with fallbacks
- `StarRating` component for review displays
- Location data normalized via `destinationAliases.ts`
- Google Maps integration with `MapScriptLoader` component

### Development Workflow

#### Environment Setup

```bash
# Copy environment template (user must create this)
cp .env.example .env

# Database operations
npm run prisma:migrate -- --name "your_migration_name"
npm run prisma:generate
npm run dev  # Uses --turbopack for faster builds
```

#### Key Scripts

- `npm run dev` - Development with Turbopack
- `npm run build` - Production build with Turbopack
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client

### Malaysia-Specific Context

- **Locations**: Focus on Selangor fishing spots (Klang, Port Klang, Kuala Selangor)
- **Pricing**: All prices in Malaysian Ringgit (RM)
- **Species**: Local fish species in dummy data (e.g., Siakap, Ikan Merah)
- **Geographic**: Coordinates for Malaysian waters, state/district structure

### Integration Points

- **Google Maps**: API key in `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Images**: Unsplash integration configured in `next.config.ts`
- **Database**: PostgreSQL via `DATABASE_URL` environment variable
- **Deployment**: Vercel-optimized with Prisma migrate in build process

### Critical Files

- `src/lib/prisma.ts` - Database client singleton
- `src/dummy/charter.ts` - Comprehensive mock data (2500+ lines)
- `prisma/schema.prisma` - Database schema and relationships
- `src/app/layout.tsx` - Global layout with SEO metadata
- `src/utils/destinationAliases.ts` - Location search normalization

### Common Tasks

- **New Charter Types**: Add to Prisma enums and update form schemas
- **Location Features**: Extend `destinationAliases.ts` for search
- **Form Validation**: Follow Zod schema pattern in existing forms
- **UI Components**: Use shared styling constants from form `constants.ts`
- **Database Changes**: Always run migrations, never edit migration files directly
