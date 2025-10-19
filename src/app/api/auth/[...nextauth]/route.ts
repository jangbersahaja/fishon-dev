import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
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
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!ok) return null;
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
      // Force all auth-related redirects to /book on same origin
      if (url.startsWith(baseUrl)) return `${baseUrl}/book`;
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return `${baseUrl}/book`;
      } catch {}
      return `${baseUrl}/book`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id =
          (user as any).id || token.sub || (user as any).email || token.email;
        (token as any).role =
          (user as any).role || (token as any).role || "ANGLER";
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
