---
type: plan
status: proposed
updated: 2025-10-23
feature: File Structure Refactor
author: GitHub Copilot
---

# File Structure Analysis & Refactor Proposal

## Current Structure Analysis

### 📁 Current `/src/app` Structure

```
src/app/
├── (auth)/              ✅ Route group for auth (good!)
│   ├── login/
│   └── register/
├── about/               ✅ Public page
├── account/             ⚠️  Minimal account page (needs expansion)
│   ├── page.tsx
│   └── sign-out.tsx
├── admin/               ⚠️  Admin features (needs proper auth)
├── api/                 ✅ API routes
│   ├── auth/
│   ├── blog/
│   ├── bookings/
│   ├── debug-auth/
│   ├── dev/
│   ├── newsletter/
│   └── revalidate/
├── blog/                ✅ Blog with proper structure
│   ├── [slug]/
│   ├── category/
│   ├── search/
│   ├── tag/
│   ├── layout.tsx
│   └── page.tsx
├── book/                ⚠️  Book charter flow
├── booking/             ⚠️  View booking details
│   └── [id]/
├── categories/          ⚠️  Charter categories
├── charters/            ⚠️  Charter listings
│   └── view/
│       ├── [id]/
│       └── page.tsx
├── checkout/            ⚠️  Checkout flow
├── contact/             ✅ Contact page
├── dev/                 ✅ Dev tools
├── forgot-password/     ✅ Password reset
├── mybooking/           ❌ Should be /account/bookings
│   └── page.tsx
├── pay/                 ⚠️  Payment page
├── search/              ⚠️  Charter search
│   ├── category/
│   └── page.tsx
├── support/             ✅ Support page
├── layout.tsx           ✅ Root layout
└── page.tsx             ✅ Home page
```

### 🔍 Issues Identified

#### 1. **Inconsistent Naming**

- `mybooking` vs `booking` (confusing)
- `charters/view` (redundant path)
- Mixed use of singular/plural

#### 2. **Poor Grouping**

- Account-related pages scattered (`account`, `mybooking`)
- Charter-related pages split (`charters`, `book`, `categories`, `search`)
- No route groups for logical separation

#### 3. **Legacy Structure**

- `mybooking` should be nested under `/account`
- `charters/view/[id]` should be `charters/[id]`
- `pay` and `checkout` seem duplicative

#### 4. **Missing Organization**

- No `(dashboard)` route group for account pages
- No `(marketing)` route group for public pages
- No clear separation of concerns

### 📁 Current `/src` Supporting Directories

```
src/
├── aset/               ❌ Should be renamed to 'assets'
│   └── img/
├── components/         ⚠️  Needs reorganization
│   ├── auth/          ✅ Auth components
│   ├── blog/          ✅ Blog components
│   ├── charter/       ✅ Charter components
│   ├── maps/          ✅ Maps components
│   ├── ratings/       ✅ Ratings components
│   ├── search/        ✅ Search components
│   ├── ui/            ✅ UI primitives
│   ├── admin/         ✅ Admin components
│   └── *.tsx          ❌ Root-level components (should be organized)
├── lib/               ⚠️  Good structure, minor cleanup needed
│   ├── booking/
│   ├── data/
│   ├── destinations/
│   └── *.ts
├── utils/             ⚠️  Some overlap with lib
├── types/             ✅ Type definitions
├── config/            ✅ Configuration
├── dummy/             ⚠️  Should be lib/mock or lib/fixtures
└── middleware.ts      ⚠️  Duplicate (also exists in root)
```

---

## 🎯 Proposed New Structure

### Next.js 15 App Router Best Practices

Following Next.js conventions:

- Route groups `(name)` for logical organization without affecting URLs
- Colocation of related files
- Clear separation of concerns
- Consistent naming (plural for collections)

### 📁 Proposed `/src/app` Structure

