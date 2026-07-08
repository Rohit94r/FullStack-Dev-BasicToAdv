-- =============================================================================
-- QUERIES 08 — CTEs (WITH clauses)
-- =============================================================================

-- Q22: Using a CTE, list members and their total number of loans (all time).
-- TODO:
-- _____________________


-- ANSWER:
-- WITH loan_counts AS (
--   SELECT user_id, COUNT(*) AS total_loans
--   FROM loans
--   GROUP BY user_id
-- )
-- SELECT u.name, COALESCE(lc.total_loans, 0) AS total_loans
-- FROM users u
-- LEFT JOIN loan_counts lc ON u.id = lc.user_id
-- WHERE u.role = 'member';


-- Q23: Using a CTE, find books where active loans equal total_copies (fully checked out).
-- TODO:
-- _____________________


-- ANSWER:
-- WITH active AS (
--   SELECT book_id, COUNT(*) AS out_count
--   FROM loans
--   WHERE returned_at IS NULL
--   GROUP BY book_id
-- )
-- SELECT b.title, b.total_copies, a.out_count
-- FROM books b
-- INNER JOIN active a ON b.id = a.book_id
-- WHERE a.out_count >= b.total_copies;


-- Q24: Monthly borrow counts for the current year using a CTE.
-- TODO:
-- _____________________


-- ANSWER:
-- WITH monthly AS (
--   SELECT DATE_TRUNC('month', borrowed_at) AS month, COUNT(*) AS borrows
--   FROM loans
--   WHERE EXTRACT(YEAR FROM borrowed_at) = EXTRACT(YEAR FROM NOW())
--   GROUP BY 1
-- )
-- SELECT TO_CHAR(month, 'Mon YYYY') AS month, borrows FROM monthly ORDER BY month;
