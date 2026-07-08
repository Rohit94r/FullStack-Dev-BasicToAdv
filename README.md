# 18-DAY FULL STACK MASTERY PLAN
## From Absolute Zero → Backend-Focused Full Stack Developer (Interview + Hackathon Level)

> **Who this is for:** You. You know workflows but concepts vanish after 2 days because
> tutorials give passive knowledge. This plan is ACTIVE — every day you type code,
> fill in blanks, build a small project, and write notes. Nothing is passive.
>
> **Time commitment:** 15+ hours/day × 18 days
> **Main goal:** Backend mastery (Node/Express/Next.js/FastAPI/PostgreSQL) + strong frontend (React/Next.js)
> **After this:** DSA in Java (see `dsa-java-plan/PLAN.md`)

---

## THE GOLDEN RULES (Read Every Morning)

1. **NEVER copy-paste code.** Type everything by hand. Muscle memory = real memory.
2. **Fill-in-the-blank first.** Every project file has `YOUR IDEA` comments. Try YOUR solution
   first, THEN look at the `ANSWER` below it. Even if wrong — trying first is what makes it stick.
3. **Explain out loud.** After each topic, explain it in simple words as if teaching a friend.
   If you can't explain it, you don't know it yet. Re-read.
4. **Notes every night (last 1 hour).** For each topic write in `notes.md`:
   - What is it? / Why use it? / Real example / Common mistake / 1 interview question
5. **Docs when stuck, not tutorials.** MDN, TypeScript Handbook, Node docs, React docs.
   YouTube = passive = forgotten in 2 days. Docs + typing = permanent.
6. **Every day's project MUST run before you sleep.** Broken code = unfinished day.

---

## DAILY ROUTINE (15 hours)

| Time Block | Hours | What |
|-----------|-------|------|
| Session 1 | 4 hr | Learn new concepts (read lesson files, run every example, modify them) |
| Session 2 | 2 hr | Re-do yesterday's hardest topic from memory (spaced repetition!) |
| Session 3 | 6 hr | Build the day's project (fill-in-the-blank, YOUR code first) |
| Session 4 | 2 hr | Read official docs on today's topics |
| Session 5 | 1 hr | Write notes + interview Q&A in your own words |

---

## THE 18-DAY MAP

### PHASE 1: FOUNDATIONS (Days 1-4)
| Day | Folder | Topics | Project |
|-----|--------|--------|---------|
| 1 | `day01-html-css` | HTML complete + CSS complete (box model, flexbox, grid, responsive, animations) | Personal Portfolio Page (pure HTML/CSS, responsive) |
| 2 | `day02-javascript-basics` | Variables, data types, operators, conditions, loops, functions, objects, arrays, strings, ES6+ | Console Quiz Game (pure JS, no browser) |
| 3 | `day03-javascript-advanced` | Closures, hoisting, event loop, promises, async/await, prototype, this, classes, HOF | Async Data Pipeline (fetch-simulator with retry, cache, queue) |
| 4 | `day04-typescript-and-task-api` | All TS: types, interfaces, generics, utility types, enums, narrowing | Task API (pure TS, no Express) — already scaffolded! |

### PHASE 2: BACKEND CORE — YOUR MAIN FOCUS (Days 5-9)
| Day | Folder | Topics | Project |
|-----|--------|--------|---------|
| 5 | `day05-nodejs-fundamentals` | Node event loop, modules, fs, path, http, streams, buffers, process, npm | Mini Express Clone (router + middleware from scratch) |
| 6 | `day06-express-rest-api` | Express, routing, middleware, REST design, validation, error handling, MVC structure | Notes REST API (full CRUD, proper structure) |
| 7 | `day07-authentication` | JWT, bcrypt, cookies, sessions, refresh tokens, RBAC, security best practices | Auth Server (register/login/refresh/logout/roles) |
| 8 | `day08-postgresql-database` | SQL from zero: SELECT→JOINs→indexes→transactions→normalization→schema design | Library DB (design schema + write 30 queries by hand) |
| 9 | `day09-express-postgres-prisma` | Prisma ORM, migrations, relations, connecting Express+PG, pagination, filtering | Library Management API (Express + Prisma + PG) |

