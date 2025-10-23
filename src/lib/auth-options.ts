import { prisma } from "@/lib/prisma";
import { validateTac } from "@/lib/tac";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
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
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return `${baseUrl}/book`;
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return `${baseUrl}/book`;
      } catch {}
      return `${baseUrl}/book`;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "credentials") {
          token.id = (user as any).id || token.sub || token.email;
          (token as any).role =
            (user as any).role || (token as any).role || "ANGLER";
          (token as any).dbLinked = true;
        } else {
          try {
            const email = (
              (user as any).email ||
              token.email ||
              ""
            ).toLowerCase();
            if (email) {
              let dbUser = await prisma.user.findUnique({ where: { email } });
              if (!dbUser) {
                const placeholder = randomBytes(16).toString("hex");
                const passwordHash = await bcrypt.hash(placeholder, 10);
                dbUser = await prisma.user.create({
                  data: {
                    email,
                    passwordHash,
                    displayName: (user as any).name ?? undefined,
                  },
                });
              } else if (!dbUser.displayName && (user as any).name) {
                dbUser = await prisma.user.update({
                  where: { id: dbUser.id },
                  data: { displayName: (user as any).name },
                });
              }
              token.id = dbUser.id;
              (token as any).role =
                dbUser.role || (token as any).role || "ANGLER";
              (token as any).dbLinked = true;
            } else {
              token.id = token.sub || (user as any).id || token.id;
              (token as any).dbLinked = false;
            }
          } catch {}
        }
      } else {
        if (!(token as any).dbLinked && token.email) {
          try {
            const email = String(token.email).toLowerCase();
            const dbUser = await prisma.user.findUnique({ where: { email } });
            if (dbUser) {
              token.id = dbUser.id;
              (token as any).role =
                dbUser.role || (token as any).role || "ANGLER";
              (token as any).dbLinked = true;
            }
          } catch {}
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
