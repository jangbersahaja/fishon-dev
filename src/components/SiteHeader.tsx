import SignOutButton from "@/app/account/sign-out";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function SiteHeader() {
  const session = await auth();
  const isAuthed = !!session?.user;
  return (
    <header className="border-b border-black/10 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/book" className="font-semibold tracking-tight">
          Fishon
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {isAuthed ? (
            <>
              <Link href="/account" className="hover:underline">
                Account
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded bg-black text-white px-3 py-1 hover:opacity-90"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
