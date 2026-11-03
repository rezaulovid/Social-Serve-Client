
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

const protectedRoutes = [
  "/create-event",
  "/manage-events",
  "/joined-events",
];

const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check whether the current route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check whether the current route is an authentication page
  const isAuthRoute = authRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  // Read existing authentication cookies as a fallback
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session-data")?.value ||
    request.cookies.get("socialserve_token")?.value;

  const userCookie = request.cookies.get("socialserve_user")?.value;

  try {
    // Verify the actual Better Auth session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isAuthenticated = !!session?.user || !!(
      sessionToken || userCookie
    );

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from login/register
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication error:", error);

    // Fail safely for protected routes if session verification fails
    if (isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("callbackUrl", pathname);

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/create-event/:path*",
    "/manage-events/:path*",
    "/joined-events/:path*",
    "/login",
    "/register",
  ],
};
