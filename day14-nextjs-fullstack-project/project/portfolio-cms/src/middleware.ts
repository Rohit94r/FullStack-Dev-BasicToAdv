import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: Protect all /admin routes except /admin/login
// - Read session cookie (e.g. "session" with user id)
// - Redirect to /admin/login if missing
// - Allow /admin/login through without auth
// YOUR IDEA:

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

// ─── ANSWER (only look after trying!) ───
/*
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const session = request.cookies.get("session")?.value;

  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}
*/

export const config = {
  matcher: ["/admin/:path*"],
};
