---
type: plan
status: proposed
updated: 2025-10-23
feature: Angler Dashboard
author: GitHub Copilot
---

# Angler Dashboard - Strategic Plan

## Executive Summary

This document outlines a comprehensive plan to build a professional, trust-building angler dashboard for fishon-market. The dashboard will serve as the central hub for anglers to manage their profiles, bookings, and interactions with captains.

**Current State:** Basic `/account` page showing name, email, role + `/mybooking` page with simple booking list

**Proposed:** Full-featured dashboard with profile management, booking lifecycle, reviews, favorites, and support

## Goals & Success Metrics

### Primary Goals

1. **Build Trust**: Transparent booking management, clear status updates, and captain communication
2. **Increase Conversion**: Easy access to favorites and past charters for repeat bookings
3. **Reduce Support Burden**: Self-service profile management and clear booking information
4. **Encourage Reviews**: Seamless review flow after completed trips builds marketplace credibility

### Success Metrics

- **Engagement**: % of users who access dashboard within 7 days of booking
- **Retention**: Repeat booking rate from dashboard
- **Review Coverage**: % of PAID bookings that receive reviews
- **Support Reduction**: Decrease in booking status inquiries
- **Profile Completeness**: % of users with complete profiles (phone, address)

## Proposed Dashboard Structure

### URL Structure

```
/account                    → Dashboard home (redirect to /account/overview)
/account/overview           → Dashboard overview (summary cards)
/account/profile            → Profile management with tabs
/account/profile/personal   → Personal information
/account/profile/security   → Password & MFA
/account/profile/preferences → Notification settings
/account/bookings           → All bookings with filters
/account/bookings/[id]      → Booking detail page
/account/trips              → Confirmed trips (PAID status)
/account/trips/upcoming     → Future trips
/account/trips/past         → Completed trips (can review)
/account/favorites          → Saved charters
/account/support            → Help center & contact
```

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Angler Dashboard                          │
├─────────────────────────────────────────────────────────────┤
│  Overview | Bookings | Trips | Favorites | Profile | Support │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Feature Specifications

### 1. Dashboard Overview (`/account/overview`)

**Purpose:** At-a-glance view of account activity

**Components:**

- Welcome banner with user name
- Quick stats cards:
  - Pending bookings (action required)
  - Upcoming trips
  - Past trips
  - Favorite charters
- Recent activity timeline (last 5 items)
- Quick actions: "Book a charter", "View favorites", "Need help?"

**UI/UX:**

- Mobile-first responsive grid
- Status badges with color coding (pending=yellow, approved=green, paid=blue)
- Empty states with CTAs ("No bookings yet - explore charters!")

### 2. Profile Management (`/account/profile`)

**Tab Structure:**

#### 2.1 Personal Information Tab

**Fields:**

- Display name (editable)
- Email (display only, verified indicator)
- Phone number (editable with country code selector)
- Profile photo upload (optional)
- Address fields:
  - Street address
  - City
  - State/Province (dropdown - Malaysian states)
  - Postcode
  - Country (default: Malaysia)
- Emergency contact (optional):
  - Name
  - Phone
  - Relationship

**Data Model Update Required:**

```prisma
model User {
  // ... existing fields

  // New profile fields
  profilePhoto     String?
  streetAddress    String?
  city             String?
  state            String?
  postcode         String?
  country          String?  @default("Malaysia")
  emergencyName    String?
  emergencyPhone   String?
  emergencyRelation String?
}
```

**Validation:**

- Phone: International format with country code
- Email: Verified via email verification flow (future)
- Postcode: Malaysian format validation

**Trust Building:**

- Show profile completion percentage
- Explain why each field helps (e.g., "Address helps captains verify pickup locations")
- Privacy assurance badge ("Your information is only shared with confirmed bookings")

#### 2.2 Security Tab

**Features:**

- Change password (current + new + confirm)
- Password strength meter
- Last password change date
- Login activity log (last 5 logins with device/location)
- Two-Factor Authentication (MFA) - **Coming Soon placeholder**
  - "Protect your account with 2FA - Launching Q1 2026"
  - Email for waitlist notification

