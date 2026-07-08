# ============================================================
# DAY 13 — LESSON 5: MIDDLEWARE
# Interview Level: Intermediate
# Time: ~45 min
# ============================================================

Middleware runs **before every request** reaches your pages or API routes.
It's the gatekeeper at the edge of your app — auth checks, redirects,
locale detection, logging.

```
Request → middleware.ts → page / route handler / static file
              ↑
         Can redirect, rewrite, modify headers, set cookies
```

**File location:** `src/middleware.ts` (or `middleware.ts` at project root).
NOT inside `app/`.

─────────────────────────────────────────────────────────────
## SECTION 1: BASIC MIDDLEWARE
─────────────────────────────────────────────────────────────

```ts
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Path:", request.nextUrl.pathname);
  return NextResponse.next(); // allow request to continue
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

`NextResponse.next()` = proceed normally.
`NextResponse.redirect(url)` = send user elsewhere.

─────────────────────────────────────────────────────────────
## SECTION 2: AUTH GATE (blog project pattern)
─────────────────────────────────────────────────────────────

Block `/posts/new` unless user has a session cookie:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("session")?.value === "demo-user";
  const isProtected = request.nextUrl.pathname.startsWith("/posts/new");

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/new"],
};
```

For Day 13, fake auth is fine — real auth comes Day 14.

─────────────────────────────────────────────────────────────
## SECTION 3: MATCHER — WHICH PATHS RUN MIDDLEWARE
─────────────────────────────────────────────────────────────

```ts
export const config = {
  // Only these paths:
  matcher: ["/admin/:path*", "/posts/new"],

  // Exclude static files and API (common pattern):
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg)$).*)",
  ],
};
```

Middleware on EVERY route adds latency — be selective.

─────────────────────────────────────────────────────────────
## SECTION 4: REWRITE vs REDIRECT
─────────────────────────────────────────────────────────────

```ts
// REDIRECT — browser URL changes (user sees /login)
return NextResponse.redirect(new URL("/login", request.url));

// REWRITE — browser URL stays same, serves different content internally
return NextResponse.rewrite(new URL("/internal-dashboard", request.url));
```

Use rewrite for A/B testing, i18n routes, proxying.

─────────────────────────────────────────────────────────────
## SECTION 5: MODIFYING HEADERS & COOKIES
─────────────────────────────────────────────────────────────

```ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("x-custom-header", "hello");
  response.cookies.set("visited", "true", { maxAge: 60 * 60 * 24 });

  return response;
}
```

Read cookies from request:
```ts
const token = request.cookies.get("session")?.value;
```

─────────────────────────────────────────────────────────────
## SECTION 6: middleware.ts LIMITATIONS
─────────────────────────────────────────────────────────────

Middleware runs on the **Edge Runtime** — not full Node.js.

| Can do ✅ | Cannot do ❌ |
|-----------|-------------|
| Read cookies, headers, URL | Direct DB calls (use Edge-compatible DB or skip) |
| Redirect, rewrite | Heavy computation |
| JWT verify (with jose library) | fs, native Node modules |

For DB auth checks in middleware, use JWT in cookie (verify signature
with `jose`) — not a Prisma query. Full session validation can happen
in the page/layout.

─────────────────────────────────────────────────────────────
## SECTION 7: METADATA API (bonus — often paired with routing)
─────────────────────────────────────────────────────────────

SEO metadata in Server Components:

```tsx
// app/posts/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, images: [post.coverImage] },
  };
}
```

─────────────────────────────────────────────────────────────
## PRACTICE TODO
─────────────────────────────────────────────────────────────

In blog project:
1. Create `middleware.ts` protecting `/posts/new`
2. Create fake login at `/login` that sets `session=demo-user` cookie
3. Test: visiting `/posts/new` redirects when logged out
4. Add `generateMetadata` to post detail page

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A
─────────────────────────────────────────────────────────────

**Q: What does Next.js middleware do?**
A: Runs before a request completes, enabling redirects, rewrites,
   auth checks, header/cookie modification at the edge.

**Q: Where does middleware.ts live?**
A: Project root or `src/` root — same level as `app/`, NOT inside `app/`.

**Q: Middleware vs layout auth check?**
A: Middleware = early gate, runs before any rendering, good for redirects.
   Layout = can access DB, show UI, but page code may already start.

**Q: Why Edge Runtime limits in middleware?**
A: Middleware runs globally on every matched request — must be fast.
   Full Node.js APIs would be too heavy at the edge.

**Q: Redirect vs rewrite?**
A: Redirect changes browser URL. Rewrite serves different content
   while keeping the original URL visible.
