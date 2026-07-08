// ============================================================
// DAY 9 — LESSON 5: PRISMA ADVANCED QUERIES
// Filtering, Pagination, Sorting, Aggregations, Transactions
// Interview Level: Intermediate → Advanced
// ============================================================
//
// HOW TO RUN: same as lesson 04 — needs the migrated library schema.
// Reading it carefully is enough; every query shows its output shape.

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ─────────────────────────────────────────────────────────────
  // SECTION 1: WHERE FILTERS — the full toolbox
  // ─────────────────────────────────────────────────────────────
  // In SQL you write:   WHERE title ILIKE '%dune%' AND copies >= 1
  // In Prisma, `where` is a nested OBJECT. Each operator has a name:

  const filtered = await prisma.book.findMany({
    where: {
      // String operators:
      title: {
        contains: "dune",        // SQL: LIKE '%dune%'
        mode: "insensitive",     // ignore upper/lower case (Postgres ILIKE)
      },
      // Also available for strings:
      //   startsWith: "The"     // LIKE 'The%'
      //   endsWith: "War"       // LIKE '%War'
      //   equals: "Dune"        // exact match (default if you pass a plain value)

      // Number/date operators:
      copiesAvailable: {
        gte: 1,                  // >=   (gt >, lt <, lte <=)
      },

      // "one of these values":
      authorId: { in: [1, 2, 3] },        // SQL: IN (1,2,3)
      // and the opposite: { notIn: [...] }
    },
  });
  console.log("filtered count:", filtered.length);

  // ─────────────────────────────────────────────────────────────
  // SECTION 2: AND / OR / NOT — combining conditions
  // ─────────────────────────────────────────────────────────────
  // Fields inside one `where` object are ALREADY joined by AND.
  // Use explicit OR/AND/NOT arrays for anything more complex.

  const searched = await prisma.book.findMany({
    where: {
      // (title contains q OR author name contains q) AND available >= 1
      OR: [
        { title: { contains: "war", mode: "insensitive" } },
        { author: { name: { contains: "war", mode: "insensitive" } } }, // filter THROUGH a relation!
      ],
      copiesAvailable: { gte: 1 }, // implicit AND with the OR block above
      NOT: { title: { startsWith: "Draft" } },
    },
  });
  console.log("searched:", searched.map((b) => b.title));

  // Relation list filters — for "many" side relations:
  //   some:  at least one related row matches  (most common)
  //   every: all related rows match
  //   none:  no related row matches
  const sciFiBooks = await prisma.book.findMany({
    where: { categories: { some: { name: "Sci-Fi" } } },
  });
  console.log("sci-fi:", sciFiBooks.length);

  // ─────────────────────────────────────────────────────────────
  // SECTION 3: PAGINATION — offset vs cursor (INTERVIEW CLASSIC)
  // ─────────────────────────────────────────────────────────────

  // ── OFFSET PAGINATION ──
  // "Skip the first N rows, give me the next `limit`."
  // Perfect for numbered pages: page 1, 2, 3...
  const page = 2;
  const limit = 10;

  const offsetPage = await prisma.book.findMany({
    skip: (page - 1) * limit,   // page 2 → skip 10
    take: limit,                // take 10
    orderBy: { id: "asc" },     // pagination without stable ORDER BY is a bug!
  });

  // For "Page 2 of 57" you also need the total. Run count in PARALLEL:
  const [rows, total] = await Promise.all([
    prisma.book.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { id: "asc" } }),
    prisma.book.count(),
  ]);
  console.log(`page ${page}: ${rows.length} rows of ${total} total`);

  // ❌ Weakness of offset: the DB still READS and throws away all skipped
  //    rows. skip: 1_000_000 is slow. Also, if rows are inserted/deleted
  //    between page loads, items can shift and appear twice or get skipped.

  // ── CURSOR PAGINATION ──
  // "Give me rows AFTER the row with this id."
  // Analogy: a bookmark. You do not count pages from the beginning —
  // you open the book exactly where the bookmark is.
  const firstBatch = await prisma.book.findMany({
    take: 10,
    orderBy: { id: "asc" },
  });
  const lastSeen = firstBatch[firstBatch.length - 1];

  if (lastSeen) {
    const nextBatch = await prisma.book.findMany({
      take: 10,
      cursor: { id: lastSeen.id }, // start AT this row (a unique field!)
      skip: 1,                     // ...but do not repeat the cursor row itself
      orderBy: { id: "asc" },
    });
    console.log("next batch starts at id:", nextBatch[0]?.id);
  }

  // ✅ Cursor is fast at any depth (index jump, no wasted reads) and
  //    stable under inserts/deletes → the choice for infinite scroll.
  // ❌ But: no "jump to page 7", and you need a unique, sortable cursor column.

  // ─────────────────────────────────────────────────────────────
  // SECTION 4: ORDER BY
  // ─────────────────────────────────────────────────────────────

  const sorted = await prisma.book.findMany({
    orderBy: [
      { copiesAvailable: "desc" },      // primary sort
      { title: "asc" },                 // tie-breaker
    ],
  });
  console.log("most available first:", sorted[0]?.title);

  // You can even sort by a RELATION AGGREGATE — authors with most books first:
  const busyAuthors = await prisma.author.findMany({
    orderBy: { books: { _count: "desc" } },
    take: 5,
  });
  console.log("busiest author:", busyAuthors[0]?.name);

  // ─────────────────────────────────────────────────────────────
  // SECTION 5: AGGREGATE & GROUP BY
  // ─────────────────────────────────────────────────────────────

  // aggregate = one summary row for the WHOLE filtered set.
  // SQL: SELECT COUNT(*), SUM(...), AVG(...), MIN(...), MAX(...) FROM books
  const stats = await prisma.book.aggregate({
    _count: true,
    _sum: { copiesTotal: true },
    _avg: { copiesAvailable: true },
    _min: { copiesAvailable: true },
    _max: { copiesTotal: true },
  });
  // Shape: { _count: 42, _sum: { copiesTotal: 130 }, _avg: {...}, ... }
  console.log("library stats:", stats);

  // groupBy = one summary row PER GROUP.
  // SQL: SELECT "bookId", COUNT(*) FROM borrow_records GROUP BY "bookId"
  // Example: MOST BORROWED BOOKS (used in the day 9 project /stats!)
  const mostBorrowed = await prisma.borrowRecord.groupBy({
    by: ["bookId"],                      // the GROUP BY column(s)
    _count: { bookId: true },            // COUNT per group
    orderBy: { _count: { bookId: "desc" } },
    take: 5,
    // `having` filters GROUPS (after grouping), like SQL HAVING:
    // having: { bookId: { _count: { gte: 2 } } },
  });
  // Shape: [ { bookId: 3, _count: { bookId: 17 } }, ... ]
  console.log("top borrowed bookIds:", mostBorrowed);

  // NOTE: groupBy returns IDs, not titles. To show titles you follow up
  // with findMany({ where: { id: { in: [...] } } }) — see the project.

  // Bonus: count relations directly with _count in include:
  const authorsWithCounts = await prisma.author.findMany({
    include: { _count: { select: { books: true } } },
  });
  // Shape: [ { id, name, _count: { books: 4 } }, ... ]
  console.log("author book counts:", authorsWithCounts.length);

  // ─────────────────────────────────────────────────────────────
  // SECTION 6: TRANSACTIONS — all or nothing
  // ─────────────────────────────────────────────────────────────
  //
  // A transaction groups several queries so they succeed TOGETHER or
  // fail TOGETHER. Classic analogy: bank transfer. Money must leave
  // account A AND arrive in account B. If the second step fails, the
  // first must be undone — otherwise money vanishes.
  //
  // Prisma has TWO forms:

  // ── FORM 1: ARRAY (batch) form ──
  // Pass an array of Prisma queries. They run in one transaction.
  // ❗ Limitation: queries cannot depend on each other's results
  //    (you build the whole list up front).
  const [categoryCount, authorCount] = await prisma.$transaction([
    prisma.category.count(),
    prisma.author.count(),
  ]);
  console.log("counts in one tx:", categoryCount, authorCount);

  // ── FORM 2: INTERACTIVE (callback) form ──
  // You get a `tx` client and can use logic BETWEEN queries.
  // If your callback THROWS, everything inside is ROLLED BACK.
  // This is the form you need for the borrow-a-book flow:
  try {
    await prisma.$transaction(async (tx) => {
      // Step 1: read (inside the transaction)
      const book = await tx.book.findUniqueOrThrow({ where: { id: 1 } });

      // Step 2: business rule — decide with code
      if (book.copiesAvailable < 1) {
        throw new Error("No copies available"); // ← triggers ROLLBACK
      }

      // Step 3+4: two writes that must both happen or neither
      await tx.book.update({
        where: { id: book.id },
        data: { copiesAvailable: { decrement: 1 } },
      });
      await tx.borrowRecord.create({
        data: {
          userId: 1,
          bookId: book.id,
          dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 days
        },
      });
    });
    console.log("borrow transaction committed ✅");
  } catch (e) {
    console.log("borrow rolled back ❌:", (e as Error).message);
  }

  // ❗ RACE CONDITION NOTE (interview gold):
  // Even inside a transaction, two parallel transactions might BOTH read
  // copiesAvailable = 1 and both try to borrow. Protections:
  //   a) a conditional update: updateMany({ where: { id, copiesAvailable: { gte: 1 } },
  //      data: { copiesAvailable: { decrement: 1 } } }) and check count === 1
  //   b) a CHECK constraint in the DB (copiesAvailable >= 0)
  //   c) stricter isolation level or SELECT ... FOR UPDATE via $queryRaw
  // The day 9 project uses (a) — the safest simple pattern.

  // ─────────────────────────────────────────────────────────────
  // SECTION 7: RAW SQL ESCAPE HATCH
  // ─────────────────────────────────────────────────────────────
  // Template-literal version is parameterized → injection-safe.
  const rawResult = await prisma.$queryRaw<{ count: bigint }[]>(
    Prisma.sql`SELECT COUNT(*)::bigint AS count FROM "Book"`
  );
  console.log("raw count:", rawResult[0]?.count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
//
// Q1: Offset vs cursor pagination — trade-offs?
// A: Offset (skip/take) supports "jump to page N" and total counts, but
//    gets slower at deep pages (DB reads and discards skipped rows) and
//    can skip/duplicate items when data changes between pages. Cursor
//    (cursor/take) is fast at any depth and stable under writes, ideal
//    for infinite scroll — but no random page jumps and it needs a
//    unique sortable column.
//
// Q2: How do you get both a page of rows AND the total count efficiently?
// A: Run findMany and count with the same `where` in Promise.all so the
//    two queries execute in parallel.
//
// Q3: Difference between aggregate and groupBy?
// A: aggregate returns ONE summary (count/sum/avg/min/max) for the whole
//    filtered set. groupBy returns one summary PER group of a column
//    (like SQL GROUP BY), and `having` filters those groups.
//
// Q4: What are Prisma's two transaction forms?
// A: Array form — a fixed batch of queries committed together; no logic
//    between them. Interactive form — a callback receiving `tx`; you can
//    read, decide, then write; throwing rolls everything back. Use
//    interactive when later steps depend on earlier results.
//
// Q5: How do you prevent two users borrowing the last copy at once?
// A: Do not read-then-write. Use a conditional atomic update:
//    UPDATE ... SET copies = copies - 1 WHERE id = ? AND copies >= 1,
//    then check whether a row was actually affected. Back it up with a
//    DB CHECK constraint. Locks (SELECT FOR UPDATE) or stricter isolation
//    are heavier alternatives.
//
// Q6: How do you filter by a related table in Prisma?
// A: Nest into the relation field: where: { author: { name: { contains:
//    "x" } } } for to-one, and some/every/none for to-many lists.
//
// Q7: What does `mode: "insensitive"` do?
// A: Makes string filters case-insensitive (Postgres ILIKE instead of
//    LIKE), so "dune" matches "Dune".
//
// Q8: Why must pagination always have an orderBy?
// A: Without ORDER BY, SQL row order is undefined — pages could overlap
//    or miss rows between requests. A stable sort (usually by id or
//    createdAt + id) makes pages deterministic.
