# Day 17 — Production Backend & RAG Interview Questions & Answers

---

## SECTION A — Production Backend

**Q1. What makes a backend "production-ready"?**
A: A production-ready backend has:
   - Security: HTTPS, helmet, CORS, rate limiting, input validation, no secrets in code.
   - Error handling: global handler, no crashes on unhandled errors, structured logs.
   - Logging: request logs, error logs, structured JSON format (Winston/Pino).
   - Monitoring: uptime, error rates, latency tracking (Prometheus, Datadog, Sentry).
   - Graceful shutdown: handle SIGTERM, finish in-flight requests, close DB connections.
   - Database: connection pooling, migrations, backups.
   - Environment config: .env for secrets, validate at startup, never hardcode.
   - Health check endpoint: /health for load balancers to check liveness.
   - Zero-downtime deploys: rolling restarts, blue-green, health checks.

**Q2. What is Docker and why is it used for deployments?**
A: Docker: containerization. Package your app + all dependencies into a single "container image."
   Without Docker: "works on my machine" — different OS, different Node version, missing dependency.
   With Docker: one container image runs IDENTICALLY everywhere (dev, staging, production).
   
   Dockerfile → instructions to build the image.
   docker-compose.yml → run multiple containers (app + PostgreSQL + Redis).
   Kubernetes → orchestrate many containers at scale (auto-scaling, self-healing).
   Cloud: ECS (AWS), Cloud Run (GCP), Azure Container Apps — run containers without managing servers.

**Q3. What is connection pooling in databases?**
A: Opening a database connection is expensive (TCP handshake, auth, session).
   Without pooling: every request opens a new connection → slow, PostgreSQL has connection limit (100 default).
   With pooling: maintain a POOL of pre-opened connections. Requests borrow and return connections.
   
   Node.js: pg pool, Prisma has built-in pooling.
   External pooler: PgBouncer (proxy between app and PostgreSQL).
   Pool settings: min connections (always open), max connections (upper limit).
   Serverless: use pgBouncer/Prisma Accelerate because serverless functions don't maintain pools.

**Q4. What is a health check endpoint?**
A: `GET /health` → returns server status. Used by:
   - Load balancers: to decide if to send traffic to this instance.
   - Kubernetes: liveness (is process running?) and readiness (is it ready to serve traffic?) probes.
   - Monitoring: uptime tracking.
   
   Good health check:
   ```javascript
   app.get("/health", async (req, res) => {
     try {
       await prisma.$queryRaw`SELECT 1`; // Check DB connection
       res.json({ status: "ok", db: "ok", uptime: process.uptime() });
     } catch (err) {
       res.status(503).json({ status: "error", db: "unreachable" });
     }
   });
   ```

**Q5. What is rate limiting? What strategies exist?**
A: Limits requests per time window per client (usually by IP or user ID).
   Strategies:
   - Fixed window: count requests in current minute. Simple but spiky at boundaries.
   - Sliding window: count requests in last N seconds from NOW. More accurate.
   - Token bucket: each client gets tokens that refill over time. Allows bursts.
   - Leaky bucket: requests queued and processed at fixed rate. Smooth output.
   
   In Express: `express-rate-limit`. Store in Redis for distributed (multiple servers).
   Apply differently: stricter on auth routes (5 req/15min), looser on public API (1000 req/min).

---

## SECTION B — RAG (Retrieval-Augmented Generation)

**Q6. What is RAG?**
A: Retrieval-Augmented Generation. A technique that:
   1. Takes a user's question.
   2. RETRIEVES relevant documents from a knowledge base.
   3. Provides those documents as CONTEXT to an LLM.
   4. LLM GENERATES an answer grounded in your specific data.
   
   Problem it solves: LLMs have a training cutoff, don't know your private data, can hallucinate.
   With RAG: LLM answers based on YOUR documents (docs, PDFs, database records) with citations.
   Used for: internal knowledge bases, customer support bots, document Q&A.

**Q7. What are embeddings?**
A: Embeddings: numerical vector representations of text that capture semantic MEANING.
   "Hello" → [0.23, -0.54, 0.89, ...] (1536 dimensions for text-embedding-3-small)
   Similar meaning → similar vectors → small cosine distance.
   "How to cook pasta?" is near "pasta cooking instructions" in vector space.
   "How to cook pasta?" is far from "quantum physics equations."
   
   Used for: semantic search, RAG retrieval, clustering similar documents, recommendations.
   How: send text to OpenAI/Cohere embedding API → get back a vector → store in vector DB.

