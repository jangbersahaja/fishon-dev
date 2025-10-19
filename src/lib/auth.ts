import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { NextAuthOptions } from "next-auth";
import { getServerSession, type DefaultSession } from "next-auth";

export function auth() {
  return getServerSession(authOptions as NextAuthOptions);
}

export type AppSession = DefaultSession & {
  user?: DefaultSession["user"] & {
    id?: string;
    role?: string;
  };
};
