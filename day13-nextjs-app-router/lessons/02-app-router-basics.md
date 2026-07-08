# ============================================================
# DAY 13 — LESSON 2: APP ROUTER BASICS (File-Based Routing)
# Interview Level: Beginner → Intermediate
# Time: ~60 min
# ============================================================

In React Router you wrote code to describe routes:

```tsx
<Route path="/posts/:slug" element={<PostPage />} />
```

In Next.js you don't write that code at all. **The folder structure
IS the router.** You create files with special names, and Next.js
wires everything up.

**Analogy:** React Router is telling a taxi driver directions turn
by turn. The App Router is a city where the street signs already
exist — you just place your buildings (files) on the right streets
(folders).

─────────────────────────────────────────────────────────────
## SECTION 1: THE `app/` DIRECTORY AND `page.tsx`
─────────────────────────────────────────────────────────────

Everything lives inside the `app/` folder (usually `src/app/`).

**Rule #1: a folder becomes a URL segment. A `page.tsx` inside it
makes that URL actually visitable.**

```
src/app/
├── page.tsx                →  /            (the homepage)
├── about/
│   └── page.tsx            →  /about
└── posts/
    ├── page.tsx            →  /posts
    └── new/
        └── page.tsx        →  /posts/new
```

A page is just a React component exported as `default`:

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return <h1>About us</h1>;
}
```

A folder WITHOUT a `page.tsx` is not visitable — it only acts as a
path segment for deeper folders. (Helper files like `components.tsx`
or `utils.ts` can live next to pages safely; only the special
file names do anything.)

─────────────────────────────────────────────────────────────
## SECTION 2: THE SPECIAL FILES (learn these seven)
─────────────────────────────────────────────────────────────

| File            | Job                                                        |
|-----------------|------------------------------------------------------------|
| `page.tsx`      | The UI for a URL. Makes the route publicly visitable.      |
| `layout.tsx`    | Shared wrapper (navbar, sidebar). WRAPS pages below it. Keeps state when navigating between its children. |
| `loading.tsx`   | Instant loading UI (skeleton/spinner) shown while the page's server work runs. |
| `error.tsx`     | Error boundary UI if the page (or children) throws. Must be a client component. |
| `not-found.tsx` | Shown when you call `notFound()` or the URL doesn't exist. |
| `route.ts`      | An API endpoint (JSON, not UI). Cannot live in the same folder as `page.tsx`. |
| `middleware.ts` | NOT in `app/` — sits at `src/middleware.ts`. Runs BEFORE every request (auth redirects etc.). |

### `layout.tsx` — the wrapper

```tsx
// src/app/layout.tsx  ← the ROOT layout (required in every app)
export default function RootLayout({
  children,               // ← the current page gets injected here
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>My Site</nav>
        {children}         {/* ← page.tsx renders here */}
      </body>
    </html>
  );
}
```

Key facts about layouts:
- The root layout must contain `<html>` and `<body>` — Next.js does
  not add them for you.
- Layouts **do not re-render** when you navigate between their child
  pages. A music player in a layout keeps playing across navigation.
- Layouts receive `children`, never the page's props.

### `loading.tsx` — free loading states

While a server component is fetching data, Next.js instantly shows
`loading.tsx` from the same folder (or the nearest parent folder).
Under the hood it wraps your page in React `<Suspense>`.

```tsx
// src/app/posts/loading.tsx
export default function Loading() {
  return <p>Loading posts…</p>;   // usually a skeleton UI
}
```

### `error.tsx` — free error boundaries

```tsx
// src/app/posts/error.tsx
"use client";                     // ← REQUIRED: error boundaries are client components

