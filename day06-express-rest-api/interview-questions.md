# Day 6 — Express.js & REST API Interview Questions & Answers

---

## SECTION A — Express Fundamentals

**Q1. What is Express.js? Why is it used instead of raw Node.js http module?**
A: Express is a minimal web framework for Node.js that adds:
   - Routing system (map URL + method to handler)
   - Middleware pipeline
   - Convenient request/response helpers (res.json, res.status, etc.)
   - Body parsing, static files, template rendering
   Raw Node.js requires you to: manually parse URLs, read body streams, match routes manually.
   Express handles all that. Still, Express is deliberately MINIMAL — you compose your stack.

**Q2. What is the difference between `app.use()` and `app.get()`?**
A: app.use(path?, middleware) → applies middleware to ALL HTTP methods.
                                If path is omitted, applies to every request.
                                If path is given, applies to any method that starts with that path.
   app.get(path, handler)    → applies ONLY to GET requests at exact path.
   Express also has: app.post(), app.put(), app.patch(), app.delete(), app.all().

**Q3. What is the middleware signature? What happens if you forget to call `next()`?**
A: Signature: `function(req, res, next)`
   If you don't call next() AND don't send a response → request HANGS FOREVER.
   Client gets a timeout error. This is the most common Express beginner mistake.
   Always either: call next(), call next(err), OR send a response.

**Q4. What is the difference between `next()` and `next(error)`?**
A: next()      → passes to the NEXT matching middleware or route in normal pipeline.
   next(error) → passes to the error-handling middleware (4-param: err, req, res, next).
                 Skips all normal middleware/routes.
   If you throw inside a synchronous route, Express catches it automatically and calls next(err).
   For async routes, you MUST manually catch and call next(err).

**Q5. Why must error-handling middleware have exactly 4 parameters?**
A: Express identifies error middleware by counting parameters.
   `function(err, req, res, next)` — 4 params → error handler.
   `function(req, res, next)` — 3 params → normal middleware.
   If you write the error handler with 3 params, Express treats it as normal middleware
   and errors will never reach it. The 4th param (`next`) must be there even if unused.

---

## SECTION B — REST API Design

**Q6. What does REST stand for? What are its 6 constraints?**
A: REST = Representational State Transfer. An architectural STYLE, not a protocol.
   6 constraints:
   1. Client-Server separation
   2. Stateless — each request contains all info needed. Server stores no client state.
   3. Cacheable — responses indicate if they can be cached.
   4. Uniform Interface — consistent resource naming, HTTP verbs, status codes.
   5. Layered System — client doesn't know if talking to actual server or load balancer.
   6. Code on Demand (optional) — server can send executable code to client (JS).

**Q7. What HTTP method should you use for creating, reading, updating (partial), and deleting?**
A: Create  → POST (201 Created)
   Read all → GET (200 OK)
   Read one → GET (200 OK)
   Replace  → PUT (200 OK) — all fields required
   Partial  → PATCH (200 OK) — only changed fields
   Delete   → DELETE (204 No Content)
   Rule: GET never has a body. DELETE rarely has a body. Only POST/PUT/PATCH have bodies.

**Q8. What HTTP status codes must you know for a REST API?**
A: 2xx Success:
   200 OK             — general success
   201 Created        — resource created (POST response)
   204 No Content     — success, no body (DELETE, some PATCHes)
   3xx Redirect:
   301 Moved Permanently, 302 Found (temporary redirect)
   4xx Client Errors:
   400 Bad Request    — malformed request, wrong format
   401 Unauthorized   — not authenticated
   403 Forbidden      — authenticated but not allowed
   404 Not Found      — resource doesn't exist
   409 Conflict       — duplicate (email already exists)
   422 Unprocessable  — valid format but fails business validation
   429 Too Many       — rate limit exceeded
   5xx Server Errors:
   500 Internal       — bug on server
   503 Unavailable    — server temporarily down (maintenance)

**Q9. What is the difference between 401 and 403?**
A: 401 Unauthorized → "Who are you?" — Not authenticated. No token or invalid token.
                      Fix: log in to get a token.
   403 Forbidden    → "I know who you are, but you can't do this." — Authenticated but not authorized.
                      Fix: you need a higher role/permission.
   Common mistake: using 401 when you mean 403.

**Q10. What is the difference between PUT and PATCH?**
A: PUT   → REPLACES the entire resource. All fields must be provided. Missing = deleted/null.
           `PUT /users/1 { name: "New" }` → user now only has name, email gone.
   PATCH  → PARTIAL update. Only send what changes. Unchanged fields stay.
            `PATCH /users/1 { name: "New" }` → only name changes, email stays.
   Real APIs mostly use PATCH. PUT is used when you're literally replacing a document.

---

## SECTION C — Routing & Structure