```
src/app/
│
├── (auth)/                          # 🔐 Authentication pages (no layout)
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
│
├── (dashboard)/                     # 👤 User dashboard (shared layout)
│   ├── layout.tsx                   # Dashboard shell with sidebar
│   ├── account/
│   │   ├── page.tsx                 # Redirect to /account/overview
│   │   ├── overview/
│   │   │   └── page.tsx             # Dashboard home
│   │   ├── profile/
│   │   │   ├── page.tsx             # Personal information
│   │   │   ├── security/
│   │   │   │   └── page.tsx         # Password & MFA
│   │   │   └── preferences/
│   │   │       └── page.tsx         # Notification settings
│   │   ├── bookings/
│   │   │   ├── page.tsx             # All bookings list
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Booking detail
│   │   │       └── receipt/
│   │   │           └── route.ts     # PDF receipt generation
│   │   ├── trips/
│   │   │   ├── page.tsx             # All trips
│   │   │   ├── upcoming/
│   │   │   │   └── page.tsx
│   │   │   └── past/
│   │   │       └── page.tsx
│   │   ├── favorites/
│   │   │   └── page.tsx             # Saved charters
│   │   └── support/
│   │       └── page.tsx             # Help center
│   └── signout/
│       └── page.tsx                 # Sign out confirmation
│
├── (marketplace)/                   # 🎣 Public marketplace (shared layout)
│   ├── layout.tsx                   # Marketplace layout with navbar
│   ├── charters/
│   │   ├── page.tsx                 # Browse all charters
│   │   ├── [id]/
│   │   │   └── page.tsx             # Charter detail page
│   │   └── loading.tsx
│   ├── search/
│   │   ├── page.tsx                 # Search results
│   │   └── category/
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── categories/
│   │   ├── page.tsx                 # All categories
│   │   └── [slug]/
│   │       └── page.tsx             # Category page
│   ├── book/
│   │   └── [charterId]/
│   │       └── page.tsx             # Booking form
│   ├── checkout/
│   │   └── [bookingId]/
│   │       └── page.tsx             # Payment page
│   └── destinations/
│       └── [slug]/
│           └── page.tsx             # Destination page
│
├── (marketing)/                     # 📄 Marketing pages (minimal layout)
│   ├── layout.tsx                   # Simple layout
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── support/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   └── faq/
│       └── page.tsx
│
├── blog/                            # ✅ Keep current structure
│   ├── layout.tsx
│   ├── page.tsx
│   ├── [slug]/
│   │   └── page.tsx
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── tag/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── rss.xml/
│   │   └── route.ts
│   └── sitemap.xml/
│       └── route.ts
│
├── admin/                           # 🛡️ Admin panel (separate auth)
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── bookings/
│   │   └── page.tsx
│   └── users/
│       └── page.tsx
│
├── api/                             # 🔌 API routes
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts
│   ├── account/
│   │   ├── profile/
│   │   │   ├── route.ts             # Update profile
│   │   │   └── photo/
│   │   │       └── route.ts
│   │   ├── password/
│   │   │   └── change/
│   │   │       └── route.ts
│   │   ├── favorites/
│   │   │   ├── route.ts             # List/add favorites
│   │   │   └── [id]/
│   │   │       └── route.ts         # Remove favorite
│   │   ├── reviews/
│   │   │   ├── route.ts             # Create/list reviews
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── activity/
│   │       └── route.ts             # Login activity
│   ├── bookings/
│   │   ├── route.ts                 # Create booking
│   │   ├── [id]/
│   │   │   ├── route.ts             # Get/update booking
│   │   │   ├── approve/
│   │   │   │   └── route.ts
│   │   │   ├── reject/
│   │   │   │   └── route.ts
│   │   │   ├── cancel/
│   │   │   │   └── route.ts
│   │   │   └── pay/
│   │   │       └── route.ts
│   │   └── webhook/
│   │       └── route.ts
│   ├── charters/
│   │   ├── route.ts                 # List charters
│   │   └── [id]/
│   │       └── route.ts             # Get charter
│   ├── blog/
│   │   └── ...                      # Keep existing
│   ├── newsletter/
│   │   └── route.ts
│   ├── revalidate/
│   │   └── route.ts
│   └── dev/
│       └── ...                      # Dev tools
│
├── dev/                             # 🔧 Development pages
│   └── ...                          # Keep existing
│
├── layout.tsx                       # Root layout
├── page.tsx                         # Home/landing page
├── loading.tsx                      # Global loading
├── error.tsx                        # Global error
├── not-found.tsx                    # 404 page
└── globals.css
```

### 📁 Proposed `/src` Supporting Structure