export default function Error({
  error,
  reset,                          // ← call to re-try rendering the page
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

Why must it be a client component? Because it needs to catch errors
during rendering in the browser and hold state (has an error happened
or not) — that requires JavaScript on the client.

### `not-found.tsx`

```tsx
// src/app/posts/[slug]/not-found.tsx
export default function NotFound() {
  return <h2>Post not found.</h2>;
}
```

Trigger it from a page with:

```tsx
import { notFound } from "next/navigation";

if (!post) notFound();  // stops rendering, shows nearest not-found.tsx
```

─────────────────────────────────────────────────────────────
## SECTION 3: DYNAMIC ROUTES — `[slug]`
─────────────────────────────────────────────────────────────

Square brackets in a folder name = a dynamic (variable) segment.

```
src/app/posts/[slug]/page.tsx   →  /posts/anything-here
```

The page receives the value in `params`. **In Next.js 15, `params`
is a Promise** — you must `await` it (this is a common upgrade trap):

```tsx
// src/app/posts/[slug]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;   // ← Promise in Next 15!
}) {
  const { slug } = await params;       // ← await it
  return <h1>Reading post: {slug}</h1>;
}
```

Other bracket variants (recognize them; use rarely):
- `[...parts]` — catch-all: matches `/docs/a/b/c` → `parts = ["a","b","c"]`
- `[[...parts]]` — optional catch-all: also matches `/docs` itself

─────────────────────────────────────────────────────────────
## SECTION 4: NESTED LAYOUTS — layouts stack like Russian dolls
─────────────────────────────────────────────────────────────

Every folder can have its own `layout.tsx`. They **nest**:

```
src/app/
├── layout.tsx            ← root layout (html, body, navbar)
└── posts/
    ├── layout.tsx        ← blog layout (adds a sidebar)
    ├── page.tsx          →  /posts
    └── [slug]/
        └── page.tsx      →  /posts/hello
```

Visiting `/posts/hello` renders:

```
<RootLayout>            ← navbar
  <PostsLayout>         ← sidebar
    <PostPage />        ← the actual post
  </PostsLayout>
</RootLayout>
```

This is how you build "sections" of a site: the blog section gets a
sidebar, the admin section gets a different menu — without repeating
the navbar code anywhere.

─────────────────────────────────────────────────────────────
## SECTION 5: ROUTE GROUPS — `(folder)` organizes WITHOUT changing URLs
─────────────────────────────────────────────────────────────

Parentheses around a folder name = "this folder is for organization
only, do NOT put it in the URL."

```
src/app/
├── (marketing)/
│   ├── layout.tsx        ← layout only for marketing pages
│   ├── page.tsx          →  /        (NOT /marketing!)
│   └── pricing/page.tsx  →  /pricing (NOT /marketing/pricing!)
└── (shop)/
    ├── layout.tsx        ← different layout for shop pages
    └── cart/page.tsx     →  /cart
```

Why this exists: sometimes two groups of pages need DIFFERENT
layouts but should share the same URL level. Route groups give
each group its own layout without adding a URL segment.

─────────────────────────────────────────────────────────────
## SECTION 6: NAVIGATION — `<Link>` and the router
─────────────────────────────────────────────────────────────

Never use `<a href>` for internal links — it does a full page reload.
Use `<Link>`:

```tsx
import Link from "next/link";

<Link href="/posts/hello">Read the post</Link>
```

What `<Link>` gives you:
- **Client-side navigation** — only the changing part of the page
  updates; layouts stay mounted.
- **Prefetching** — when the link scrolls into view, Next.js quietly
  downloads that page in the background. Clicking feels instant.

Programmatic navigation (inside client components only):

```tsx
"use client";
import { useRouter } from "next/navigation";  // ← NOT "next/router" (old pages router!)

const router = useRouter();
router.push("/posts");     // navigate
router.refresh();          // re-fetch server components for current page
```

In SERVER code (server components, server actions) use `redirect`:

```tsx
import { redirect } from "next/navigation";
redirect("/login");        // throws internally — code after it never runs
```

─────────────────────────────────────────────────────────────
## SECTION 7: THE FULL PICTURE — one tree to memorize
─────────────────────────────────────────────────────────────

```
src/
├── middleware.ts                  ← runs before every matched request
└── app/
    ├── layout.tsx                 ← root layout (html + body)
    ├── page.tsx                   →  /
    ├── globals.css
    ├── not-found.tsx              ← global 404
    ├── api/
    │   └── health/route.ts        →  GET /api/health (JSON API)
    └── posts/
        ├── layout.tsx             ← sidebar for all post pages
        ├── page.tsx               →  /posts
        ├── loading.tsx            ← skeleton while /posts loads
        ├── error.tsx              ← error UI for post pages
        ├── new/page.tsx           →  /posts/new
        └── [slug]/
            ├── page.tsx           →  /posts/:slug
            └── not-found.tsx      ← 404 for missing posts
```

You will build EXACTLY this tree in today's project.

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A CHEAT SHEET
─────────────────────────────────────────────────────────────

**Q1. How does routing work in the Next.js App Router?**
A: It's file-based. Folders inside `app/` become URL segments, and a
`page.tsx` file makes that URL renderable. Special files add behavior:
`layout.tsx` wraps children, `loading.tsx` shows instant loading UI,
`error.tsx` is an error boundary, `route.ts` defines an API endpoint.

**Q2. What's the difference between `page.tsx` and `layout.tsx`?**
A: A page is the unique UI for one URL and re-renders on navigation.
A layout wraps pages below it, is shared across sibling routes, and
does NOT re-render or lose state when navigating between its children.

**Q3. How do you create a dynamic route, and how do you read the parameter?**
A: Name a folder with square brackets — `app/posts/[slug]/page.tsx`
matches `/posts/anything`. The page receives `params`; in Next.js 15
it's a Promise, so you write `const { slug } = await params;` inside
an async server component.

**Q4. What are route groups?**
A: Folders wrapped in parentheses, like `(marketing)`. They organize
files and let a set of routes share a layout WITHOUT adding a segment
to the URL. `(marketing)/pricing/page.tsx` serves `/pricing`.

**Q5. How does `loading.tsx` work under the hood?**
A: Next.js wraps the page in a React Suspense boundary and uses
`loading.tsx` as the fallback. While the server component's async
work (data fetching) is pending, the fallback shows instantly.

**Q6. Why must `error.tsx` be a client component?**
A: It's a React error boundary — it needs client-side state to track
"did an error happen" and to offer a `reset()` retry. Error catching
of this kind only works in the browser's React runtime.

**Q7. `<Link>` vs a normal `<a>` tag?**
A: `<Link>` does client-side navigation (no full page reload, layouts
keep their state) and prefetches the target route when the link
becomes visible, so navigation feels instant. `<a>` reloads the whole
document and re-downloads everything.

**Q8. How do you redirect a user in Next.js?**
A: In server code (server components/actions): `redirect("/login")`
from `next/navigation`. In client components: `useRouter().push()`.
Before the request even reaches the page: `NextResponse.redirect()`
in `middleware.ts`.