### PHASE 3: FRONTEND (Days 10-14)
| Day | Folder | Topics | Project |
|-----|--------|--------|---------|
| 10 | `day10-react-basics` | Components, JSX, props, state, events, lists, forms, useEffect, conditional rendering | Todo App (React + Vite, all core hooks) |
| 11 | `day11-react-advanced-redux` | Custom hooks, useContext, useReducer, useMemo/useCallback, Redux Toolkit, RTK Query | Shopping Cart (Redux Toolkit + API integration) |
| 12 | `day12-ui-tailwind-shadcn-framer` | Tailwind CSS, shadcn/ui, lucide icons, framer-motion animations, responsive design | Upgrade Day 11 cart → beautiful animated UI |
| 13 | `day13-nextjs-app-router` | App Router, server/client components, server actions, route handlers, caching, middleware | Blog App (Next.js 15, SSR, dynamic routes) |
| 14 | `day14-nextjs-fullstack-project` | Full-stack Next.js: DB + auth + server actions together | Portfolio CMS (admin dashboard, CRUD, image upload) |

### PHASE 4: PYTHON BACKEND + PRODUCTION (Days 15-17)
| Day | Folder | Topics | Project |
|-----|--------|--------|---------|
| 15 | `day15-python-basics-to-advanced` | Python from zero: syntax, data structures, functions, OOP, comprehensions, decorators, async | CLI Expense Tracker (pure Python) |
| 16 | `day16-fastapi-backend` | FastAPI, Pydantic, dependency injection, async endpoints, SQLAlchemy + PostgreSQL | Todo API in FastAPI (same features as Day 6 — compare!) |
| 17 | `day17-production-backend-and-rag` | Docker, env vars, CORS, helmet, rate limiting, logging, file upload, email, RAG basics (embeddings, vector DB concept) | Production Backend Boilerplate + tiny RAG demo |

### PHASE 5: CAPSTONE (Day 18)
| Day | Folder | Topics | Project |
|-----|--------|--------|---------|
| 18 | `day18-capstone-saas-dashboard` | NOTHING NEW — prove you can build alone | Full SaaS Dashboard: Next.js + Express/FastAPI + PG + auth + charts + deploy. NO looking at old code for first 4 hours. |

### AFTER DAY 18 → `dsa-java-plan/PLAN.md` (Java + DSA from zero)

---

## HOW EACH DAY'S FOLDER WORKS

```
dayXX-topic-name/
├── README.md        ← Day plan: topics, checklist, project spec, interview Qs
├── lessons/         ← Concept files with heavy comments (run each one!)
├── project/         ← Fill-in-the-blank project
│   └── (each file: TODO comment → YOUR IDEA space → ANSWER below)
└── notes.md         ← YOU write this every night (your interview revision book)
```

### The Fill-in-the-Blank System
Every project file looks like this:
```ts
// TODO: Implement addTask(input): should validate title, generate id, store task
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER (only look after trying!) ───
// ... working solution with explanation comments ...
```
Your workflow: read TODO → close the answer → write YOUR version → compare → fix → understand WHY.

---

## COMPLETION STATUS

All 18 days are **fully pre-built** — lessons, fill-in-the-blank projects, and interview questions.

