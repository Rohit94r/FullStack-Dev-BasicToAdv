// =============================================================================
// NOTES REPOSITORY
// In-memory storage (replace with real DB in Day 9 with Prisma).
// Responsibility: ONLY data storage and retrieval. No business logic.
// =============================================================================

// In-memory "database" — simulates a real database for now
const notes = [
  {
    id: "1",
    title: "Welcome Note",
    content: "Welcome to the Notes API! This is your first note.",
    tags: ["welcome", "getting-started"],
    pinned: false,
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "2",
    title: "Express.js Notes",
    content: "Express is a minimal Node.js web framework. Middleware is key.",
    tags: ["express", "nodejs", "backend"],
    pinned: true,
    createdAt: new Date("2024-01-02").toISOString(),
    updatedAt: new Date("2024-01-02").toISOString(),
  },
];

let nextId = 3; // Auto-increment counter

const notesRepository = {
  // Get all notes with optional filtering
  findAll: async ({ search, tag, pinned } = {}) => {
    // TODO: Start with all notes
    // let result = [...notes];

    // TODO: If `search` is provided, filter notes where
    // title OR content includes the search string (case-insensitive)
    // Hint: .filter() + .toLowerCase().includes()
    // _____________________

    // TODO: If `tag` is provided, filter notes that include that tag
    // Hint: note.tags.includes(tag)
    // _____________________

    // TODO: If `pinned` is provided (true/false), filter by pinned status
    // Note: req.query values come as strings, so convert: pinned === "true"
    // _____________________

    // TODO: Return the result array
    // return result;
  },

  // Find a single note by ID
  findById: async (id) => {
    // TODO: Find and return note where note.id === id
    // Return undefined if not found
    // _____________________
  },

  // Create a new note
  create: async ({ title, content, tags = [], pinned = false }) => {
    const now = new Date().toISOString();

    // TODO: Create a new note object with:
    // id: String(nextId++) — then increment nextId
    // title, content, tags, pinned
    // createdAt: now
    // updatedAt: now
    // _____________________

    // TODO: Push the new note to the notes array
    // _____________________

    // TODO: Return the new note
    // _____________________
  },

  // Update an existing note (partial update)
  update: async (id, updates) => {
    // TODO: Find the index of the note with matching id
    // _____________________

    // TODO: If index is -1 (not found), return null
    // _____________________

    // TODO: Merge existing note with updates:
    // notes[index] = { ...notes[index], ...updates, id, updatedAt: new Date().toISOString() }
    // Keep the original id and update updatedAt
    // _____________________

    // TODO: Return the updated note
    // _____________________
  },

  // Delete a note by ID
  remove: async (id) => {
    // TODO: Find the index of the note
    // _____________________

    // TODO: If not found, return false
    // _____________________

    // TODO: Remove it with splice and return true
    // _____________________
  },
};

module.exports = notesRepository;
