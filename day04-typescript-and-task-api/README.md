# DAY 4 — TypeScript (Zero → Generics Master) + Task API Project

## Today's Goal
Write TypeScript naturally. Generics, utility types, and discriminated unions
stop being scary — they become your daily tools.

## Morning Revision (2 hr)
From memory: write a memoize function, a promise-with-timeout wrapper,
and explain the event loop out loud in 2 minutes.

## Lessons (in order) — ALL FILES ALREADY EXIST in `lessons/`
| # | File | Time |
|---|------|------|
| 1 | `basics/00-why-and-what-is-typescript.ts` — what TS is, all basic types, first interfaces | 60 min |
| 2 | `01-types-and-interfaces.ts` — objects, unions, intersections, literal types, overloads | 60 min |
| 3 | `02-type-aliases-and-generics.ts` — GENERICS (most important!), constraints, keyof, infer | 90 min |
| 4 | `03-utility-types.ts` — Partial, Required, Pick, Omit, Record + how they're built | 60 min |
| 5 | `04-enums-and-type-narrowing.ts` — enums, type guards, discriminated unions, as const | 55 min |

**Run:** `npx ts-node lessons/basics/00-why-and-what-is-typescript.ts`

## Project (6 hours): Task API — ALREADY SCAFFOLDED in `task-api/`
This is a pure-TypeScript in-memory API (no Express). Fill-in-the-blank format is ready.

Workflow for each file:
1. Read `src/types.ts` fully first (the data model — everything builds on it)
2. In `src/utils.ts`: for each function, READ the TODO → hide the ANSWER → write yours → compare
3. Same for `src/taskManager.ts` (11 methods — the real work)
4. Run `npx ts-node src/index.ts` — all 12 demos must pass

Features you're implementing:
- [ ] addTask with validation
- [ ] getTaskById / getAllTasks
- [ ] updateTask (partial updates with `Partial<>`)
- [ ] deleteTask
- [ ] markComplete / cancelTask / reopenTask (status rules)
- [ ] filterTasks (status, priority, tag, overdue — AND logic)
- [ ] searchTasks (title + description + tags, case-insensitive)
- [ ] sortTasks (5 fields, asc/desc)
- [ ] getStats (Record<Status, number>, completion rate)
- [ ] groupByStatus (reduce into Record)
- [ ] bulk operations

Setup: `cd task-api && npm install && npx ts-node src/index.ts`

## Tonight's Notes
- interface vs type — 3 differences
- any vs unknown
- Write Partial<T> implementation from memory
- Discriminated union example from memory
- Generic constraint example: `<T extends { length: number }>`

## Interview Questions
1. Why TypeScript over JavaScript?
2. What are generics? Why not just use any?
3. Partial vs Required vs Pick vs Omit?
4. What is a discriminated union?
5. What is type narrowing? Name 4 ways to narrow.
6. What does `keyof` do?
