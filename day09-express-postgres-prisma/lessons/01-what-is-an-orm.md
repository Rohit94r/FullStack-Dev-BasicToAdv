# DAY 9 — LESSON 1: What Is an ORM?

> Level: Beginner → Intermediate
> Time: ~30 min
> Prerequisite: Day 8 (raw SQL with PostgreSQL)

─────────────────────────────────────────────────────────────

## 1. The Problem ORMs Solve

Yesterday (Day 8) you wrote raw SQL like this:

```sql
SELECT * FROM books WHERE author_id = 3;
```

And in Node.js, you had to do something like:

```js
const result = await pool.query("SELECT * FROM books WHERE author_id = $1", [3]);
const books = result.rows; // just plain objects, no types, no help
```

Problems with this approach:

1. **No type safety.** `result.rows` is `any[]`. If you typo a column name
   (`book.titel`), TypeScript cannot warn you. You find the bug at runtime.
2. **Strings everywhere.** SQL lives inside strings. Your editor cannot
   autocomplete table names or catch a broken query before you run it.
3. **Manual mapping.** The database gives you `snake_case` columns
   (`created_at`), but JavaScript prefers `camelCase` (`createdAt`).
   You convert by hand, again and again.
4. **Repetitive code.** Every table needs the same create/read/update/delete
   queries written over and over.

─────────────────────────────────────────────────────────────

## 2. What Is an ORM?

**ORM = Object-Relational Mapper.**

Analogy: an ORM is a **translator** standing between two people who speak
different languages:

- Your JavaScript/TypeScript code speaks in **objects** (`{ title: "Dune" }`).
- The database speaks in **tables, rows, and SQL**.

The ORM translates between them, in both directions:

```
Your code (objects)  ←── ORM translates ──→  Database (tables + SQL)

prisma.book.create({ data: { title: "Dune" } })
        │
        ▼  ORM generates SQL for you:
INSERT INTO "Book" ("title") VALUES ('Dune') RETURNING *;
        │
        ▼  ...and converts the returned row back into:
{ id: 1, title: "Dune", createdAt: 2026-07-03T... }
```

Popular ORMs:

| Language | ORMs |
|----------|------|
| Node.js / TS | **Prisma**, TypeORM, Sequelize, Drizzle |
| Python | SQLAlchemy, Django ORM |
| Java | Hibernate |

We use **Prisma** because it has the best TypeScript support: it *generates
types from your schema*, so `book.title` autocompletes and `book.titel`
becomes a compile error.

─────────────────────────────────────────────────────────────

## 3. ORM vs Raw SQL — Honest Trade-offs

### ✅ ORM advantages

1. **Type safety.** Prisma generates a TypeScript client from your schema.
   Wrong field name = red squiggle before you even run the code.
2. **Productivity.** `prisma.book.findMany()` instead of writing SELECT,
   mapping rows, and handling nulls by hand.
3. **Migrations built in.** Schema changes are tracked as versioned files
   (like git for your database structure).
4. **Protection from SQL injection by default.** The ORM always uses
   parameterized queries under the hood.
5. **One mental model.** Relations look like nested objects, not JOINs.

### ❌ ORM disadvantages

1. **You lose fine control.** Some complex queries (window functions,
   recursive CTEs, exotic JOINs) are hard or impossible to express.
2. **Hidden performance costs.** The ORM may generate more queries than
   you expect (see the N+1 problem below).
3. **Learning another layer.** You must learn Prisma's API *and* still
   understand SQL to debug what it generates.
4. **Abstraction leaks.** When something goes wrong deep down, you must
   read the generated SQL anyway.

### When to drop to raw SQL

Prisma lets you escape the abstraction when needed:

```ts
// $queryRaw is still parameterized (safe from injection)
const rows = await prisma.$queryRaw`
  SELECT a.name, COUNT(b.id)::int AS book_count
  FROM "Author" a
  LEFT JOIN "Book" b ON b."authorId" = a.id
  GROUP BY a.name
  HAVING COUNT(b.id) > 5
