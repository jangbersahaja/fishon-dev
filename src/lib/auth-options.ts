import { prisma } from "@/lib/prisma";
import { validateTac } from "@/lib/tac";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/(auth)/login" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) return null;
        // TAC-first: if a valid TAC code is provided, accept regardless of stored password
        if (await validateTac(email, credentials.password)) {
          // no-op: authenticated by TAC code
        } else {
          const ok = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          if (!ok) return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.displayName ?? undefined,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth sign-ins, ensure user has a passwordHash
      if (account?.provider !== "credentials" && user.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
            select: { id: true, passwordHash: true },
          });

          // If user exists but has no passwordHash, set a placeholder
          if (dbUser && !dbUser.passwordHash) {
            const placeholderHash = await bcrypt.hash(
              Math.random().toString(36),
              10
            );
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { passwordHash: placeholderHash },
            });
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // If url starts with baseUrl, it's a relative redirect - use it
      if (url.startsWith(baseUrl)) return url;

      // If url is an absolute URL with same origin, use it
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch {}

      // Default fallback to homepage (not /book)
      return baseUrl;
    },
    async jwt({ token, user, trigger }) {
      // On initial sign-in or when user object is available
      if (user) {
        token.id = user.id;
        // Fetch role from database for all users
        if (user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email.toLowerCase() },
              select: { id: true, role: true },
            });
            if (dbUser) {
              token.id = dbUser.id;
              (token as any).role = dbUser.role;
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
          }
        }
      }

      // Refresh role on update trigger
      if (trigger === "update" && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: String(token.email).toLowerCase() },
            select: { role: true },
          });
          if (dbUser) {
            (token as any).role = dbUser.role;
          }
        } catch (error) {
          console.error("Error refreshing user role:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string | undefined;
        (session.user as any).role = (token as any).role as string | undefined;
      }
      return session;
    },
  },
};
