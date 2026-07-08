# TrackStack — Day 18 Capstone

**Project & Task Management SaaS** — workspaces, projects, tasks, dashboard, deploy.

> First 4 hours: build alone. No old code. No AI code generation.  
> After hour 4: reference your Days 6–17 projects.

---

## Stack (pick and justify in your README)

| Layer | Option A | Option B |
|-------|----------|----------|
| Frontend | Next.js 15 App Router | Next.js 15 |
| Backend | Server Actions + Route Handlers | Express or FastAPI API |
| DB | PostgreSQL + Prisma | Same |
| Auth | NextAuth / JWT | JWT (Day 7 pattern) |
| UI | shadcn + Tailwind + framer-motion | Same |
| Charts | recharts | Same |
| Deploy | Vercel + Neon | Railway / Render |

---

## Folder structure (scaffold — fill every TODO)

```
trackstack/
├── prisma/schema.prisma       ← starter schema (extend if needed)
├── src/
│   ├── app/                   ← Next.js pages (YOU create)
│   ├── lib/
│   │   ├── db.ts              ← Prisma client singleton
│   │   └── auth.ts            ← session/JWT helpers
│   ├── actions/               ← server actions (Option A)
│   │   ├── auth.ts
│   │   ├── workspaces.ts
│   │   ├── projects.ts
│   │   └── tasks.ts
│   └── api/                   ← route handlers OR Express mount
│       └── routes/
│           ├── auth.ts
│           ├── workspaces.ts
│           ├── projects.ts
│           └── tasks.ts
├── components/                ← UI components (YOU create)
└── README.md                  ← YOU write: setup, arch diagram, trade-offs
```

---

## Required features

### Auth
- [ ] Register / login / logout
- [ ] Roles: `OWNER`, `MEMBER` on workspace membership

### Core
- [ ] Workspaces — create, list, invite member (email invite stub OK)
- [ ] Projects — CRUD within workspace (owner/member access)
- [ ] Tasks — status, priority, assignee, due date, CRUD
- [ ] Kanban board OR table view with filters
- [ ] Search + pagination on tasks

### Dashboard
- [ ] Stats: total / completed / overdue tasks
- [ ] Chart: tasks completed per day (recharts)
- [ ] Recent activity feed

### Polish
- [ ] shadcn UI, dark mode, responsive
- [ ] Toasts, loading skeletons, empty states, error boundaries
- [ ] Zod validation on every input

### Production
- [ ] Deployed live URL
- [ ] README with architecture diagram and decisions

---

## Environment variables

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...          # or JWT_SECRET
NEXTAUTH_URL=http://localhost:3000
```

---

## Setup (after you implement TODOs)

```bash
cd project/trackstack
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

---

## Grading yourself (honest checklist)

| Score | Meaning |
|-------|---------|
| Deployed + auth + tasks CRUD | Pass — you're job-ready for junior full-stack |
| + dashboard + kanban | Strong pass |
| + polish + activity feed | Interview-ready capstone |

---

## Final deliverable

Live URL in README + 5-minute voice memo answering the questions in `lessons/01-capstone-guide.md`.
