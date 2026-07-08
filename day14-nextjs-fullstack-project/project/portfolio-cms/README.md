# Day 14 Project — Portfolio CMS (Full-Stack Next.js)

Your first **complete full-stack app** in one framework:
Next.js 15 + Prisma + PostgreSQL + session auth + shadcn UI + file upload.

This is portfolio-worthy. Deploy it live by end of day.

---

## Setup

```bash
npx create-next-app@latest portfolio-cms --typescript --tailwind --eslint --app --src-dir
cd portfolio-cms

# Database
npm install prisma @prisma/client
npx prisma init

# Auth + validation
npm install bcryptjs zod
npm install -D @types/bcryptjs

# shadcn (reuse Day 12)
npx shadcn@latest init
npx shadcn@latest add button card input textarea dialog table toast form badge

# Set DATABASE_URL in .env (Neon/Supabase/local Postgres)
# npx prisma migrate dev --name init
# npx prisma db seed  (optional)

npm run dev
```

---

## Architecture overview

```
┌─────────────┐     middleware.ts      ┌──────────────────┐
│   Browser   │ ─────────────────────▶ │  /admin/* gate   │
└─────────────┘                        └──────────────────┘
       │                                        │
       ▼                                        ▼
┌─────────────────┐                   ┌─────────────────┐
│  Public routes  │                   │  Admin routes   │
│  / (server)     │                   │  /admin (CRUD)  │
│  /projects/[slug]│                  │  server actions │
│  contact form   │                   │  + shadcn UI    │
└────────┬────────┘                   └────────┬────────┘
         │                                     │
         └──────────────┬──────────────────────┘
                        ▼
              ┌─────────────────┐
              │  Prisma Client  │  ← singleton in lib/db.ts
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              └─────────────────┘
```

---

## Database models

See `prisma/schema.prisma`:
- **User** — admin login (email + hashed password)
- **Project** — portfolio items (title, slug, description, image, featured)
- **Message** — contact form submissions (read/unread)
- **Tag** — labels for projects (many-to-many with Project)

---

## Folder structure (scaffold — fill TODOs!)

```
portfolio-cms/
├── prisma/
│   └── schema.prisma              ← models (partial + TODO)
├── src/
│   ├── middleware.ts              ← protect /admin (TODO)
│   ├── lib/
│   │   ├── db.ts                  ← Prisma singleton (TODO)
│   │   └── auth.ts                ← session helpers (TODO)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── (public)/
│   │   │   ├── page.tsx           ← hero + featured projects (TODO)
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx       ← all projects (TODO)
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx       ← contact form (TODO)
│   │   ├── admin/
│   │   │   ├── layout.tsx         ← admin shell + nav (TODO)
│   │   │   ├── page.tsx           ← dashboard stats (TODO)
│   │   │   ├── login/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx       ← DataTable list (TODO)
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── messages/page.tsx  ← inbox (TODO)
│   │   └── actions/
│   │       ├── projects.ts        ← CRUD server actions (TODO)
│   │       ├── messages.ts        ← mark read, delete (TODO)
│   │       ├── contact.ts         ← public contact form (TODO)
│   │       └── auth.ts            ← login/logout (TODO)
│   └── components/
│       ├── admin/ProjectForm.tsx
│       └── public/ProjectCard.tsx
└── README.md
```

---

## Features checklist

### Public site
- [ ] Home: hero section + featured projects (server component, from DB)
- [ ] `/projects` — grid of all published projects
- [ ] `/projects/[slug]` — detail page + `generateMetadata`
- [ ] Contact form → server action → saves `Message` to DB

### Admin (`/admin` — middleware protected)
- [ ] Login: email/password → bcrypt verify → session cookie
- [ ] Dashboard: counts (projects, unread messages) in shadcn Cards
- [ ] Projects CRUD: list, create, edit, delete (with confirm Dialog)
- [ ] Image upload for project thumbnail (FormData in server action)
- [ ] Messages inbox: list, mark read, delete
- [ ] Toast on every mutation

### Database
- [ ] User, Project, Message, Tag models
- [ ] Many-to-many: Project ↔ Tag
- [ ] Seed script with demo admin user + projects

### Deploy
- [ ] Vercel + Neon/Supabase Postgres
- [ ] Environment variables configured
- [ ] **Live URL in your portfolio**

---

## Auth flow (build yourself using Day 7 knowledge)

1. `POST /admin/login` → server action verifies bcrypt hash
2. Set `httpOnly` session cookie (user id or signed token)
3. `middleware.ts` checks cookie on `/admin/*` routes
4. `logout` action clears cookie

No NextAuth required — build it to understand auth deeply.

---

## Prisma singleton pattern (CRITICAL for Next.js dev)

```ts
// lib/db.ts — prevents connection pool exhaustion in hot reload
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

**Interview question:** "Why?" — Because Next.js dev hot-reloads modules,
creating new PrismaClient instances each time → exhausts DB connections.

---

## Image upload approach

In server action:
```ts
const file = formData.get("image") as File;
const bytes = await file.arrayBuffer();
const buffer = Buffer.from(bytes);
// Save to public/uploads/ or cloud (Cloudinary/S3)
```

Validate: file type, max size (5MB), sanitize filename.

---

## How to work through this

1. Schema + migrate + seed
2. Public home page (read projects)
3. Admin login + middleware
4. Projects CRUD
5. Contact form + messages inbox
6. Polish UI with shadcn
7. Deploy

Every scaffold file: `TODO` → YOUR IDEA → ANSWER.

---

## Interview prep

Practice explaining:
1. Full request flow when user submits contact form
2. How admin routes are protected
3. Why server actions instead of API routes here
4. Prisma singleton pattern
5. How you'd paginate projects at 1M rows (cursor pagination, indexes)

---

## Definition of done

- [ ] Public site looks professional (Day 12 UI skills)
- [ ] Admin can CRUD projects without touching DB manually
- [ ] Contact messages appear in admin inbox
- [ ] Deployed with live URL
- [ ] You can demo the entire app in 3 minutes
