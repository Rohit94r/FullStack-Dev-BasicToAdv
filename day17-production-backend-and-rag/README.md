# DAY 17 — Production Backend + RAG Basics

## Today's Goal
Make backends production-ready: Docker, security, logging, uploads, email.
Plus RAG fundamentals (basic level, as planned) — enough to build and explain it.

## Morning Revision (2 hr)
From memory: FastAPI route with Pydantic schema + dependency-injected DB session.
Explain Depends() out loud.

## Lessons (`lessons/`)
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-docker-basics.md` | Images vs containers, Dockerfile, docker-compose (app + postgres!), volumes | 90 min |
| 2 | `02-env-and-config.ts` | .env files, config validation on startup, secrets NEVER in git | 30 min |
| 3 | `03-security-middleware.ts` | helmet, CORS (finally understand it!), rate limiting, compression | 60 min |
| 4 | `04-logging-and-monitoring.ts` | pino structured logging, request IDs, log levels, health checks | 45 min |
| 5 | `05-uploads-and-email.ts` | multer file uploads, cloud storage concept, nodemailer, cron jobs | 60 min |
| 6 | `06-rag-fundamentals.md` | Embeddings (text→vectors), similarity search, chunking, vector DB concept, the RAG pipeline: ingest→embed→store→retrieve→augment→generate | 90 min |

## Projects (6 hours): Two parts

### Part A: `project/production-boilerplate/` (4 hr)
Take your Day 7 auth server and make it production-grade — this becomes
your starter for EVERY future project:
- [ ] Dockerfile + docker-compose.yml (app + postgres + one command startup)
- [ ] Validated env config (crash on startup if missing vars — fail fast!)
- [ ] helmet + CORS + rate limiting + compression wired correctly
- [ ] pino logging with request IDs
- [ ] /health endpoint (checks DB connection)
- [ ] File upload endpoint with validation (type, size)
- [ ] Email on register (console/ethereal transport for dev)
- [ ] Graceful shutdown (SIGTERM → close server → close DB)

### Part B: `project/tiny-rag-demo/` (2 hr)
Minimal but REAL — understand every step:
- [ ] Load a few text files → chunk them
- [ ] Embed chunks (any embedding API or local model)
- [ ] Store vectors in memory (simple array — vector DB concept without the DB)
- [ ] Cosine similarity search function (YOU write the math — it's 5 lines)
- [ ] Query → top 3 chunks → stuff into prompt → LLM answer
- [ ] Now you can EXPLAIN RAG in interviews because you built it

## Tonight's Notes
- Draw the RAG pipeline
- What CORS actually is (browser protection, not server protection!)
- Docker image vs container
- Why fail-fast config validation

## Interview Questions
1. What is CORS and why does the browser enforce it?
2. What does helmet protect against?
3. Explain Docker in simple words. What is docker-compose for?
4. What is an embedding? What is cosine similarity?
5. Walk through the RAG pipeline. Why RAG instead of fine-tuning?
6. How do you handle secrets in production?
