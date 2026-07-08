import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: Protect /posts/new — redirect to /login if no session cookie
// Hint: request.cookies.get("session")
// YOUR IDEA:

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

// ─── ANSWER (only look after trying!) ───
/*
export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const isProtected = request.nextUrl.pathname.startsWith("/posts/new");

  if (isProtected && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
*/

export const config = {
  matcher: ["/posts/new"],
};
