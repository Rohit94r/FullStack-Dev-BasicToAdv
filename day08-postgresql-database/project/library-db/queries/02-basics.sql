-- =============================================================================
-- QUERIES 02 — Basics: INSERT, UPDATE, DELETE
-- =============================================================================

-- Q4: Insert a new author named 'Tolkien' with bio 'Author of The Lord of the Rings'.
-- TODO:
-- _____________________


-- ANSWER:
-- INSERT INTO authors (name, bio) VALUES ('Tolkien', 'Author of The Lord of the Rings');


-- Q5: Update book id=8 to have total_copies = 3.
-- TODO:
-- _____________________


-- ANSWER:
-- UPDATE books SET total_copies = 3 WHERE id = 8;


-- Q6: Delete the user with email 'carol@example.com' ONLY if they have no active loans.
--     (Hint: use a subquery or NOT EXISTS — try both!)
-- TODO:
-- _____________________


-- ANSWER:
-- DELETE FROM users
-- WHERE email = 'carol@example.com'
--   AND NOT EXISTS (
--     SELECT 1 FROM loans WHERE user_id = users.id AND returned_at IS NULL
--   );
