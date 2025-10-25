import { DashboardHeader } from "@/components/account/DashboardHeader";
import { DashboardNav } from "@/components/account/DashboardNav";
import { auth } from "@/lib/auth/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login?next=/account/overview");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <DashboardHeader
        user={{
          ...session.user,
          name: session.user.name ?? undefined,
          image: session.user.image ?? undefined,
        }}
      />

      {/* Desktop Layout */}
      <div className="lg:flex">
        {/* Sidebar */}
        <aside className="hidden bg-white border-r border-gray-200 lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-1 min-h-0 pb-4">
            <div className="h-16 bg-[#ec2227] flex items-center px-4">
              <Link
                href="/home"
                className="flex items-center gap-2"
                aria-label="Fishon.my home"
              >
                <span className="relative h-14 w-28">
                  <Image
                    src="/images/logos/fishon-logo-white.png"
                    alt="Fishon"
                    sizes="200px"
                    fill
                    className="object-contain"
                    priority
                  />
                </span>
              </Link>
            </div>
            {/* Dashboard Title */}
            <div className="flex items-center px-4 py-6">
              <h1 className="text-xl font-bold text-gray-900">My Account</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              <DashboardNav />
            </nav>

            {/* User Info */}
            <div className="flex-shrink-0 px-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {session.user.image ? (
                    <div className="relative w-10 h-10 overflow-hidden rounded-full">
                      <Image
                        src={session.user.image}
                        fill
                        sizes="100px"
                        alt="User profile picture"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#ec2227] flex items-center justify-center text-white font-semibold">
                      {session.user.name?.[0]?.toUpperCase() || "A"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user.name || "Angler"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
