# DAY 9 — LESSON 2: Prisma Setup From Zero

> Level: Beginner
> Time: ~45 min
> Goal: install Prisma, understand every part of `schema.prisma`,
> run your first migration, and open Prisma Studio.

─────────────────────────────────────────────────────────────

## 1. The Big Picture — Prisma's 4 Tools

Prisma is not one thing, it is a toolbox:

| Tool | What it does | Command |
|------|--------------|---------|
| Prisma Schema | One file describing your DB | `prisma/schema.prisma` |
| Prisma Migrate | Turns schema changes into SQL migration files | `npx prisma migrate dev` |
| Prisma Client | Auto-generated, type-safe query library | `npx prisma generate` |
| Prisma Studio | Web GUI to browse/edit your data | `npx prisma studio` |

Workflow you will repeat 100 times in your career:

```
edit schema.prisma → npx prisma migrate dev → use the updated client in code
```

─────────────────────────────────────────────────────────────

## 2. Installation (step by step)

```bash
# 1. Start inside a Node + TypeScript project (like Day 4/6 setup)
npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init

# 2. Install Prisma
npm install prisma --save-dev        # the CLI (dev tool)
npm install @prisma/client           # the runtime client (used in your code)

# 3. Initialize Prisma
npx prisma init
```

`npx prisma init` creates two things:

```
prisma/
└── schema.prisma   ← your database description lives here
.env                ← DATABASE_URL goes here (never commit real secrets!)
```

Why two packages? `prisma` (dev dependency) is the command-line tool for
migrations and generation. `@prisma/client` (regular dependency) is the
library your running app imports.

─────────────────────────────────────────────────────────────

## 3. Anatomy of `schema.prisma`

The freshly generated file looks like this:

```prisma
// 1) GENERATOR — "what should Prisma build for me?"
//    'prisma-client-js' means: generate the TypeScript/JS client
//    into node_modules/@prisma/client when I run `prisma generate`.
generator client {
  provider = "prisma-client-js"
}

// 2) DATASOURCE — "where is my database?"
//    provider = which database engine (postgresql, mysql, sqlite...)
//    url      = connection string, read from the .env file
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 3) MODELS — your tables (you add these yourself, next lesson)
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}
```

And in `.env`:

```env
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/librarydb"
```

**Important:** `.env` must be in `.gitignore`. Committing a real database
password to git is one of the most common (and most embarrassing)
security mistakes.

─────────────────────────────────────────────────────────────

## 4. `prisma migrate dev` — Your First Migration

A **migration** is a saved SQL file that changes the database structure.
Think of migrations as **git commits for your database schema**: each one
is a recorded, ordered step from the old structure to the new one.

```bash
npx prisma migrate dev --name init
```

What this single command does (in order):

1. Compares your `schema.prisma` with the actual database.
2. Generates a SQL file with the difference:
   `prisma/migrations/20260703120000_init/migration.sql`
3. Runs that SQL against your dev database.
4. Records it in a special table `_prisma_migrations` (so it never runs twice).
5. Runs `prisma generate` for you (regenerates the typed client).

The generated SQL for the User model above would be:

```sql
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

You *can* read every migration file — and you should! It keeps your
raw SQL knowledge from Day 8 alive.

─────────────────────────────────────────────────────────────

## 5. `prisma generate` — Building the Typed Client

```bash
npx prisma generate
```

This reads `schema.prisma` and writes a custom client into
`node_modules/@prisma/client`. After that, in your code:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fully typed! Your editor knows `email` and `name` exist.
const user = await prisma.user.create({
  data: { email: "rohit@example.com", name: "Rohit" },
});
```

When do you need to run it manually? After `npm install` on a fresh
clone, or after editing the schema *without* migrating (rare). Otherwise
`migrate dev` runs it for you.

─────────────────────────────────────────────────────────────

## 6. `prisma studio` — See Your Data

```bash
npx prisma studio
```

Opens `http://localhost:5555` — a spreadsheet-like GUI where you can
browse tables, edit rows, and follow relations by clicking. Perfect for
checking "did my seed script actually work?" without writing SELECTs.

─────────────────────────────────────────────────────────────

## 7. Quick Command Reference

```bash
npx prisma init                     # create prisma/ folder + .env
npx prisma migrate dev --name xyz   # create + apply migration (DEV)
npx prisma migrate deploy           # apply existing migrations (PROD)
npx prisma generate                 # (re)build the typed client
npx prisma studio                   # data browser GUI
npx prisma db seed                  # run your seed script
npx prisma migrate reset            # DROP everything, re-run all migrations + seed (DEV ONLY!)
npx prisma format                   # auto-format schema.prisma
```

─────────────────────────────────────────────────────────────

## INTERVIEW Q&A CHEAT SHEET

**Q1: What are the main parts of a `schema.prisma` file?**
A: A `generator` block (what client to generate), a `datasource` block
(database provider + connection URL from env), and `model` blocks
(one per table) plus optional `enum` blocks.

**Q2: What does `prisma migrate dev` do?**
A: Diffs the schema against the database, generates a SQL migration
file, applies it to the dev database, records it in `_prisma_migrations`,
and regenerates the Prisma Client.

**Q3: What is a migration and why not edit the database directly?**
A: A migration is a versioned SQL file describing a schema change.
Editing the DB directly leaves no history, cannot be replayed on other
environments (teammates, staging, production), and drifts out of sync
with your code. Migrations make schema changes repeatable and reviewable.

**Q4: Difference between the `prisma` and `@prisma/client` packages?**
A: `prisma` is the CLI (dev dependency: migrate, generate, studio).
`@prisma/client` is the runtime library your application imports to
run queries.

**Q5: Why is the database URL kept in `.env`?**
A: It contains credentials, and it differs per environment (local,
staging, prod). Env vars keep secrets out of git and let the same code
run anywhere with different configuration.

**Q6: What does `prisma generate` produce?**
A: A TypeScript client tailored to your exact schema — model types,
input types for create/update, and query methods — placed in
`node_modules/@prisma/client`.
