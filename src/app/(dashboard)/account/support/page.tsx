import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { HelpCircle, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SupportPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?next=/account/support");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>

      {/* Contact Options */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-50">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Email Support
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Send us an email and we&apos;ll respond within 24 hours.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <a href="mailto:support@fishon.my">support@fishon.my</a>
          </Button>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-green-50">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Live Chat
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Chat with our support team in real-time.
          </p>
          <Button variant="outline" className="w-full" disabled>
            Coming Soon
          </Button>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-50">
            <HelpCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Help Center
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Find answers to commonly asked questions.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link
              href="/support/help"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Help Center
            </Link>
          </Button>
        </div>
      </div>

      {/* Common Issues */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Common Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <span className="font-medium text-gray-900">
                How do I modify my booking?
              </span>
              <span className="ml-1.5 flex-shrink-0 transition group-open:rotate-180">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </summary>
            <p className="px-4 mt-4 text-sm text-gray-600">
              To modify your booking, please contact the captain directly or
              reach out to our support team. Modification policies vary by
              charter.
            </p>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <span className="font-medium text-gray-900">
                What is the cancellation policy?
              </span>
              <span className="ml-1.5 flex-shrink-0 transition group-open:rotate-180">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </summary>
            <p className="px-4 mt-4 text-sm text-gray-600">
              Cancellation policies vary by charter. You can cancel PENDING or
              APPROVED bookings from your bookings page. Check the charter
              details for specific policies.
            </p>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <span className="font-medium text-gray-900">
                How long does captain approval take?
              </span>
              <span className="ml-1.5 flex-shrink-0 transition group-open:rotate-180">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </summary>
            <p className="px-4 mt-4 text-sm text-gray-600">
              Captains typically respond within 6-24 hours. Your booking hold
              expires after 12 hours if not approved. You&apos;ll receive an
              email notification once the captain responds.
            </p>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <span className="font-medium text-gray-900">
                When will I be charged?
              </span>
              <span className="ml-1.5 flex-shrink-0 transition group-open:rotate-180">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </summary>
            <p className="px-4 mt-4 text-sm text-gray-600">
              You&apos;re only charged after the captain approves your booking.
              Once approved, you&apos;ll receive a payment link to complete your
              booking confirmation.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
