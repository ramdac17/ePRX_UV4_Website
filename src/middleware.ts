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

  // 🎯 2. ROOT LANDING REDIRECT: Forward base url to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🛡️ 3. AUTH GUARD: If NO token and trying to access dashboard, send to /auth/login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 🚪 4. AUTH REVERSE-GUARD: If logged in with token, don't let them wander into /auth paths
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
