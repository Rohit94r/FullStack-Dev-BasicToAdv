const { NotFoundError } = require("../utils/errors");

// Catches any request that didn't match a route
const notFound = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.path}`));
};

module.exports = { notFound };
