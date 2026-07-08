# DAY 6 — Express + REST API Design (Your Bread and Butter)

## Today's Goal
Build professional REST APIs with proper structure (routes/controllers/services),
validation, and error handling — the way real companies structure backends.

## Content Ready
All **5 lesson files** in `lessons/` and the **Notes API** project in `project/notes-api/` are pre-built. Fill every `TODO` before checking answers.

## Morning Revision (2 hr)
Rebuild the middleware chain from your mini-express FROM MEMORY.
If you can rebuild `next()` logic, you understand Express forever.

## Lessons (in order) — ALL FILES EXIST in `lessons/`
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-express-basics.ts` | app, routing, req/res objects, params, query, body | 45 min |
| 2 | `02-middleware-deep-dive.ts` | built-in, custom, router-level, error middleware, order matters! | 60 min |
| 3 | `03-rest-api-design.md` | REST rules: nouns not verbs, status codes, versioning, pagination conventions | 45 min |
| 4 | `04-validation-with-zod.ts` | Zod schemas, parsing request bodies, custom errors | 60 min |
| 5 | `05-error-handling.ts` | Custom error classes, async error wrapper, central error middleware | 60 min |
| 6 | `06-project-structure.md` | routes → controllers → services → repositories, why layers | 30 min |

## Project (6 hours): Notes REST API (TypeScript + Express)
Full CRUD API with PROFESSIONAL structure (in-memory storage — DB comes Day 8-9).

Structure you'll build:
```
project/notes-api/
├── src/
│   ├── index.ts          ← server bootstrap
│   ├── app.ts            ← express app + middleware registration
│   ├── routes/notes.routes.ts
│   ├── controllers/notes.controller.ts   ← req/res handling only
│   ├── services/notes.service.ts         ← business logic only
│   ├── repositories/notes.repo.ts        ← data access only
│   ├── middleware/ (error handler, logger, validate)
│   ├── schemas/notes.schema.ts           ← Zod validation
│   └── utils/ (ApiError class, asyncHandler)
```

Features:
- [ ] POST /api/v1/notes (validated with Zod)
- [ ] GET /api/v1/notes (pagination ?page=&limit=, filtering ?tag=, search ?q=)
- [ ] GET /api/v1/notes/:id (404 if missing)
- [ ] PATCH /api/v1/notes/:id (partial update)
- [ ] DELETE /api/v1/notes/:id
- [ ] Request logger middleware (method, path, duration)
- [ ] Central error handler (never crash, always JSON error response)
- [ ] Correct status codes everywhere (201, 200, 204, 400, 404, 500)

## Tonight's Notes
- Draw the layer diagram: route → controller → service → repository
- Why separate controller from service?
- The 8 most important HTTP status codes
- PUT vs PATCH

## Interview Questions
1. What is REST? What makes an API RESTful?
2. PUT vs PATCH vs POST?
3. What status code for: created / no content / validation error / not found?
4. Why does middleware order matter in Express?
5. How do you handle errors in async Express routes?
6. Why layer your backend (controller/service/repo)?
