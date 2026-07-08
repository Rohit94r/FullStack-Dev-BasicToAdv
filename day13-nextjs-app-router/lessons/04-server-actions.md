# ============================================================
# DAY 13 — LESSON 4: SERVER ACTIONS
# Interview Level: Intermediate → Advanced
# Time: ~75 min
# ============================================================

Server Actions let you run **server-side functions** directly from forms
and client components — without writing a separate API route.

Think: "I click Submit → a function runs on the server → database updates
→ page re-renders with fresh data."

─────────────────────────────────────────────────────────────
## SECTION 1: THE SIMPLEST SERVER ACTION
─────────────────────────────────────────────────────────────

```tsx
// app/actions/posts.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // Validate (use Zod in production!)
  if (!title?.trim()) {
    return { error: "Title is required" };
  }

  // Save to DB or JSON file
  await savePost({ title, content, slug: slugify(title) });

  revalidatePath("/");           // refresh cached pages
  redirect(`/posts/${slugify(title)}`);
}
```

```tsx
// app/posts/new/page.tsx — can be a Server Component!
import { createPost } from "@/app/actions/posts";

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Publish</button>
    </form>
  );
}
```

No `fetch("/api/posts")`. No `useEffect`. The form POSTs to your server function.

─────────────────────────────────────────────────────────────
## SECTION 2: "use server" — TWO PLACES
─────────────────────────────────────────────────────────────

**Option A:** Top of a file (all exports are server actions)
```ts
"use server";
export async function deletePost(id: string) { ... }
```

**Option B:** Inline in a Server Component (single action)
```tsx
export default function Page() {
  async function submit(formData: FormData) {
    "use server";
    // ...
  }
  return <form action={submit}>...</form>;
}
```

Prefer **separate `actions/` files** for reuse and testing.

─────────────────────────────────────────────────────────────
## SECTION 3: RETURNING ERRORS TO THE FORM
─────────────────────────────────────────────────────────────

Server actions can return data (not just redirect):

```tsx
"use server";

export async function createPost(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const title = formData.get("title") as string;
  if (!title) return { error: "Title required" };
  await savePost({ title });
  revalidatePath("/");
  return { error: undefined };
}
```

Use with `useFormState` (client component wrapper):

```tsx
"use client";

import { useFormState } from "react-dom";
import { createPost } from "@/app/actions/posts";

export function NewPostForm() {
  const [state, action] = useFormState(createPost, null);

  return (
    <form action={action}>
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

─────────────────────────────────────────────────────────────
## SECTION 4: useFormStatus — LOADING STATE
─────────────────────────────────────────────────────────────

```tsx
"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Publish"}
    </button>
  );
}
```

`useFormStatus` must be used inside a component that is a **child of `<form>`**.

─────────────────────────────────────────────────────────────
## SECTION 5: revalidatePath vs revalidateTag
─────────────────────────────────────────────────────────────

After mutating data, tell Next.js to refresh cached pages:

```ts
import { revalidatePath, revalidateTag } from "next/cache";

revalidatePath("/");              // refresh home page cache
revalidatePath("/posts/[slug]", "page");  // specific dynamic route
revalidateTag("posts");            // refresh all fetches tagged "posts"
```

Tag fetches when reading:
```ts
fetch(url, { next: { tags: ["posts"] } });
```

─────────────────────────────────────────────────────────────
## SECTION 6: SERVER ACTIONS vs API ROUTES
─────────────────────────────────────────────────────────────

| Server Action | API Route (`route.ts`) |
|---------------|------------------------|
| Form submissions, mutations | REST API for external clients |
| Called from your Next.js UI | Mobile app, webhooks, third parties |
| Automatic progressive enhancement | Manual fetch + JSON |
| Type-safe with TypeScript | Manual request/response typing |

**Rule:** If only YOUR Next.js app calls it → Server Action.
If external clients need it → Route Handler.

─────────────────────────────────────────────────────────────
## SECTION 7: VALIDATION WITH ZOD
─────────────────────────────────────────────────────────────

```ts
"use server";

import { z } from "zod";

const PostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
});

export async function createPost(formData: FormData) {
  const parsed = PostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await savePost(parsed.data);
  revalidatePath("/");
}
```

─────────────────────────────────────────────────────────────
## PRACTICE TODO
─────────────────────────────────────────────────────────────

In blog project:
1. Implement `createPost` server action with validation
2. Wire `/posts/new` form to the action
3. Add `useFormStatus` submit button with loading state
4. Call `revalidatePath("/")` after create

─────────────────────────────────────────────────────────────
## INTERVIEW Q&A
─────────────────────────────────────────────────────────────

**Q: What is a server action?**
A: An async function marked with `"use server"` that runs on the server,
   callable from forms or client components, enabling mutations without
   a separate API route.

**Q: Server action vs API route?**
A: Actions = internal UI mutations, progressive enhancement, simpler DX.
   API routes = external HTTP clients, webhooks, non-Next consumers.

**Q: What does revalidatePath do?**
A: Invalidates Next.js cached data for a path so the next request fetches
   fresh content.

**Q: Why useFormStatus?**
A: Gives pending state during server action execution for submit buttons
   without manual useState loading flags.

**Q: Can server actions be called from client components?**
A: Yes — import and call directly, or pass to form `action` prop.
