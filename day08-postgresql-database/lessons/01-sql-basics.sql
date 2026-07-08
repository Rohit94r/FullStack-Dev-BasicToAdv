-- =============================================================================
-- DAY 8 — LESSON 1: SQL Basics — SELECT, INSERT, UPDATE, DELETE
-- =============================================================================
-- PostgreSQL is the most advanced open-source relational database.
-- SQL (Structured Query Language) = the language for talking to databases.
-- Run these in: psql, TablePlus, pgAdmin, DBeaver.
-- =============================================================================

-- =============================================================================
-- SECTION 1: Creating Tables (DDL — Data Definition Language)
-- =============================================================================

-- Drop tables if they exist (for clean start)
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,           -- Auto-incrementing integer primary key
    name        VARCHAR(100) NOT NULL,        -- Max 100 chars, required
    email       VARCHAR(255) NOT NULL UNIQUE, -- Max 255 chars, required, must be unique
    age         INTEGER CHECK (age >= 0 AND age <= 150),  -- Must be valid age
    role        VARCHAR(20) DEFAULT 'user',   -- Defaults to 'user' if not provided
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),    -- Timestamp with timezone, auto-set
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    description TEXT,                         -- Unlimited text length
    price       NUMERIC(10, 2) NOT NULL,      -- 10 digits total, 2 decimal places
    stock       INTEGER NOT NULL DEFAULT 0,
    category    VARCHAR(50),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table (references both users and products)
CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    ordered_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SECTION 2: INSERT — Adding Data (DML — Data Manipulation Language)
-- =============================================================================

-- Insert one row
INSERT INTO users (name, email, age, role) VALUES
    ('Rohit Jadhav', 'rohit@example.com', 25, 'admin');

-- Insert multiple rows at once
INSERT INTO users (name, email, age) VALUES
    ('Priya Sharma', 'priya@example.com', 28),
    ('Amit Kumar', 'amit@example.com', 22),
    ('Sneha Patel', 'sneha@example.com', 30),
    ('Vikram Singh', 'vikram@example.com', 35);

-- Insert with RETURNING — get inserted row back
INSERT INTO products (name, price, stock, category)
VALUES ('Laptop Pro', 79999.00, 50, 'electronics')
RETURNING id, name, created_at;

-- Insert multiple products
INSERT INTO products (name, price, stock, category) VALUES
    ('Smartphone X', 49999.00, 100, 'electronics'),
    ('Wireless Headphones', 9999.00, 200, 'electronics'),
    ('Coffee Maker', 2999.00, 75, 'appliances'),
    ('Python Book', 599.00, 500, 'books'),
    ('Running Shoes', 3499.00, 150, 'sports');

-- =============================================================================
-- SECTION 3: SELECT — Reading Data
-- =============================================================================

-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT id, name, email, age FROM users;

-- Select with alias (rename columns in output)
SELECT
    id          AS user_id,
    name        AS full_name,
    email       AS email_address,
    created_at  AS "Created On"   -- Quotes needed for spaces
FROM users;

-- Calculated columns
SELECT
    name,
    price,
    stock,
    price * stock AS total_value    -- Calculate total inventory value
FROM products;

-- Distinct values
SELECT DISTINCT category FROM products;

-- =============================================================================
-- SECTION 4: WHERE — Filtering Data
-- =============================================================================

-- Comparison operators: =, !=, <>, <, >, <=, >=
SELECT * FROM users WHERE age > 25;
SELECT * FROM products WHERE price < 5000;

-- Multiple conditions
SELECT * FROM users WHERE age >= 25 AND role = 'user';
SELECT * FROM products WHERE category = 'electronics' OR price < 1000;

-- IN — check if value is in a list
SELECT * FROM users WHERE role IN ('admin', 'moderator');
SELECT * FROM products WHERE category IN ('electronics', 'books');

-- NOT IN
SELECT * FROM users WHERE role NOT IN ('admin');

-- BETWEEN (inclusive on both ends)
SELECT * FROM products WHERE price BETWEEN 1000 AND 50000;
SELECT * FROM users WHERE age BETWEEN 20 AND 30;

-- IS NULL / IS NOT NULL
SELECT * FROM products WHERE description IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;

-- LIKE / ILIKE — pattern matching (ILIKE = case-insensitive)
SELECT * FROM users WHERE name LIKE 'R%';       -- Starts with R
SELECT * FROM users WHERE email ILIKE '%@example.com'; -- Ends with @example.com
SELECT * FROM products WHERE name ILIKE '%phone%';     -- Contains 'phone' (any case)
-- % = zero or more characters, _ = exactly one character

-- =============================================================================
-- SECTION 5: ORDER BY — Sorting Results
-- =============================================================================

-- Sort ascending (default)
SELECT * FROM products ORDER BY price;

