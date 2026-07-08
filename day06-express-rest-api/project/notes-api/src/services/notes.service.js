// =============================================================================
// NOTES SERVICE
// Business logic layer. Knows about business rules. Calls repository.
// Does NOT know about HTTP (no req, no res).
// =============================================================================

const notesRepository = require("../repositories/notes.repository");
const { NotFoundError, ConflictError } = require("../utils/errors");

const notesService = {
  // Get all notes (with optional filters from query params)
  getAll: async (filters = {}) => {
    // TODO: Call notesRepository.findAll(filters) and return results
    // _____________________
  },

  // Get one note by ID — throws NotFoundError if not found
  getById: async (id) => {
    // TODO: Call notesRepository.findById(id)
    // If result is null/undefined → throw new NotFoundError("Note")
    // Otherwise return the note
    // _____________________
  },

  // Create a new note — applies business rules
  create: async (data) => {
    // Business Rule: title must be unique
    // TODO: Get all notes and check if any has the same title (case-insensitive)
    // If duplicate found → throw new ConflictError("A note with this title already exists")
    // _____________________

    // TODO: Call notesRepository.create(data) and return the new note
    // _____________________
  },

  // Update a note — partial update
  update: async (id, updates) => {
    // TODO: First verify the note exists by calling this.getById(id)
    // (this.getById already throws NotFoundError if not found)
    // _____________________

    // Business Rule: if title is being changed, check it's unique
    // TODO: If updates.title is provided, check no other note has that title
    // (exclude the note being updated from duplicate check: existingNote.id !== id)
    // If conflict → throw new ConflictError("A note with this title already exists")
    // _____________________

    // TODO: Call notesRepository.update(id, updates) and return result
    // _____________________
  },

  // Delete a note
  remove: async (id) => {
    // TODO: First verify the note exists (getById throws if not found)
    // _____________________

    // TODO: Call notesRepository.remove(id)
    // _____________________
  },

  // Toggle the pinned status of a note
  togglePin: async (id) => {
    // TODO: Get the current note (throws if not found)
    // _____________________

    // TODO: Call update with pinned = !currentNote.pinned
    // Return the updated note
    // _____________________
  },
};

module.exports = notesService;
