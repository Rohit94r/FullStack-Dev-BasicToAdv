-- =============================================================================
-- QUERIES 07 — Subqueries: IN, EXISTS
-- =============================================================================

-- Q19: Books that have NEVER been loaned.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT title FROM books
-- WHERE id NOT IN (SELECT DISTINCT book_id FROM loans);


-- Q20: Users with at least one OVERDUE loan (due_at < NOW() and not returned).
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT DISTINCT u.name, u.email
-- FROM users u
-- WHERE EXISTS (
--   SELECT 1 FROM loans l
--   WHERE l.user_id = u.id
--     AND l.returned_at IS NULL
--     AND l.due_at < NOW()
-- );


-- Q21: Authors whose books include at least one with total_copies >= 3.
-- TODO:
-- _____________________


-- ANSWER:
-- SELECT name FROM authors
-- WHERE id IN (SELECT author_id FROM books WHERE total_copies >= 3);
