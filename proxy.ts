import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/accounts", "/investment", "/Investment", "/commission"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get("auth_session")?.value;
  const isAdmin = authCookie === "admin";
  const isLoggedIn = authCookie === "true" || isAdmin;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // An admin may not use the normal user dashboard.
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Admin area is off-limits to regular users (cosmetic pre-bundle guard;
  // the API enforces @Roles(ADMIN) server-side).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (authCookie === "true") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(isAdmin ? "/admin" : "/dashboard", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|img/|fonts/).*)",
  ],
};
