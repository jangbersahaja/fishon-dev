import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import type { Metadata } from "next";
import Link from "next/link";

/** SEO */
export const metadata: Metadata = {
  title: "Help Center | FishOn.my",
  description:
    "Answers for bookings, payments, cancellations, account management, and safety on FishOn.my.",
  alternates: { canonical: "https://www.fishon.my/help" },
  openGraph: {
    title: "Help Center | FishOn.my",
    description:
      "FAQs and guides for bookings, payments, captain onboarding, and safety.",
    url: "https://www.fishon.my/help",
    type: "website",
    siteName: "FishOn.my",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center | FishOn.my",
    description:
      "FAQs and guides for bookings, payments, captain onboarding, and safety.",
  },
};

const lastUpdated = "18 September 2025";

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,34,39,0.08),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <nav className="text-sm text-neutral-500">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-700">Help Center</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Help <span className="text-[#EC2227]">Center</span>
          </h1>
          <p className="mt-3 max-w-3xl text-neutral-700">
            Find quick answers, how-tos and policies. Still stuck? Our team is
            one click away.
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Last updated: {lastUpdated}
          </p>

          {/* Quick categories */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CategoryCard
              title="Getting Started"
              icon="🎣"
              href="#getting-started"
              items={["Create account", "Find a charter", "Make a booking"]}
            />
            <CategoryCard
              title="Account"
              icon="👤"
              href="#account"
              items={["Profile", "Password", "Notifications"]}
            />
            <CategoryCard
              title="Payments"
              icon="💳"
              href="#payments"
              items={["Methods", "Deposits", "Refunds"]}
            />
            <CategoryCard
              title="Safety"
              icon="🛟"
              href="#safety"
              items={["Captain verification", "Trip checklist", "Report issue"]}
            />
          </div>
        </div>
      </section>

      {/* Content with sticky TOC */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* TOC (sticky) */}
          <aside className="lg:block">
            <div className="sticky top-20 rounded-xl border border-neutral-200 p-4">
              <p className="text-sm font-semibold">On this page</p>
              <ul className="mt-3 space-y-2 text-sm">
                <TocItem href="#getting-started" label="Getting started" />
                <TocItem href="#account" label="Managing your account" />
                <TocItem href="#payments" label="Payments & refunds" />
                <TocItem href="#safety" label="Safety & verification" />
                <TocItem href="#faq" label="Top FAQs" />
              </ul>
              <a
                className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[#EC2227] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95"
                href="/contact"
              >
                Contact Support
              </a>
            </div>
          </aside>

          {/* Main */}
          <article className="prose max-w-none prose-neutral">
            <Section id="getting-started" title="Getting started">
              <h3 id="create-account" className="!mt-0">
                Create an account
              </h3>
              <p>
                Sign up with your email, verify it, and you’re ready to book
                trips.
              </p>
              <h3 id="search-charters">Find a charter</h3>
              <p>
                Filter by location, species, boat type, price, and available
                dates.
              </p>
              <h3 id="make-booking">Make a booking</h3>
              <p>
                Select a package, add gear/bait/meals, then confirm with secure
                checkout.
              </p>
            </Section>

            <Section id="account" title="Managing your account">
              <h3 id="update-profile" className="!mt-0">
                Profile
              </h3>
              <p>
                Keep name/phone up to date for smooth captain communication.
              </p>
              <h3 id="change-password">Password</h3>
              <p>
                Use a strong, unique passphrase. Reset anytime from “Forgot
                password”.
              </p>
              <h3 id="notifications">Notifications</h3>
              <p>
                We send essential trip updates; marketing emails are opt-in.
              </p>
            </Section>

            <Section id="payments" title="Payments & refunds">
              <h3 id="payment-methods" className="!mt-0">
                Accepted methods
              </h3>
              <p>
                Major cards and FPX/online banking (MY). Options appear at
                checkout.
              </p>
              <h3 id="cancellations">Deposits & cancellations</h3>
              <p>
                Policies vary by listing and conditions; see policy on each
                charter page.
              </p>
              <h3 id="refunds">Refund timeline</h3>
              <p>
                Approved refunds return to your original method in ~3–10
                business days.
              </p>
            </Section>

            <Section id="safety" title="Safety & verification">
              <h3 id="captain-verification" className="!mt-0">
                Captain verification
              </h3>
              <p>
                Captains upload licences/registration/insurance before listings
                go live.
              </p>
              <h3 id="safety-checklist">Trip checklist</h3>
              <ul>
                <li>Confirm jetty/time and weather updates.</li>
                <li>
                  Bring sun protection, water, and motion-sickness meds if
                  needed.
                </li>
                <li>
                  Follow safety briefing and crew instructions at all times.
                </li>
              </ul>
              <h3 id="report-issue">Report an issue</h3>
              <p>
                Share your booking reference at{" "}
                <a href="mailto:hello@fishon.my">hello@fishon.my</a> or{" "}
                <a href="/contact">Contact</a>.
              </p>
            </Section>

            {/* Top FAQs accordion */}
            <div id="faq" className="not-prose mt-12">
              <h2 className="text-2xl font-semibold">Top FAQs</h2>
              <div className="mt-4 divide-y rounded-xl border border-neutral-200">
                <Faq
                  q="Can I change my date after booking?"
                  a="Date changes depend on captain availability and the listing’s policy. Use your booking page or contact support."
                />
                <Faq
                  q="Do trips go out in bad weather?"
                  a="Safety first. Captains may reschedule or cancel according to sea conditions and local advisories."
                />
                <Faq
                  q="How do deposits work?"
                  a="Some listings require a deposit to secure your date. The policy is shown on the charter page and at checkout."
                />
                <Faq
                  q="What if my card is charged but I have no confirmation?"
                  a="Check spam/junk. If still missing after 10 minutes, contact us with the last four digits of the card and time of payment."
                />
              </div>
            </div>

            {/* CTA */}
            <div className="mt-14 rounded-xl border border-neutral-200 p-6">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Need personalised help?
                  </h3>
                  <p className="text-neutral-700">
                    Our team replies as fast as possible during business hours
                    (MYT).
                  </p>
                </div>
                <a
                  href="/contact"
                  className="inline-flex items-center rounded-md bg-[#EC2227] px-5 py-2.5 text-white shadow hover:opacity-95"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ---- UI bits ---- */
function CategoryCard({
  title,
  icon,
  href,
  items,
}: {
  title: string;
  icon: string;
  href: string;
  items: string[];
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-neutral-200 p-5 transition hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EC2227]/10">
          <span className="text-lg">{icon}</span>
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <ul className="mt-3 text-sm text-neutral-600 space-y-1">
        {items.map((i) => (
          <li key={i} className="truncate">
            {i}
          </li>
        ))}
      </ul>
      <span className="mt-3 inline-block text-sm font-medium text-[#EC2227]">
        Explore →
      </span>
    </a>
  );
}

function TocItem({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        className="text-neutral-700 hover:text-[#EC2227] hover:underline"
      >
        {label}
      </a>
    </li>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span className="font-medium">{q}</span>
        <span className="text-neutral-400 transition group-open:rotate-90">
          ›
        </span>
      </summary>
      <p className="mt-2 text-neutral-700">{a}</p>
    </details>
  );
}