```
src/
│
├── app/                             # Next.js App Router (above)
│
├── assets/                          # 🖼️ Static assets (renamed from aset)
│   ├── images/
│   │   ├── brand/                   # Logo, branding
│   │   ├── placeholders/            # Placeholder images
│   │   └── icons/                   # Icon files
│   └── fonts/                       # Custom fonts (if any)
│
├── components/                      # 🧩 React components
│   ├── account/                     # Dashboard components
│   │   ├── DashboardNav.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── BookingCard.tsx
│   │   ├── BookingTimeline.tsx
│   │   ├── TripCard.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── FavoriteButton.tsx
│   │   └── ReceiptGenerator.tsx
│   ├── auth/                        # Auth components
│   │   ├── AuthModal.tsx
│   │   ├── AuthModalContext.tsx
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── booking/                     # Booking components
│   │   ├── BookingForm.tsx
│   │   ├── BookingStatus.tsx
│   │   └── BookingSummary.tsx
│   ├── charter/                     # Charter detail components
│   │   ├── AboutSection.tsx
│   │   ├── AmenitiesCard.tsx
│   │   ├── BoatCard.tsx
│   │   ├── BookingWidget.tsx
│   │   ├── CaptainSection.tsx
│   │   ├── CharterGallery.tsx
│   │   ├── GuestFeedbackPanel.tsx
│   │   ├── LocationMap.tsx
│   │   ├── PoliciesInfoCard.tsx
│   │   ├── ReviewsList.tsx
│   │   ├── SpeciesTechniquesCard.tsx
│   │   └── Stars.tsx
│   ├── charters/                    # Charter list components
│   │   ├── CharterCard.tsx
│   │   ├── CharterGrid.tsx
│   │   └── CharterFilters.tsx
│   ├── search/                      # Search components
│   │   ├── SearchBox.tsx
│   │   ├── FiltersBar.tsx
│   │   └── SearchResults.tsx
│   ├── marketing/                   # Landing page components
│   │   ├── HeroWallpaper.tsx
│   │   ├── PopularDestination.tsx
│   │   ├── LatestTrip.tsx
│   │   └── CategoryCard.tsx
│   ├── blog/                        # Blog components
│   │   └── ...
│   ├── maps/                        # Map components
│   │   └── ...
│   ├── ratings/                     # Rating components
│   │   └── ...
│   ├── admin/                       # Admin components
│   │   └── ...
│   ├── layout/                      # Layout components
│   │   ├── Navbar.tsx
│   │   ├── SiteHeader.tsx
│   │   ├── Footer.tsx
│   │   └── Chrome.tsx
│   ├── ui/                          # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── providers/                   # Context providers
│   │   ├── SessionProvider.tsx
│   │   └── ...
│   └── shared/                      # Shared utilities
│       ├── SafeImage.tsx
│       ├── CalendarPicker.tsx
│       └── ...
│
├── lib/                             # 🛠️ Business logic & utilities
│   ├── auth/
│   │   ├── auth.ts                  # Auth utility functions
│   │   ├── auth-options.ts          # NextAuth config
│   │   └── password.ts              # Password utilities
│   ├── booking/
│   │   └── ...                      # Booking logic
│   ├── charter/
│   │   ├── charter-service.ts       # Charter data service
│   │   ├── charter-adapter.ts       # Backend adapter
│   │   └── ...
│   ├── blog/
│   │   └── blog-service.ts
│   ├── email/
│   │   └── email.ts
│   ├── payment/
│   │   └── ...                      # Payment logic (future)
│   ├── database/
│   │   ├── prisma.ts                # Prisma client
│   │   └── prisma-captain.ts
│   ├── api/
│   │   ├── captain-api.ts           # Captain app API client
│   │   └── captain-db.ts            # Direct DB access
│   ├── helpers/
│   │   ├── image-helpers.ts
│   │   ├── popularity-helpers.ts
│   │   ├── city-district-mapping.ts
│   │   └── ...
│   └── webhooks/
│       ├── webhook.ts
│       └── social-webhook.ts
│
├── features/                        # 🎯 Feature modules (future)
│   ├── account/
│   ├── booking/
│   └── charter/
│
├── hooks/                           # 🪝 Custom React hooks
│   ├── useAuth.ts
│   ├── useBooking.ts
│   ├── useCharter.ts
│   └── ...
│
├── config/                          # ⚙️ Configuration
│   ├── site.ts                      # Site metadata
│   ├── designTokens.ts              # Design system
│   └── constants.ts                 # App constants
│
├── types/                           # 📝 TypeScript types
│   ├── charter.ts
│   ├── booking.ts
│   ├── user.ts
│   ├── next-auth.d.ts
│   ├── images.d.ts
│   └── window.d.ts
│
├── utils/                           # 🔧 Pure utility functions
│   ├── formatting.ts                # Date, price formatting
│   ├── validation.ts                # Input validation
│   ├── destinationAliases.ts
│   ├── mapItems.ts
│   └── ratings.ts
│
├── data/                            # 📊 Static data & fixtures
│   ├── destinations/
│   ├── categories/
│   └── mock/                        # Mock data (renamed from dummy)
│       ├── blog.ts
│       ├── charter.ts
│       ├── destination.ts
│       └── receipts.ts
│
├── styles/                          # 🎨 Global styles (optional)
│   └── ...
│
└── middleware.ts                    # ✅ Keep at root
```

