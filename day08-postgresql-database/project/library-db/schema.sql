-- =============================================================================
-- LIBRARY DATABASE — schema.sql
-- Day 8 Project: Normalized schema (3NF)
-- =============================================================================
-- Run:  psql -d library_db -f schema.sql
-- =============================================================================

DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ── USERS (library members + staff) ──
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  role        VARCHAR(20) NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'librarian', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── AUTHORS ──
CREATE TABLE authors (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(150) NOT NULL,
  bio   TEXT
);

-- ── BOOKS (each book belongs to one author) ──
CREATE TABLE books (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  author_id     INT NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
  isbn          VARCHAR(13) UNIQUE,
  total_copies  INT NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_books_author ON books(author_id);

-- ── LOANS (who borrowed which book, when) ──
CREATE TABLE loans (
  id           SERIAL PRIMARY KEY,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  book_id      INT NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  borrowed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_at       TIMESTAMPTZ NOT NULL,
  returned_at  TIMESTAMPTZ,  -- NULL = still borrowed
  CHECK (due_at > borrowed_at)
);

CREATE INDEX idx_loans_user ON loans(user_id);
CREATE INDEX idx_loans_book ON loans(book_id);
CREATE INDEX idx_loans_active ON loans(returned_at) WHERE returned_at IS NULL;

-- ── SEED DATA ──
INSERT INTO users (name, email, role) VALUES
  ('Alice Johnson', 'alice@example.com', 'member'),
  ('Bob Smith', 'bob@example.com', 'member'),
  ('Carol Lee', 'carol@example.com', 'member'),
  ('Dana Admin', 'dana@library.org', 'admin'),
  ('Eve Librarian', 'eve@library.org', 'librarian');

INSERT INTO authors (name, bio) VALUES
  ('George Orwell', 'English novelist and essayist'),
  ('Jane Austen', 'English novelist known for social commentary'),
  ('Isaac Asimov', 'American writer and professor of biochemistry'),
  ('Agatha Christie', 'Queen of mystery fiction');

INSERT INTO books (title, author_id, isbn, total_copies) VALUES
  ('1984', 1, '9780451524935', 3),
  ('Animal Farm', 1, '9780451526342', 2),
  ('Pride and Prejudice', 2, '9780141439518', 4),
  ('Emma', 2, '9780141439587', 2),
  ('Foundation', 3, '9780553293357', 2),
  ('I, Robot', 3, '9780553294385', 3),
  ('Murder on the Orient Express', 4, '9780062073495', 2),
  ('And Then There Were None', 4, '9780062073488', 1);

INSERT INTO loans (user_id, book_id, borrowed_at, due_at, returned_at) VALUES
  (1, 1, NOW() - INTERVAL '10 days', NOW() + INTERVAL '4 days', NULL),
  (2, 3, NOW() - INTERVAL '20 days', NOW() - INTERVAL '6 days', NULL),
  (3, 5, NOW() - INTERVAL '5 days', NOW() + INTERVAL '9 days', NULL),
  (1, 6, NOW() - INTERVAL '30 days', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days'),
  (2, 7, NOW() - INTERVAL '14 days', NOW() + INTERVAL '0 days', NOW() - INTERVAL '1 day'),
  (3, 2, NOW() - INTERVAL '7 days', NOW() + INTERVAL '7 days', NULL);
