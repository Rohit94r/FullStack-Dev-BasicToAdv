# Library API — Day 9 Project

Express + Prisma REST API for a library management system.
Same layered architecture as Day 6: **Route → Controller → Service → Repository**.

## Prerequisites

- PostgreSQL running (reuse Day 8 Docker container or local install)
- Node.js 18+

## Setup

```bash
cd project/library-api
npm install
cp .env.example .env

# Create DB and run migrations
createdb library_api   # or via psql
npx prisma migrate dev --name init

# Seed sample data
npm run db:seed

# Start dev server
npm run dev
```

## Prisma Models

| Model | Description |
|-------|-------------|
| `Member` | Library members (MEMBER, LIBRARIAN, ADMIN) |
| `Author` | Book authors |
| `Book` | Books with copy tracking |
| `Loan` | Borrow records linking Member ↔ Book |

## Your Task

Fill in all `TODO` sections in:

- `src/services/books.service.js` — filtering, pagination
- `src/services/authors.service.js` — CRUD with NotFoundError
- `src/services/loans.service.js` — **borrow/return with `$transaction`**
- `src/controllers/*.js` — extract req params, call services, send responses
- `src/app.js` — mount routes

Repositories are pre-implemented — focus on service logic and controllers.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/books?page=1&limit=10&search=&authorId=&available=true` | List books |
| GET | `/api/books/:id` | Get one book |
| POST | `/api/books` | Create book |
| PATCH | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| GET/POST/PATCH/DELETE | `/api/authors` | Author CRUD |
| POST | `/api/loans/borrow` | Borrow a book `{ memberId, bookId }` |
| POST | `/api/loans/:id/return` | Return a book |
| GET | `/api/loans/stats` | Overdue count + stats |

## Example Requests

```bash
BASE=http://localhost:5000

# List available books
curl "$BASE/api/books?available=true" | jq .

# Borrow (after seed: member id=1, book id=1)
curl -X POST "$BASE/api/loans/borrow" \
  -H "Content-Type: application/json" \
  -d '{"memberId":1,"bookId":1}' | jq .

# Return loan id=1
curl -X POST "$BASE/api/loans/1/return" | jq .

# Stats
curl "$BASE/api/loans/stats" | jq .
```

## Key Learning: Transactions

The borrow operation **must** use `prisma.$transaction()`:

1. Check `copiesAvailable > 0`
2. Decrement `copiesAvailable`
3. Create `Loan` record

Without a transaction, two concurrent requests could both pass the availability check and create two loans for the last copy.

## Useful Commands

```bash
npx prisma studio          # Visual DB browser
npx prisma migrate dev     # Apply schema changes
npm run db:seed            # Re-seed data
```
