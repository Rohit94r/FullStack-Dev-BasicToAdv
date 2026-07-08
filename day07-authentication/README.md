# DAY 7 — Authentication & Security (Every Backend Interview Asks This)

## Today's Goal
Build auth from scratch and UNDERSTAND it: hashing, JWT, refresh tokens,
cookies, RBAC. Never again say "I use a library but don't know how it works."

## Content Ready
All **6 lesson files** in `lessons/` and the **auth-server** project in `project/auth-server/` are pre-built. Fill every `TODO` before checking answers.

## Morning Revision (2 hr)
From memory: write the asyncHandler wrapper + ApiError class + central error
middleware from yesterday. These appear in EVERY backend you'll ever build.

## Lessons (in order) — ALL FILES EXIST in `lessons/`
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-password-hashing.ts` | Why never store plaintext, bcrypt, salt, rounds, timing attacks | 45 min |
| 2 | `02-jwt-explained.ts` | JWT structure (header.payload.signature), signing, verifying, expiry, WHY stateless | 75 min |
| 3 | `03-cookies-vs-headers.ts` | httpOnly cookies vs Authorization header, XSS vs CSRF trade-offs | 45 min |
| 4 | `04-refresh-token-pattern.ts` | Access (short) + refresh (long) tokens, rotation, revocation | 60 min |
| 5 | `05-rbac-authorization.ts` | Authentication vs Authorization, roles, permission middleware | 45 min |
| 6 | `06-security-checklist.md` | OWASP basics: injection, XSS, CSRF, rate limiting, helmet | 45 min |

## Project (6 hours): Auth Server (extends Day 6 structure)
```
project/auth-server/src/
├── routes/auth.routes.ts, users.routes.ts
├── controllers/ services/ repositories/ middleware/ schemas/
```

Features:
- [ ] POST /auth/register (validate → hash password → save → return safe user, NO password in response!)
- [ ] POST /auth/login (verify password → issue access token 15min + refresh token 7d in httpOnly cookie)
- [ ] POST /auth/refresh (rotate refresh token, issue new access token)
- [ ] POST /auth/logout (invalidate refresh token)
- [ ] GET /users/me (protected — requireAuth middleware reads + verifies JWT)
- [ ] GET /admin/users (protected + requireRole("admin") middleware)
- [ ] Rate limit login attempts (5 per minute — simple in-memory counter)
- [ ] Password rules validation with Zod
- [ ] Test full flow with curl/REST client: register → login → me → refresh → logout

## Tonight's Notes
- Draw the JWT flow: login → token → protected request → verify
- Access vs refresh token — why two?
- Authentication vs authorization — one line each
- Why httpOnly cookies?
- What bcrypt salt does

## Interview Questions
1. How do you store passwords securely? What is a salt?
2. What are the 3 parts of a JWT? Can the client read the payload? Modify it?
3. Where to store JWT on the client — localStorage or cookie? Trade-offs?
4. What is a refresh token and why use one?
5. Authentication vs Authorization?
6. What is CSRF and how do you prevent it?
