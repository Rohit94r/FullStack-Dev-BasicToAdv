# Day 13 — Next.js App Router Interview Questions & Answers

---

## SECTION A — Next.js Fundamentals

**Q1. What is Next.js? What does it add over plain React?**
A: Next.js is a React framework (built on React) that adds:
   - File-system routing (no react-router needed)
   - Server-Side Rendering (SSR) out of the box
   - Static Site Generation (SSG)
   - API Routes (backend in the same project)
   - Image optimization, font optimization
   - Code splitting per page automatically
   - Built-in TypeScript support
   - Edge runtime support (Cloudflare, Vercel Edge)
   Use Next.js for: production web apps, SEO-critical sites, full-stack apps.
   Use plain React for: SPAs where SEO doesn't matter, embedded widgets.

**Q2. What is the difference between App Router and Pages Router?**
A: Pages Router (old, /pages directory):
   - `pages/index.js` → /
   - `pages/users/[id].js` → /users/:id
   - SSR/SSG via `getServerSideProps` / `getStaticProps` (exported functions)
   - All components are Client Components by default.
   
   App Router (new, /app directory, Next.js 13+):
   - `app/page.tsx` → /
   - `app/users/[id]/page.tsx` → /users/:id
   - Server Components by default (render on server, no JS sent to browser)
   - Client Components: add `"use client"` directive
   - Nested layouts, loading UI, error boundaries built-in
   - New data fetching with `fetch()` extended by Next.js
   
   Use App Router for all new projects. Pages Router is legacy.

**Q3. What are React Server Components (RSC)?**
A: Components that render on the SERVER only. Their code never ships to the browser.
   Benefits:
   - Can access server-side resources (DB, filesystem, secrets) directly.
   - Zero JavaScript added to client bundle for these components.
   - SEO-friendly — HTML is pre-rendered.
   - Faster initial load (HTML arrives pre-rendered).
   
   Limitations:
   - No useState, useEffect, or any hooks.
   - No event listeners (onClick, onChange).
   - No browser APIs (window, localStorage).
   
   By default in Next.js App Router: all components are Server Components.
   Add `"use client"` at top → makes it a Client Component.

**Q4. What is the rule for `"use client"` vs Server Component?**
A: Server Component by default. Add `"use client"` when you need:
   - useState, useEffect, useReducer, useCallback, useMemo
   - onClick, onChange, onSubmit (event handlers)
   - Browser APIs: localStorage, window, document
   - Real-time data: WebSocket, SSE
   - Libraries that use React APIs
   
   Architecture: Server Components at the outer layers (data fetching).
   Client Components at the leaves (interactive UI elements).
   `"use client"` draws a boundary — ALL imports in that file become client-side too.
   Keep interactive parts as small/deep as possible.

**Q5. How does data fetching work in Next.js App Router?**
A: Server Components can be `async` — directly await data:
   ```tsx
   // app/users/page.tsx (Server Component)
   async function UsersPage() {
     const users = await prisma.user.findMany(); // Direct DB access!
     // OR: const res = await fetch("/api/users");
     return <UserList users={users} />;
   }
   ```
   This is the PREFERRED pattern — no useEffect, no loading state management, no client overhead.
   Next.js extends `fetch()` with caching options.

---

## SECTION B — Routing in App Router

**Q6. Explain Next.js App Router file conventions.**
A: Special files in app directory:
   `page.tsx` → the UI for a route segment. Only page.tsx files create routes.
   `layout.tsx` → wraps all pages in the segment. Persists across navigation (no remount).
   `loading.tsx` → Suspense fallback shown while page renders.
   `error.tsx` → error boundary for the segment. Must be Client Component.
   `not-found.tsx` → shown when notFound() is called.
   `route.ts` → API route handler (replaces pages/api/).
   `template.tsx` → like layout but remounts on navigation (rare).
   `default.tsx` → fallback for parallel routes.

**Q7. What are Route Groups in Next.js?**
A: Folders with parentheses `(groupName)` — group routes without affecting the URL.
   `app/(auth)/login/page.tsx` → URL is `/login` (not `/auth/login`).
   `app/(dashboard)/analytics/page.tsx` → URL is `/analytics`.
   Use for: different layouts for different sections without URL nesting.
   `app/(auth)/layout.tsx` → auth layout (centered, no sidebar).
   `app/(dashboard)/layout.tsx` → dashboard layout (sidebar, header).