**Data Model:**

```prisma
model LoginActivity {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  ipAddress String
  userAgent String
  location  String?  // Parsed from IP
  loginAt   DateTime @default(now())

  @@index([userId, loginAt])
}
```

#### 2.3 Preferences Tab (Future Phase)

**Placeholder for:**

- Email notification settings
- SMS notifications (when implemented)
- Marketing preferences
- Language preference
- Currency preference (MYR default)

### 3. Bookings (`/account/bookings`)

**Features:**

- Tab filters:
  - All bookings
  - Pending (awaiting captain approval)
  - Approved (awaiting payment)
  - Rejected
  - Expired
- Search by charter name, location, or date
- Sort by: Date (newest/oldest), Status, Total price

**Booking Card Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ [Charter Name]                         [Status Badge]   │
│ [Location] • [Trip Type]                                │
│ 📅 [Date] • ⏱️ [Duration] • 👥 [Guests]                 │
│ 💰 RM [Total Price]                                     │
│                                                          │
│ [View Details] [Take Action Button based on status]     │
└─────────────────────────────────────────────────────────┘
```

**Status-Based Actions:**

- PENDING: "Waiting for captain..." + countdown timer to expiry
- APPROVED: "Pay Now" button (prominent, green)
- REJECTED: "Find similar charters" + show rejection reason
- EXPIRED: "Book again" button
- PAID: "View trip details" + "Contact captain"
- CANCELLED: "Book again" + show cancellation reason

**Trust Building:**

- Clear timeline visualization showing booking progress
- Expected response time messaging ("Captains typically respond within 6 hours")
- Automatic expiry countdown with notification

### 4. Booking Detail Page (`/account/bookings/[id]`)

**Sections:**

#### 4.1 Booking Summary

- Charter details with photos
- Trip details (type, duration, what's included)
- Date, time, guests
- Pricing breakdown
- Status timeline (visual progress bar)

#### 4.2 Payment Information (for APPROVED/PAID)

- Payment method (future: integrate payment gateway)
- Receipt download button (PDF)
- Invoice number
- Payment date

**Receipt Generation:**

- PDF template with FishOn branding
- Booking reference number
- Itemized breakdown
- Company details (for business expense claims)
- QR code with booking verification link

#### 4.3 Captain Information (for PAID bookings only)

- Captain name
- Photo
- Contact button (reveal phone/email after payment)
- Charter boat details
- Meeting point with map

#### 4.4 Cancellation Policy

- Display charter's cancellation terms
- Refund policy
- Cancel booking button (if eligible)
- Cancellation deadline countdown

#### 4.5 Actions Panel

- Status-dependent action buttons
- Download receipt
- Contact support
- Report issue

### 5. Trips (`/account/trips`)

**Purpose:** Focus on confirmed (PAID) bookings - the actual trips

**Tabs:**

- **Upcoming**: Future trips, sorted by date
- **Past**: Completed trips with review option

#### 5.1 Upcoming Trips View

**Features:**

- Trip countdown ("Departing in 5 days!")
- Weather forecast integration (future)
- Packing checklist reminder
- Add to calendar button (iCal/Google Calendar)
- Trip preparation tips
- Captain contact info (unhidden)

**Trip Card:**

```
┌─────────────────────────────────────────────────────────┐
│ 🎣 UPCOMING IN 5 DAYS                                   │
│                                                          │
│ [Charter Photo]                                          │
│ [Charter Name]                                           │
│ [Location]                                               │
│                                                          │
│ 📅 Nov 15, 2025 • 7:00 AM                               │
│ ⏱️ 8 hours • 👥 4 adults                                │
│                                                          │
│ 📍 Meeting Point: Port Klang Jetty                      │
│                                                          │
│ [View Details] [Contact Captain] [Add to Calendar]      │
└─────────────────────────────────────────────────────────┘
```

#### 5.2 Past Trips View

**Features:**

- Trip memories section (upload photos - future)
- Review prompt if not reviewed
- "Book again" quick action
- Download receipt

**Review Flow:**

- Star rating (1-5)
- Review categories:
  - Captain professionalism
  - Boat condition
  - Value for money
  - Overall experience
- Text review (optional)
- Photo upload (optional)
- Anonymous option checkbox

**Data Model:**

```prisma
model Review {
  id                    String   @id @default(cuid())
  bookingId             String   @unique
  booking               Booking  @relation(fields: [bookingId], references: [id])
  userId                String
  user                  User     @relation(fields: [userId], references: [id])

  charterIdcuid         String   // For aggregation on captain side

  // Ratings (1-5 scale)
  captainRating         Int
  boatRating            Int
  valueRating           Int
  overallRating         Int      // Average of above

  // Content
  reviewText            String?
  photos                String[] // Array of blob URLs
  isAnonymous           Boolean  @default(false)

  // Moderation
  isPublished           Boolean  @default(true)
  isFlagged             Boolean  @default(false)
  flagReason            String?

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([charterIdcuid, isPublished])
  @@index([userId])
  @@index([createdAt])
}
```

**Trust Building:**

- Show review impact: "Help future anglers make informed decisions"
- Badge for verified reviewer (must have completed trip)
- Review moderation for quality control

### 6. Favorites (`/account/favorites`)

**Features:**

- Grid/list view toggle
- Save charters for later
- Quick book button
- Remove from favorites
- Share favorite list (future)

**Data Model:**

```prisma
model Favorite {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  charterId   String   // Captain charter ID
  addedAt     DateTime @default(now())
  notes       String?  // User's private notes

  @@unique([userId, charterId])
  @@index([userId, addedAt])
}
```

**UI:**

- Heart icon on charter cards (filled = favorited)
- Favorite count on charter detail pages
- "Saved on [date]" timestamp
- Private notes field ("Great for family trips")

### 7. Support (`/account/support`)

**Sections:**

#### 7.1 Help Center

- FAQ accordion
- Common topics:
  - Booking process
  - Payment methods
  - Cancellation policy
  - Contact captain
  - Safety guidelines
  - Weather concerns

#### 7.2 Contact Support

- Contact form
- Email: <support@fishon.my>
- Response time expectation: "24 hours"
- Attach booking reference for faster resolution

#### 7.3 Resources

- Charter booking guide (PDF)
- Safety checklist
- What to bring
- Fishing tips for beginners
- Terms of service
- Privacy policy

## Trust-Building Strategy

### Transparency Principles

1. **Clear Communication**

   - Plain language explanations
   - Status updates via email + in-app notifications
   - Expected timelines for captain responses

2. **Security Indicators**

   - HTTPS everywhere
   - "Secure payment" badges
   - Data privacy assurances
   - Verified captain badges

3. **Social Proof**

   - Charter review ratings
   - Total bookings count
   - "Booked by X anglers this month"
   - Featured reviews

4. **Responsive Support**
   - Live chat (future)
   - WhatsApp support number
   - Quick response promise
   - Dedicated booking support

### Trust Elements to Implement

#### Visual Trust Indicators

- SSL certificate badge
- Payment partner logos (when integrated)
- Money-back guarantee seal (if applicable)
- "Safe booking" promise

#### Content Trust

- Captain verification process explanation
- Safety standards disclosure
- Insurance coverage information
- Refund policy clarity

#### Interactive Trust

- Real-time booking updates
- Captain response rate display
- Booking success rate statistics
- Customer testimonials

## Additional Features to Consider

### Phase 1 (MVP) - Q1 2026

✅ Dashboard overview  
✅ Profile management (personal info)  
✅ Bookings list with filters  
✅ Trip management  
✅ Favorites  
✅ Support center  
✅ PDF receipt generation

### Phase 2 - Q2 2026

- Review & rating system
- Photo uploads
- Login activity tracking
- Email notifications
- Address management

### Phase 3 - Q3 2026

- Two-factor authentication
- Calendar integration
- Weather forecast integration
- Trip memories/photos album
- Referral program
- Loyalty points

### Phase 4 - Q4 2026

- Live chat support
- Mobile app notifications
- Advanced search/filter
- Charter comparison tool
- Trip planning assistant

## Technical Implementation Plan

### Database Migrations Required

```prisma
// User profile extensions
model User {
  // ... existing fields

  profilePhoto      String?
  streetAddress     String?
  city              String?
  state             String?
  postcode          String?
  country           String?  @default("Malaysia")
  emergencyName     String?
  emergencyPhone    String?
  emergencyRelation String?

  favorites         Favorite[]
  reviews           Review[]
  loginActivity     LoginActivity[]
}

