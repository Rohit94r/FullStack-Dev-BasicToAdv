-- =============================================================================
-- QUERIES 10 — Advanced: Window functions
-- =============================================================================

-- Q28: Rank authors by number of books (use RANK() window function).
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT name, book_count, RANK() OVER (ORDER BY book_count DESC) AS rank
-- FROM (
--   SELECT a.name, COUNT(b.id) AS book_count
--   FROM authors a
--   LEFT JOIN books b ON a.id = b.author_id
--   GROUP BY a.id, a.name
-- ) counts;


-- Q29: For each user, show their loans with row_number ordered by borrowed_at desc.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT u.name, b.title, l.borrowed_at,
--        ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY l.borrowed_at DESC) AS loan_num
-- FROM loans l
-- JOIN users u ON l.user_id = u.id
-- JOIN books b ON l.book_id = b.id;


-- Q30: Running total of books added over time (cumulative count by created_at).
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT title, created_at,
--        COUNT(*) OVER (ORDER BY created_at ROWS UNBOUNDED PRECEDING) AS running_total
-- FROM books
-- ORDER BY created_at;
