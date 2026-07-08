# DAY 13 — Next.js 15 App Router (React, Full-Stack Mode)

## Today's Goal
Understand what Next.js adds over React: server components, file-based routing,
server actions, caching. The framework you'll use for real products.

## Content Ready
All **5 lesson files** in `lessons/` and the **blog-app** project in `project/blog-app/` are pre-built. Fill every `TODO` before checking answers.

## Morning Revision (2 hr)
Rebuild a shadcn Dialog + Toast flow from memory. Write a framer-motion
staggered list animation from memory.

## Lessons (in order) — ALL FILES EXIST in `lessons/`
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-why-nextjs.md` | CSR vs SSR vs SSG vs ISR — the rendering story, SEO, why Next exists | 45 min |
| 2 | `02-app-router-basics.md` | File-based routing: page/layout/loading/error/not-found, nested layouts | 60 min |
| 3 | `03-server-vs-client-components.tsx` | THE key concept: what runs where, "use client", composition patterns | 90 min |
| 4 | `04-data-fetching-and-caching.tsx` | fetch in server components, caching options, revalidate, dynamic vs static | 75 min |
| 5 | `05-server-actions.tsx` | "use server", forms without API routes, useFormStatus, revalidatePath | 75 min |
| 6 | `06-route-handlers-middleware.ts` | API routes in app dir, middleware.ts, redirects, metadata API | 45 min |

## Project (6 hours): Blog Platform (Next.js 15 + TypeScript + Tailwind)
Features:
- [ ] Home: post list (server component, static)
- [ ] /posts/[slug]: dynamic route + generateStaticParams + generateMetadata (SEO!)
- [ ] /posts/new: form using a SERVER ACTION (no API route!) with validation
- [ ] Like button (client component INSIDE server component — composition)
- [ ] Search with URL searchParams (server-side filtering — state in the URL)
- [ ] loading.tsx skeletons + error.tsx boundaries + not-found.tsx
- [ ] Nested layout: blog section with sidebar (recent posts, categories)
- [ ] Middleware: block /posts/new unless "logged in" (fake cookie check)
- [ ] Data layer: JSON file or SQLite for now (real DB tomorrow)
- [ ] Deploy to Vercel — your first live URL!

## Tonight's Notes
- Draw: request → server component renders → HTML + RSC payload → hydration
- Server vs client component — decision table (what CAN'T each do?)
- What server actions replace and why they're better for forms
- The 4 rendering strategies (CSR/SSR/SSG/ISR) — one line + one use case each

## Interview Questions
1. Server components vs client components — what runs where?
2. When do you need "use client"?
3. SSR vs SSG vs ISR — trade-offs?
4. What is a server action? How is it different from an API route?
5. How does Next.js caching work (fetch cache, revalidate)?
6. Why is putting search state in the URL better than useState?