**Q8. What is a vector database?**
A: A database specialized in storing and querying VECTOR EMBEDDINGS efficiently.
   Regular DB: SQL queries (WHERE, JOIN) — good for exact matches.
   Vector DB: finds vectors MOST SIMILAR to a query vector (ANN = Approximate Nearest Neighbor).
   
   Popular: Pinecone, Weaviate, Qdrant, Chroma (local), pgvector (PostgreSQL extension).
   pgvector: adds vector type and `<->` distance operator to PostgreSQL.
   `SELECT content FROM docs ORDER BY embedding <-> query_embedding LIMIT 5;`
   
   For production: Pinecone or Weaviate (managed, scalable).
   For learning/MVP: Chroma (local) or pgvector.

**Q9. Walk through building a simple RAG pipeline.**
A: ```
   INDEXING PHASE (done once, or when documents updated):
   1. Split documents into chunks (e.g., 500-1000 tokens each, with overlap).
   2. Send each chunk to embedding API → get vector.
   3. Store vector + original text + metadata in vector DB.
   
   QUERY PHASE (every user question):
   1. User sends question: "What is the refund policy?"
   2. Embed the question: embed("What is the refund policy?") → query vector.
   3. Vector DB similarity search: find top 5 most similar chunks.
   4. Build prompt: "Based on this context: [chunk1] [chunk2] ..., answer: What is the refund policy?"
   5. Send to LLM (GPT-4, Claude) → get answer grounded in your documents.
   6. Return answer (optionally with source citations).
   ```

**Q10. What is chunk size and why does it matter in RAG?**
A: Chunks are pieces of text documents that get individually embedded.
   Too small chunks (< 100 tokens): miss context. "The refund is 30 days" — what refund?
   Too large chunks (> 2000 tokens): embedding loses precision, wastes context window.
   Sweet spot: 500-1000 tokens with 50-100 token overlap (overlap helps preserve context at boundaries).
   
   Chunking strategies:
   - Fixed size: split every N characters. Simple, works well.
   - Semantic (sentence/paragraph): respect natural document structure. Better quality.
   - Recursive: try to split on `\n\n`, then `\n`, then ` `. LangChain default.

---

## SECTION C — System Design

**Q11. What is the difference between horizontal and vertical scaling?**
A: Vertical (scale up): bigger machine (more CPU, RAM). Easier but has limits (biggest AWS instance is finite). Single point of failure.
   Horizontal (scale out): more machines running the same service. Load balancer distributes traffic. Essentially infinite scale. Fault tolerant.
   
   Node.js: stateless APIs scale horizontally easily.
   Problem: shared state (sessions, counters) must be in external store (Redis) not in-process.

**Q12. What is a message queue? Name two examples.**
A: A queue of messages passed between services asynchronously.
   Producer sends a message → queue holds it → consumer processes it (when ready).
   Benefits: decoupling (services don't need to be up simultaneously), load leveling (process at your own pace), retry on failure.
   
   Examples: RabbitMQ (AMQP protocol), Apache Kafka (event streaming, very high throughput), AWS SQS (managed), Redis Streams, BullMQ (Node.js, Redis-backed job queue).
   
   Use cases: email sending, image processing, event sourcing, microservice communication.
   BullMQ in Node.js: job queues with retry, delay, priority, concurrency.

**Q13. What is caching? What are the caching strategies?**
A: Store frequently accessed data in fast storage (memory) to avoid recomputing/refetching.
   Levels: in-process memory (Map, LRU cache), Redis (distributed, shared across servers), CDN (edge caching).
   
   Strategies:
   - Cache-aside (lazy): check cache first. If miss: fetch from DB, store in cache, return.
   - Write-through: write to cache AND DB simultaneously. Always consistent.
   - Write-behind: write to cache, async write to DB later. Fast writes, risk of data loss.
   - TTL (Time-To-Live): cached items expire after N seconds. Prevents stale data.
   
   What to cache: static data, expensive queries, API responses, session data.
   What NOT to cache: frequently changing data, sensitive data, large objects.

**Q14. What is a CDN and why is it important?**
A: CDN (Content Delivery Network): globally distributed network of servers that cache your static content.
   Without CDN: user in Tokyo → request travels to US server → 200ms latency.
   With CDN: user in Tokyo → cached copy on Tokyo CDN server → 5ms latency.
   
   What CDNs cache: static files (JS, CSS, images), API responses (with cache headers), HTML pages (static).
   Popular CDNs: Cloudflare, AWS CloudFront, Fastly, Vercel Edge Network.
   
   Next.js on Vercel: pages, API routes, and static assets automatically served from Vercel's global CDN.
