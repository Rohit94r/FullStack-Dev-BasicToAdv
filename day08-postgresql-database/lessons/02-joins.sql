-- =============================================================================
-- DAY 8 — LESSON 2: SQL JOINS — Combining Data from Multiple Tables
-- =============================================================================
-- JOINs are the most important SQL concept.
-- Relational databases split data into tables to avoid duplication.
-- JOINs let you COMBINE them back when querying.
-- =============================================================================

-- Setup data (run lesson 01 first for tables)
INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES
    (1, 1, 1, 79999.00, 'delivered'),
    (1, 3, 2, 19998.00, 'shipped'),
    (2, 2, 1, 49999.00, 'pending'),
    (3, 5, 2, 6998.00, 'delivered'),
    (4, 4, 1, 2999.00, 'delivered'),
    (1, 6, 1, 599.00, 'pending');

-- =============================================================================
-- SECTION 1: INNER JOIN — Only Matching Rows
-- =============================================================================
-- Returns rows only where JOIN condition is TRUE in BOTH tables.
-- Missing matches are EXCLUDED from results.

-- Get orders with user info
SELECT
    o.id           AS order_id,
    u.name         AS customer,
    u.email,
    o.total_price,
    o.status,
    o.ordered_at
FROM orders o
INNER JOIN users u ON o.user_id = u.id;
-- Only shows orders that have a matching user (user_id exists in users)
-- Users with NO orders are NOT shown
-- Orders with invalid user_id are NOT shown

-- Join 3 tables: orders + users + products
SELECT
    o.id           AS order_id,
    u.name         AS customer,
    p.name         AS product,
    p.category,
    o.quantity,
    o.total_price,
    o.status
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN products p ON o.product_id = p.id
ORDER BY o.ordered_at DESC;

-- =============================================================================
-- SECTION 2: LEFT JOIN (LEFT OUTER JOIN) — All from Left Table
-- =============================================================================
-- Returns ALL rows from LEFT table.
-- Includes matching rows from RIGHT table.
-- If no match on right: NULL for right table columns.
-- Use for: "show all X, and their Y if they have one"

-- All users and their orders (including users who never ordered)
SELECT
    u.id        AS user_id,
    u.name,
    u.email,
    o.id        AS order_id,
    o.total_price,
    o.status
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
ORDER BY u.name, o.ordered_at;
-- Users with no orders: appear once with NULL order columns

-- Find users with NO orders (the NULL trick)
SELECT u.id, u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;  -- NULL means no matching order found

-- =============================================================================
-- SECTION 3: RIGHT JOIN — All from Right Table
-- =============================================================================
-- Returns ALL rows from RIGHT table.
-- Same as LEFT JOIN with tables swapped.
-- Rarely used — prefer LEFT JOIN and swap table order for clarity.

-- Products, including those never ordered
SELECT
    p.name,
    p.price,
    o.id AS order_id,
    o.quantity
FROM orders o
RIGHT JOIN products p ON o.product_id = p.id;
-- Products with no orders show up with NULL order columns

-- =============================================================================
-- SECTION 4: FULL OUTER JOIN — All from Both Tables
-- =============================================================================
-- Returns ALL rows from BOTH tables.
-- Unmatched rows from either side get NULLs.
-- Use for: finding ALL unmatched records in both directions.

SELECT
    u.name      AS user,
    o.id        AS order_id,
    o.status
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id
ORDER BY u.name;

-- =============================================================================
-- SECTION 5: CROSS JOIN — Cartesian Product
-- =============================================================================
-- Every row from left combined with every row from right.
-- 5 users × 6 products = 30 rows. No ON condition.
-- Use for: generating test data, combo tables.

SELECT u.name, p.name AS product
FROM users u
CROSS JOIN products p;
-- 5 users × 7 products = 35 combinations

-- =============================================================================
-- SECTION 6: SELF JOIN — Join Table With Itself
-- =============================================================================
-- Used for: hierarchical data (managers/employees, parent/child categories)

-- Example: employee table where each employee has a manager
CREATE TABLE IF NOT EXISTS employees (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    manager_id  INTEGER REFERENCES employees(id)  -- References OWN table
);