| Day | Folder | Lessons | Project | Interview Qs |
|-----|--------|---------|---------|--------------|
| 1 | `day01-html-css` | ✅ | ✅ Portfolio | ✅ |
| 2 | `day02-javascript-basics` | ✅ | ✅ Quiz game | ✅ |
| 3 | `day03-javascript-advanced` | ✅ | ✅ Async pipeline | ✅ |
| 4 | `day04-typescript-and-task-api` | ✅ | ✅ Task API | ✅ |
| 5 | `day05-nodejs-fundamentals` | ✅ | ✅ Mini Express | ✅ |
| 6 | `day06-express-rest-api` | ✅ | ✅ Notes API | ✅ |
| 7 | `day07-authentication` | ✅ | ✅ Auth server | ✅ |
| 8 | `day08-postgresql-database` | ✅ | ✅ Library DB | ✅ |
| 9 | `day09-express-postgres-prisma` | ✅ | ✅ Library API | ✅ |
| 10 | `day10-react-basics` | ✅ | ✅ Todo app | ✅ |
| 11 | `day11-react-advanced-redux` | ✅ | ✅ Shopping cart | ✅ |
| 12 | `day12-ui-tailwind-shadcn-framer` | ✅ | ✅ Animated UI | ✅ |
| 13 | `day13-nextjs-app-router` | ✅ | ✅ Blog | ✅ |
| 14 | `day14-nextjs-fullstack-project` | ✅ | ✅ Portfolio CMS | ✅ |
| 15 | `day15-python-basics-to-advanced` | ✅ | ✅ Expense tracker | ✅ |
| 16 | `day16-fastapi-backend` | ✅ | ✅ FastAPI todo | ✅ |
| 17 | `day17-production-backend-and-rag` | ✅ | ✅ Boilerplate + RAG | ✅ |
| 18 | `day18-capstone-saas-dashboard` | ✅ | ✅ TrackStack | ✅ |

Open any day's folder and start — no generation step required.

---

## MASTER PROGRESS TRACKER

> All lesson files, projects, and interview questions are pre-built. Check boxes as **you** complete each day.

- [ ] Day 1 — HTML + CSS + Portfolio page
- [ ] Day 2 — JavaScript basics + Quiz game
- [ ] Day 3 — JavaScript advanced + Async pipeline
- [ ] Day 4 — TypeScript + Task API
- [ ] Day 5 — Node.js + Mini Express clone
- [ ] Day 6 — Express + Notes REST API
- [ ] Day 7 — Authentication server
- [ ] Day 8 — PostgreSQL + Library schema
- [ ] Day 9 — Express + Prisma + Library API
- [ ] Day 10 — React basics + Todo app
- [ ] Day 11 — React advanced + Redux cart
- [ ] Day 12 — Tailwind + shadcn + framer-motion UI
- [ ] Day 13 — Next.js App Router + Blog
- [ ] Day 14 — Next.js full-stack Portfolio CMS
- [ ] Day 15 — Python + Expense tracker
- [ ] Day 16 — FastAPI + Todo API
- [ ] Day 17 — Production backend + RAG demo
- [ ] Day 18 — CAPSTONE SaaS Dashboard deployed

---

## FINAL DELIVERABLES (Your GitHub After 18 Days)

1. Portfolio page (HTML/CSS)
2. Quiz game (JS)
3. Async pipeline (JS)
4. Task API (TypeScript)
5. Mini Express clone (Node)
6. Notes REST API (Express)
7. Auth server (JWT + RBAC)
8. Library schema + 30 SQL queries
9. Library Management API (Prisma + PG)
10. Todo app (React)
11. Shopping cart (Redux Toolkit)
12. Animated UI (shadcn + framer-motion)
13. Blog (Next.js)
14. Portfolio CMS (Next.js full-stack)
15. Expense tracker (Python)
16. Todo API (FastAPI)
17. Production boilerplate + RAG demo
18. **SaaS Dashboard (deployed, live URL)**
19. `notes.md` × 18 = your personal interview book

---

## INTERVIEW PREPARATION BUILT-IN

Every lesson file ends with an **Interview Q&A** section.
Every night, answer them OUT LOUD without looking.
By Day 18 you'll have answered 200+ interview questions multiple times.
That's why the basics won't vanish this time — spaced repetition + building + explaining.
