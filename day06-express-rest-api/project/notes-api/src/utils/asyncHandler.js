// Wraps async route handlers to auto-forward thrown errors to next()
// Without this: every handler needs its own try/catch block
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { asyncHandler };
