-- =============================================================================
-- QUERIES 04 — Joins: LEFT JOIN
-- =============================================================================

-- Q10: List ALL authors and their book count (include authors with zero books).
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT a.name, COUNT(b.id) AS book_count
-- FROM authors a
-- LEFT JOIN books b ON a.id = b.author_id
-- GROUP BY a.id, a.name
-- ORDER BY a.name;


-- Q11: List ALL books and whether they currently have an active loan (yes/no).
--      Show title and loan status.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT b.title,
--        CASE WHEN l.id IS NOT NULL THEN 'borrowed' ELSE 'available' END AS status
-- FROM books b
-- LEFT JOIN loans l ON b.id = l.book_id AND l.returned_at IS NULL;


-- Q12: Find users who have NEVER borrowed a book.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT u.name, u.email
-- FROM users u
-- LEFT JOIN loans l ON u.id = l.user_id
-- WHERE l.id IS NULL;
