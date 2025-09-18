import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

// --- SEO metadata ---
export const metadata: Metadata = {
  title: "About Us | FishOn.my",
  description:
    "FishOn.my is Malaysia’s #1 fishing charter booking platform — built by anglers, for anglers. Discover our mission, safety standards, captain verification, awards, and roadmap.",
  alternates: {
    canonical: "https://www.fishon.my/about",
  },
  openGraph: {
    title: "About FishOn.my",
    description:
      "Plan, book, and go fishing — safer and easier. Learn how we connect anglers and captains across Malaysia.",
    url: "https://www.fishon.my/about",
    siteName: "FishOn.my",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About FishOn.my",
    description:
      "Malaysia’s #1 fishing charter booking platform — built by anglers, for anglers.",
  },
};

// --- Structured data (JSON-LD) ---
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FishOn.my",
  url: "https://www.fishon.my",
  slogan: "Plan, Book & Go Fishing.",
  sameAs: [
    "https://www.facebook.com/fishon.my",
    "https://www.instagram.com/fishon.my",
  ],
  brand: {
    "@type": "Brand",
    name: "FishOn",
    logo: "/favicon.ico",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@fishon.my",
      availableLanguage: ["en", "ms"],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />

        {/* Hero */}
        <section className="mb-14">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            About <span className="text-[#EC2227]">FishOn.my</span>
          </h1>
          <p className="mt-4 text-base/7 text-neutral-600">
            FishOn.my is Malaysia’s #1 online platform for fishing charter
            bookings, connecting anglers with verified captains and boats across
            the country — from the East Coast to Sabah &amp; Sarawak. We
            simplify discovery, scheduling, and payments so you can focus on the
            one thing that matters: a memorable day on the water.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Founded" value="2025" />
            <Stat label="Focus" value="Malaysia, expanding regionally" />
            <Stat label="Tagline" value="Plan, Book &amp; Go Fishing." />
          </div>
        </section>

        {/* Mission & Why we exist */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold tracking-tight">Our Mission</h2>
          <p className="mt-3 text-neutral-700">
            We’re building a safer, more transparent, and more professional
            fishing ecosystem. Historically, booking a charter relied on
            word-of-mouth, scattered social posts, and slow messaging threads —
            often leading to unclear pricing, double bookings, or last‑minute
            cancellations. FishOn.my brings everything together in one reliable
            place.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card title="What we solve">
              <ul className="list-disc pl-5 space-y-2">
                <li>Limited visibility of great spots and captains.</li>
                <li>Slow or inconsistent communication.</li>
                <li>No centralized calendar — risk of double booking.</li>
                <li>Payment uncertainty and refund confusion.</li>
                <li>
                  Lack of standardised information on price, packages &amp;
                  facilities.
                </li>
              </ul>
            </Card>
            <Card title="How we solve it">
              <ul className="list-disc pl-5 space-y-2">
                <li>Unified search across locations and techniques.</li>
                <li>Complete charter profiles with verified documents.</li>
                <li>Real‑time availability &amp; booking calendar.</li>
                <li>Secure, streamlined payments.</li>
                <li>Ratings &amp; reviews to build trustworthy reputations.</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* How FishOn works */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold tracking-tight">
            How FishOn Works
          </h2>
          <ol className="mt-4 grid gap-6 sm:grid-cols-3">
            <Step num="01" title="Discover">
              Browse charters by location, target species, boat type, and
              budget. Save your favourites for quick access later.
            </Step>
            <Step num="02" title="Book">
              See real‑time availability, choose add‑ons (gear, bait, meal), and
              confirm with secure payment.
            </Step>
            <Step num="03" title="Go Fishing">
              Chat with your captain, get directions to the jetty, and enjoy the
              trip. Leave a review to help the community.
            </Step>
          </ol>
        </section>

        {/* Safety & Captain Verification */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold tracking-tight">
            Safety First
          </h2>
          <p className="mt-3 text-neutral-700">
            Angler safety is our top priority. Captains and operators on
            FishOn.my go through a verification process before listings go live.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card title="Verification may include">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Seafarer ID / Boat Registration Certificate (for maritime
                  charters).
                </li>
                <li>SSM / Business Registration and insurance policy.</li>
                <li>
                  Supporting certifications (CPR/First Aid, IGFA Captain,
                  permits).
                </li>
                <li>
                  Proof of vessel ownership/permission and relevant licenses.
                </li>
              </ul>
            </Card>
            <Card title="On‑trip conduct">
              <ul className="list-disc pl-5 space-y-2">
                <li>Safety briefings and adherence to local regulations.</li>
                <li>Weather &amp; sea condition checks prior to departure.</li>
                <li>Well‑maintained vessels and safety equipment onboard.</li>
                <li>Professional crew conduct and responsible angling.</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* For Captains */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold tracking-tight">
            For Captains &amp; Operators
          </h2>
          <p className="mt-3 text-neutral-700">
            FishOn.my helps you fill your calendar and reduce admin — so you can
            focus on delivering great trips.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <Benefit title="Wider Exposure">
              Reach anglers nationwide and visiting tourists via web and social.
            </Benefit>
            <Benefit title="Systematic Bookings">
              Centralised calendar reduces clashes and protects your time.
            </Benefit>
            <Benefit title="Marketing Support">
              We amplify your listing with content, ads and campaign placements.
            </Benefit>
            <Benefit title="Safer Payments">
              Clear, secure flows that increase trust and professionalism.
            </Benefit>
            <Benefit title="Reputation &amp; Reviews">
              Build a public track record that converts more bookings.
            </Benefit>
            <Benefit title="Long‑term Opportunities">
              Collaborate with events, brands and travel partners.
            </Benefit>
          </div>
        </section>

        {/* Recognition */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold tracking-tight">
            Badges &amp; Awards
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Card title="Angler’s Choice Badge">
              <p>
                Monthly recognition for captains who consistently deliver
                exceptional service and high ratings. Awarded badges appear on
                listings to signal quality at a glance.
              </p>
            </Card>
            <Card title="Best Spot / Location Award">
              <p>
                Periodic grants for top captains within a location to upgrade
                service quality — assessed every six months.
              </p>
            </Card>
          </div>
        </section>

        {/* Pricing models for captains */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold tracking-tight">
            Flexible Partnership Options
          </h2>
          <p className="mt-3 text-neutral-700">
            Choose the plan that aligns with your goals. You can change plans
            anytime.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Plan
              rate="10% commission"
              summary="For established captains who only need incremental bookings."
              features={[
                "Listing & 24/7 support",
                "Real‑time calendar & reviews",
                "Direct chat with clients",
                "Performance tools & basic ads",
              ]}
            />
            <Plan
              rate="20% commission"
              summary="For competitive locations — more visibility and conversion."
              features={[
                "Everything in 10%",
                "Top Listing Optimisation",
                "Charter Ads placements",
                "Multi‑channel ad campaigns",
              ]}
              highlight
            />
            <Plan
              rate="30% commission"
              summary="For new captains in hot markets who want to maximise demand."
              features={[
                "Everything in 20%",
                "Monthly video ad shoots",
                "Extra campaign budgets",
                "Concierge growth support",
              ]}
            />
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold tracking-tight">Roadmap</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card title="Phase 1 — Launch &amp; Core Experience">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Marketing rollout and app integrations for seamless access.
                </li>
                <li>Real‑time booking calendar to prevent double bookings.</li>
                <li>Add‑ons at checkout: meals, rod rental, bait.</li>
                <li>Nearby tackle shop recommendations.</li>
              </ul>
            </Card>
            <Card title="Phase 2 — Growth &amp; Diversification">
              <ul className="list-disc pl-5 space-y-2">
                <li>Tackle marketplace integration.</li>
                <li>Charter + accommodation bundles.</li>
                <li>
                  New categories: house raft &amp; kelong, kayak, jetski,
                  cruise.
                </li>
                <li>International categories: Fly, Ice &amp; Spear fishing.</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Team */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold tracking-tight">Team</h2>
          <p className="mt-3 text-neutral-700">
            A multidisciplinary crew of anglers, technologists and creators.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <TeamCard name="Fais Faudzi" role="Managing Director" />
            <TeamCard name="Azam Shah" role="Operation Manager" />
            <TeamCard name="Ismail Bob Hasim" role="Marketing Director" />
            <TeamCard name="Farhan" role="Branding Operation" />
            <TeamCard name="Jang" role="Platform Manager" />
            <TeamCard name="Shafiq Jalil" role="Public Relation" />
            <TeamCard name="Adib Zulhatta" role="Head of Finance" />
            <TeamCard name="FZ" role="Customer Support" />
          </div>
        </section>

        {/* Call to action */}
        <section className="mb-6 rounded-lg border border-neutral-200 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Work With Us
          </h2>
          <p className="mt-3 text-neutral-700">
            Whether you’re an angler planning your next trip or a captain ready
            to grow, we’d love to help.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/charters"
              className="inline-flex items-center rounded-md bg-[#EC2227] px-4 py-2 text-white shadow hover:opacity-95"
            >
              Browse Charters
            </a>
            <a
              href="/captains/apply"
              className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 hover:bg-neutral-50"
            >
              List Your Charter
            </a>
            <a
              href="mailto:hello@fishon.my"
              className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 hover:bg-neutral-50"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ---------- Small UI building blocks ---------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <p className="text-sm text-neutral-600">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 text-neutral-700">{children}</div>
    </div>
  );
}

function Step({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative rounded-xl border border-neutral-200 p-5">
      <span className="absolute -top-3 left-5 inline-flex items-center justify-center rounded-full bg-[#EC2227] px-2 py-1 text-xs font-semibold text-white">
        {num}
      </span>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-neutral-700">{children}</p>
    </li>
  );
}

function Benefit({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-neutral-700">{children}</p>
    </div>
  );
}

function Plan({
  rate,
  summary,
  features,
  highlight = false,
}: {
  rate: string;
  summary: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex flex-col rounded-xl border p-6",
        highlight
          ? "border-[#EC2227] ring-2 ring-[#EC2227]/10"
          : "border-neutral-200",
      ].join(" ")}
    >
      <p className="text-sm font-medium text-[#EC2227]">{rate}</p>
      <p className="mt-1 text-base font-semibold">{summary}</p>
      <ul className="mt-4 list-disc pl-5 text-neutral-700 space-y-2">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}

function TeamCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 p-4">
      <div
        className="h-12 w-12 shrink-0 rounded-full bg-neutral-200"
        aria-hidden
      />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-neutral-600">{role}</p>
      </div>
    </div>
  );
}
