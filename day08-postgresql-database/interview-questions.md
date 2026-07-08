# Day 8 — PostgreSQL & SQL Interview Questions & Answers

SQL interviews are common for backend roles. Know every concept here.

---

## SECTION A — SQL Fundamentals

**Q1. What is a relational database? How is it different from NoSQL?**
A: Relational DB: data organized in TABLES with rows and columns. Relationships via foreign keys.
   Uses SQL. Enforces schema. ACID transactions. Examples: PostgreSQL, MySQL, SQLite.
   NoSQL: various models — document (MongoDB), key-value (Redis), column (Cassandra), graph (Neo4j).
   Usually schema-less, eventually consistent, horizontally scalable.
   Choose Relational when: data has clear structure, complex queries, financial data, need ACID.
   Choose NoSQL when: flexible/changing schema, massive scale, simple access patterns, JSON-heavy.

**Q2. What are the 5 SQL command types?**
A: DDL (Data Definition Language): CREATE, ALTER, DROP, TRUNCATE — table structure.
   DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE — data operations.
   DCL (Data Control Language): GRANT, REVOKE — permissions.
   TCL (Transaction Control Language): BEGIN, COMMIT, ROLLBACK, SAVEPOINT.
   DQL (Data Query Language): some categorize SELECT separately.

**Q3. What is a PRIMARY KEY?**
A: A column (or combination of columns) that UNIQUELY identifies each row.
   Properties: NOT NULL (required), UNIQUE (no duplicates), one per table.
   Common: SERIAL (auto-increment integer), UUID (universally unique).
   SERIAL → simple, sequential. UUID → no sequential guessing, good for distributed systems.

**Q4. What is a FOREIGN KEY?**
A: A column that references the PRIMARY KEY of another table.
   Enforces REFERENTIAL INTEGRITY — you can't have an orphaned child record.
   `ON DELETE CASCADE` → when parent deleted, child rows automatically deleted.
   `ON DELETE RESTRICT` → prevents deleting parent if children exist.
   `ON DELETE SET NULL` → sets FK column to NULL when parent deleted.

**Q5. What is the difference between WHERE and HAVING?**
A: WHERE  → filters ROWS before grouping. Applied before GROUP BY.
             Can use any column, but NOT aggregate functions.
   HAVING → filters GROUPS after grouping. Applied after GROUP BY.
             Used with aggregate functions: HAVING COUNT(*) > 5.
   ```sql
   SELECT category, COUNT(*) as cnt
   FROM products
   WHERE price > 100          -- filter individual rows first
   GROUP BY category
   HAVING COUNT(*) > 2;       -- then filter groups
   ```

---

## SECTION B — JOINs

**Q6. Explain all 4 types of JOINs with a diagram.**
A: INNER JOIN: Only rows where JOIN condition is TRUE in BOTH tables.
               [Table A] ONLY MATCHES [Table B]
   LEFT JOIN:  ALL rows from left, plus matching rows from right (NULLs for no match).
               [ALL of Table A] + [matching from B]
   RIGHT JOIN: ALL rows from right, plus matching rows from left.
               [matching from A] + [ALL of Table B]
   FULL JOIN:  ALL rows from BOTH tables. NULLs where no match on either side.
               [ALL of Table A] + [ALL of Table B]
   
   Most used: INNER JOIN and LEFT JOIN. RIGHT JOIN = just swap table order in a LEFT JOIN.

**Q7. What is a SELF JOIN? When do you use it?**
A: Joining a table to itself. Used for hierarchical data.
   Example: employees table where manager_id references the same employees table.
   ```sql
   SELECT e.name AS employee, m.name AS manager
   FROM employees e
   LEFT JOIN employees m ON e.manager_id = m.id;
   ```

**Q8. What is the difference between UNION and JOIN?**
A: JOIN    → combines COLUMNS from multiple tables (horizontal combination).
             Result has MORE columns. Rows come from the same set of records.
   UNION   → combines ROWS from multiple queries (vertical combination).
             Result has SAME columns. All queries must have same number/type of columns.
   UNION     → removes duplicate rows.
   UNION ALL → keeps all rows including duplicates (faster).

---

## SECTION C — Aggregation & Advanced

**Q9. What are window functions? How do they differ from GROUP BY?**
A: GROUP BY → collapses rows into groups. One row per group in result.
   Window functions → calculate across a set of rows WITHOUT collapsing them.
                      Each original row remains, gains an extra calculated column.
   
   ```sql
   -- GROUP BY: one row per user (collapses)
   SELECT user_id, SUM(total) FROM orders GROUP BY user_id;
   
   -- Window: each row + running total (doesn't collapse)
   SELECT id, total, SUM(total) OVER (ORDER BY id) AS running_total FROM orders;
   ```
   Key window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), SUM() OVER(), AVG() OVER().

**Q10. What is the difference between RANK() and DENSE_RANK()?**
A: RANK()       → gives same rank to ties, SKIPS next ranks.
                  Example: 1, 2, 2, 4 (no 3 after the tie)
   DENSE_RANK()  → gives same rank to ties, DOESN'T skip.
                  Example: 1, 2, 2, 3 (3 comes after the tie)
   ROW_NUMBER()  → always unique. No ties. Assigns sequential numbers.
                  Example: 1, 2, 3, 4 regardless of ties.

