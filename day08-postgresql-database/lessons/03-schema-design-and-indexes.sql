-- =============================================================================
-- DAY 8 — LESSON 3: Schema Design, Normalization, and Indexes
-- =============================================================================
-- Good schema design is the foundation of a healthy database.
-- Bad design leads to: data inconsistency, slow queries, hard migrations.
-- =============================================================================

-- =============================================================================
-- SECTION 1: Data Types in PostgreSQL
-- =============================================================================

-- Text types:
-- VARCHAR(n)  → variable-length string, max n chars. Use for bounded strings (email, name).
-- TEXT        → unlimited length string. Use for content, descriptions.
-- CHAR(n)     → fixed-length. Padded with spaces. Rarely used.

-- Number types:
-- SMALLINT    → -32768 to 32767 (2 bytes)
-- INTEGER     → -2 billion to 2 billion (4 bytes). Standard whole number.
-- BIGINT      → -(2^63) to 2^63 (8 bytes). For very large numbers (user IDs, tweet counts).
-- SERIAL      → auto-incrementing INTEGER. Use for primary keys.
-- BIGSERIAL   → auto-incrementing BIGINT. For very large tables.
-- NUMERIC(p,s)→ exact decimal. Use for MONEY (never use FLOAT for money!).
-- FLOAT/REAL  → approximate decimal. Use for scientific data, not money.

-- Date/Time:
-- DATE        → date only (2024-01-15)
-- TIME        → time only (14:30:00)
-- TIMESTAMP   → date + time, no timezone
-- TIMESTAMPTZ → date + time WITH timezone. ALWAYS prefer this.

-- Other:
-- BOOLEAN     → TRUE / FALSE
-- UUID        → universally unique identifier. Better than SERIAL for distributed systems.
-- JSONB       → binary JSON. Fast queries. Use for flexible/schemaless data.
-- ARRAY       → array of any type. TEXT[], INTEGER[]
-- ENUM        → custom type with fixed values (better than VARCHAR for statuses)

-- Create a custom ENUM type
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE user_role AS ENUM ('guest', 'user', 'moderator', 'admin', 'superadmin');

-- =============================================================================
-- SECTION 2: Normalization — The Core Design Principle
-- =============================================================================
-- Normalization = organizing tables to REDUCE REDUNDANCY and improve integrity.

-- BAD DESIGN (denormalized — all in one table):
-- | order_id | user_name | user_email | product_name | product_price | quantity |
-- | 1        | Rohit     | rohit@ex   | Laptop       | 79999         | 1        |
-- | 2        | Rohit     | rohit@ex   | Phone        | 49999         | 2        |
-- Problems:
-- - "Rohit" and "rohit@ex" repeated for every order → wasted space
-- - If Rohit changes his email: must update EVERY order row → inconsistency risk
-- - If a product is discontinued: lose price history

-- GOOD DESIGN (normalized):
-- users table:    id, name, email
-- products table: id, name, price
-- orders table:   id, user_id (FK), product_id (FK), quantity, price_at_time

-- Normal Forms (you need to understand these conceptually):
-- 1NF: Each column has atomic (single) values. No repeating groups.
-- 2NF: 1NF + every non-key column depends on the WHOLE primary key (not part of it).
-- 3NF: 2NF + no non-key column depends on ANOTHER non-key column.
-- BCNF: Stricter 3NF.
-- For most practical applications: aim for 3NF.

-- =============================================================================
-- SECTION 3: Constraints — Enforcing Data Integrity
-- =============================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,  -- UUID primary key
    author_id   BIGINT NOT NULL,
    title       VARCHAR(500) NOT NULL,
    slug        VARCHAR(500) NOT NULL,
    content     TEXT NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'published', 'archived')),
    view_count  INTEGER NOT NULL DEFAULT 0 CHECK (view_count >= 0),
    tags        TEXT[],                                       -- Array of tag strings
    metadata    JSONB DEFAULT '{}',                           -- Flexible JSON data
    published_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Table-level constraints
    CONSTRAINT blog_posts_author_fk FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT blog_posts_slug_unique UNIQUE (slug)  -- Named constraints are easier to manage
);

-- ON DELETE options for foreign keys:
-- CASCADE    → when parent deleted, delete child rows too. (user deleted → their posts deleted)
-- RESTRICT   → prevent deletion of parent if children exist. (error if you try to delete)
-- SET NULL   → set FK column to NULL when parent deleted.
-- SET DEFAULT→ set FK column to its default value when parent deleted.
-- NO ACTION  → same as RESTRICT but checked at end of transaction.

-- =============================================================================
-- SECTION 4: Indexes — Making Queries Fast
-- =============================================================================
-- Without indexes: PostgreSQL reads EVERY row to find matches (full table scan). O(n).
-- With indexes: PostgreSQL goes directly to relevant rows. O(log n) or O(1).

-- Default: PRIMARY KEY and UNIQUE constraints automatically create indexes.
-- You must manually create indexes for other frequently queried columns.