---

## 🔄 Migration Plan

### Phase 1: Create New Structure (No Breaking Changes)

**Goal:** Set up new directories and route groups without affecting existing functionality

**Steps:**

1. **Create Route Groups**

   ```bash
   mkdir -p src/app/\(auth\)
   mkdir -p src/app/\(dashboard\)
   mkdir -p src/app/\(marketplace\)
   mkdir -p src/app/\(marketing\)
   ```

2. **Create Dashboard Layout**

   ```bash
   mkdir -p src/app/\(dashboard\)/account/{overview,profile,bookings,trips,favorites,support}
   touch src/app/\(dashboard\)/layout.tsx
   ```

3. **Rename Assets**

   ```bash
   mv src/aset src/assets
   mv src/assets/img src/assets/images
   ```

4. **Reorganize Components**

   ```bash
   mkdir -p src/components/{account,booking,charters,marketing,layout,providers,shared}
   ```

5. **Create Hooks Directory**

   ```bash
   mkdir -p src/hooks
   ```

6. **Consolidate Data**

   ```bash
   mkdir -p src/data/mock
   mv src/dummy/* src/data/mock/
   ```

### Phase 2: Move Existing Pages

**Goal:** Migrate pages to new structure one by one

**Order of Migration:**

1. ✅ **Move Auth Pages** (no URL change due to route group)

   - `/login` → `/(auth)/login`
   - `/register` → `/(auth)/register`
   - `/forgot-password` → `/(auth)/forgot-password`

2. ✅ **Move Marketing Pages**

   - `/about` → `/(marketing)/about`
   - `/contact` → `/(marketing)/contact`
   - `/support` → `/(marketing)/support`

3. ⚠️ **Refactor Account Pages** (URL will change!)

   - `/account` → `/(dashboard)/account/overview`
   - `/mybooking` → `/(dashboard)/account/bookings` (REDIRECT OLD URL)

4. ⚠️ **Refactor Charter Pages**

   - `/charters/view` → `/(marketplace)/charters`
   - `/charters/view/[id]` → `/(marketplace)/charters/[id]`
   - `/book` → `/(marketplace)/book/[charterId]`
   - `/categories` → `/(marketplace)/categories`
   - `/search` → `/(marketplace)/search`

5. ⚠️ **Consolidate Checkout Flow**
   - Decide: Keep `/checkout` or `/pay` or merge both
   - Recommendation: `/(marketplace)/checkout/[bookingId]`

### Phase 3: Update Imports & References

**Goal:** Fix all import paths and internal links

**Files to Update:**

1. **Component Imports**

   ```typescript
   // Old
   import FishonLogo from "@/aset/img/fishonDP.png";

   // New
   import FishonLogo from "@/assets/images/brand/fishonDP.png";
   ```

2. **Link URLs**

   ```tsx
   // Old
   <Link href="/mybooking">My Bookings</Link>

   // New
   <Link href="/account/bookings">My Bookings</Link>
   ```

3. **API Routes**

   - Update API client imports
   - Update webhook URLs

4. **Middleware**

   ```typescript
   // Update middleware matchers for new routes
   export const config = {
     matcher: ["/admin/:path*", "/account/:path*"],
   };
   ```

### Phase 4: Add Redirects

**Goal:** Ensure old URLs redirect to new ones

**In `next.config.ts`:**

```typescript
async redirects() {
  return [
    {
      source: '/mybooking',
      destination: '/account/bookings',
      permanent: true,
    },
    {
      source: '/charters/view',
      destination: '/charters',
      permanent: true,
    },
    {
      source: '/charters/view/:id',
      destination: '/charters/:id',
      permanent: true,
    },
    {
      source: '/pay/:id',
      destination: '/checkout/:id',
      permanent: true,
    },
  ]
}
```

