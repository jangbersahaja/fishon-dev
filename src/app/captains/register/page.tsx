import type { Metadata } from "next";
import FormSection from "./_components/FormSection";

export const metadata: Metadata = {
  title: "Register Your Charter | FishOn.my",
  description:
    "List your fishing charter on FishOn.my. Add trips, pricing, photos, boat details, policies, and more.",
  alternates: { canonical: "https://www.fishon.my/captains/register" },
  openGraph: {
    title: "Register Your Charter | FishOn.my",
    description:
      "Add your listing with trips, photos, boat details, and policies. Start getting bookings today.",
    url: "https://www.fishon.my/captains/register",
    type: "website",
    siteName: "FishOn.my",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register Your Charter | FishOn.my",
    description:
      "Add your listing with trips, photos, boat details, and policies.",
  },
};

export default function CharterRegisterPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Become Our First <span className="text-[#EC2227]">Charter</span>
          </h1>
          <p className="mt-3 max-w-3xl text-neutral-700">
            Add your listing details, trips, pricing, and policies. You’ll be
            able to review a JSON preview before submitting.
          </p>
        </section>

        <FormSection />
      </div>
    </main>
  );
}
