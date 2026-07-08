// ============================================================
// DAY 9 — LESSON 4: PRISMA CRUD (Create, Read, Update, Delete)
// Interview Level: Beginner → Intermediate
// ============================================================
//
// HOW TO RUN THIS FILE:
// This lesson assumes the schema from lesson 03 has been migrated
// into a PostgreSQL database. If you have the day 9 project set up:
//   cd project/library-api && npx ts-node ../../lessons/04-prisma-crud.ts
// Otherwise just READ it — every query shows its result shape in comments.
//
// THE ONE IDEA OF THIS LESSON:
// Every Prisma query follows the same pattern:
//
//   prisma.<model>.<action>({ ...options })
//
//   model  = user, book, author...   (lowercase version of your model)
//   action = create, findMany, findUnique, update, delete, upsert...
//   options = data (what to write), where (which rows), select/include
//             (what shape to return)

import { PrismaClient } from "@prisma/client";

// Create ONE PrismaClient for your whole app and reuse it.
// Each PrismaClient manages its own connection pool — creating a new
// one per request would exhaust database connections. (Like opening a
// new bank account every time you want to pay — just reuse one!)
const prisma = new PrismaClient();

async function main() {
  // ─────────────────────────────────────────────────────────────
  // SECTION 1: CREATE
  // ─────────────────────────────────────────────────────────────

  // Basic create: `data` = the column values for the new row.
  const author = await prisma.author.create({
    data: { name: "Frank Herbert" },
  });
  // Returns the FULL created row, including DB-generated fields:
  // { id: 1, name: "Frank Herbert" }
  console.log("created author:", author);

  // NESTED CREATE — create a book AND connect/create relations in ONE call.
  const book = await prisma.book.create({
    data: {
      title: "Dune",
      copiesTotal: 3,
      copiesAvailable: 3,
      // `connect` = link to an EXISTING row by unique field.
      author: { connect: { id: author.id } },
      // `connectOrCreate` = link if it exists, otherwise create it.
      // Perfect for tags/categories.
      categories: {
        connectOrCreate: [
          {
            where: { name: "Sci-Fi" },
            create: { name: "Sci-Fi" },
          },
        ],
      },
    },
  });
  console.log("created book:", book.title);

  // createMany — bulk insert. Faster (one SQL statement), BUT:
  // ❌ does not return the created rows (only a count)
  // ❌ cannot do nested relation writes
  const many = await prisma.author.createMany({
    data: [{ name: "Ursula K. Le Guin" }, { name: "Isaac Asimov" }],
    skipDuplicates: true, // ignore rows that hit a unique constraint
  });
  console.log("createMany count:", many.count); // { count: 2 }

  // ─────────────────────────────────────────────────────────────
  // SECTION 2: READ — findMany, findUnique, findFirst
  // ─────────────────────────────────────────────────────────────

  // findMany = SELECT ... WHERE ... — always returns an ARRAY (maybe empty).
  const allBooks = await prisma.book.findMany();
  console.log("total books:", allBooks.length);

  // findUnique = look up by a UNIQUE field (@id or @unique ONLY).
  // Returns the row or `null` — never throws when not found.
  const maybeBook = await prisma.book.findUnique({
    where: { id: book.id },
  });
  console.log("findUnique:", maybeBook?.title);

  // findUniqueOrThrow = same, but throws if missing.
  // Nice in services: catch the error → return 404.
  //   const b = await prisma.book.findUniqueOrThrow({ where: { id: 999 } });

  // findFirst = like findMany but returns only the first match (or null).
  // Use when your filter is NOT on a unique column.
  const firstSciFi = await prisma.book.findFirst({
    where: { categories: { some: { name: "Sci-Fi" } } },
  });
  console.log("first sci-fi book:", firstSciFi?.title);

  // ─────────────────────────────────────────────────────────────
  // SECTION 3: select vs include  (INTERVIEW FAVORITE)
  // ─────────────────────────────────────────────────────────────
  //
  // By default a query returns ALL scalar columns and NO relations.
  // Two options change the returned shape — you can use ONE at a time
  // per level (not both together on the same level):
  //
  //   select  = "give me ONLY these fields"        (narrow down)
  //   include = "give me everything PLUS relations" (add on top)

  // include: full book + its author object + its categories.
  const withRelations = await prisma.book.findUnique({
    where: { id: book.id },
    include: {
      author: true,
      categories: true,
    },
  });
  // Shape: { id, title, ..., author: { id, name }, categories: [...] }
  console.log("author via include:", withRelations?.author.name);

  // select: ONLY title and the author's name. Less data over the wire,
  // and the TypeScript type narrows too — bookSlim.id does NOT exist!
  const bookSlim = await prisma.book.findUnique({
    where: { id: book.id },
    select: {
      title: true,
      author: { select: { name: true } }, // nested select inside relation
    },
  });
  // Shape: { title: "Dune", author: { name: "Frank Herbert" } }
  console.log("slim book:", bookSlim);

  // WHY IT MATTERS: `select` = performance + not leaking fields
  // (imagine accidentally returning user.passwordHash to the frontend ❌).

  // ─────────────────────────────────────────────────────────────
  // SECTION 4: UPDATE
  // ─────────────────────────────────────────────────────────────

  // update = change ONE row found by a unique field.
  // Throws P2025 error if the row does not exist.
  const updated = await prisma.book.update({
    where: { id: book.id },
    data: {
      // Atomic number operations — the DATABASE does the math, which is
      // safe even if two requests run at the same moment:
      copiesAvailable: { decrement: 1 },
      // (also: increment, multiply, divide, set)
    },
  });
  console.log("copies after decrement:", updated.copiesAvailable);

  // updateMany = change ALL matching rows. Returns only { count }.
  const bulk = await prisma.book.updateMany({
    where: { copiesAvailable: 0 },
    data: { copiesAvailable: 1 },
  });
  console.log("updateMany count:", bulk.count);

  // ─────────────────────────────────────────────────────────────
  // SECTION 5: UPSERT — "update if exists, create if not"
  // ─────────────────────────────────────────────────────────────
  // Analogy: hotel check-in. Guest in the system? Update the record.
  // New guest? Create one. Either way, one call, no if/else in your code.
  // Great for seed scripts and "sync from external source" jobs.

  const category = await prisma.category.upsert({
    where: { name: "Fantasy" },       // must be a UNIQUE field
    update: {},                        // what to change if found (nothing here)
    create: { name: "Fantasy" },       // what to insert if missing
  });
  console.log("upserted category:", category.name);

  // ─────────────────────────────────────────────────────────────
  // SECTION 6: DELETE
  // ─────────────────────────────────────────────────────────────

  // delete = remove ONE row by unique field. Throws P2025 if missing.
  // NOTE: if other rows point at it with a foreign key (and onDelete is
  // Restrict), the DATABASE will refuse — that is your FK protecting you.
  await prisma.category.delete({ where: { name: "Fantasy" } });

  // deleteMany = remove all matching rows (empty where = WIPE THE TABLE ❗)
  const gone = await prisma.borrowRecord.deleteMany({
    where: { returnedAt: { not: null } },
  });
  console.log("deleted returned records:", gone.count);

  // ─────────────────────────────────────────────────────────────
  // SECTION 7: ERROR HANDLING — the codes you will actually see
  // ─────────────────────────────────────────────────────────────
  try {
    await prisma.author.create({ data: { name: "Frank Herbert" } });
    // If `name` had @unique, a duplicate would throw:
  } catch (err: any) {
    // P2002 = unique constraint violated  → respond 409 Conflict
    // P2025 = record not found            → respond 404 Not Found
    // P2003 = foreign key violated        → respond 400/409
    if (err.code === "P2002") console.log("duplicate! ->", err.meta);
    else throw err;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Always disconnect so the Node process can exit cleanly.
    await prisma.$disconnect();
  });

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
//
// Q1: Difference between findUnique, findFirst, and findMany?
// A: findUnique looks up by a unique field (@id/@unique) and returns
//    one row or null. findFirst returns the first row matching ANY
//    filter (or null). findMany returns an array of all matches.
//
// Q2: select vs include?
// A: select picks an exact set of fields (only those are returned —
//    good for performance and for hiding sensitive fields). include
//    returns all scalar fields PLUS the listed relations. You cannot
//    use both at the same level of the same query.
//
// Q3: What is upsert and when is it useful?
// A: One atomic call that updates a row if it exists (by unique field)
//    or creates it otherwise. Useful in seeding, imports, and
//    "insert-or-refresh" flows without racy check-then-write code.
//
// Q4: How does Prisma handle "record not found" in update/delete?
// A: It throws a known error with code P2025. In an API you catch it
//    and translate it to a 404 response.
//
// Q5: Why use { decrement: 1 } instead of reading the value,
//     subtracting in JS, and writing it back?
// A: Read-then-write is a race condition: two parallel requests read
//    the same value and both write value-1 (one decrement is lost).
//    { decrement: 1 } becomes SQL `SET x = x - 1`, done atomically by
//    the database.
//
// Q6: Difference between create and createMany?
// A: create inserts one row, supports nested relation writes, and
//    returns the full row. createMany bulk-inserts in one statement,
//    returns only a count, and cannot write nested relations.
//
// Q7: Why should the whole app share one PrismaClient instance?
// A: Each instance holds a connection pool. Many instances = many
//    pools = you exhaust the database's max connections.
