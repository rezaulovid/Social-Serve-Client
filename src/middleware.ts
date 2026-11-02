import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/create-event", "/manage-events", "/joined-events"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check for Better Auth session cookies
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session-data")?.value ||
    request.cookies.get("socialserve_token")?.value;

  const userCookie = request.cookies.get("socialserve_user")?.value;

  const isAuthenticated = !!(sessionToken || userCookie);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create-event/:path*", "/manage-events/:path*", "/joined-events/:path*"],
};
