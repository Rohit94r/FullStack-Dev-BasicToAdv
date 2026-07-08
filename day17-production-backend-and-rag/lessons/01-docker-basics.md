# Day 17 — Lesson 1: Docker Basics

> Run every example. Type commands by hand — don't copy-paste.

## Why Docker?

Your app works on your laptop but breaks on a teammate's machine because Node/Python versions, env vars, or Postgres differ. Docker packages **app + runtime + dependencies** into an **image**. Running an image creates a **container** — an isolated process with its own filesystem.

| Term | Simple definition |
|------|-------------------|
| **Image** | Blueprint (read-only template) |
| **Container** | Running instance of an image |
| **Dockerfile** | Recipe to build an image |
| **docker-compose** | Run multiple containers together (app + postgres) |
| **Volume** | Persistent storage outside the container |

---

## Example 1: Minimal Dockerfile (Node API)

Create `Dockerfile`:

```dockerfile
# ─── Stage 1: base image ───
FROM node:20-alpine

# Working directory inside container
WORKDIR /app

# Copy package files first (Docker layer caching!)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Document which port the app listens on
EXPOSE 3000

# Start command (NOT npm start in production if it uses nodemon)
CMD ["node", "src/server.js"]
```

Build and run:

```bash
docker build -t my-api .
docker run -p 3000:3000 --env-file .env my-api
```

- `-p 3000:3000` → host port 3000 → container port 3000
- `--env-file .env` → inject environment variables

---

## Example 2: docker-compose (app + PostgreSQL)

Create `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/app_db
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:
```

Commands:

```bash
docker compose up --build      # build + start (foreground)
docker compose up -d           # detached (background)
docker compose logs -f app     # follow app logs
docker compose down            # stop and remove containers
docker compose down -v         # also delete volumes (wipes DB!)
```

**Key insight:** Inside compose, services talk by **service name** (`db`), not `localhost`.

---

## Example 3: .dockerignore

```
node_modules
.env
.git
*.md
Dockerfile
docker-compose.yml
```

Smaller images, faster builds, no secrets baked in.

---

## Common mistakes

1. **Using `localhost` inside container for DB** — use service name `db`.
2. **Forgetting volumes** — data lost when container is removed.
3. **Running as root in production** — add `USER node` after install steps.
4. **Baking secrets into image** — pass via env at runtime.

---

## Interview Q&A

**Q: Image vs container?**  
A: Image is the template; container is a running instance. You can run many containers from one image.

**Q: What is docker-compose for?**  
A: Orchestrating multi-container dev/prod setups (app, DB, Redis) with one command and shared network.

**Q: Why copy package.json before source in Dockerfile?**  
A: Layer caching — dependencies change less often than code, so rebuilds are faster.
