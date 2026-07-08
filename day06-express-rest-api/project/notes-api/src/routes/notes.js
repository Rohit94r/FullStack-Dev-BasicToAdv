// =============================================================================
// NOTES ROUTES
// Maps URLs to controller functions. Also applies per-route middleware.
// =============================================================================

const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes.controller");
const { validate } = require("../middleware/validate");
const { createNoteSchema, updateNoteSchema } = require("../schemas/note.schema");

// GET /api/notes — get all notes (optional: ?search=&tag=&pinned=)
router.get("/", notesController.getAll);

// GET /api/notes/:id — get one note
router.get("/:id", notesController.getOne);

// POST /api/notes — create note (with body validation)
router.post(
  "/",
  validate(createNoteSchema), // 1. Validate request body
  notesController.create       // 2. Handle the request
);

// PATCH /api/notes/:id — partial update
router.patch(
  "/:id",
  validate(updateNoteSchema),
  notesController.update
);

// DELETE /api/notes/:id — delete
router.delete("/:id", notesController.remove);

// PATCH /api/notes/:id/pin — toggle pin status (no body needed)
router.patch("/:id/pin", notesController.togglePin);

module.exports = router;
