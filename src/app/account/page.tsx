import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "./sign-out";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/account");
  const u = session.user as any;
  return (
    <main className="max-w-3xl p-6 mx-auto">
      <h1 className="text-2xl font-bold">Account</h1>
      <div className="mt-4 space-y-2">
        <div>
          <span className="text-sm text-black/60">Name</span>
          <div>{u?.name || "—"}</div>
        </div>
        <div>
          <span className="text-sm text-black/60">Email</span>
          <div>{u?.email || "—"}</div>
        </div>
        <div>
          <span className="text-sm text-black/60">Role</span>
          <div>{u?.role || "ANGLER"}</div>
        </div>
      </div>
      <div className="mt-6">
        <SignOutButton />
      </div>
    </main>
  );
}
