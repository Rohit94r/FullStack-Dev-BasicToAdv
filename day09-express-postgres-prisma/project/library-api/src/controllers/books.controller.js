const { booksService } = require("../services/books.service");
const { asyncHandler } = require("../utils/asyncHandler");

const booksController = {
  getAll: asyncHandler(async (req, res) => {
    // TODO: Parse page, limit, search, authorId, available from req.query
    // Call booksService.getAll(...)
    // Return 200 JSON result
    // _____________________
  }),

  getOne: asyncHandler(async (req, res) => {
    // TODO: booksService.getById(req.params.id), return 200
    // _____________________
  }),

  create: asyncHandler(async (req, res) => {
    // TODO: booksService.create(req.body), return 201
    // _____________________
  }),

  update: asyncHandler(async (req, res) => {
    // TODO: booksService.update(req.params.id, req.body), return 200
    // _____________________
  }),

  remove: asyncHandler(async (req, res) => {
    // TODO: booksService.remove(req.params.id), return 204
    // _____________________
  }),
};

module.exports = { booksController };
