-- =============================================================================
-- QUERIES 06 — Aggregations: SUM, AVG, HAVING
-- =============================================================================

-- Q16: Total number of book copies in the library (sum of total_copies).
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT SUM(total_copies) AS total_inventory FROM books;


-- Q17: Authors who have written more than 1 book.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT a.name, COUNT(b.id) AS book_count
-- FROM authors a
-- INNER JOIN books b ON a.id = b.author_id
-- GROUP BY a.id, a.name
-- HAVING COUNT(b.id) > 1;


-- Q18: Average loan duration in days for RETURNED loans only.
--      Duration = returned_at - borrowed_at
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT AVG(EXTRACT(EPOCH FROM (returned_at - borrowed_at)) / 86400) AS avg_days
-- FROM loans
-- WHERE returned_at IS NOT NULL;
