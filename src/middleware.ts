import { withAuth } from "next-auth/middleware";

// Protect authenticated areas (can expand as booking/account features ship)
export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/account/:path*",
    "/book/checkout/:path*",
    // add more protected routes here as features roll out
  ],
};
