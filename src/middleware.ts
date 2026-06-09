import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";

  // 🤖 1. FACEBOOK SCRAPER BYPASS
  if (userAgent.includes("facebookexternalhit")) {
    return NextResponse.next();
  }

  // 🎯 2. ROOT LANDING REDIRECT: Forward base url to dashboard with no-cache rules
  if (pathname === "/") {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.headers.set(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate",
    );
    return response;
  }

  // 🚪 3. AUTH REVERSE-GUARD: If logged in with token, kick out of authentication gates cleanly
  // Unauthenticated guests will naturally pass through this and can view /dashboard freely!
  if (
    token &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.headers.set(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate",
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - All image/icon assets with common file extensions in public/ (png, jpg, jpeg, svg, gif, webp)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
