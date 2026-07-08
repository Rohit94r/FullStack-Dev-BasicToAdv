-- =============================================================================
-- QUERIES 05 — Aggregations: COUNT, GROUP BY
-- =============================================================================

-- Q13: How many users are there per role?
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT role, COUNT(*) AS user_count
-- FROM users
-- GROUP BY role;


-- Q14: Which books have been borrowed the most times? Show top 5.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT b.title, COUNT(l.id) AS times_borrowed
-- FROM books b
-- INNER JOIN loans l ON b.id = l.book_id
-- GROUP BY b.id, b.title
-- ORDER BY times_borrowed DESC
-- LIMIT 5;


-- Q15: How many active vs returned loans exist?
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT
--   COUNT(*) FILTER (WHERE returned_at IS NULL) AS active_loans,
--   COUNT(*) FILTER (WHERE returned_at IS NOT NULL) AS returned_loans
-- FROM loans;