### Phase 5: Clean Up

**Goal:** Remove old files and unused code

1. Delete empty directories
2. Remove duplicate middleware
3. Clean up unused components
4. Update documentation

---

## 📋 Detailed File Moves

### Component Reorganization

```bash
# Root-level components → Organized folders
src/components/CharterCard.tsx           → src/components/charters/CharterCard.tsx
src/components/CharterCard copy.tsx      → DELETE (duplicate)
src/components/CategoryCard.tsx          → src/components/marketing/CategoryCard.tsx
src/components/HeroWallpaper.tsx         → src/components/marketing/HeroWallpaper.tsx
src/components/LatestTrip.tsx            → src/components/marketing/LatestTrip.tsx
src/components/PopularDestination.tsx    → src/components/marketing/PopularDestination.tsx
src/components/SearchBox.tsx             → src/components/search/SearchBox.tsx
src/components/FiltersBar.tsx            → src/components/search/FiltersBar.tsx
src/components/CalendarPicker.tsx        → src/components/shared/CalendarPicker.tsx
src/components/SafeImage.tsx             → src/components/shared/SafeImage.tsx

# Layout components
src/components/Navbar.tsx                → src/components/layout/Navbar.tsx
src/components/SiteHeader.tsx            → src/components/layout/SiteHeader.tsx
src/components/Footer.tsx                → src/components/layout/Footer.tsx
src/components/Chrome.tsx                → src/components/layout/Chrome.tsx

# Providers
src/components/SessionProvider.tsx       → src/components/providers/SessionProvider.tsx
```

### Lib Reorganization

```bash
# Auth
src/lib/auth.ts                          → src/lib/auth/auth.ts
src/lib/auth-options.ts                  → src/lib/auth/auth-options.ts
src/lib/password.ts                      → src/lib/auth/password.ts

# Database
src/lib/prisma.ts                        → src/lib/database/prisma.ts
src/lib/prisma-captain.ts                → src/lib/database/prisma-captain.ts

# API clients
src/lib/captain-api.ts                   → src/lib/api/captain-api.ts
src/lib/captain-db.ts                    → src/lib/api/captain-db.ts

# Charter
src/lib/charter-service.ts               → src/lib/charter/charter-service.ts
src/lib/charter-adapter.ts               → src/lib/charter/charter-adapter.ts

# Email
src/lib/email.ts                         → src/lib/email/email.ts

# Webhooks
src/lib/webhook.ts                       → src/lib/webhooks/webhook.ts
src/lib/social-webhook.ts                → src/lib/webhooks/social-webhook.ts

# Helpers
src/lib/image-helpers.ts                 → src/lib/helpers/image-helpers.ts
src/lib/popularity-helpers.ts            → src/lib/helpers/popularity-helpers.ts
src/lib/city-district-mapping.ts         → src/lib/helpers/city-district-mapping.ts
src/lib/ratings.ts                       → src/lib/helpers/ratings.ts
src/lib/tac.ts                           → src/lib/helpers/tac.ts

# Blog
src/lib/blog-service.ts                  → src/lib/blog/blog-service.ts

# Keep in lib root (move contents to subfolders)
src/lib/data/                            → src/data/
src/lib/destinations/                    → src/data/destinations/
```

### Utils to Hooks

```bash
# If these are hooks (use state/effects), move to hooks/
src/utils/useCharterDraft.ts             → src/hooks/useCharterDraft.ts (if it's a hook)

# If pure functions, keep in utils or move to lib
src/utils/destinationAliases.ts          → src/utils/destinationAliases.ts ✅
src/utils/mapItems.ts                    → src/utils/mapItems.ts ✅
src/utils/ratings.ts                     → src/utils/ratings.ts ✅
src/utils/reviewBadges.ts                → src/utils/reviewBadges.ts ✅
src/utils/captainFormData.ts             → src/data/captainFormData.ts (if static data)
```

### Dummy Data → Mock Data

```bash
src/dummy/blog.ts                        → src/data/mock/blog.ts
src/dummy/charter.ts                     → src/data/mock/charter.ts
src/dummy/destination.ts                 → src/data/mock/destination.ts
src/dummy/receipts.ts                    → src/data/mock/receipts.ts
```

