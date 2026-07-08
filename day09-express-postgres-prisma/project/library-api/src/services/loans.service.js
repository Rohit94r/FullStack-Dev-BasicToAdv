const { prisma } = require("../lib/prisma");
const { booksRepository } = require("../repositories/books.repository");
const { loansRepository } = require("../repositories/loans.repository");
const { NotFoundError, ConflictError } = require("../utils/errors");

const LOAN_DAYS = 14;

const loansService = {
  // ── EXERCISE: borrow — MUST use a transaction ──
  borrow: async ({ memberId, bookId }) => {
    // TODO: Use prisma.$transaction(async (tx) => { ... })
    //
    // Inside the transaction:
    // 1. Find book (via tx or booksRepository with tx param)
    // 2. If !book → throw NotFoundError("Book")
    // 3. If book.copiesAvailable <= 0 → throw ConflictError("No copies available")
    // 4. Decrement copiesAvailable (booksRepository.decrementAvailable)
    // 5. Create loan with dueAt = now + LOAN_DAYS days
    // 6. Return the created loan
    //
    // WHY transaction? Two users borrowing the last copy at the same time
    // must not both succeed — the DB locks rows inside a transaction.
    // _____________________

    throw new Error("Not implemented — fill in borrow()");
  },

  // ── EXERCISE: return ──
  return: async (loanId) => {
    // TODO: Use prisma.$transaction
    // 1. Find loan by id — NotFoundError if missing
    // 2. If already returned → ConflictError
    // 3. markReturned + incrementAvailable on the book
    // _____________________

    throw new Error("Not implemented — fill in return()");
  },

  getStats: async () => {
    // TODO: Return { overdueCount: await loansRepository.countOverdue() }
    // Bonus: most borrowed books using prisma.loan.groupBy
    // _____________________
  },
};

module.exports = { loansService };
