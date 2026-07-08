const { authorsService } = require("../services/authors.service");
const { asyncHandler } = require("../utils/asyncHandler");

const authorsController = {
  getAll: asyncHandler(async (_req, res) => {
    // TODO: authorsService.getAll(), return 200 { data }
    // _____________________
  }),

  getOne: asyncHandler(async (req, res) => {
    // TODO: authorsService.getById(req.params.id), return 200
    // _____________________
  }),

  create: asyncHandler(async (req, res) => {
    // TODO: create, return 201
    // _____________________
  }),

  update: asyncHandler(async (req, res) => {
    // TODO: update, return 200
    // _____________________
  }),

  remove: asyncHandler(async (req, res) => {
    // TODO: remove, return 204
    // _____________________
  }),
};

module.exports = { authorsController };