---

## 🎯 Key Benefits

### 1. **Route Groups for Organization**

- `(auth)` - Auth pages share no layout, grouped logically
- `(dashboard)` - User account pages share dashboard layout
- `(marketplace)` - Charter browsing/booking share marketplace layout
- `(marketing)` - Static pages share minimal layout

### 2. **Colocation**

- Related components near their pages
- Easier to find and maintain
- Clear ownership

### 3. **Consistent Naming**

- Plural for collections: `/charters`, `/bookings`, `/categories`
- Singular for actions: `/book`, `/checkout`, `/login`
- Descriptive paths: `/account/bookings` vs `/mybooking`

### 4. **Scalability**

- Room for feature modules
- Clear API structure
- Easy to add new sections

### 5. **Better Developer Experience**

- Intuitive file locations
- Less cognitive load
- Easier onboarding

---

## ⚠️ Breaking Changes to Consider

### URL Changes

| Old URL               | New URL             | Need Redirect?   |
| --------------------- | ------------------- | ---------------- |
| `/mybooking`          | `/account/bookings` | ✅ YES           |
| `/charters/view`      | `/charters`         | ✅ YES           |
| `/charters/view/[id]` | `/charters/[id]`    | ✅ YES           |
| `/pay/[id]`           | `/checkout/[id]`    | ⚠️ DECIDE        |
| `/account`            | `/account/overview` | ⚠️ AUTO REDIRECT |

### Import Path Changes

All imports from moved files will need updating:

- `@/aset/img/*` → `@/assets/images/*`
- `@/dummy/*` → `@/data/mock/*`
- `@/lib/auth.ts` → `@/lib/auth/auth.ts`
- Root component imports → Organized paths

---

## 📝 Implementation Checklist

```markdown
### Phase 1: Setup (No Breaking Changes)

- [ ] Create route group directories
- [ ] Create new component subdirectories
- [ ] Create hooks directory
- [ ] Rename aset → assets
- [ ] Move dummy → data/mock

### Phase 2: Move Files

- [ ] Move auth pages to (auth)
- [ ] Move marketing pages to (marketing)
- [ ] Create dashboard layout
- [ ] Move account page to dashboard
- [ ] Create new account subdirectories
- [ ] Move mybooking to account/bookings
- [ ] Refactor charter pages to (marketplace)
- [ ] Organize component files
- [ ] Organize lib files

### Phase 3: Update References

- [ ] Update all import paths
- [ ] Update Link hrefs
- [ ] Update API route references
- [ ] Update middleware config
- [ ] Update asset imports

### Phase 4: Add Redirects

- [ ] Add redirects in next.config.ts
- [ ] Test all old URLs redirect correctly
- [ ] Update external links (if any)

### Phase 5: Test & Clean Up

- [ ] Run TypeScript type check
- [ ] Test all pages load
- [ ] Test all links work
- [ ] Delete old files
- [ ] Remove empty directories
- [ ] Update documentation

### Phase 6: Commit & Deploy

- [ ] Commit changes with detailed message
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor for issues
```

---

## 🚀 Next Steps

1. **Review this proposal** - Approve the new structure
2. **Choose migration approach:**
   - **Big Bang:** Migrate everything at once (risky, faster)
   - **Incremental:** Migrate section by section (safer, slower)
3. **Start with Phase 1** - Set up new directories
4. **Execute migrations** - Follow the checklist
5. **Test thoroughly** - Ensure nothing breaks

---

## 💡 Additional Recommendations

### 1. **Add More Page Types**

```
src/app/
├── loading.tsx              # Global loading state
├── error.tsx                # Global error boundary
├── not-found.tsx            # Custom 404 page
└── (dashboard)/
    └── loading.tsx          # Dashboard loading state
```

### 2. **Consider Feature Modules** (Future)

```
src/features/
├── account/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── booking/
└── charter/
```

### 3. **Improve Middleware**

```typescript
// Protect dashboard routes
export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
```

### 4. **Add Path Aliases**

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/config/*": ["./src/config/*"],
      "@/data/*": ["./src/data/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  }
}
```

---

## 📚 References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Redirects](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)

---

**Questions?**

1. Should we migrate `/pay` to `/checkout` or keep both?
2. Do we want to add feature modules now or later?
3. Should blog remain outside route groups or move to `(marketing)`?
4. Any specific concerns about URL changes?
