const { prisma } = require("../lib/prisma");

const authorsRepository = {
  findAll: () => prisma.author.findMany({ include: { _count: { select: { books: true } } } }),
  findById: (id) => prisma.author.findUnique({ where: { id: Number(id) }, include: { books: true } }),
  create: (data) => prisma.author.create({ data }),
  update: (id, data) => prisma.author.update({ where: { id: Number(id) }, data }),
  remove: (id) => prisma.author.delete({ where: { id: Number(id) } }),
};

module.exports = { authorsRepository };
