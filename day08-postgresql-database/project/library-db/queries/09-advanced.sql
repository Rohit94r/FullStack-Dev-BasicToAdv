-- =============================================================================
-- QUERIES 09 — Advanced: Date functions, CASE
-- =============================================================================

-- Q25: Active loans with days until due (negative = overdue). Show borrower, book, days_left.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT u.name, b.title,
--        EXTRACT(DAY FROM (l.due_at - NOW()))::INT AS days_left
-- FROM loans l
-- JOIN users u ON l.user_id = u.id
-- JOIN books b ON l.book_id = b.id
-- WHERE l.returned_at IS NULL
-- ORDER BY days_left ASC;


-- Q26: Categorize each book's availability: 'in_stock', 'low' (1 copy left), 'out_of_stock'.
--      Assume available = total_copies minus active loans.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT b.title,
--   CASE
--     WHEN b.total_copies - COALESCE(active.cnt, 0) <= 0 THEN 'out_of_stock'
--     WHEN b.total_copies - COALESCE(active.cnt, 0) = 1 THEN 'low'
--     ELSE 'in_stock'
--   END AS availability
-- FROM books b
-- LEFT JOIN (
--   SELECT book_id, COUNT(*) AS cnt FROM loans WHERE returned_at IS NULL GROUP BY book_id
-- ) active ON b.id = active.book_id;


-- Q27: List loans borrowed in the last 30 days with a 'status' column:
--      'returned', 'overdue', or 'active'.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT b.title, u.name,
--   CASE
--     WHEN l.returned_at IS NOT NULL THEN 'returned'
--     WHEN l.due_at < NOW() THEN 'overdue'
--     ELSE 'active'
--   END AS status
-- FROM loans l
-- JOIN books b ON l.book_id = b.id
-- JOIN users u ON l.user_id = u.id
-- WHERE l.borrowed_at >= NOW() - INTERVAL '30 days';
