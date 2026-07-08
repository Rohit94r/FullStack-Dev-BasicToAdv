// =============================================================================
// NOTES CONTROLLER
// Handles HTTP layer: extract from req, call service, send res.
// No business logic here. Thin glue between HTTP and service.
// =============================================================================

const notesService = require("../services/notes.service");
const { asyncHandler } = require("../utils/asyncHandler");

const notesController = {
  // GET /api/notes?search=&tag=&pinned=
  getAll: asyncHandler(async (req, res) => {
    // TODO: Extract optional query params: search, tag, pinned from req.query
    // _____________________

    // TODO: Call notesService.getAll({ search, tag, pinned })
    // _____________________

    // TODO: Return 200 JSON with { data: notes, total: notes.length }
    // _____________________
  }),

  // GET /api/notes/:id
  getOne: asyncHandler(async (req, res) => {
    // TODO: Extract id from req.params
    // _____________________

    // TODO: Call notesService.getById(id)
    // (service throws NotFoundError if not found — asyncHandler will catch it)
    // _____________________

    // TODO: Return 200 JSON with the note
    // _____________________
  }),

  // POST /api/notes
  create: asyncHandler(async (req, res) => {
    // TODO: Extract { title, content, tags, pinned } from req.body
    // (already validated by middleware — req.body is clean)
    // _____________________

    // TODO: Call notesService.create({ title, content, tags, pinned })
    // _____________________

    // TODO: Return 201 JSON with the created note
    // _____________________
  }),

  // PATCH /api/notes/:id
  update: asyncHandler(async (req, res) => {
    // TODO: Extract id from req.params
    // _____________________

    // TODO: Call notesService.update(id, req.body)
    // _____________________

    // TODO: Return 200 JSON with the updated note
    // _____________________
  }),

  // DELETE /api/notes/:id
  remove: asyncHandler(async (req, res) => {
    // TODO: Extract id from req.params
    // _____________________

    // TODO: Call notesService.remove(id)
    // _____________________

    // TODO: Return 204 with no body
    // res.status(____).send();
  }),

  // PATCH /api/notes/:id/pin  (toggle pin)
  togglePin: asyncHandler(async (req, res) => {
    // TODO: Extract id from req.params
    // _____________________

    // TODO: Call notesService.togglePin(id)
    // _____________________

    // TODO: Return 200 JSON with updated note
    // _____________________
  }),
};

module.exports = notesController;
