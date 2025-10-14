import FishonLogo from "@/aset/img/fishonDP.png";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-dvh bg-[#ec2227] flex items-center justify-center p-6">
      <section className="w-full max-w-3xl mx-auto">
        <div className="rounded-3xl bg-white shadow-2xl border border-black/5 p-8 md:p-12">
          <header className="flex items-center gap-4">
            <Image
              src={FishonLogo}
              width={72}
              height={72}
              sizes="(max-width: 768px) 48px, 72px"
              alt="Fishon logo"
              className="h-12 w-auto md:h-16 rounded-full"
              priority
            />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Fishon
              <span className="sr-only">
                {" "}
                — Malaysia&apos;s fishing & charter booking
              </span>
              .my
            </h1>
          </header>

          <p className="mt-5 text-lg md:text-xl/relaxed text-black/80">
            Malaysia&apos;s first{" "}
            <span className="font-semibold text-black">
              fishing &amp; charter booking
            </span>{" "}
            platform. The marketplace experience is coming soon!
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span
              aria-label="Status: Marketplace in development"
              className="inline-flex items-center gap-2 rounded-full border border-[#ec2227]/20 bg-[#ec2227] px-3 py-1 text-white"
            >
              <span className="size-2 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,.6)]" />
              Marketplace in development
            </span>
            <span className="opacity-80 text-black/70">plan • book • fish</span>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-gray-50 p-5">
            <h2 className="text-base md:text-lg font-semibold text-black">
              🎣 Are you a Captain or Charter Operator?
            </h2>
            <p className="mt-2 text-sm md:text-base text-black/80">
              Captain and charter registration is now available at{" "}
              <Link
                href="https://fishon-captain.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#ec2227] underline decoration-[#ec2227]/40 underline-offset-4 hover:decoration-[#ec2227]"
              >
                fishon-captain.vercel.app
              </Link>
            </p>
            <p className="mt-2 text-xs md:text-sm text-black/60">
              Register your charter, manage bookings, and reach anglers across Malaysia.
            </p>
          </div>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-white/90 bg-[#ec2227] border border-white/10 rounded-xl px-4 py-3">
            <div>© {year} Fishon. All rights reserved.</div>
            <nav aria-label="Social links">
              <ul className="flex items-center gap-4">
                {/* Add more links as they go live */}
                <li>
                  <Link
                    href="https://www.facebook.com/profile.php?id=61580228252347"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/40 underline-offset-4 hover:decoration-white"
                  >
                    Facebook
                  </Link>
                </li>
              </ul>
            </nav>
          </footer>
        </div>
      </section>
    </main>
  );
}