**Q11. What is a CTE (Common Table Expression)?**
A: A named temporary result set defined with WITH, usable in the main query.
   ```sql
   WITH high_spenders AS (
       SELECT user_id, SUM(total_price) AS spent
       FROM orders GROUP BY user_id HAVING SUM(total_price) > 10000
   )
   SELECT u.name, hs.spent
   FROM users u JOIN high_spenders hs ON u.id = hs.user_id;
   ```
   Benefits: readable (breaks complex queries into steps), reusable within query.
   Alternative: subquery in FROM. CTEs are cleaner for multi-step logic.
   Recursive CTEs: can reference themselves. Used for tree/hierarchy queries.

**Q12. What is the difference between a subquery in WHERE vs FROM?**
A: Subquery in WHERE (correlated or not):
   `SELECT * FROM users WHERE id IN (SELECT user_id FROM orders)`
   Subquery in FROM (derived table / inline view):
   `SELECT * FROM (SELECT user_id, COUNT(*) as cnt FROM orders GROUP BY user_id) AS counts`
   The FROM subquery acts like a temporary table you can JOIN and query against.

---

## SECTION D — Schema Design

**Q13. What are the normal forms? Explain 1NF, 2NF, 3NF.**
A: 1NF: Each column has atomic (single) values. No repeating groups.
       BAD: `tags` column with "python,fastapi,sql" → multiple values in one cell.
       GOOD: separate `tags` table with one row per tag.
   
   2NF: 1NF + every non-key column depends on the WHOLE primary key.
        Violation: composite PK (order_id, product_id), and product_name depends only on product_id.
        Fix: move product_name to products table.
   
   3NF: 2NF + no non-key column depends on ANOTHER non-key column (transitive dependency).
        Violation: orders has user_id and user_city. user_city depends on user_id, not order_id.
        Fix: move user_city to users table.
   
   In practice: aim for 3NF. Denormalize only when you have proven performance issues.

**Q14. What is soft delete? Why use it?**
A: Instead of DELETE, update a `deleted_at` column to the current timestamp.
   Query active records: `WHERE deleted_at IS NULL`.
   Benefits: data recovery (oops, deleted wrong thing), audit trail, comply with regulations (GDPR — delete by overwriting, not removing).
   Drawback: table grows unbounded, queries need `deleted_at IS NULL` everywhere (use views or filtered indexes).
   Alternative: archive to separate table.

**Q15. What is the difference between UUID and SERIAL for primary keys?**
A: SERIAL (auto-increment integer):
   - Predictable (1,2,3...) — can enumerate records.
   - Fast joins (integer comparison).
   - Single point of generation (sequential).
   UUID:
   - Random, globally unique — can't guess record IDs.
   - Distributed generation — no coordination needed.
   - Larger (16 bytes vs 4 bytes) — slightly slower joins, larger indexes.
   - Good for: microservices, public APIs (don't expose sequential IDs), merging databases.
   Use SERIAL for internal/private systems. UUID for distributed or externally-exposed IDs.

---

## SECTION E — Performance & Indexes

**Q16. What is an index? How does it work internally?**
A: An index is a separate data structure (usually B-tree) that stores column values + row pointer.
   Without index: PostgreSQL reads every row to find matches (full table scan). O(n).
   With index: PostgreSQL traverses B-tree to find values. O(log n).
   B-tree: balanced tree. Root → branches → leaf nodes (with value + ctid pointer to actual row).
   Index on `email`: B-tree of emails sorted alphabetically. Binary search finds any email in O(log n).
   Trade-off: faster reads, slower writes (must update index on every INSERT/UPDATE/DELETE).

**Q17. When should you NOT add an index?**
A: Indexes have costs too:
   - Extra storage space.
   - Write overhead (INSERT/UPDATE/DELETE must also update all indexes).
   - Too many indexes → write performance degrades.
   Don't index: low-cardinality columns (boolean, status with 3 values).
   Do index: high-cardinality columns (email, UUID), frequently WHERE'd columns, JOIN columns, ORDER BY columns.
   Rule: add indexes based on ACTUAL query patterns, not speculatively.

**Q18. What is EXPLAIN ANALYZE?**
A: Shows how PostgreSQL executes a query — the "execution plan."
   EXPLAIN → shows the plan without running the query.
   EXPLAIN ANALYZE → runs the query and shows actual vs estimated stats.
   Key things to look for:
   - "Seq Scan" = full table scan = missing index.
   - "Index Scan" = using an index.
   - "Nested Loop" / "Hash Join" = join strategy.
   - High "cost" numbers = expensive operations.
   - Large difference between estimated rows and actual rows = stale statistics.
   Run `ANALYZE tablename` to refresh statistics if estimates are wildly off.

---

## SECTION F — Transactions & ACID

**Q19. What are ACID properties?**
A: Atomicity    → Transaction is all-or-nothing. Either all changes commit or none do.
   Consistency  → Database moves from one valid state to another. Constraints always satisfied.
   Isolation    → Concurrent transactions don't interfere with each other (each sees a consistent snapshot).
   Durability   → Committed transactions survive crashes (written to disk before confirming).
   PostgreSQL is fully ACID compliant. This is why it's used for financial systems.

**Q20. What are database isolation levels? What anomalies do they prevent?**
A: Read Uncommitted → can read uncommitted changes from other transactions (dirty reads). Not used in PG.
   Read Committed   → default in PostgreSQL. Only reads committed data. Prevents dirty reads.
   Repeatable Read  → same row reads always return same value. Prevents non-repeatable reads.
   Serializable     → strictest. Transactions appear to run one after another. Prevents phantom reads.
   
   Anomalies:
   - Dirty read: reading uncommitted data that might be rolled back.
   - Non-repeatable read: reading same row twice in a transaction, getting different values.
   - Phantom read: a re-executed query returns different rows (due to inserts by other transactions).
   For most apps: default Read Committed is fine. For financial: consider Serializable.
