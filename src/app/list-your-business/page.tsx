import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "List Your Business — Fishon.my",
  description:
    "Get your fishing charter in front of Malaysian anglers. List with Fishon.my and start receiving bookings.",
  robots: { index: false, follow: false },
};

export default function ListYourBusinessPage() {
  return (
    <>
      <main className="min-h-dvh bg-[#ec2227] flex items-center justify-center p-6">
        <section className="w-full max-w-3xl mx-auto flex flex-col gap-10">
          {/* Why list with Fishon */}
          <section
            aria-labelledby="why-fishon"
            className="mt-8 rounded-3xl bg-white/80 p-6 md:p-8 shadow-xl border border-black/5"
          >
            <h2
              id="why-fishon"
              className="text-2xl font-extrabold tracking-tight"
            >
              Why list with Fishon?
            </h2>
            <p className="mt-2 text-black/70">
              We focus on Malaysian anglers and local charters — helping you
              appear in front of real customers who are ready to book.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-2xl">🎯</div>
                <h3 className="mt-2 font-semibold">Malaysia-first audience</h3>
                <p className="text-sm text-black/70">
                  Your listing reaches anglers searching by state, lake/river,
                  or offshore spots across Malaysia.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-2xl">📅</div>
                <h3 className="mt-2 font-semibold">
                  Booking calendar (coming soon)
                </h3>
                <p className="text-sm text-black/70">
                  Manage trip availability, block dates, and receive enquiries
                  in one place.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-2xl">📣</div>
                <h3 className="mt-2 font-semibold">Marketing boost</h3>
                <p className="text-sm text-black/70">
                  We promote destinations and seasonal trips via social &amp;
                  content — your trips get discovered.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-2xl">🧾</div>
                <h3 className="mt-2 font-semibold">Simple pricing</h3>
                <p className="text-sm text-black/70">
                  Start free with lead capture. Upgrade later for premium
                  placement and extra tools.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits to joining */}
          <section
            aria-labelledby="benefits"
            className="rounded-3xl bg-white/80 p-6 md:p-8 shadow-xl border border-black/5"
          >
            <h2
              id="benefits"
              className="text-2xl font-extrabold tracking-tight"
            >
              Benefits when you join
            </h2>
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-[#ec2227]" />
                <span>
                  <strong>Targeted leads:</strong> enquiries from anglers
                  looking for your exact trip type and location.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-[#ec2227]" />
                <span>
                  <strong>Flexible listing:</strong> add photos, trip types,
                  capacity, languages, and price ranges.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-[#ec2227]" />
                <span>
                  <strong>WhatsApp friendly:</strong> let customers contact you
                  using the channel you already use.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-[#ec2227]" />
                <span>
                  <strong>Local support:</strong> guidance on improving your
                  listing for Malaysian anglers.
                </span>
              </li>
            </ul>
          </section>

          {/* How it works */}
          <section
            aria-labelledby="how-it-works"
            className="rounded-3xl bg-white/80 p-6 md:p-8 shadow-xl border border-black/5"
          >
            <h2
              id="how-it-works"
              className="text-2xl font-extrabold tracking-tight"
            >
              How it works
            </h2>
            <ol className="mt-4 grid grid-cols-1 gap-4 text-sm text-black/80">
              <li className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="font-semibold">
                  1) Tell us about your charter
                </div>
                <p className="mt-1">
                  Share your location, boat/capacity, trip types and photos.
                </p>
              </li>
              <li className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="font-semibold">2) Go live to local anglers</div>
                <p className="mt-1">
                  We’ll review essentials and publish your page so anglers can
                  find you by state, lake/river or offshore.
                </p>
              </li>
              <li className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="font-semibold">3) Get enquiries & bookings</div>
                <p className="mt-1">
                  Manage leads via WhatsApp/phone/email. Calendar & online
                  booking tools are coming soon.
                </p>
              </li>
            </ol>
          </section>

          {/* Pricing */}
          <section
            aria-labelledby="pricing"
            className="rounded-3xl bg-white/80 p-6 md:p-8 shadow-xl border border-black/5"
          >
            <h2 id="pricing" className="text-2xl font-extrabold tracking-tight">
              Pricing
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-black/80">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="font-semibold">Free to list</div>
                <p className="mt-1">
                  Create your profile and appear in searches at no cost.
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="font-semibold">
                  Pay as you grow (coming soon)
                </div>
                <p className="mt-1">
                  Optional premium placement and tools. We’ll announce simple
                  Malaysia‑friendly pricing before launch.
                </p>
              </div>
            </div>
          </section>

          {/* Tools you get */}
          <section
            aria-labelledby="tools"
            className="rounded-3xl bg-white/80 p-6 md:p-8 shadow-xl border border-black/5"
          >
            <h2 id="tools" className="text-2xl font-extrabold tracking-tight">
              Tools you get
            </h2>
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-black/80">
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-[#ec2227]" />
                <span>
                  <strong>Showcase page:</strong> trips, photos, prices and
                  what’s included.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-[#ec2227]" />
                <span>
                  <strong>Lead capture:</strong> enquiries via WhatsApp, phone
                  or email.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-[#ec2227]" />
                <span>
                  <strong>Reviews:</strong> collect and display verified
                  customer feedback (coming soon).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-2 rounded-full bg-[#ec2227]" />
                <span>
                  <strong>Availability tools:</strong> booking calendar & date
                  blocks (coming soon).
                </span>
              </li>
            </ul>
          </section>

          {/* Trust & Safety + FAQ */}
          <section
            aria-labelledby="trust-faq"
            className="rounded-3xl bg-white/80 p-6 md:p-8 shadow-xl border border-black/5"
          >
            <h2
              id="trust-faq"
              className="text-2xl font-extrabold tracking-tight"
            >
              Trust &amp; FAQs
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <h3 className="font-semibold">Verified operators</h3>
                <p className="mt-1 text-sm text-black/80">
                  Basic checks help anglers book with confidence. We’ll guide
                  you on what to provide.
                </p>
              </div>
              <details className="rounded-2xl border border-black/10 bg-white p-4">
                <summary className="cursor-pointer font-semibold">
                  Do I need to pay to join?
                </summary>
                <p className="mt-1 text-sm text-black/80">
                  No. It’s free to create a listing. Optional paid features may
                  be offered later.
                </p>
              </details>
              <details className="rounded-2xl border border-black/10 bg-white p-4">
                <summary className="cursor-pointer font-semibold">
                  How will customers contact me?
                </summary>
                <p className="mt-1 text-sm text-black/80">
                  You can receive leads by WhatsApp, phone or email — set your
                  preference in the form.
                </p>
              </details>
              <details className="rounded-2xl border border-black/10 bg-white p-4">
                <summary className="cursor-pointer font-semibold">
                  Can I manage availability?
                </summary>
                <p className="mt-1 text-sm text-black/80">
                  Calendar and online booking tools are on the roadmap. For now,
                  manage dates directly with customers.
                </p>
              </details>
            </div>
          </section>

          <div className="rounded-3xl bg-white shadow-2xl border border-black/5 p-8 md:p-10">
            <header className="mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                List your business on Fishon
              </h1>
              <p className="mt-2 text-black/70">
                Tell us about your charter. We’ll follow up to verify details
                and help you go live.
              </p>
            </header>

            {/* Direct WhatsApp contact option */}
            <div className="mb-6">
              <p className="text-sm text-black/70">
                Prefer quick contact? Reach us directly on WhatsApp:
              </p>
              <Link
                href="https://wa.me/60123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white hover:bg-[#1ebe5d] transition"
              >
                📲 Contact us on WhatsApp
              </Link>
              <p className="mt-4 text-sm text-black/70">
                Or fill in the form below…
              </p>
            </div>

            {/* Quick, no-backend form via FormSubmit (swap later to /api/lead) */}
            <form
              action="https://formsubmit.co/youremail@example.com"
              method="POST"
              className="grid grid-cols-1 gap-4"
            >
              {/* FormSubmit options */}
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input
                type="hidden"
                name="_subject"
                value="New Fishon Business Lead"
              />
              <input
                type="hidden"
                name="_next"
                value="https://your-domain.com/list-your-business?success=1"
              />
              {/* Honeypot */}
              <input
                type="text"
                name="_honey"
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ownerName"
                    className="block text-sm font-medium text-black"
                  >
                    Your name
                  </label>
                  <input
                    id="ownerName"
                    name="ownerName"
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-black"
                  >
                    Business / Charter name
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-black"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    placeholder="+60…"
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="whatsapp"
                    className="block text-sm font-medium text-black"
                  >
                    WhatsApp
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    placeholder="+60…"
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-black"
                >
                  Location (City / State)
                </label>
                <input
                  id="location"
                  name="location"
                  required
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="boatType"
                    className="block text-sm font-medium text-black"
                  >
                    Boat type
                  </label>
                  <input
                    id="boatType"
                    name="boatType"
                    placeholder="Fiber, Cabin, etc."
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-medium text-black"
                  >
                    Capacity (pax)
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="languages"
                    className="block text-sm font-medium text-black"
                  >
                    Languages
                  </label>
                  <input
                    id="languages"
                    name="languages"
                    placeholder="BM, English, …"
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
              </div>

              <fieldset className="mt-2">
                <legend className="text-sm font-medium text-black mb-2">
                  Trip types
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Lake",
                    "River",
                    "Inshore",
                    "Offshore",
                    "Island Hopping",
                    "Night",
                  ].map((t) => (
                    <label
                      key={t}
                      className="inline-flex items-center gap-2 text-sm text-black/80"
                    >
                      <input
                        type="checkbox"
                        name="tripTypes"
                        value={t}
                        className="accent-[#ec2227]"
                      />{" "}
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="priceRange"
                    className="block text-sm font-medium text-black"
                  >
                    Typical price range (MYR)
                  </label>
                  <input
                    id="priceRange"
                    name="priceRange"
                    placeholder="e.g. RM300 – RM1200"
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-black"
                  >
                    Website / Social
                  </label>
                  <input
                    id="website"
                    name="website"
                    placeholder="Instagram, FB Page, etc."
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-black"
                >
                  Notes
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your trips, gear provided, and highlights."
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#ec2227]/40"
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-black/60">
                  By submitting, you agree to be contacted by Fishon regarding
                  your listing.
                </p>
                <button
                  type="submit"
                  className="rounded-xl bg-[#ec2227] px-5 py-3 font-semibold text-white hover:translate-y-px transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Fishing & boat photos (placeholder gallery) */}
          <section
            aria-labelledby="gallery"
            className="rounded-3xl bg-white/80 p-6 md:p-8 shadow-xl border border-black/5"
          >
            <h2 id="gallery" className="text-2xl font-extrabold tracking-tight">
              What anglers are booking
            </h2>
            <p className="mt-2 text-black/70">
              A glimpse of trips — from calm lake mornings to offshore
              adventures.
            </p>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  src: "https://images.unsplash.com/photo-1500367215255-0e0b25b396af?q=80&w=800&auto=format&fit=crop",
                  alt: "Offshore boat heading out at sunrise",
                },
                {
                  src: "https://images.unsplash.com/photo-1508184964240-ee76b36e3b20?q=80&w=800&auto=format&fit=crop",
                  alt: "Angler holding a catch on deck",
                },
                {
                  src: "https://images.unsplash.com/photo-1474667686408-59e71a2a7e36?q=80&w=800&auto=format&fit=crop",
                  alt: "Lakeside jetty and boats",
                },
                {
                  src: "https://images.unsplash.com/photo-1508182311256-e3f3e78dc8d0?q=80&w=800&auto=format&fit=crop",
                  alt: "Close-up of fishing reel",
                },
              ].map((img) => (
                <div
                  key={img.src}
                  className="relative h-36 w-full rounded-xl overflow-hidden"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                    priority={false}
                  />
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-black/60">
              Photos are illustrative. Replace with your own images in{" "}
              <code>/public/</code> for best performance.
            </p>
          </section>
        </section>
      </main>
      <footer className="w-full bg-[#ec2227] text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Fishon.my. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