**Q8. What are Dynamic Routes?**
A: Folders with brackets: `app/users/[id]/page.tsx` → matches `/users/anything`.
   In the page: `{ params }: { params: { id: string } }` → `params.id = "123"`.
   Catch-all: `app/docs/[...slug]/page.tsx` → matches `/docs/a/b/c`.
   Optional catch-all: `app/docs/[[...slug]]/page.tsx` → matches `/docs` too.

**Q9. What is parallel routing?**
A: Show multiple pages simultaneously in the SAME layout.
   Use `@slot` folders:
   `app/@modal/(.)users/[id]/page.tsx` → intercept /users/:id and show as modal.
   Complex routing patterns for: modals with own URLs, dashboards with multiple panels, conditional pages.

---

## SECTION C — Caching & Performance

**Q10. What are Next.js caching layers?**
A: Next.js has 4 caching mechanisms:
   1. Request memoization → deduplicate `fetch()` calls with same URL in same request.
   2. Data Cache → persist `fetch()` results across requests. On Vercel: distributed cache.
                  `fetch(url, { cache: "force-cache" })` → always use cache.
                  `fetch(url, { cache: "no-store" })` → always fresh.
                  `fetch(url, { next: { revalidate: 60 } })` → revalidate every 60s (ISR).
   3. Full Route Cache → cache entire rendered pages (for static pages).
   4. Router Cache → client-side cache. Navigation reuses cached page HTML.

**Q11. What is ISR (Incremental Static Regeneration)?**
A: Generates static pages that can be REGENERATED on a schedule or on-demand.
   Static + Dynamic = best of both worlds.
   ```tsx
   // Revalidate this page every 60 seconds
   export const revalidate = 60;
   
   async function Page() {
     const data = await fetch("https://api.example.com/data", {
       next: { revalidate: 60 }
     });
     // ...
   }
   ```
   On-demand revalidation: `revalidatePath("/blog")` or `revalidateTag("posts")` from Server Actions.
   Use for: blog posts, product listings, news feeds — frequently changing but can tolerate some staleness.

---

## SECTION D — Server Actions

**Q12. What are Server Actions?**
A: Functions that run on the SERVER, callable from CLIENT components.
   Like form actions but for Next.js. Replace API routes for simple mutations.
   ```tsx
   // In a Server Component or separate file with "use server"
   async function createNote(formData: FormData) {
     "use server"; // Marks this function as a Server Action
     const title = formData.get("title") as string;
     await prisma.note.create({ data: { title } });
     revalidatePath("/notes");
   }
   
   // Client Component uses it:
   <form action={createNote}>
     <input name="title" />
     <button type="submit">Create</button>
   </form>
   ```
   No need for manual API route for simple CRUD. Can also call from event handlers with `startTransition`.

**Q13. What is Next.js Middleware?**
A: Code that runs on the EDGE before every request, before the page renders.
   `middleware.ts` in root: runs for matched routes.
   Use for: authentication redirect, A/B testing, geolocation, rate limiting.
   ```typescript
   export function middleware(request: NextRequest) {
     const token = request.cookies.get("token");
     if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
       return NextResponse.redirect(new URL("/login", request.url));
     }
   }
   export const config = { matcher: ["/dashboard/:path*"] };
   ```
   Runs at the EDGE (before the serverless function) — very fast, globally distributed.

---

## SECTION E — Next.js Best Practices

**Q14. When should a component be a Server Component vs Client Component?**
A: Server Component when: needs data from DB, uses secrets, heavy computation, static content, no interactivity.
   Client Component when: needs state, event handlers, browser APIs, real-time data.
   Decision tree:
   Does it need: useState, useEffect, onClick, browser API? → Client. Otherwise → Server.
   Push client boundaries DOWN the component tree as far as possible.
   Extract only the interactive part into "use client" — keep parent as Server Component.

**Q15. What is the difference between `Link` and `<a>` in Next.js?**
A: `<a href="/page">` → full page reload. No client-side navigation. Bad UX.
   `<Link href="/page">` → client-side navigation. No reload. Prefetches on hover. React state preserved.
   Always use `<Link>` for internal navigation. Use `<a>` only for external URLs.
   Next.js also automatically prefetches in-viewport Link destinations in production.

**Q16. What is `next/image` and why use it?**
A: The `<Image>` component from Next.js:
   - Lazy loads (only loads when in viewport)
   - Automatic WebP conversion (smaller files)
   - Prevents Cumulative Layout Shift (CLS) — requires width/height or fill
   - Serves from Next.js image optimization endpoint
   - Responsive srcSet automatically generated
   Always use `<Image>` instead of `<img>` for better Core Web Vitals scores.
