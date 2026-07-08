const { authorsRepository } = require("../repositories/authors.repository");
const { NotFoundError } = require("../utils/errors");

const authorsService = {
  getAll: async () => authorsRepository.findAll(),

  getById: async (id) => {
    // TODO: findById, throw NotFoundError if null
    // _____________________
  },

  create: async (data) => {
    // TODO: authorsRepository.create(data)
    // _____________________
  },

  update: async (id, data) => {
    // TODO: verify exists, update
    // _____________________
  },

  remove: async (id) => {
    // TODO: verify exists, remove
    // _____________________
  },
};

module.exports = { authorsService };