// New models
model Favorite {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  charterId  String
  notes      String?
  addedAt    DateTime @default(now())

  @@unique([userId, charterId])
  @@index([userId, addedAt])
}

model Review {
  id                String   @id @default(cuid())
  bookingId         String   @unique
  booking           Booking  @relation(fields: [bookingId], references: [id])
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  charterId         String

  captainRating     Int
  boatRating        Int
  valueRating       Int
  overallRating     Int
  reviewText        String?
  photos            String[]
  isAnonymous       Boolean  @default(false)
  isPublished       Boolean  @default(true)
  isFlagged         Boolean  @default(false)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([charterId, isPublished])
  @@index([userId])
}

model LoginActivity {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  ipAddress  String
  userAgent  String
  location   String?
  loginAt    DateTime @default(now())

  @@index([userId, loginAt])
}

// Update Booking model
model Booking {
  // ... existing fields
  review  Review?
}
```

### API Routes Required

```
POST   /api/account/profile/update          → Update profile
POST   /api/account/profile/photo            → Upload profile photo
POST   /api/account/password/change          → Change password
GET    /api/account/bookings                 → List bookings
GET    /api/account/bookings/[id]            → Get booking details
GET    /api/account/bookings/[id]/receipt    → Download receipt PDF
POST   /api/account/favorites/add            → Add to favorites
DELETE /api/account/favorites/[id]           → Remove favorite
GET    /api/account/favorites                → List favorites
POST   /api/account/reviews/create           → Submit review
GET    /api/account/reviews                  → List user reviews
GET    /api/account/activity                 → Get login activity
```

### Component Architecture

```
src/app/account/
├── layout.tsx                    → Dashboard shell with sidebar
├── page.tsx                      → Redirect to /account/overview
├── overview/
│   └── page.tsx                  → Dashboard home
├── profile/
│   ├── page.tsx                  → Personal info form
│   ├── security/page.tsx         → Password & MFA
│   └── preferences/page.tsx      → Notifications
├── bookings/
│   ├── page.tsx                  → Booking list
│   └── [id]/page.tsx             → Booking detail
├── trips/
│   ├── page.tsx                  → All trips
│   ├── upcoming/page.tsx         → Future trips
│   └── past/page.tsx             → Completed trips
├── favorites/
│   └── page.tsx                  → Saved charters
└── support/
    └── page.tsx                  → Help center

