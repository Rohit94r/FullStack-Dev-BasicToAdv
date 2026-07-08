// =============================================================================
// DAY 6 — LESSON 5: Validation & Error Handling in Express
// =============================================================================
// Two most important things for a production API:
// 1. VALIDATE all incoming data (never trust the client)
// 2. HANDLE all errors gracefully (never crash, never leak details)
// =============================================================================

// npm install zod
const { z } = require("zod");
const express = require("express");
const app = express();
app.use(express.json());

// =============================================================================
// SECTION 1: Why Validate?
// =============================================================================
// Client might send:
// - Missing required fields
// - Wrong data types (string instead of number)
// - Values out of range (age: -5, price: 999999999)
// - Invalid format (not an email, not a UUID)
// - Malicious input (SQL injection strings, script tags)
// - Extra fields that shouldn't be there
//
// Without validation → runtime errors, corrupted database, security vulnerabilities.
// With validation → reject bad data EARLY with a clear error message.

// =============================================================================
// SECTION 2: Zod — Schema-Based Validation
// =============================================================================
// Zod defines a SCHEMA that describes the expected shape of data.
// It parses the data and returns either the parsed result OR throws ZodError.
// TypeScript-first: schemas automatically generate TypeScript types.

// Define a schema for creating a user
const CreateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  age: z.number().int().min(13, "Must be at least 13").max(120).optional(),
  role: z.enum(["user", "admin", "moderator"]).default("user"),
});

// Update schema — all fields optional
const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true });

// Zod usage:
// z.string()  → must be a string
// z.number()  → must be a number
// z.boolean() → must be boolean
// z.date()    → must be a Date
// z.array(z.string()) → array of strings
// z.object({}) → object with specific shape
// z.enum(["a", "b"]) → must be one of these values
// .optional() → field can be missing
// .nullable() → field can be null
// .default(v) → use this value if field is missing
// .min() .max() → length or value constraints
// .regex() → must match regex
// .email() .url() .uuid() → format validators
// .trim() .toLowerCase() → transform/sanitize input
// z.union([z.string(), z.number()]) → must be string OR number

// =============================================================================
// SECTION 3: Parsing with Zod
// =============================================================================

function parseWithZod(schema, data) {
  const result = schema.safeParse(data); // safeParse: doesn't throw, returns { success, data, error }
  // vs schema.parse(data) — throws ZodError if invalid

  if (!result.success) {
    // result.error.errors = array of validation errors
    const errors = result.error.errors.map((e) => ({
      field: e.path.join("."), // "address.street" for nested fields
      message: e.message,
    }));
    return { success: false, errors };
  }

  // result.data = validated AND transformed (trimmed, lowercased etc.)
  return { success: true, data: result.data };
}

// Example
const rawInput = { name: "  Rohit  ", email: "ROHIT@EXAMPLE.COM", password: "Passw0rd", role: "user" };
const parsed = parseWithZod(CreateUserSchema, rawInput);
// parsed.data.name = "Rohit" (trimmed)
// parsed.data.email = "rohit@example.com" (lowercased)

// =============================================================================
// SECTION 4: Validation Middleware
// =============================================================================

// Reusable middleware factory — wrap any Zod schema into middleware
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        error: "Validation failed",
        issues: result.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    // Replace req.body with the PARSED/TRANSFORMED data
    // This ensures sanitized data (trimmed, lowercased) reaches the controller
    req.body = result.data;
    next();
  };
}

// For validating query params
function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid query parameters",
        issues: result.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    req.validatedQuery = result.data; // Don't overwrite req.query
    next();
  };
}

// Usage
app.post("/api/users", validate(CreateUserSchema), (req, res) => {
  // req.body is now guaranteed to be valid and sanitized
  const { name, email, role } = req.body;
  res.status(201).json({ id: Date.now(), name, email, role });
});

// =============================================================================
// SECTION 5: Custom Error Classes
// =============================================================================
// Instead of generic Error objects, create domain-specific errors.
// This makes error handling cleaner and more explicit.

class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code; // Machine-readable error code e.g. "EMAIL_DUPLICATE"
    this.isOperational = true; // vs programming errors (bugs)
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "FORBIDDEN");
  }
}

// Usage in services:
async function findUser(id) {
  const user = null; // database returns null
  if (!user) throw new NotFoundError("User"); // Clean, semantic
}

