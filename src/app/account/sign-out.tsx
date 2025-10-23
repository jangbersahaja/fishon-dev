"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      className="px-4 py-2 text-white bg-black rounded"
      onClick={() => signOut({ callbackUrl: "/book" })}
    >
      Sign out
    </button>
  );
}
