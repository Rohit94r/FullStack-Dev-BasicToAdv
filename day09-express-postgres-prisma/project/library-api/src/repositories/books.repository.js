const { prisma } = require("../lib/prisma");

const booksRepository = {
  findAll: ({ skip, take, where }) =>
    prisma.book.findMany({
      where,
      skip,
      take,
      include: { author: true },
      orderBy: { title: "asc" },
    }),

  count: (where) => prisma.book.count({ where }),

  findById: (id) =>
    prisma.book.findUnique({
      where: { id: Number(id) },
      include: { author: true, loans: { where: { returnedAt: null } } },
    }),

  create: (data) =>
    prisma.book.create({
      data: { ...data, copiesAvailable: data.totalCopies ?? 1 },
      include: { author: true },
    }),

  update: (id, data) =>
    prisma.book.update({
      where: { id: Number(id) },
      data,
      include: { author: true },
    }),

  remove: (id) => prisma.book.delete({ where: { id: Number(id) } }),

  decrementAvailable: (id, tx = prisma) =>
    tx.book.update({
      where: { id: Number(id) },
      data: { copiesAvailable: { decrement: 1 } },
    }),

  incrementAvailable: (id, tx = prisma) =>
    tx.book.update({
      where: { id: Number(id) },
      data: { copiesAvailable: { increment: 1 } },
    }),
};

module.exports = { booksRepository };
