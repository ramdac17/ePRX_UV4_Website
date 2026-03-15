import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 🎯 GOAL: Make /dashboard the primary landing page.
  // Redirecting the root "/" to "/dashboard" for everyone.
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🛡️ AUTH CHECK: If a logged-in user tries to go back to Login/Register,
  // push them back to the Dashboard.
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // We exclude /api, /_next, and static files to prevent middleware from running
  // on every image or internal request (this helps avoid that deprecation warning).
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
