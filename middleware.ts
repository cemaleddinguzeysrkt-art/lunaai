import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth internal routes)
     * - auth/login, auth/forgot-password, auth/reset-password (Public Auth pages)
     * - _next (Next.js internals like static files and images)
     * - favicon.ico (Browser icon)
     * - All files with image extensions (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!api/auth|auth/login|auth/forgot-password|auth/reset-password|_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};