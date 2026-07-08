-- =============================================================================
-- QUERIES 01 — Basics: SELECT, WHERE, ORDER BY
-- =============================================================================

-- Q1: List all books ordered by title alphabetically.
-- TODO: Write your query below
-- _____________________


-- ANSWER:
-- SELECT id, title, isbn, total_copies FROM books ORDER BY title ASC;


-- Q2: Find all users with role 'member'.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT id, name, email FROM users WHERE role = 'member';


-- Q3: Get the 3 most recently added books (use created_at).
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT title, created_at FROM books ORDER BY created_at DESC LIMIT 3;
