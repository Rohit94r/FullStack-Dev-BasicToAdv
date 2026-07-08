# Production Backend Boilerplate — Day 17 Part A

Production-grade Express starter: Docker, validated env, security middleware, logging, health check.

## Quick start

```bash
cd project/production-boilerplate
cp .env.example .env
npm install
docker compose up --build
# API: http://localhost:3000/health
```

## Fill-in-the-blank files

| File | Your job |
|------|----------|
| `src/config/env.js` | Zod env validation — fail fast on startup |
| `src/middleware/requestLogger.js` | pino-http + request IDs |
| `src/routes/health.js` | Health check with DB ping |
| `src/server.js` | Wire helmet, cors, rate limit, graceful shutdown |

## Checklist

- [ ] Env validated before server starts
- [ ] helmet + CORS + rate limiting
- [ ] Structured logging with request IDs
- [ ] `/health` checks PostgreSQL connection
- [ ] SIGTERM graceful shutdown
- [ ] `docker compose up` starts app + postgres

## Workflow

TODO → YOUR IDEA → ANSWER (in comments) → run → fix until green.
