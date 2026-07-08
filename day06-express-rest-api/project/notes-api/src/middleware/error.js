// Global error handler — registered last in app.js
// 4 parameters required — Express identifies this as error middleware
const globalErrorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} — Error:`, err.message);

  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code });
  }

  if (err.name === "ZodError") {
    return res.status(422).json({ error: "Validation failed", issues: err.errors });
  }

  const isDev = process.env.NODE_ENV !== "production";
  res.status(500).json({
    error: isDev ? err.message : "Internal Server Error",
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = { globalErrorHandler };
