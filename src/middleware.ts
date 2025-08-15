import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(async function middleware() {}, {
  isReturnToCurrentPage: true,
  publicPaths: [
    "^/$",
    "^/public/.*$",
    "\\.(?:json|ico|css|js|png)$",
  ],
});

export const config = {
  matcher: ["/dashboard/:path*", "/auth-callback"],
};
