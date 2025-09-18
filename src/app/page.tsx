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
              src="/fishon-logo.png"
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
                — Malaysia’s fishing & charter booking
              </span>
              .my
            </h1>
          </header>

          <p className="mt-5 text-lg md:text-xl/relaxed text-black/80">
            Malaysia’s first{" "}
            <span className="font-semibold text-black">
              fishing &amp; charter booking
            </span>{" "}
            platform. We’re currently{" "}
            <span className="font-semibold text-black">building</span> the
            experience — launching soon.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span
              aria-label="Status: In development"
              className="inline-flex items-center gap-2 rounded-full border border-[#ec2227]/20 bg-[#ec2227] px-3 py-1 text-white"
            >
              <span className="size-2 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,.6)]" />
              In development
            </span>
            <span className="opacity-80 text-black/70">plan • book • fish</span>
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
