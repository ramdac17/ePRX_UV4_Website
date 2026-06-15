import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";

  const isFacebookScraper =
    userAgent.includes("facebookexternalhit") || userAgent.includes("Facebot");

  // 🎯 1. ROOT LANDING REDIRECT: Ensure EVERYONE (including Facebook) gets sent to /dashboard
  if (pathname === "/") {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.headers.set(
      "Cache-Control",
      "no-store, max-age=0, must-revalidate",
    );
    return response;
  }

  // 🤖 2. FACEBOOK SCRAPER ALLOWANCE
  // If it's Facebook looking at an article or dashboard, let it pass right through
  // without checking any reverse auth guards below.
  if (isFacebookScraper) {
    return NextResponse.next();
  }

  // 🚪 3. AUTH REVERSE-GUARD: If logged in with token, kick out of authentication gates cleanly
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
