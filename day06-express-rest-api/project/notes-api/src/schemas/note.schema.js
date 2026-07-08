// =============================================================================
// NOTE VALIDATION SCHEMAS (Zod)
// Defines the shape of valid request bodies.
// =============================================================================

const { z } = require("zod");

// Schema for creating a note (POST)
const createNoteSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  content: z
    .string({ required_error: "Content is required" })
    .min(1, "Content cannot be empty")
    .max(10000, "Content must be 10000 characters or less"),
  tags: z
    .array(z.string().trim().toLowerCase())
    .max(10, "Maximum 10 tags allowed")
    .default([]),
  pinned: z.boolean().default(false),
});

// Schema for updating a note (PATCH) — all fields optional
// .partial() makes every field optional. .omit() removes fields you can't change.
const updateNoteSchema = createNoteSchema.partial();
// Result: { title?, content?, tags?, pinned? }

module.exports = { createNoteSchema, updateNoteSchema };
