# ============================================================
# DAY 13 — LESSON 3: SERVER vs CLIENT COMPONENTS
# Interview Level: Intermediate (CRITICAL — expect this in every interview)
# Time: ~90 min
# ============================================================

This is the **most important concept** in the App Router. Get this wrong
and you'll fetch data on the client when you shouldn't, bundle server
code to the browser, or break interactivity.

─────────────────────────────────────────────────────────────
## SECTION 1: THE DEFAULT — EVERYTHING IS A SERVER COMPONENT
─────────────────────────────────────────────────────────────

In the `app/` directory, every component is a **Server Component** unless
you add `"use client"` at the top of the file.

```tsx
// app/posts/page.tsx — NO "use client" = Server Component
export default async function PostsPage() {
  const posts = await getPosts(); // ✅ direct DB/file access
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.slug}>{p.title}</li>
      ))}
    </ul>
  );
}
```

This runs **only on the server**. The JavaScript for this component is
NOT sent to the browser. The user receives ready-made HTML.

─────────────────────────────────────────────────────────────
## SECTION 2: WHAT SERVER COMPONENTS CAN DO
─────────────────────────────────────────────────────────────

| Can do ✅ | Cannot do ❌ |
|-----------|-------------|
| `async/await` directly in component | `useState`, `useEffect`, any hook |
| Read files, query DB, call secrets | `onClick`, `onChange`, event handlers |
| Use server-only npm packages | `window`, `document`, `localStorage` |
| Keep API keys off the client | Browser APIs |

**Analogy:** Server Component = kitchen (backend). Client Component =
dining table (browser). Customers don't go into the kitchen.

─────────────────────────────────────────────────────────────
## SECTION 3: WHEN YOU NEED "use client"
─────────────────────────────────────────────────────────────

Add `"use client"` at the **top of the file** when you need:

- Interactivity (clicks, forms with client state)
- React hooks (`useState`, `useEffect`, `useReducer`)
- Browser APIs
- Third-party libs that use hooks internally

```tsx
"use client";

import { useState } from "react";

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "❤️" : "🤍"} Like
    </button>
  );
}
```

**Important:** `"use client"` makes that file AND its imports part of
the client bundle. Keep client components **small and leaf-level**.

─────────────────────────────────────────────────────────────
## SECTION 4: COMPOSITION PATTERN (the pro move)
─────────────────────────────────────────────────────────────

Server Component fetches data → passes as props to Client Component:

```tsx
// app/posts/[slug]/page.tsx — SERVER
import { LikeButton } from "@/components/LikeButton";
import { getPost } from "@/lib/posts";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      {/* Client island inside server page */}
      <LikeButton postId={post.id} initialLikes={post.likes} />
    </article>
  );
}
```

```tsx
// components/LikeButton.tsx — CLIENT
"use client";
// ... interactive like button
```

You CAN import a Client Component into a Server Component.
You CANNOT import a Server Component into a Client Component directly.

**Workaround:** Pass Server Components as `children` prop:

```tsx
// ClientWrapper.tsx
"use client";
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div>{open && children}</div>;
}

// page.tsx (server)
<ClientWrapper>
  <ServerOnlyContent />  {/* still runs on server! */}
</ClientWrapper>
```

─────────────────────────────────────────────────────────────
## SECTION 5: DATA FETCHING IN SERVER COMPONENTS
─────────────────────────────────────────────────────────────

```tsx
export default async function Page() {
  // Option A: direct function call
  const posts = await db.post.findMany();

  // Option B: fetch (cached by default in Next.js!)
  const res = await fetch("https://api.example.com/posts");
  const data = await res.json();

  return <PostList posts={data} />;
}
```

No `useEffect`. No loading state in the component (use `loading.tsx` instead).

Force dynamic (no cache):
```tsx
const res = await fetch(url, { cache: "no-store" });
// or at page level:
export const dynamic = "force-dynamic";
```

Revalidate every 60 seconds (ISR-like):
```tsx
const res = await fetch(url, { next: { revalidate: 60 } });
```

─────────────────────────────────────────────────────────────
## SECTION 6: DECISION TABLE (memorize!)
─────────────────────────────────────────────────────────────

| Need | Use |
|------|-----|
| Fetch data, render HTML | Server Component |
| Button click, toggle, form input | Client Component |
| SEO-critical content | Server Component |
| Chart, map, rich text editor | Client Component |
| Pass data to interactive child | Server → Client via props |
| Share state between client widgets | Client Component + Context |

─────────────────────────────────────────────────────────────
## PRACTICE TODO
─────────────────────────────────────────────────────────────

In your blog project:
1. Make `app/page.tsx` a server component that reads posts from JSON
2. Create `LikeButton` as a client component
3. Import LikeButton into the post detail page

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A
─────────────────────────────────────────────────────────────

**Q: Server vs client components — what runs where?**
A: Server Components render on the server, send HTML to browser, no
   client JS for that component. Client Components hydrate in browser
   with full interactivity and hooks.

**Q: When do you need "use client"?**
A: When the component needs hooks, event handlers, or browser APIs.

**Q: Can a Server Component import a Client Component?**
A: Yes. The client part becomes an "island" of interactivity.

**Q: Can a Client Component import a Server Component?**
A: Not directly. Pass server-rendered content as children or props from
   a parent Server Component.

**Q: Why are Server Components good for performance?**
A: Less JavaScript to the browser, data fetching on server (closer to DB),
   secrets stay server-side.
