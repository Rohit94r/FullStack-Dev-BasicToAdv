# Day 14 — Next.js Full-Stack Project Interview Questions & Answers

---

## SECTION A — Full-Stack Next.js Architecture

**Q1. What is the "full-stack" in Next.js? How does it differ from a separate frontend + backend?**
A: Next.js full-stack: frontend (React pages), backend (API routes or Server Actions), and data layer (Prisma) — all in ONE repository.
   Separate: Next.js frontend calling Express/FastAPI backend on different domain/port.
   
   Full-stack Next.js benefits: simpler deployment, shared types (TypeScript), no CORS, faster iteration.
   Separate benefits: independent scaling, different language for backend (Python/Go), larger teams can work independently.
   For startups and solo devs: full-stack Next.js wins for speed.

**Q2. When should you use API Routes vs Server Actions in Next.js?**
A: API Routes (`app/api/route.ts`):
   - Need a public REST API for mobile app or external consumers.
   - Webhooks from external services.
   - Need to respond to non-POST methods (webhooks often use GET).
   - Complex response headers, streaming responses.
   
   Server Actions:
   - Form submissions from your own frontend.
   - Simple CRUD from your Next.js pages.
   - No need for a separate API endpoint URL.
   - Progressive enhancement (works without JS too).
   
   Rule of thumb: Server Actions for your own frontend mutations. API Routes when you need a "real" API.

**Q3. How do you handle authentication in a full-stack Next.js app?**
A: Recommended approach: Auth.js (formerly NextAuth.js) v5.
   ```typescript
   // auth.ts
   export const { auth, signIn, signOut, handlers } = NextAuth({
     providers: [GitHub, Google, Credentials({...})],
     callbacks: {
       async session({ session, token }) {
         session.user.id = token.sub;
         return session;
       }
     }
   });
   
   // In Server Component: const session = await auth();
   // In Client Component: const session = useSession();
   // Middleware: auth() to protect routes
   ```
   Auth.js handles: OAuth flow, session management, JWT, database adapters (Prisma adapter).

**Q4. How do you structure a Next.js full-stack project?**
A: ```
   src/
   ├── app/
   │   ├── (auth)/           → auth group (login, register)
   │   ├── (dashboard)/      → protected dashboard
   │   │   ├── layout.tsx    → dashboard layout
   │   │   └── page.tsx      → dashboard home
   │   ├── api/              → API routes
   │   │   └── users/route.ts
   │   └── layout.tsx        → root layout
   ├── components/
   │   ├── ui/               → shadcn components
   │   └── features/         → feature-specific components
   ├── lib/
   │   ├── db.ts             → Prisma client singleton
   │   ├── auth.ts           → Auth.js config
   │   └── utils.ts          → utilities
   ├── actions/              → Server Actions
   ├── schemas/              → Zod validation schemas
   └── types/                → TypeScript types
   prisma/schema.prisma
   ```

**Q5. What is a Prisma client singleton and why is it needed?**
A: In development with hot-reload, Next.js re-creates modules on every file save.
   If you do `new PrismaClient()` in each module → multiple connections → "too many clients" error.
   Solution: create ONE instance and reuse it:
   ```typescript
   // lib/db.ts
   import { PrismaClient } from "@prisma/client";
   
   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
   
   export const prisma = globalForPrisma.prisma ?? new PrismaClient();
   
   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
   ```
   In production (no hot reload): always creates one instance.
   In development: stores on `globalThis` so hot reload reuses the same connection.

---

## SECTION B — API Routes in App Router

**Q6. How do you create API routes in Next.js App Router?**
A: Create `route.ts` files in the `app/api/` directory.
   ```typescript
   // app/api/users/route.ts
   import { NextRequest, NextResponse } from "next/server";
   
   export async function GET(request: NextRequest) {
     const users = await prisma.user.findMany();
     return NextResponse.json(users);
   }
   
   export async function POST(request: NextRequest) {
     const body = await request.json();
     const user = await prisma.user.create({ data: body });
     return NextResponse.json(user, { status: 201 });
   }
   ```
   Dynamic: `app/api/users/[id]/route.ts` → `GET(req, { params: { id } })`.
   Export named functions for each HTTP method you want to handle.

**Q7. How do you protect API routes in Next.js?**
A: ```typescript
   // app/api/admin/route.ts
   import { auth } from "@/lib/auth";
   
   export async function GET(request: NextRequest) {
     const session = await auth(); // Get current session
     
     if (!session) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
     
     if (session.user.role !== "admin") {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
     }
     
     const data = await prisma.user.findMany();
     return NextResponse.json(data);
   }
   ```
   Middleware is even better — protects before the route even runs.

---

## SECTION C — Performance & SEO

**Q8. How do you optimize SEO in Next.js?**
A: ```typescript
   // app/page.tsx
   import type { Metadata } from "next";
   
   export const metadata: Metadata = {
     title: "My App",
     description: "The best app",
     openGraph: { title: "My App", description: "...", images: ["/og.png"] },
     twitter: { card: "summary_large_image" },
   };
   
   // Dynamic metadata:
   export async function generateMetadata({ params }): Promise<Metadata> {
     const post = await prisma.post.findUnique({ where: { id: params.id } });
     return { title: post.title, description: post.excerpt };
   }
   ```
   Server Components render HTML → search engines can index content.
   Use semantic HTML (h1, h2, article, nav, main).
   Structured data (JSON-LD) for rich search results.

**Q9. What is the `generateStaticParams` function?**
A: Tells Next.js which dynamic routes to pre-render at build time.
   ```typescript
   // app/blog/[slug]/page.tsx
   export async function generateStaticParams() {
     const posts = await prisma.post.findMany({ select: { slug: true } });
     return posts.map(post => ({ slug: post.slug }));
   }
   ```
   Next.js pre-renders all these routes as static HTML.
   Requests for these pages serve instantly from CDN — no server computation.
   Unknown slugs: runtime SSR (dynamicParams = true, default) or 404 (dynamicParams = false).

**Q10. What are Core Web Vitals? How does Next.js help?**
A: Google's metrics for page quality:
   LCP (Largest Contentful Paint) → how long until main content loads. Target: < 2.5s.
   INP (Interaction to Next Paint) → response time to user input. Target: < 200ms.
   CLS (Cumulative Layout Shift) → how much content jumps around. Target: < 0.1.
   
   Next.js helps:
   - Server rendering → content arrives pre-rendered → faster LCP.
   - next/image → prevents CLS (requires dimensions), lazy loading, optimized formats.
   - next/font → no layout shift from font loading (font inlined).
   - Code splitting → smaller JS bundles → faster INP.
   - Static generation → instant response from CDN → faster LCP.