**Q11. What is Express Router? Why use it?**
A: Express.Router() creates a mini-app for a specific resource.
   Lets you group related routes and mount them at a path prefix.
   `app.use("/api/users", userRouter)` — all routes in userRouter get "/api/users" prefix.
   Benefits: organized code, separate files per resource, can have own middleware.
   Without Router: one huge file with hundreds of routes. Unmaintainable.

**Q12. What does `mergeParams: true` do in a Router?**
A: `express.Router({ mergeParams: true })` lets a nested router access
   route parameters from its parent router.
   Without it: `/users/:userId/posts` — postRouter can't access `req.params.userId`.
   With it: postRouter can access `req.params.userId` from the parent mount.

**Q13. Explain the layered architecture for an Express API.**
A: Route → Controller → Service → Repository
   Route: maps URL+method to controller function.
   Controller: extracts req data, calls service, sends res. No business logic.
   Service: business logic. Doesn't know about HTTP. Calls repository.
   Repository: database queries ONLY. Returns plain data.
   Why: testable (mock the service to test controller), swappable (change DB without changing business logic).

---

## SECTION D — Validation & Security

**Q14. What is Zod and why use it over manual validation?**
A: Zod is a TypeScript-first schema validation library.
   Manual validation: verbose, inconsistent, error-prone, no type inference.
   Zod: define schema once → validates AND generates TypeScript type.
   `safeParse()` → no throw, returns `{ success, data, error }`.
   `parse()` → throws ZodError on failure.
   `.transform()` → sanitize data in the schema (trim, lowercase, coerce types).

**Q15. What is CORS? Why does it matter for APIs?**
A: CORS = Cross-Origin Resource Sharing. Browser security feature.
   Browsers block requests from origin A to origin B unless B explicitly allows it.
   Same origin = same protocol + domain + port. Different = cross-origin.
   Frontend at localhost:3000 calling API at localhost:3001 = cross-origin.
   Fix: API must send `Access-Control-Allow-Origin` header.
   `app.use(cors({ origin: "http://localhost:3000" }))` — allow specific origin.
   Never use `cors()` with no options in production (allows ALL origins = security risk).

**Q16. What does `helmet()` do? Name 3 headers it sets.**
A: Helmet sets HTTP security headers to protect against common attacks.
   Key headers it sets:
   - `X-Content-Type-Options: nosniff` — prevent MIME sniffing attacks
   - `X-Frame-Options: SAMEORIGIN` — prevent clickjacking (your page in iframe)
   - `Content-Security-Policy` — restrict which scripts/styles can load
   - `Strict-Transport-Security` — force HTTPS
   - Removes `X-Powered-By: Express` — hide technology stack
   One line: `app.use(helmet())`. Do it on every API.

**Q17. What is rate limiting? How do you implement it?**
A: Rate limiting restricts how many requests a client can make in a time window.
   Prevents: brute force attacks (login), API abuse, DDoS.
   npm package: `express-rate-limit`.
   ```javascript
   const rateLimit = require("express-rate-limit");
   app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
   // Max 10 login attempts per 15 minutes
   ```
   Apply stricter limits to auth routes, looser to public routes.

**Q18. What is input sanitization? How is it different from validation?**
A: Validation → checks if data is the RIGHT shape/type/format. Rejects if not.
   Sanitization → TRANSFORMS data to make it safe to use.
   Examples of sanitization: `.trim()` (remove whitespace), `.toLowerCase()`, `parseInt()`,
   strip HTML tags (to prevent XSS), `encodeURIComponent()`.
   Zod can do both: `.email().trim().toLowerCase()` validates AND sanitizes in one schema.
   Always sanitize before saving to database or using in queries.

---

## SECTION E — Error Handling

**Q19. Why should you use custom error classes?**
A: Custom errors add: statusCode (for HTTP response), code (machine-readable identifier), isOperational flag.
   `isOperational = true` means it's an expected error (user not found, duplicate email).
   `isOperational = false` or absent = programming bug.
   Error handler can act differently: operational errors get clean message, bugs get 500 + alert.
   Named error classes also make error handling intent clear: `throw new ConflictError()` vs `throw new Error("...")`.

**Q20. What is the asyncHandler / catchAsync wrapper pattern?**
A: Wraps async route handlers to automatically catch errors and pass to next().
   Without it: every async handler needs its own try/catch.
   ```javascript
   const asyncHandler = fn => (req, res, next) =>
     Promise.resolve(fn(req, res, next)).catch(next);
   ```
   With it:
   ```javascript
   app.get("/users", asyncHandler(async (req, res) => {
     const users = await userService.findAll(); // any error auto-forwarded
     res.json(users);
   }));
   ```
   Used in real-world frameworks (NestJS does this automatically).
