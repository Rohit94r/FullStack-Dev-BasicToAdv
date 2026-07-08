# DAY 16 — FastAPI + PostgreSQL (Python Backend)

## Today's Goal
Build the same quality API you built in Express — but in FastAPI.
Comparing the two stacks makes BOTH stick permanently.

## Morning Revision (2 hr)
From memory in Python: a dataclass, a decorator, a dict comprehension
grouping items by category. Then explain generators out loud.

## Lessons (`lessons/`)
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01_fastapi_basics.py` | App, path operations, path/query params, automatic docs (/docs!) | 60 min |
| 2 | `02_dependency_injection.py` | Depends() — FastAPI's superpower, reusable dependencies, auth deps | 60 min |
| 3 | `03_pydantic_models.py` | BaseModel, validation, Field, response_model (it's Zod for Python!) | 75 min |
| 4 | `04_async_endpoints.py` | async def vs def in FastAPI, when async matters | 45 min |
| 5 | `05_sqlalchemy_setup.py` | Engine, session, models, relationship — Prisma equivalent | 75 min |
| 6 | `06_error_handling.py` | HTTPException, custom exception handlers, status codes | 45 min |

## Project (6 hours): `project/fastapi-todo/`
Same features as Day 6 Notes API — fill in the blanks, then compare stacks.

Features:
- [ ] Full CRUD /api/v1/todos with Pydantic validation
- [ ] Pagination, filtering, search (query params with validation!)
- [ ] PostgreSQL via SQLAlchemy (reuse your Postgres from Day 8)
- [ ] JWT auth (python-jose + passlib — you KNOW the concepts from Day 7)
- [ ] Protected routes with Depends(get_current_user)
- [ ] Proper status codes + error responses
- [ ] Explore /docs — automatic Swagger UI (Express doesn't give you this!)
- [ ] Write comparison notes: FastAPI vs Express — what's better where?

## Tonight's Notes
- Express vs FastAPI comparison table (routing, validation, DI, docs, async)
- What Pydantic does (and its Zod equivalent)
- What Depends() replaces from Express middleware
- SQLAlchemy session lifecycle

## Interview Questions
1. Why FastAPI over Flask/Django?
2. What is Pydantic and what does it give you?
3. How does dependency injection work in FastAPI?
4. async def vs def in FastAPI — what happens with each?
5. How did you implement auth in FastAPI vs Express?
