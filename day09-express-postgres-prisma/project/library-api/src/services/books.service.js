const { booksRepository } = require("../repositories/books.repository");
const { NotFoundError } = require("../utils/errors");

const booksService = {
  getAll: async ({ page = 1, limit = 10, search, authorId, available }) => {
    const skip = (page - 1) * limit;

    // TODO: Build Prisma `where` object from filters
    // - search: title contains search (case-insensitive) — use mode: 'insensitive'
    // - authorId: filter by authorId if provided
    // - available: if true, copiesAvailable > 0
    // const where = { ... }
    // _____________________

    // TODO: Call booksRepository.findAll({ skip, take: limit, where })
    // and booksRepository.count(where) in parallel (Promise.all)
    // Return { data, total, page, limit }
    // _____________________
  },

  getById: async (id) => {
    // TODO: findById, throw NotFoundError if null
    // _____________________
  },

  create: async (data) => {
    // TODO: booksRepository.create(data)
    // _____________________
  },

  update: async (id, data) => {
    // TODO: verify exists, then update
    // _____________________
  },

  remove: async (id) => {
    // TODO: verify exists, then remove
    // _____________________
  },
};

module.exports = { booksService };
