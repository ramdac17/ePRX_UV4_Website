import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";

  // 🤖 1. FACEBOOK SCRAPER BYPASS: Always step out of the way for metadata scrapers
  if (userAgent.includes("facebookexternalhit")) {
    return NextResponse.next();
  }

  // 🎯 2. ROOT LANDING REDIRECT: Force the base website url "/" to forward straight to "/dashboard"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🛡️ 3. AUTH GUARD: Secure layout paths from unauthenticated sessions
  // If a user has NO token and tries to access the dashboard, redirect them to login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url)); // Adjust to your exact login route if different (e.g. /login)
  }

  // 🚪 4. AUTH REVERSE-GUARD: If a logged-in user tries to visit login/register, push them back to dashboard
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Keeps internal assets clean, matches all operational page endpoints
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
