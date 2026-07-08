# Day 9 — Prisma ORM Interview Questions & Answers

---

## SECTION A — ORM & Prisma Fundamentals

**Q1. What is an ORM? Why use Prisma over raw SQL?**
A: ORM (Object-Relational Mapper): translates between database tables and programming language objects.
   Instead of writing SQL: `SELECT * FROM users WHERE id = $1` → use: `prisma.user.findUnique({ where: { id } })`.
   Prisma advantages:
   - Type-safe queries (TypeScript types generated from schema).
   - Migrations — track schema changes in code (like git for your database).
   - Auto-completion in IDE for all queries.
   - Works with multiple databases (PostgreSQL, MySQL, SQLite, MongoDB).
   When to use raw SQL: complex queries Prisma can't express, performance-critical operations.

**Q2. What are the 3 main parts of the Prisma toolkit?**
A: Prisma Client → auto-generated type-safe query builder. `import { PrismaClient }`.
   Prisma Migrate → migration system. Generates SQL migration files from schema changes.
   Prisma Studio → GUI to browse and edit database data. `npx prisma studio`.

**Q3. What is the Prisma schema? What does it define?**
A: The `schema.prisma` file is the SINGLE source of truth.
   Defines:
   - datasource → which database to connect to (DATABASE_URL from .env).
   - generator → what to generate (prisma-client-js for TypeScript).
   - models → database tables (fields, types, constraints, relations).
   Changes to schema → run `npx prisma migrate dev` to apply changes.

**Q4. What is the difference between `findUnique`, `findFirst`, and `findMany`?**
A: findUnique → finds exactly ONE record by unique field (id, email). Returns null if not found.
               If no unique field → TypeScript compile error.
   findFirst  → finds FIRST matching record. Accepts any filter. Returns null if not found.
   findMany   → returns ARRAY of all matching records. Empty array if none.
   
   Use findUnique for: looking up by id or email (unique fields).
   Use findFirst for: "get the latest active user" (non-unique filter).
   Use findMany for: listing, filtering, pagination.

**Q5. What is the difference between `create`, `upsert`, and `createMany`?**
A: create      → insert one record. Throws if unique constraint violated.
   upsert      → create if not exists, UPDATE if exists. Based on `where` unique field.
                 Pattern: "create or update."
   createMany  → insert multiple records at once. More efficient than multiple creates.
                 PostgreSQL returns the count, not the created records.

---

## SECTION B — Relations in Prisma

**Q6. How do you define a one-to-many relationship in Prisma?**
A: ```prisma
   model User {
     id    Int    @id @default(autoincrement())
     posts Post[] // One user has many posts
   }
   
   model Post {
     id     Int  @id @default(autoincrement())
     userId Int
     user   User @relation(fields: [userId], references: [id]) // Many posts belong to one user
   }
   ```
   The `userId` is the FOREIGN KEY. The `user` field is the relation (no database column).

**Q7. How do you include related data in a Prisma query?**
A: Use `include`:
   ```typescript
   const user = await prisma.user.findUnique({
     where: { id: 1 },
     include: {
       posts: true,  // Include all posts
       _count: { select: { posts: true } }  // Include count
     }
   });
   ```
   Or `select` to choose specific fields:
   ```typescript
   const user = await prisma.user.findUnique({
     where: { id: 1 },
     select: { name: true, email: true, posts: { select: { title: true } } }
   });
   ```
   Cannot use both include and select at the same level.

**Q8. What is the `_count` field in Prisma?**
A: Returns the count of related records without fetching them.
   ```typescript
   const users = await prisma.user.findMany({
     include: { _count: { select: { posts: true, orders: true } } }
   });
   // Result: { id: 1, name: "Rohit", _count: { posts: 5, orders: 3 } }
   ```
   Much more efficient than loading all related records just to count them.

---

## SECTION C — Migrations

**Q9. What is the difference between `prisma migrate dev` and `prisma migrate deploy`?**
A: migrate dev   → development only. Generates migration file, applies it, regenerates client.
                   May reset database if needed. Safe for development.
   migrate deploy → production safe. Applies pending migrations WITHOUT resetting.
                   Does NOT generate new migrations. Use in CI/CD and production deploys.
   migrate reset  → drops database and re-runs all migrations from scratch. Development only.

**Q10. What happens if you modify a Prisma model without running a migration?**
A: The database schema stays unchanged. Your queries will fail at runtime because the database doesn't match the schema.
   Prisma Client is generated from the schema, but the REAL database needs to match.
   Always: modify schema → run `npx prisma migrate dev` → commit migration file.
   Commit both `schema.prisma` AND the migration SQL files (in prisma/migrations/).

---

## SECTION D — Advanced Queries

**Q11. How do you do transactions in Prisma?**
A: ```typescript
   // Sequential (each uses result of previous)
   const [user, profile] = await prisma.$transaction([
     prisma.user.create({ data: { ... } }),
     prisma.profile.create({ data: { ... } })
   ]);
   
   // Interactive transaction (can use results between queries)
   await prisma.$transaction(async (tx) => {
     const order = await tx.order.create({ data: { ... } });
     await tx.product.update({
       where: { id: order.productId },
       data: { stock: { decrement: order.quantity } }
     });
     // If stock goes negative: throw error → entire transaction rolled back
   });
   ```

**Q12. How do you use raw SQL in Prisma?**
A: ```typescript
   // When Prisma can't express a query (complex aggregations, custom functions)
   const result = await prisma.$queryRaw`
     SELECT user_id, SUM(total_price) as total
     FROM orders
     GROUP BY user_id
     HAVING SUM(total_price) > ${1000}
   `;
   ```
   Template literal prevents SQL injection. Return type is unknown — cast with Prisma.sql.

**Q13. What is the `select` option for and when do you NOT use `include`?**
A: `select` → choose EXACTLY which fields to return. Cannot be used with include at same level.
   Use select when: returning API response (exclude password), optimizing queries (don't fetch unused data).
   Use include when: you need full related objects.
   ```typescript
   // Good practice — never return password from Prisma
   const user = await prisma.user.findUnique({
     where: { id },
     select: { id: true, name: true, email: true }  // password excluded
   });
   ```
