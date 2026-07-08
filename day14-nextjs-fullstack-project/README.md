# DAY 14 — Next.js Full-Stack: Portfolio CMS (Everything Together)

## Today's Goal
Your first COMPLETE full-stack app in one framework:
Next.js + Prisma + PostgreSQL + auth + file upload + shadcn UI.
This is a portfolio-worthy project.

## Content Ready
The **portfolio-cms** project in `project/portfolio-cms/` is pre-built (Prisma schema + app scaffold). Fill every `TODO` before checking answers. Review Day 13 lessons for concepts — no new lesson files today.

## Morning Revision (2 hr)
From memory: write a server action with validation + revalidatePath.
Explain server vs client components out loud in 2 minutes.

## No new lessons today — 2hr concept review instead
| Topic | Review |
|-------|--------|
| Prisma in Next.js | Singleton client pattern (why!), where queries live | 30 min |
| Auth in Next.js | Session cookie + middleware protection (build simple version yourself) | 45 min |
| File uploads | FormData in server actions, saving to disk/cloud | 30 min |
| Deployment | Environment variables, connection pooling on Vercel | 15 min |

## Project (10+ hours): Portfolio CMS
An admin dashboard where you manage your OWN portfolio content —
public site + protected admin area.

Public site:
- [ ] Home: hero, featured projects (from DB, server components)
- [ ] /projects + /projects/[slug] with generateMetadata
- [ ] Contact form → server action → saves message to DB

Admin area (/admin — protected by middleware):
- [ ] Login page (credentials → bcrypt check → session cookie — YOUR auth from Day 7 knowledge!)
- [ ] Dashboard: counts (projects, messages, views) in shadcn Cards
- [ ] Projects CRUD: DataTable, create/edit forms (server actions + Zod), delete with confirm Dialog
- [ ] Image upload for project thumbnails
- [ ] Messages inbox: list, mark read, delete
- [ ] Toast feedback on every action, loading states everywhere

Database (Prisma + PostgreSQL):
- [ ] User, Project, Message, Tag models (N-N: Project↔Tag)

Deploy:
- [ ] Vercel + hosted Postgres (Neon/Supabase) — LIVE URL by tonight

## Tonight's Notes
- Full request flow diagram of YOUR app: browser → middleware → server component → Prisma → PG
- Why the Prisma singleton pattern in Next.js dev
- How your session auth works (cookie → middleware → protected page)

## Interview Questions
1. Walk me through what happens when a user submits the contact form. (Practice this — it's a REAL interview question about YOUR project!)
2. How did you protect admin routes?
3. Why server actions instead of API routes here?
4. How would you scale this if projects table had 1M rows?
