# Lesson 06 — Security Checklist (OWASP Basics)

Use this as a **pre-ship checklist** for every backend you build.
Check each item before calling an API "production-ready."

---

## 1. OWASP Top 10 — What to Know

The [OWASP Top 10](https://owasp.org/www-project-top-ten/) lists the most common web vulnerabilities.
You don't need to memorize all ten — focus on these for backend interviews:

| Risk | One-line summary | Your defense |
|------|------------------|--------------|
| **Injection** | Attacker sends SQL/commands as input | Parameterized queries (Prisma/ORM), validate input |
| **Broken Auth** | Weak login, leaked tokens | bcrypt, short JWT, refresh rotation, rate limit login |
| **Sensitive Data Exposure** | Passwords/tokens in logs or responses | Never return `passwordHash`, use HTTPS, redact logs |
| **Security Misconfiguration** | Default creds, debug mode in prod | `helmet`, disable stack traces in prod, review `.env` |
| **Broken Access Control** | User A accesses User B's data | Auth middleware + ownership checks + RBAC |

---

## 2. XSS (Cross-Site Scripting)

**What:** Attacker injects JavaScript that runs in another user's browser.

**Example:** A comment field stores `<script>steal(document.cookie)</script>`.

**Backend's job:**
- [ ] **Sanitize/escape** user-generated content before storing or rendering
- [ ] Set **`Content-Security-Policy`** header (Helmet helps)
- [ ] If using cookies for auth: **`httpOnly`** flag so JS cannot read the token
- [ ] Never trust client input — validate with Zod on every write endpoint

**Trade-off with JWT storage:**
- `localStorage` → immune to CSRF, **vulnerable to XSS** (any script can read it)
- `httpOnly` cookie → immune to XSS reads, needs CSRF protection

---

## 3. CSRF (Cross-Site Request Forgery)

**What:** A malicious site tricks the user's browser into sending a request to *your* API
with the user's cookies attached (e.g., `POST /transfer-money`).

**When it matters:** Cookie-based auth (especially session cookies on all routes).

**Defenses checklist:**
- [ ] **`SameSite=Strict` or `Lax`** on cookies (blocks most cross-site sends)
- [ ] **`Secure`** flag — cookies only over HTTPS
- [ ] Scope refresh cookie with **`Path=/auth/refresh`** (smaller attack surface)
- [ ] For state-changing routes: **CSRF token** (double-submit cookie or synchronizer token)
- [ ] Require **`Content-Type: application/json`** + custom header for APIs (simple extra barrier)
- [ ] **CORS** — only allow trusted origins (don't use `*` with credentials)

**When it does NOT matter:** Bearer token in `Authorization` header (browser won't attach it cross-site automatically).

---

## 4. Rate Limiting

**Why:** Stop brute-force login, credential stuffing, and API abuse.

**Checklist:**
- [ ] Rate limit **login/register** endpoints (e.g., 5 attempts per minute per IP)
- [ ] Return **`429 Too Many Requests`** with `Retry-After` header when exceeded
- [ ] Use stricter limits on expensive endpoints (search, exports)
- [ ] In production: Redis-backed limiter (in-memory is fine for learning/single server)

**Day 7 project:** `rateLimit.middleware.ts` — in-memory counter per IP for `POST /auth/login`.

---

## 5. Headers & Transport (Helmet)

Install `helmet` and use it globally:

```ts
import helmet from "helmet";
app.use(helmet());
```

Helmet sets sensible defaults:
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options` (clickjacking)
- [ ] Strict-Transport-Security (when behind HTTPS)
- [ ] Hide `X-Powered-By: Express`

Also:
- [ ] **HTTPS everywhere** in production (TLS terminates at load balancer or Node)
- [ ] Never commit secrets — use `.env` + `.env.example` without real values

---

## 6. Input Validation & Errors

- [ ] Validate **every** POST/PATCH body with **Zod** (or similar)
- [ ] Return **422** for validation errors, not 500
- [ ] Generic error messages to clients in production ("Invalid credentials" not "User not found")
- [ ] Log full errors server-side only

---

## 7. Password & Token Hygiene

- [ ] Hash passwords with **bcrypt** (cost 10–12) — never SHA-256 alone
- [ ] Access token: **short TTL** (5–15 min)
- [ ] Refresh token: **httpOnly cookie**, rotate on use, store hash in DB
- [ ] On logout: **invalidate** refresh token server-side
- [ ] Never log tokens or passwords

---

## 8. Pre-Deploy Quick Scan

Before you ship, ask:

1. Can an unauthenticated user hit protected routes? (try with curl)
2. Can a `user` role hit `admin` routes? (403 expected)
3. Does the API leak stack traces in production?
4. Are CORS origins locked down?
5. Is login rate-limited?
6. Does `GET /users/me` ever return `passwordHash`?

---

## Interview Sound Bites

- **XSS vs CSRF:** XSS = attacker runs JS in victim's browser. CSRF = attacker forges requests using victim's cookies.
- **Why httpOnly cookies?** JS cannot read them — stolen XSS script can't grab the refresh token.
- **Why rate limit login?** Slows brute-force; 5/min turns billions of guesses into years.
- **401 vs 403:** Not authenticated vs authenticated but not allowed.