`;
```

Rule of thumb: **use the ORM for 95% of queries** (CRUD, simple filters,
relations) and **drop to raw SQL for the 5%** that are report-style,
performance-critical, or use database features the ORM does not support.

─────────────────────────────────────────────────────────────

## 4. The N+1 Query Problem (Interview Favorite!)

This is the most famous ORM performance trap. Say you want to show
10 books with each book's author name.

### ❌ The naive way (N+1 queries)

```ts
const books = await prisma.book.findMany({ take: 10 });   // 1 query

for (const book of books) {
  // Runs ONE MORE query PER BOOK — 10 extra queries!
  const author = await prisma.author.findUnique({ where: { id: book.authorId } });
  console.log(book.title, author?.name);
}
```

Total: **1 query for books + N queries for authors = N+1 queries.**
With 10 books that is 11 queries. With 1,000 books it is 1,001 queries.
Each query is a network round-trip to the database — this gets slow fast.

### ✅ The fix: fetch relations together (`include`)

```ts
const books = await prisma.book.findMany({
  take: 10,
  include: { author: true },   // Prisma fetches authors in the SAME trip
});

for (const book of books) {
  console.log(book.title, book.author.name);  // no extra queries
}
```

Prisma solves this with a JOIN or a smart batched second query —
either way it is **2 queries max instead of N+1**.

**Analogy:** you need 10 pizzas. N+1 = driving to the pizza shop 10
separate times. `include` = one trip, carry all 10 boxes at once.

─────────────────────────────────────────────────────────────

## 5. How Prisma Is Different From Classic ORMs

Classic ORMs (TypeORM, Sequelize) make you write **classes** that mirror
tables. Prisma flips this:

1. You describe your database in **one file**: `schema.prisma`
   (its own simple language, not TypeScript).
2. You run `prisma generate` and Prisma **writes a type-safe client
   for you** (`@prisma/client`).
3. You query with that client: `prisma.book.findMany(...)`.

So Prisma is technically a "database toolkit" (schema + migrations +
query builder + GUI), but everyone calls it an ORM and that is fine
for interviews too.

─────────────────────────────────────────────────────────────

## INTERVIEW Q&A CHEAT SHEET

**Q1: What is an ORM?**
A: Object-Relational Mapper — a library that translates between objects
in your programming language and rows/tables in a relational database.
It generates SQL for you, maps results back to objects, and usually
handles migrations and connection pooling.

**Q2: Pros and cons of an ORM vs raw SQL?**
A: Pros — type safety, faster development, built-in migrations,
automatic protection from SQL injection, relations as nested objects.
Cons — less control over generated SQL, possible hidden performance
issues (N+1), one more abstraction to learn, some complex queries are
impossible without dropping to raw SQL.

**Q3: What is the N+1 query problem?**
A: When you fetch N parent rows with 1 query, then loop and run 1 more
query per row to get related data — N+1 total queries. Fix: eager-load
the relation in the first request (Prisma `include`, SQL JOIN), which
reduces it to 1–2 queries.

**Q4: When would you use raw SQL even though you have an ORM?**
A: Complex reporting queries (window functions, CTEs), bulk operations,
performance-critical hot paths, or database-specific features the ORM
does not expose. Prisma supports this via `$queryRaw` which is still
parameterized and safe.

**Q5: Does an ORM fully protect you from SQL injection?**
A: For normal ORM methods, yes — everything is parameterized. But if
you build raw SQL strings by concatenating user input (even inside
`$queryRawUnsafe`), you reintroduce injection. Always use parameters.

**Q6: What makes Prisma different from TypeORM/Sequelize?**
A: Prisma is schema-first: you define models in `schema.prisma`, and it
generates a fully typed client. Classic ORMs are code-first with entity
classes and decorators, and their TypeScript types are weaker.
