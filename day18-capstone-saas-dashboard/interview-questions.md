# Day 18 — Capstone SaaS Dashboard Interview Questions & Answers

These are the SENIOR-LEVEL questions. If you can answer all of these, you are ready for interviews.

---

## SECTION A — System Design

**Q1. Design a URL shortener like bit.ly.**
A: Requirements:
   - Given long URL → return short URL (e.g., bit.ly/abc123)
   - Given short URL → redirect to long URL
   - Scale: millions of redirects per second

   Core components:
   1. SHORT CODE GENERATION: 6-character base62 string (a-z,A-Z,0-9) = 62^6 ≈ 56 billion unique URLs.
      - Approach 1: random + check uniqueness in DB. Simple, has collision risk at scale.
      - Approach 2: auto-increment ID → base62 encode. No collision. Sequential (predictable).
   
   2. DATABASE: `{ shortCode, longUrl, userId, createdAt, clicks }`.
      Index on shortCode (lookup), userId (user's links).
   
   3. REDIRECT SERVICE: GET /abc123 → DB lookup → 301/302 redirect.
      Cache shortCode → longUrl in Redis (99% of traffic is reads).
      301 = permanent (browser caches, less server load). 302 = temporary (every click hits your server = accurate analytics).
   
   4. ANALYTICS: click count, geographic data, referrers. Write to Kafka → process async → analytics DB.
   
   Scale: Redis caches hot URLs → millions of redirects without DB hits.

**Q2. Design a real-time notification system.**
A: Requirements: users receive notifications instantly when events happen.

   Approach 1 — Polling: client asks "any new notifications?" every 5 seconds. Simple. Wastes resources.
   Approach 2 — Long Polling: client keeps connection open. Server responds when notification arrives. Better.
   Approach 3 — Server-Sent Events (SSE): one-way stream from server to browser. Easy to implement, HTTP/1.1.
   Approach 4 — WebSockets: bidirectional. Overkill for notifications but used for chat.
   
   Architecture:
   - Events happen (order placed, payment received) → publish to message queue (Kafka/Redis Pub/Sub).
   - Notification Service consumes events → creates notification records in DB.
   - Push to connected users via SSE/WebSocket.
   - If user offline: store in DB → deliver when they connect.
   
   In Next.js: Server-Sent Events via Route Handler, or use Pusher/Ably (managed WebSocket service).

**Q3. Design an authentication system. What all must you implement?**
A: Complete auth system components:
   1. Registration: email+password (hash with bcrypt). Verify email (send confirmation link with 24hr token).
   2. Login: bcrypt.compare → issue JWT access token (15min) + refresh token (7 days in HttpOnly cookie).
   3. Refresh: client sends refresh token → validate against DB → issue new access token.
   4. Logout: delete refresh token from DB. Client clears tokens.
   5. Forgot password: user submits email → send reset link with short-lived token (1hr) → user sets new password → invalidate token.
   6. Social auth (OAuth): redirect to Google/GitHub → callback → create/find user → issue tokens.
   7. 2FA: TOTP (Google Authenticator) using speakeasy library. QR code setup → verify 6-digit code on login.
   8. Rate limiting: 5 login attempts per IP per 15 minutes → temporary ban → alerts.
   9. Session management: view all active sessions → revoke specific sessions (mobile app, web, etc.).

**Q4. How would you handle file uploads at scale?**
A: Naive approach: upload to Express → save to server disk. Problems: disk fills up, doesn't scale horizontally, no CDN, backup issues.
   
   Production approach:
   1. Client requests PRESIGNED URL from your API (S3 presigned URL = temporary URL to upload directly to S3).
   2. Client uploads directly to S3/R2 (bypasses your server). 5GB files, no memory pressure.
   3. S3 triggers Lambda/Worker when upload complete → process (resize, convert, scan for malware).
   4. Store final file URL in database.
   5. Serve files from CloudFront/Cloudflare CDN (not S3 directly — CDN is faster and cheaper).
   
   Libraries: AWS SDK v3, Cloudflare R2 (cheaper than S3, no egress fees), UploadThing (Next.js-focused wrapper).

---

## SECTION B — Full-Stack Architecture

**Q5. What is a monolith vs microservices? When to choose each?**
A: Monolith: ONE codebase, ONE deployment. All features together.
   - Pros: simple to develop, deploy, debug. No network calls between services. One database.
   - Cons: codebase grows large, deployment is all-or-nothing, can't scale services independently.
   
   Microservices: separate services for separate capabilities (users, payments, notifications, products).
   - Pros: independent deployment, independent scaling, polyglot (different languages per service), team autonomy.
   - Cons: distributed systems complexity, network latency, data consistency across services, harder debugging.
   
   Rule: start with monolith. Extract services when:
   - You have proven scalability requirement for a specific component.
   - You have large enough team that communication overhead justifies autonomy.
   - Netflix, Uber, Amazon migrated from monolith to microservices as they grew.

**Q6. What is the Saga pattern?**
A: Managing distributed transactions across multiple microservices.
   Problem: Order service creates order, Payment service charges card, Inventory service decrements stock.
   If payment succeeds but inventory fails — you've charged but can't fulfill.
   Traditional ACID transaction can't span multiple services.
   
   Saga: sequence of local transactions, each publishing an event. If any step fails → compensating transactions (rollbacks) for previous steps.
   
   Choreography: each service listens for events and triggers next step. Decoupled but hard to debug.
   Orchestration: a central Saga Orchestrator tells each service what to do. Easier to see the big picture.

**Q7. What is CQRS?**
A: Command Query Responsibility Segregation.
   Separate the WRITE model (commands: CreateOrder, UpdateUser) from the READ model (queries: GetOrderDetails, GetUserDashboard).
   
   Different database structures for writes (normalized, ACID) vs reads (denormalized, optimized for specific views).
   Events from write side update read-side projections asynchronously.
   Benefits: each side optimized for its job. Read model can be materialized views or separate DB.
   Use when: complex domain, high read/write ratio difference, need separate scaling.

---

## SECTION C — Technical Deep Dive

**Q8. What is the N+1 query problem? How do you solve it?**
A: Fetching a list of items, then making a separate DB query for EACH item's related data.
   ```javascript
   const posts = await prisma.post.findMany();        // 1 query
   for (const post of posts) {
     post.author = await prisma.user.findUnique({ where: { id: post.authorId } }); // N queries!
   }
   // 1 + N queries for N posts → "N+1 problem"
   ```
   
   Solutions:
   1. Eager loading (join): `prisma.post.findMany({ include: { author: true } })` — 1 query with JOIN.
   2. DataLoader (batching): group individual DB calls into one batched query. Used heavily in GraphQL.
   3. Raw SQL with JOIN: when ORM can't express it cleanly.

**Q9. How do database transactions work at the application level?**
A: Database transaction = group of operations that succeed or fail atomically.
   
   In Prisma:
   ```typescript
   await prisma.$transaction(async (tx) => {
     const order = await tx.order.create({ data: { userId, status: "pending" } });
     await tx.product.update({ where: { id }, data: { stock: { decrement: quantity } } });
     await tx.payment.create({ data: { orderId: order.id, amount, status: "pending" } });
     // If ANY of these fail, ALL are rolled back
   });
   ```
   
   Common mistakes: not wrapping related operations in transaction → partial updates on error → inconsistent state.
   Always: money transfers, order creation + stock decrement, multi-table writes.

**Q10. Explain TypeScript's `satisfies` operator.**
A: `satisfies` checks that a value satisfies a type WITHOUT WIDENING the type.
   ```typescript
   const palette = {
     red: [255, 0, 0],
     green: "#00ff00",
     blue: [0, 0, 255],
   } satisfies Record<string, string | number[]>;
   
   // palette.red is inferred as [number, number, number], not string | number[]
   // If you had used: const palette: Record<...> = {...}
   // palette.red would be string | number[] — lost the specific type
   
   // satisfies validates the shape, keeps the specific types
   palette.red.map(c => c * 2);  // Works! .map available on tuple
   palette.green.toUpperCase();  // Works! .toUpperCase available on string
   ```
   Use for: typed configuration objects where you need specific inference + shape validation.

---

## SECTION D — Behavioral / Experience

**Q11. How do you debug a production issue with slow API endpoints?**
A: Step-by-step approach:
   1. IDENTIFY: Check monitoring/APM (Datadog, New Relic). Which endpoint? What's the p95/p99 latency?
   2. REPRODUCE: Can I reproduce in staging? Add logging for the slow request.
   3. ANALYZE: Check logs — is it DB? External API? Computation? Memory?
   4. DB issues: EXPLAIN ANALYZE the slow queries. Missing index? N+1 query?
   5. External API: timeout? Should I cache this? Parallel calls instead of sequential?
   6. Code: async operation being awaited sequentially that could be parallel? Memory leak?
   7. FIX: smallest change. Add index, add cache, parallelize calls, optimize query.
   8. VERIFY: deploy, monitor metrics, confirm improvement.
   9. POST-MORTEM: document root cause, prevention, lessons learned.

**Q12. Explain a complex technical decision you made (or would make) in a project.**
A: Framework for answering (STAR method for technical decisions):
   Situation: What was the context? (scaling, feature complexity, team size).
   Task: What was the requirement/problem?
   Action: What OPTIONS did you consider? What were the TRADEOFFS? What did you choose and WHY?
   Result: What was the outcome?
   
   Example answer:
   "When building the backend for our app, I chose to use PostgreSQL over MongoDB for our user and order data.
   While MongoDB would have been faster to start with (flexible schema, easy to add fields),
   our data had clear relationships (users → orders → products) that benefited from JOINs.
   We also needed ACID transactions for order processing (can't charge without guaranteeing inventory update).
   PostgreSQL's JSONB column gave us the flexibility of MongoDB where needed (product metadata).
   Result: clean relational schema, reliable transactions, and we never had data consistency issues."

**Q13. How do you ensure code quality in a team setting?**
A: Code quality practices:
   1. TypeScript strict mode — catch errors at compile time.
   2. ESLint + Prettier — consistent code style, auto-formatted.
   3. Pre-commit hooks (Husky + lint-staged) — block bad commits.
   4. Code reviews — minimum 1 reviewer, PR template, checklist.
   5. Tests — unit for business logic, integration for APIs, E2E for critical user flows.
   6. CI/CD — run tests, linting, build on every PR. Merge only when all pass.
   7. Coverage threshold — minimum 70-80% coverage enforced in CI.
   8. Documentation — README, ADRs (Architecture Decision Records) for major decisions.
   9. Feature flags — deploy code to production without releasing to all users (gradual rollout, easy rollback).

**Q14. How would you estimate the time for a feature?**
A: Estimation framework:
   1. Break into small, independent tasks (1-4 hours each).
   2. Identify unknowns and spikes needed (research).
   3. Add buffer: 2x for familiar work, 3x for new territory.
   4. Account for: code review time, QA/testing, PR iterations, deployment.
   5. Communicate confidence: "3-5 days, most likely 4."
   6. Update as you learn more. Continuous re-estimation.
   
   Common mistakes: optimistic estimation (no buffer), not counting reviews/QA, ignoring dependencies on others.
   Use story points for relative estimation (Fibonacci: 1, 2, 3, 5, 8, 13). Compare to reference stories.

**Q15. What's your approach to learning new technologies?**
A: My framework:
   1. WHY first — understand the problem it solves. Read the motivation section of docs.
   2. 80/20 — learn the 20% concepts that cover 80% of use cases.
   3. BUILD — write actual code, not just read. Even a toy project.
   4. COMPARE — how does this compare to what I already know? What's similar, what's different?
   5. TEACH — explain it to someone (or write a blog post / README). Teaching forces clarity.
   6. USE in a real project — concepts only stick when you've applied them to solve real problems.
   
   Resources approach: Official docs first (most accurate), then targeted tutorials for gaps, then advanced videos/books after basics are solid.
