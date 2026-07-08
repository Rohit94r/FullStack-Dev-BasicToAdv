# Day 13 Project — Blog Platform (Next.js 15 App Router)

Build a blog with server components, dynamic routes, server actions,
and middleware-protected authoring.

## Setup

```bash
npx create-next-app@latest blog-app --typescript --tailwind --eslint --app --src-dir
cd blog-app

# Optional: shadcn for nicer UI (reuse Day 12 knowledge)
npx shadcn@latest init
npx shadcn@latest add button card input textarea skeleton

npm run dev
```

Open http://localhost:3000

## Folder structure (scaffold — fill in TODOs!)

```
blog-app/
├── src/
│   ├── middleware.ts                 ← protect /posts/new (TODO)
│   ├── app/
│   │   ├── layout.tsx                ← root layout (TODO: nav)
│   │   ├── page.tsx                  ← home: post list (TODO)
│   │   ├── loading.tsx               ← home skeleton (TODO)
│   │   ├── error.tsx                 ← error boundary (TODO)
│   │   ├── not-found.tsx             ← 404 page (TODO)
│   │   ├── login/
│   │   │   └── page.tsx              ← fake login → set cookie (TODO)
│   │   ├── posts/
│   │   │   ├── layout.tsx            ← blog section + sidebar (TODO)
│   │   │   ├── page.tsx              ← all posts + search (TODO)
│   │   │   ├── new/
│   │   │   │   └── page.tsx          ← create form → server action (TODO)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          ← post detail + LikeButton (TODO)
│   │   │       ├── loading.tsx       ← post skeleton (TODO)
│   │   │       └── not-found.tsx     ← post not found (TODO)
│   │   └── actions/
│   │       └── posts.ts              ← createPost, likePost (TODO)
│   ├── components/
│   │   ├── LikeButton.tsx            ← "use client" (TODO)
│   │   ├── PostCard.tsx              ← server or client? decide! (TODO)
│   │   ├── SearchBar.tsx             ← client, syncs URL params (TODO)
│   │   └── NewPostForm.tsx           ← useFormStatus wrapper (TODO)
│   └── lib/
│       ├── posts.ts                  ← read/write posts.json (TODO)
│       └── types.ts                  ← Post type (TODO)
├── data/
│   └── posts.json                    ← seed data (provided)
└── README.md
```

## Features checklist

- [ ] Home: post list (server component, reads JSON/DB)
- [ ] `/posts/[slug]`: dynamic route + `generateStaticParams` + `generateMetadata`
- [ ] `/posts/new`: server action form (no API route!)
- [ ] Like button (client component inside server page)
- [ ] Search via URL `?q=` (server-side filter)
- [ ] `loading.tsx` skeletons + `error.tsx` + `not-found.tsx`
- [ ] Nested layout: sidebar with recent posts
- [ ] Middleware: block `/posts/new` unless logged in (cookie)
- [ ] Deploy to Vercel

## Data layer (start simple)

Use `data/posts.json` for now. Tomorrow (Day 14) you'll use Prisma.

```json
[
  {
    "id": "1",
    "slug": "hello-nextjs",
    "title": "Hello Next.js",
    "excerpt": "My first post",
    "content": "<p>Welcome to the blog.</p>",
    "createdAt": "2026-01-01",
    "likes": 0
  }
]
```

## How to work through this

1. Start with `lib/types.ts` and `lib/posts.ts` (data layer)
2. Build `app/page.tsx` (server component list)
3. Add dynamic `[slug]` route
4. Add server action + `/posts/new`
5. Add middleware + login
6. Polish with loading/error states

Every file has `TODO` → YOUR IDEA → ANSWER pattern.

## Interview prep

Explain out loud the request flow for `/posts/new` submit:
Browser → middleware → server action → save → revalidatePath → redirect
