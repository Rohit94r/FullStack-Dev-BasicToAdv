# DAY 8 — PostgreSQL + Database Design (SQL From Zero)

## Today's Goal
Write SQL by hand confidently: joins, aggregations, indexes, transactions.
Design a normalized schema on paper before touching an ORM.

## Content Ready
All **3 SQL lesson files** in `lessons/` and the **library-db** project in `project/library-db/` are pre-built. Fill every `TODO` before checking answers.

## Morning Revision (2 hr)
From memory: explain the full JWT auth flow out loud, then write the
requireAuth middleware without looking.

## Lessons (in order) — ALL FILES EXIST in `lessons/`
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-setup-and-basics.sql` | Install/connect, CREATE DATABASE/TABLE, data types, INSERT, SELECT, WHERE | 60 min |
| 2 | `02-crud-and-filtering.sql` | UPDATE, DELETE, ORDER BY, LIMIT/OFFSET, LIKE, IN, BETWEEN, NULL handling | 60 min |
| 3 | `03-joins.sql` | INNER, LEFT, RIGHT, FULL joins — with diagrams, self-join, multi-table | 90 min |
| 4 | `04-aggregations.sql` | COUNT/SUM/AVG/MIN/MAX, GROUP BY, HAVING, subqueries, CTEs (WITH) | 75 min |
| 5 | `05-schema-design.sql` | Primary/foreign keys, constraints, 1-1/1-N/N-N relationships, normalization (1NF/2NF/3NF) | 75 min |
| 6 | `06-indexes-and-transactions.sql` | What indexes are, when they help/hurt, EXPLAIN, BEGIN/COMMIT/ROLLBACK, ACID | 60 min |

## Project (6 hours): Library Management Database — PURE SQL (no code!)
Design + build the schema, then answer 30 real questions with queries.

Part A — Schema design (on paper FIRST, then SQL):
- [ ] users (id, name, email unique, role, created_at)
- [ ] authors (id, name, bio)
- [ ] categories (id, name)
- [ ] books (id, title, author_id FK, category_id FK, isbn unique, total_copies)
- [ ] borrow_records (id, user_id FK, book_id FK, borrowed_at, due_at, returned_at nullable)
- [ ] Correct constraints: NOT NULL, UNIQUE, CHECK (total_copies >= 0), ON DELETE behavior

Part B — Seed data (I'll generate realistic INSERT statements)

Part C — The 30 Queries Challenge (fill-in-the-blank style: question → your query → answer below):
Examples: "Books currently borrowed with borrower name", "Top 5 most borrowed books",
"Users with overdue books", "Average borrow duration per category",
"Authors with no books", "Monthly borrow counts for this year"...

## Tonight's Notes
- Draw your schema with relationship arrows
- The 4 join types — draw the Venn diagrams
- What normalization means (explain 3NF simply)
- When does an index HURT performance?
- ACID — one line per letter

## Interview Questions
1. INNER JOIN vs LEFT JOIN?
2. WHERE vs HAVING?
3. What is a foreign key? What happens on delete?
4. What is an index and how does it work (B-tree, simply)?
5. What is a transaction? What is ACID?
6. How would you design a many-to-many relationship?
