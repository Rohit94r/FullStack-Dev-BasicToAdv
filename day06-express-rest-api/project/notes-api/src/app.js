// =============================================================================
// NOTES API — app.js
// Full CRUD REST API for a notes application.
// Architecture: Route → Controller → Service → Repository
// =============================================================================
// YOUR TASK: Fill in all the BLANK sections marked with TODO.
// Everything is scaffolded — your job is to implement the logic.
// =============================================================================

const express = require("express");

// TODO: Import cors from "cors"
// const cors = _______

// TODO: Import helmet from "helmet"
// const helmet = _______

// TODO: Import morgan from "morgan"
// const morgan = _______

const noteRoutes = require("./routes/notes");
const { globalErrorHandler } = require("./middleware/error");
const { notFound } = require("./middleware/notFound");

const app = express();

// TODO: Use helmet() middleware for security headers
// app.use(______)

// TODO: Use cors middleware — allow all origins for now
// app.use(______)

// TODO: Use morgan "dev" middleware for request logging
// app.use(______)

// TODO: Use express.json() to parse JSON request bodies
// app.use(______)

// Health check route (already done — study this pattern)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// TODO: Mount noteRoutes at "/api/notes"
// app.use(______, ______);

// TODO: Use notFound middleware (for unmatched routes)
// app.use(______)

// TODO: Use globalErrorHandler middleware (last, after notFound)
// app.use(______)

module.exports = app;