-- Single column index
CREATE INDEX idx_users_email ON users (email);
-- Now: WHERE email = 'rohit@example.com' → instant lookup instead of full scan

-- Multi-column (composite) index — order matters!
CREATE INDEX idx_orders_user_status ON orders (user_id, status);
-- Efficient for: WHERE user_id = ? AND status = ?
-- Also efficient for: WHERE user_id = ? (uses prefix)
-- NOT efficient for: WHERE status = ? only (doesn't use index)
-- Rule: put most selective / most queried column first.

-- Partial index — index on a subset of rows
CREATE INDEX idx_active_users ON users (email) WHERE is_active = TRUE;
-- Only indexes active users — smaller, faster for: WHERE is_active = TRUE AND email = ?

-- Expression/functional index
CREATE INDEX idx_users_email_lower ON users (LOWER(email));
-- Now: WHERE LOWER(email) = 'rohit@example.com' uses the index
-- Without: LOWER() on a column makes indexes unusable

-- Index for LIKE queries starting with a prefix (not for %keyword% patterns)
CREATE INDEX idx_products_name_prefix ON products (name text_pattern_ops);
-- Enables: WHERE name LIKE 'Laptop%' to use index

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
-- Then: WHERE to_tsvector('english', name) @@ to_tsquery('english', 'laptop')

-- =============================================================================
-- SECTION 5: EXPLAIN ANALYZE — Understanding Query Performance
-- =============================================================================

-- Show query execution plan WITHOUT running the query
EXPLAIN SELECT * FROM users WHERE email = 'rohit@example.com';

-- Show execution plan AND run the query (shows actual time)
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;

-- Output to understand:
-- "Seq Scan" → full table scan. Bad if table is large. Needs an index.
-- "Index Scan" → using an index. Good.
-- "Index Only Scan" → index contains all needed data. Best.
-- cost=0.00..100.00 → estimated startup cost..total cost (in arbitrary units)
-- rows=5 → estimated rows
-- actual time=0.123..0.456 → actual milliseconds
-- loops=1 → how many times this node ran

-- =============================================================================
-- SECTION 6: Transactions — ACID Properties
-- =============================================================================
-- ACID: Atomicity, Consistency, Isolation, Durability
-- Transaction = group of operations that succeed or fail TOGETHER.

-- Transfer money between accounts
BEGIN; -- Start transaction

    -- Deduct from sender
    UPDATE users SET age = age + 0 WHERE id = 1; -- Placeholder for bank operation

    -- In real money transfer:
    -- UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
    -- UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
    -- If second fails → first is rolled back → money doesn't disappear!

COMMIT; -- Finalize. All changes saved.
-- or
-- ROLLBACK; -- Undo everything since BEGIN.

-- Savepoints (partial rollback within transaction)
BEGIN;
    INSERT INTO users (name, email) VALUES ('Test', 'test@test.com');
    SAVEPOINT sp1;
    INSERT INTO users (name, email) VALUES ('Bad', 'rohit@example.com'); -- Will fail (duplicate email)
ROLLBACK TO sp1; -- Roll back to before the bad insert
    -- The first insert (Test) is still pending
COMMIT; -- Only commits the first insert

-- =============================================================================
-- SECTION 7: Common Schema Patterns
-- =============================================================================

-- SOFT DELETE pattern (never actually delete rows)
-- Instead of DELETE, set deleted_at timestamp
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;
-- Query active users: WHERE deleted_at IS NULL
-- Query deleted users: WHERE deleted_at IS NOT NULL
-- Never truly deletes data — auditable, recoverable.

-- AUDIT LOG pattern
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    table_name  VARCHAR(100) NOT NULL,
    record_id   BIGINT NOT NULL,
    action      VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data    JSONB,
    new_data    JSONB,
    changed_by  INTEGER REFERENCES users(id),
    changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CREATED/UPDATED timestamps pattern (almost every table should have these)
-- created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- Use a trigger to auto-update updated_at:

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to any table
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- FILL IN THE BLANK EXERCISES
-- =============================================================================

-- Exercise 1: Create a "categories" table with:
-- - id (SERIAL PRIMARY KEY)
-- - name (VARCHAR 100, unique, not null)
-- - parent_id (self-referential FK — for sub-categories, nullable)
-- - created_at (TIMESTAMPTZ with default)
-- FILL IN:
-- CREATE TABLE categories (
--     _______________________
-- );

-- Exercise 2: Add an index on orders table for efficient "get all pending orders" query:
-- FILL IN:
-- CREATE INDEX _______ ON orders (_______) WHERE _______;

-- Exercise 3: Write a query using EXPLAIN ANALYZE to check if the email index is being used:
-- SELECT _______ FROM users WHERE _______;
-- Add EXPLAIN ANALYZE in front and run it.

-- Exercise 4: Write a transaction that:
-- 1. Creates a new order
-- 2. Decrements the product stock
-- 3. If stock would go below 0: ROLLBACK, else COMMIT
-- FILL IN:
-- BEGIN;
-- _______________________
-- COMMIT;