-- Sort descending
SELECT * FROM products ORDER BY price DESC;

-- Sort by multiple columns
SELECT * FROM users ORDER BY role ASC, name ASC;

-- Sort with NULLS handling
SELECT * FROM users ORDER BY age ASC NULLS LAST;

-- =============================================================================
-- SECTION 6: LIMIT and OFFSET — Pagination
-- =============================================================================

-- Get first 5 products
SELECT * FROM products ORDER BY id LIMIT 5;

-- Get products 6-10 (OFFSET = skip first N rows)
SELECT * FROM products ORDER BY id LIMIT 5 OFFSET 5;

-- Pagination formula: OFFSET = (page - 1) * limit
-- Page 1: LIMIT 10 OFFSET 0
-- Page 2: LIMIT 10 OFFSET 10
-- Page 3: LIMIT 10 OFFSET 20

-- ALWAYS include ORDER BY with LIMIT — without ORDER BY, result order is undefined
SELECT * FROM products ORDER BY created_at DESC LIMIT 10;

-- =============================================================================
-- SECTION 7: UPDATE — Modifying Data
-- =============================================================================

-- Update specific rows (ALWAYS use WHERE unless you want to update ALL rows!)
UPDATE users SET role = 'moderator' WHERE id = 3;
UPDATE products SET stock = stock - 1 WHERE id = 1;

-- Update multiple columns at once
UPDATE users
SET
    name = 'Rohit J.',
    updated_at = NOW()
WHERE email = 'rohit@example.com';

-- Update with RETURNING
UPDATE products
SET price = price * 1.1  -- 10% price increase
WHERE category = 'electronics'
RETURNING id, name, price;

-- WARNING: Never do this (updates ALL rows!):
-- UPDATE users SET role = 'admin';  -- Dangerous!

-- =============================================================================
-- SECTION 8: DELETE — Removing Data
-- =============================================================================

-- Delete specific rows (ALWAYS use WHERE!)
DELETE FROM users WHERE id = 5;

-- Delete with condition
DELETE FROM products WHERE stock = 0;

-- Delete with RETURNING
DELETE FROM users WHERE role = 'inactive' RETURNING id, email;

-- WARNING: Never do this (deletes ALL rows!):
-- DELETE FROM users;  -- Extremely dangerous!
-- Use TRUNCATE if you really want to empty a table (faster than DELETE)
-- TRUNCATE users;  -- Much faster but cannot be filtered

-- =============================================================================
-- SECTION 9: Aggregate Functions
-- =============================================================================

-- COUNT, SUM, AVG, MIN, MAX
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS active_users FROM users WHERE is_active = TRUE;
SELECT AVG(age) AS average_age FROM users;
SELECT MIN(price) AS cheapest, MAX(price) AS most_expensive FROM products;
SELECT SUM(stock) AS total_inventory FROM products;
SELECT SUM(price * stock) AS total_inventory_value FROM products;

-- =============================================================================
-- SECTION 10: GROUP BY and HAVING
-- =============================================================================

-- Count users by role
SELECT role, COUNT(*) AS count
FROM users
GROUP BY role
ORDER BY count DESC;

-- Total stock and average price per category
SELECT
    category,
    COUNT(*) AS product_count,
    AVG(price) AS avg_price,
    SUM(stock) AS total_stock,
    MIN(price) AS min_price,
    MAX(price) AS max_price
FROM products
WHERE category IS NOT NULL  -- WHERE filters BEFORE grouping
GROUP BY category            -- Then group
HAVING COUNT(*) > 1          -- HAVING filters AFTER grouping (unlike WHERE)
ORDER BY avg_price DESC;

-- Rule: WHERE = filter rows. HAVING = filter groups.

-- =============================================================================
-- FILL IN THE BLANK EXERCISES
-- =============================================================================

-- Exercise 1: Find all users older than 25, show name and age, ordered by age descending.
-- FILL IN:
-- SELECT _______ FROM _______ WHERE _______ ORDER BY _______ DESC;

-- Exercise 2: Find all electronics products priced between 5000 and 60000, sorted by price.
-- FILL IN:
-- SELECT _______ FROM products WHERE _______ AND _______ ORDER BY _______;

-- Exercise 3: Get the average price and total stock for each category.
-- Show only categories where total stock > 100.
-- FILL IN:
-- SELECT _______ FROM products GROUP BY _______ HAVING _______;

-- Exercise 4: Insert a new user named "Test User" with email "test@test.com", age 20.
-- Then update their role to "moderator". Then soft-delete them by setting is_active to FALSE.
-- FILL IN:
-- INSERT INTO users _______;
-- UPDATE users SET _______ WHERE _______; 
-- UPDATE users SET _______ WHERE _______;