src/components/account/
├── DashboardNav.tsx              → Sidebar navigation
├── DashboardHeader.tsx           → Mobile header
├── ProfileForm.tsx               → Profile edit form
├── BookingCard.tsx               → Booking list item
├── BookingTimeline.tsx           → Status progress
├── TripCard.tsx                  → Trip display
├── ReviewForm.tsx                → Review submission
├── ReceiptGenerator.tsx          → PDF receipt
└── FavoriteButton.tsx            → Heart icon toggle
```

### Design System

**Colors:**

- Primary: #EC2227 (FishOn red)
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Info: #3B82F6 (Blue)
- Error: #EF4444 (Red)

**Status Colors:**

- PENDING: Yellow/Amber
- APPROVED: Green
- PAID: Blue
- REJECTED: Red
- EXPIRED: Gray
- CANCELLED: Gray

**Typography:**

- Headings: Inter, semibold
- Body: Inter, regular
- Monospace: JetBrains Mono (for booking IDs)

## Security Considerations

### Data Access Controls

- Users can only access their own data
- Server-side session validation on every request
- Row-level security checks in database queries

### Privacy

- Email/phone only visible to captains after payment
- Address only shared with confirmed bookings
- Review anonymity option
- GDPR-compliant data export/deletion

### Payment Security

- PCI DSS compliance (when payment integrated)
- No credit card storage on our servers
- Secure payment gateway integration
- Receipt encryption

## Performance Optimization

### Caching Strategy

- Static: Profile page structure
- ISR: Booking list (revalidate every 60s)
- Client: Favorites list (React Query)
- CDN: Profile photos, receipts

### Loading States

- Skeleton screens for lists
- Optimistic updates for favorites
- Progressive image loading
- Lazy load past trips

## Mobile Responsiveness

### Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-First Features

- Bottom navigation (mobile)
- Swipe gestures for status filters
- Pull-to-refresh
- Native share integration
- Add to calendar

## Analytics & Tracking

### Key Events to Track

- Dashboard view
- Profile completion rate
- Booking status checks
- Favorite additions
- Review submissions
- Support contact attempts
- Payment initiations

### Conversion Funnels

1. Dashboard → Browse → Book
2. Trip complete → Review submit
3. Past trip → Rebook
4. Favorite → Book

## Migration Strategy

### Existing Pages to Update

- `/account` → Redirect to `/account/overview`
- `/mybooking` → Migrate to `/account/bookings`

### Data Migration

- No breaking changes to existing User/Booking models
- Add new fields with nullable constraints
- Backfill defaults where appropriate

### User Communication

- Email announcement of new dashboard
- In-app tutorial on first visit
- Changelog blog post
- Video walkthrough

## Success Criteria

### Launch Criteria (MVP)

- [ ] All dashboard pages functional
- [ ] Mobile responsive design
- [ ] PDF receipt generation working
- [ ] Profile updates persist correctly
- [ ] Booking status accurate
- [ ] Support form delivers emails
- [ ] No critical security vulnerabilities
- [ ] Page load < 3s on 3G
- [ ] 95%+ uptime in staging

### Post-Launch Metrics (30 days)

- 60%+ of users visit dashboard
- 40%+ complete profile information
- 20%+ add charters to favorites
- 15%+ of completed trips receive reviews
- <5% support tickets about booking status

## Recommendations Summary

### Must-Have Features (MVP)

1. ✅ Dashboard overview with quick stats
2. ✅ Profile management (personal info)
3. ✅ Bookings list with status filters
4. ✅ Booking detail with status timeline
5. ✅ PDF receipt generation
6. ✅ Trips page (upcoming/past)
7. ✅ Favorites system
8. ✅ Support center with FAQ

### High Priority (Phase 2)

1. Review & rating system
2. Email notifications
3. Login activity tracking
4. Enhanced security (password change)
5. Profile photo uploads

### Medium Priority (Phase 3)

1. Two-factor authentication
2. Calendar integration
3. Weather forecasts
4. Trip photo albums
5. Referral program

### Low Priority (Phase 4)

1. Live chat
2. Mobile app
3. Charter comparison
4. Trip planning tools

## Conclusion

This comprehensive dashboard strategy transforms fishon-market from a simple booking platform into a trusted, full-service angler experience hub. By prioritizing transparency, clear communication, and user empowerment, we build trust that drives repeat bookings and positive reviews.

The phased approach allows us to launch an MVP quickly while planning for long-term feature expansion based on user feedback and analytics.

**Next Steps:**

1. Review and approve this plan
2. Create detailed UI mockups
3. Prioritize Phase 1 features
4. Begin database schema migrations
5. Develop component library
6. Implement dashboard shell
7. Roll out features incrementally
8. Gather user feedback
9. Iterate and improve

---

**Questions for Discussion:**

1. Should we implement payment gateway in Phase 1 or Phase 2?
2. Do we want social login (Facebook, Apple) on profile page?
3. Should favorites be public or private?
4. What's the review moderation workflow?
5. Do we need booking insurance/protection plans?
