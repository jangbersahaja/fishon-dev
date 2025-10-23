````instructions
# Fishon.my Development Guide

## Purpose & App Structure

Fishon.my is the **customer-facing marketplace** where anglers discover, browse, and book fishing charters across Malaysia. This is one of three interconnected Fishon applications:

- **Fishon.my (this app)**: Public marketplace for anglers to find and book charters
- **Fishon Captain**: Management dashboard for captains/charter operators (registration, editing, analytics)
- **Fishon Video Worker**: External video normalization service

## Current Implementation Status

### ✅ Complete
- Direct database connection to fishon-captain via PostgreSQL view (`v_public_charters`)
- Fallback to fishon-captain Public API (`/api/public/charters`)
- **No dummy data** - all charter data comes from real backend
- Type definitions imported from `@fishon/ui` shared package
- Charter browsing, search, and detail pages

### 🚧 In Progress
- Angler registration and authentication
- Booking flow and payment integration
- Captain profile pages on marketplace

### 📋 Planned
- Reviews and ratings system
- Favorites/wishlist functionality
- Advanced filtering and sorting

## Architecture & Patterns

Built with Next.js 15 App Router. Follow `https://nextjs.org/docs/app/getting-started/project-structure` for structure guidance.

### Core Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (via fishon-captain database)
- **ORM**: Prisma (read-only connection to shared DB)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Type Safety**: TypeScript with strict mode
- **Shared Packages**:
  - `@fishon/ui` - Shared UI components and types (git package)
  - `@fishon/schemas` - Shared validation schemas (git package)

### Data Architecture

#### Data Sources (Priority Order)
1. **Direct DB Connection** (if `USE_CAPTAIN_DB=1` + `CAPTAIN_DATABASE_URL` set)
   - Reads from `v_public_charters` PostgreSQL view
   - View returns: `id` (text) and `charter` (jsonb)
   - Filters only active charters (`isActive = true`)

2. **fishon-captain Public API** (fallback)
   - Base URL: `FISHON_CAPTAIN_API_URL`
   - Endpoints: `/api/public/charters`, `/api/public/charters/:id`

3. **Error** - No dummy data fallbacks

#### Charter Data Service (`src/lib/charter-service.ts`)
```typescript
// Priority: DB → API → Error
getCharters()                    // Fetch all active charters
getCharterById(id)              // Fetch single charter
searchChartersByCriteria(...)   // Search with filters
getChartersByType(type)         // Filter by fishing type
getChartersByTechnique(tech)    // Filter by technique
```

#### Type Imports
```typescript
// Use shared package types
import type { Charter, Captain, Trip, Policies } from "@fishon/ui";

// TODO(@fishon/packages): When encountering shared code, add this comment
// to mark it for consolidation into the unified package
```

### Key Conventions

#### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/            # Shared React components
├── lib/                   # Utilities and services
│   ├── charter-service.ts    # Unified data fetching
│   ├── charter-adapter.ts    # Backend → Frontend conversion
│   ├── captain-api.ts        # API client
│   └── captain-db.ts         # Direct DB access
├── types/                 # TypeScript types (being phased out)
└── utils/                 # Helper functions
```

#### Component Patterns
- Import UI components from `@fishon/ui`: `BookingWidget`, `CaptainCard`, `AmenitiesCard`, etc.
- Use shadcn/ui for base components: `Button`, `Card`, `Dialog`, etc.
- Location data normalized via `destinationAliases.ts`
- Google Maps integration with `MapScriptLoader` component

#### Form Patterns
- React Hook Form + Zod validation
- Server actions with `"use server"` directive
- Include `revalidatePath()` after mutations

### Development Workflow

#### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Required environment variables:
# - DATABASE_URL (PostgreSQL connection)
# - CAPTAIN_DATABASE_URL (fishon-captain DB for direct access)
# - USE_CAPTAIN_DB=1 (enable direct DB connection)
# - FISHON_CAPTAIN_API_URL (fallback API endpoint)
# - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (Google Maps integration)

# Database operations
npm run prisma:migrate -- --name "your_migration_name"
npm run prisma:generate

# Development server
npm run dev  # Uses --turbopack for faster builds
```

#### Key Scripts

- `npm run dev` - Development with Turbopack
- `npm run build` - Production build with Turbopack
- `npm run typecheck` - TypeScript type checking
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

- `src/lib/charter-service.ts` - Unified charter data fetching service
- `src/lib/charter-adapter.ts` - Backend to frontend data conversion
- `src/lib/captain-api.ts` - fishon-captain API client
- `src/lib/captain-db.ts` - Direct database access via PostgreSQL view
- `src/lib/prisma.ts` - Database client singleton
- `prisma/schema.prisma` - Database schema and relationships
- `src/app/layout.tsx` - Global layout with SEO metadata
- `src/utils/destinationAliases.ts` - Location search normalization

### Common Tasks

- **Charter Data Fetching**: Use `charter-service.ts` functions, never bypass the service layer
- **New Components**: Check `@fishon/ui` first before creating local components
- **Location Features**: Extend `destinationAliases.ts` for search
- **Type Definitions**: Import from `@fishon/ui` or `@fishon/schemas`, mark shared code with `// TODO(@fishon/packages)`
- **Database Changes**: Always run migrations, never edit migration files directly

## Shared Package Strategy

### Current Packages
- **@fishon/ui**: Shared UI components and types (Charter, Captain, Trip, etc.)
- **@fishon/schemas**: Shared validation schemas (will be consolidated)

### Future: @fishon/packages
Plan to consolidate `@fishon/ui` and `@fishon/schemas` into a single `@fishon/packages` monorepo containing:
- Components (React UI components)
- Types (TypeScript definitions)
- Schemas (Zod validation)
- Lib (Utility functions, formatters)
- Data (Static data like amenities, species)

### Implementation Guidelines
1. **When Encountering Shared Code**: Add a TODO comment to mark for consolidation
   ```typescript
   // TODO(@fishon/packages): Move this to shared package
   ```

2. **Before Adding to Package**: Ensure code is:
   - Used in at least 2 apps (fishon-market, fishon-captain, or fishon-video-worker)
   - Stable and unlikely to change frequently per app
   - Properly typed with TypeScript
   - Has no app-specific dependencies

3. **Installation**: Always use git URL format for Vercel compatibility
   ```bash
   npm install git+https://github.com/jangbersahaja/fishon-ui#main
   ```

## Documentation

You must always follow the documentation instructions in `.github/documentation.instructions.md` when generating, reviewing, or updating documentation in this repository.

**CRITICAL**: Before creating ANY .md file in `/docs`:
1. Check if `.github/documentation.instructions.md` exists
2. Follow the naming convention: `{fix|feature|plan|design}-{area}-{topic}.md`
3. Include required YAML frontmatter (type, status, updated, feature, author)
4. ONE file per issue - no duplicate summaries/updates/final docs

**Example of what NOT to do**:
- ❌ Creating `FEATURE.md`, `FEATURE_SUMMARY.md`, `FEATURE_UPDATE.md`, `FEATURE_FINAL.md`
- ✅ Creating ONE file: `fix-location-image-mapping.md` with proper frontmatter.

**SUPER CRITICAL**: DO NOT create multiple files for a single issue. DO NOT create separate summary, update, and final documentation files. Create ONE file per issue with the appropriate type in the frontmatter.

**IMPORTANT**: Do not make mistake. Do not repeat mistakes.

## Terminal

You have access to a terminal where you can run commands. Follow instructions in `.github/terminal.instructions.md` when using the terminal.
````
