-- =============================================================================
-- QUERIES 03 — Joins: INNER JOIN
-- =============================================================================

-- Q7: List all book titles with their author names.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT b.title, a.name AS author_name
-- FROM books b
-- INNER JOIN authors a ON b.author_id = a.id;


-- Q8: List active loans (not returned) with borrower name and book title.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT u.name AS borrower, b.title AS book, l.borrowed_at, l.due_at
-- FROM loans l
-- INNER JOIN users u ON l.user_id = u.id
-- INNER JOIN books b ON l.book_id = b.id
-- WHERE l.returned_at IS NULL;


-- Q9: Count how many books each author has written.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT a.name, COUNT(b.id) AS book_count
-- FROM authors a
-- INNER JOIN books b ON a.id = b.author_id
-- GROUP BY a.id, a.name
-- ORDER BY book_count DESC;
