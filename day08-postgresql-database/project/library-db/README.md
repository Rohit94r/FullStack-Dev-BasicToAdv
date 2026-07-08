# Library Database — Day 8 Project

Pure SQL project: design a normalized library schema and write 30 queries.

## Prerequisites

Install PostgreSQL locally or use Docker:

```bash
# Docker (quick start)
docker run --name library-postgres -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 -d postgres:16

# Or install via Homebrew (macOS)
brew install postgresql@16
brew services start postgresql@16
```

## Setup

```bash
cd project/library-db

# Create database
createdb library_db
# Or: psql -U postgres -c "CREATE DATABASE library_db;"

# Load schema + seed data
psql -d library_db -f schema.sql

# Connect interactively
psql -d library_db
```

## Schema Overview

```
users ──────┐
            ├── loans ──── books ──── authors
            │
         (member/librarian/admin roles)
```

Tables: `users`, `authors`, `books`, `loans`

## Your Task

Work through `queries/01-basics.sql` → `queries/10-advanced.sql`.

Each file has **3 fill-in-the-blank queries**. Write your SQL where you see `-- TODO:`,
then uncomment the `-- ANSWER:` block below to check yourself.

## Query Files

| File | Topics |
|------|--------|
| `01-basics.sql` | SELECT, WHERE, ORDER BY |
| `02-basics.sql` | INSERT, UPDATE, DELETE |
| `03-joins.sql` | INNER JOIN, LEFT JOIN |
| `04-joins.sql` | Multi-table joins |
| `05-aggregations.sql` | COUNT, GROUP BY |
| `06-aggregations.sql` | SUM, AVG, HAVING |
| `07-subqueries.sql` | Subqueries, IN, EXISTS |
| `08-subqueries.sql` | CTEs (WITH) |
| `09-advanced.sql` | Date functions, CASE |
| `10-advanced.sql` | Window functions intro |

## Tips

- Run `\dt` in psql to list tables
- Run `\d loans` to describe a table
- Use `EXPLAIN ANALYZE` on slow queries to see index usage
- Active loan = `returned_at IS NULL`

## Verify a Query

```bash
psql -d library_db -f queries/01-basics.sql
```

Or paste individual queries into the `psql` prompt.
