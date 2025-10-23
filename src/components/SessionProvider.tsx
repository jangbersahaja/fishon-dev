"use client";
import type { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <NextAuthSessionProvider session={session ?? undefined}>
      {children}
    </NextAuthSessionProvider>
  );
}
