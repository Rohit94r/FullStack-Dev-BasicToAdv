const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const booksRoutes = require("./routes/books.routes");
const authorsRoutes = require("./routes/authors.routes");
const loansRoutes = require("./routes/loans.routes");
const { AppError } = require("./utils/errors");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// TODO: Mount routes at /api/books, /api/authors, /api/loans
// app.use("/api/books", booksRoutes)
// app.use("/api/authors", authorsRoutes)
// app.use("/api/loans", loansRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err.message);
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code });
  }
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