// =============================================================================
// SECTION 6: Global Error Handler Middleware
// =============================================================================
// Must have EXACTLY 4 parameters to be recognized as error middleware.
// Must be registered LAST (after all routes).

function globalErrorHandler(err, req, res, next) {
  // Log all errors (use a proper logger in production: Winston, Pino)
  console.error(`[ERROR] ${req.method} ${req.url}`, {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });

  // Handle known operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Handle Zod validation errors (if thrown directly, not via middleware)
  if (err.name === "ZodError") {
    return res.status(422).json({
      error: "Validation failed",
      issues: err.errors,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  // Handle Prisma/Database errors
  // PrismaClientKnownRequestError P2002 = unique constraint (duplicate key)
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return res.status(409).json({ error: `${field} already exists` });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }

  // Unknown/Programming errors — don't leak details in production
  const isDev = process.env.NODE_ENV === "development";

  res.status(500).json({
    error: isDev ? err.message : "Something went wrong",
    ...(isDev && { stack: err.stack }),
  });
}

// Register AFTER all routes
app.use(globalErrorHandler);

// =============================================================================
// SECTION 7: Async Error Handling — The Wrapper Pattern
// =============================================================================
// Without this, you must write try/catch in EVERY async route handler.
// With this, async errors are automatically forwarded to next(err).

// Wrap async functions to auto-catch errors
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
    // .catch(next) = equivalent to .catch(err => next(err))
  };
}

// Before (repetitive):
app.get("/users-before/:id", async (req, res, next) => {
  try {
    // const user = await userService.findById(req.params.id);
    res.json({ id: req.params.id });
  } catch (err) {
    next(err); // must remember this on EVERY route
  }
});

// After (clean):
app.get("/users/:id", asyncHandler(async (req, res) => {
  // throw new NotFoundError("User"); // automatically goes to error handler
  res.json({ id: req.params.id });
}));
// No try/catch needed — asyncHandler catches any thrown errors

// =============================================================================
// SECTION 8: 404 Handler (Not Found Middleware)
// =============================================================================
// Called when NO route matched the request.
// Must be defined BEFORE the error handler, AFTER all routes.

function notFoundHandler(req, res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.path}`));
  // Pass to error handler — consistent error format
}

app.use(notFoundHandler); // After all routes, before globalErrorHandler

// =============================================================================
// SECTION 9: Validation Schema Examples for Common Resources
// =============================================================================

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),       // coerce: converts "1" string to 1 number
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});

const ProductSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().min(0).default(0),
  category: z.enum(["electronics", "clothing", "food", "other"]),
  description: z.string().max(2000).optional(),
  images: z.array(z.string().url()).max(5).default([]),
});

// =============================================================================
// FILL IN THE BLANK EXERCISES
// =============================================================================

// Exercise 1: Write a Zod schema for a blog post:
// - title: string, required, 3-200 chars
// - content: string, required, at least 10 chars
// - tags: array of strings, max 5 tags, optional
// - published: boolean, defaults to false
// - slug: string, lowercase, no spaces (use regex), optional
// FILL IN:
// const BlogPostSchema = z.object({
//   _____________________
// });

// Exercise 2: Write a validation middleware for route params:
// function validateParams(schema) { ... }
// Should validate req.params and return 400 on failure, call next() on success.
// FILL IN:
// function validateParams(schema) {
//   _____________________
// }

// Exercise 3: Create a DatabaseError class that extends AppError:
// - constructor(message, operation) where operation is e.g. "INSERT"
// - statusCode 500, code "DATABASE_ERROR"
// - stores this.operation
// FILL IN:
// class DatabaseError extends AppError {
//   _____________________
// }

// =============================================================================
// KEY INTERVIEW POINTS TO REMEMBER
// =============================================================================
// 1. NEVER trust client data. Always validate on the server.
// 2. Validation = reject bad data early. Sanitization = clean/transform data.
// 3. Zod: safeParse() doesn't throw. parse() throws ZodError.
// 4. 422 Unprocessable Entity = validation error. 400 Bad Request = format error.
// 5. Custom error classes: isOperational flag separates expected errors from bugs.
// 6. Error handler: 4 params (err, req, res, next). Registered LAST.
// 7. asyncHandler wrapper: auto-catches async errors and calls next(err).
// 8. Never leak stack traces or database details to production clients.