INSERT INTO employees (name, manager_id) VALUES
    ('CEO', NULL),           -- id=1, no manager
    ('VP Engineering', 1),   -- reports to CEO
    ('VP Marketing', 1),     -- reports to CEO
    ('Senior Dev', 2),        -- reports to VP Eng
    ('Junior Dev', 4);        -- reports to Senior Dev

-- Get employees with their manager names
SELECT
    e.name AS employee,
    m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY m.name NULLS LAST;

-- =============================================================================
-- SECTION 7: Aggregation with JOINs
-- =============================================================================

-- Total spending per user
SELECT
    u.id,
    u.name,
    COUNT(o.id)         AS order_count,
    SUM(o.total_price)  AS total_spent,
    AVG(o.total_price)  AS avg_order_value
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY total_spent DESC NULLS LAST;

-- Revenue per product category
SELECT
    p.category,
    COUNT(o.id)             AS order_count,
    SUM(o.quantity)         AS units_sold,
    SUM(o.total_price)      AS revenue
FROM orders o
INNER JOIN products p ON o.product_id = p.id
WHERE o.status = 'delivered'
GROUP BY p.category
ORDER BY revenue DESC;

-- =============================================================================
-- SECTION 8: Subqueries
-- =============================================================================
-- A query INSIDE another query.

-- Products more expensive than average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price;

-- Users who have placed at least one order
SELECT id, name, email
FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- Users who have placed more than 1 order
SELECT u.name, order_count
FROM users u
JOIN (
    -- Subquery in FROM clause (derived table)
    SELECT user_id, COUNT(*) AS order_count
    FROM orders
    GROUP BY user_id
    HAVING COUNT(*) > 1
) AS multi_orders ON u.id = multi_orders.user_id;

-- =============================================================================
-- SECTION 9: CTEs (Common Table Expressions) — WITH clause
-- =============================================================================
-- CTEs are named, reusable subqueries. Makes complex queries readable.

-- Find top 3 customers by spending
WITH customer_spending AS (
    SELECT
        u.id,
        u.name,
        u.email,
        SUM(o.total_price) AS total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.name, u.email
),
ranked_customers AS (
    SELECT
        *,
        RANK() OVER (ORDER BY total_spent DESC NULLS LAST) AS spending_rank
    FROM customer_spending
)
SELECT *
FROM ranked_customers
WHERE spending_rank <= 3;

-- =============================================================================
-- SECTION 10: Window Functions
-- =============================================================================
-- Calculations across a set of rows related to current row.
-- Unlike GROUP BY: does NOT collapse rows. Each row keeps its values.

-- Row number, rank, running total
SELECT
    o.id,
    u.name AS customer,
    o.total_price,
    ROW_NUMBER() OVER (ORDER BY o.ordered_at) AS row_num,
    RANK() OVER (ORDER BY o.total_price DESC) AS price_rank,
    SUM(o.total_price) OVER (ORDER BY o.ordered_at) AS running_total,
    AVG(o.total_price) OVER () AS overall_avg   -- OVER () = entire result set
FROM orders o
JOIN users u ON o.user_id = u.id;

-- Partition: calculations within groups
SELECT
    p.category,
    p.name,
    p.price,
    RANK() OVER (PARTITION BY p.category ORDER BY p.price DESC) AS rank_in_category,
    AVG(p.price) OVER (PARTITION BY p.category) AS category_avg_price
FROM products p
ORDER BY p.category, rank_in_category;

-- =============================================================================
-- FILL IN THE BLANK EXERCISES
-- =============================================================================

-- Exercise 1: Show the most recent order for each user (user name, product name, amount).
-- FILL IN:
-- SELECT _______ FROM orders o
-- JOIN users u ON _______
-- JOIN products p ON _______
-- ORDER BY _______ DESC;

-- Exercise 2: Find products that have never been ordered.
-- Use LEFT JOIN + WHERE NULL pattern.
-- FILL IN:
-- SELECT p.name, p.price FROM products p
-- LEFT JOIN orders o ON _______
-- WHERE _______;

-- Exercise 3: Write a CTE to get each user's favorite category
-- (category where they spent the most money).
-- FILL IN:
-- WITH user_category_spending AS (
--     SELECT _______ FROM _______
-- )
-- SELECT * FROM user_category_spending ...
