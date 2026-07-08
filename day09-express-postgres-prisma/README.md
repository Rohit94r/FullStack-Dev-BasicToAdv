# DAY 9 — Express + PostgreSQL + Prisma (The Real Backend Stack)

## Today's Goal
Connect everything: Express API + PostgreSQL through Prisma ORM.
This is THE stack for your internship. Migrations, relations, transactions in code.

## Content Ready
All **5 lesson files** in `lessons/` and the **library-api** project in `project/library-api/` are pre-built. Fill every `TODO` before checking answers.

## Morning Revision (2 hr)
Write from memory: a 3-table JOIN query, a GROUP BY with HAVING,
and draw yesterday's schema.

## Lessons (in order) — ALL FILES EXIST in `lessons/`
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-what-is-an-orm.md` | ORM vs raw SQL, trade-offs, when to drop to raw SQL | 30 min |
| 2 | `02-prisma-setup.md` | Install, schema.prisma, datasource, generator, first migration | 45 min |
| 3 | `03-prisma-schema.prisma` | Models, field types, @id @unique @default, relations (1-N, N-N), enums | 75 min |
| 4 | `04-prisma-crud.ts` | create, findMany/findUnique, update, delete, select vs include | 60 min |
| 5 | `05-prisma-advanced.ts` | Filtering, pagination (cursor + offset), orderBy, aggregations, transactions | 75 min |
| 6 | `06-migrations-workflow.md` | migrate dev vs deploy, schema changes safely, seeding | 30 min |

## Project (6 hours): Library Management API
Yesterday's schema → today's full API. Combines Days 6+7+8+9!

```
project/library-api/
├── prisma/schema.prisma      ← your Day 8 schema in Prisma syntax
├── prisma/seed.ts
└── src/ (same layered structure as Day 6)
```

Features:
- [ ] Full CRUD: /books, /authors, /categories, /users
- [ ] POST /borrow (transaction! decrement available copies + create record — must be atomic)
- [ ] POST /return (update record + increment copies)
- [ ] GET /books?search=&category=&author=&available=true (dynamic filtering)
- [ ] Pagination on all list endpoints (?page, ?limit + total count in response)
- [ ] GET /stats (most borrowed, overdue count — Prisma aggregations)
- [ ] Auth from Day 7: only admins can create/delete books, users can borrow
- [ ] Proper error handling: borrowing unavailable book → 409 Conflict

## Tonight's Notes
- Prisma relation syntax for 1-N and N-N from memory
- Why the borrow operation MUST be a transaction
- offset vs cursor pagination — trade-offs
- select vs include in Prisma

## Interview Questions
1. What is an ORM? Pros and cons vs raw SQL?
2. What is a migration and why not just edit the DB directly?
3. How do you prevent race conditions when two users borrow the last copy?
4. Offset vs cursor pagination?
5. What is the N+1 query problem and how does `include` relate to it?
6. How do you model many-to-many in Prisma?
