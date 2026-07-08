const { prisma } = require("../lib/prisma");

const loansRepository = {
  findActiveByBook: (bookId) =>
    prisma.loan.findFirst({
      where: { bookId: Number(bookId), returnedAt: null },
    }),

  create: (data, tx = prisma) =>
    tx.loan.create({
      data,
      include: { book: true, member: true },
    }),

  findById: (id) =>
    prisma.loan.findUnique({
      where: { id: Number(id) },
      include: { book: true, member: true },
    }),

  markReturned: (id, tx = prisma) =>
    tx.loan.update({
      where: { id: Number(id) },
      data: { returnedAt: new Date() },
      include: { book: true, member: true },
    }),

  countOverdue: () =>
    prisma.loan.count({
      where: { returnedAt: null, dueAt: { lt: new Date() } },
    }),
};

module.exports = { loansRepository };
