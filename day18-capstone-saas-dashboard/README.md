# DAY 18 — CAPSTONE: SaaS Dashboard (Prove It)

## Today's Goal
Build a complete SaaS dashboard ALONE. First 4 hours: NO looking at old code,
NO asking me for code. This is the exam. After 4 hours, you may reference
your own previous projects (that's what real developers do).

## The Rules
1. Hours 0-4: solo. Only official docs allowed.
2. Hours 4-13: your old projects are your reference library.
3. Hour 13-14: deploy.
4. Hour 14-15: write the README + architecture explanation (interview practice).
5. I'm allowed for: environment issues, deployment blockers, code review at the end.

## Capstone guide
Read `lessons/01-capstone-guide.md` first — architecture, phases, hour-by-hour plan.

## The Project: `project/trackstack/` — Project & Task Management SaaS
(Or pick your own equivalent-scope idea — bug tracker, habit tracker with teams, CRM-lite)

### Stack (your choice — justify it in the README!)
- Option A: Next.js full-stack (like Day 14)
- Option B: Next.js frontend + Express or FastAPI backend (more impressive, more work)
- PostgreSQL + Prisma/SQLAlchemy either way

### Required Features
**Auth:**
- [ ] Register / login / logout (JWT or session — your call)
- [ ] Roles: owner, member

**Core:**
- [ ] Workspaces (user owns workspaces, can invite members — N-N!)
- [ ] Projects within workspaces (CRUD)
- [ ] Tasks within projects: status, priority, assignee, due date (CRUD)
- [ ] Kanban board OR table view with drag/filter
- [ ] Search + filters + pagination on tasks

**Dashboard:**
- [ ] Stats cards: total/completed/overdue tasks
- [ ] Chart: tasks completed per day (recharts — first time, read its docs, you can do it now!)
- [ ] Recent activity feed

**Polish:**
- [ ] shadcn UI + dark mode + responsive + framer-motion touches
- [ ] Toasts, loading skeletons, empty states, error boundaries
- [ ] Zod/Pydantic validation on every input

**Production:**
- [ ] Deployed with live URL (Vercel + Neon/Supabase, or Railway/Render)
- [ ] README: setup instructions, architecture diagram, decisions + trade-offs

## The Final Test (tonight)
Record yourself (voice memo) answering these — like a real interview:
1. "Walk me through your architecture."
2. "How does authentication work in your app?"
3. "How did you model workspaces and members in the database?"
4. "What would break first at 100k users? How would you fix it?"
5. "What was the hardest bug today and how did you debug it?"

If you can answer these smoothly — YOU ARE READY. Next: `../dsa-java-plan/PLAN.md`

## After Deployment Checklist
- [ ] All 18 projects pushed to GitHub with READMEs
- [ ] notes.md × 18 collected into one `fullstack-notes` repo (your interview book)
- [ ] Capstone live URL added to your resume
- [ ] Start DSA plan tomorrow
