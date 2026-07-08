// =============================================================================
// DAY 6 — LESSON 1: What is Express.js?
// =============================================================================
// Express is a MINIMAL and FLEXIBLE Node.js web framework.
// It gives you: routing, middleware, request/response helpers.
// It does NOT give you: database, auth, validation (you add those yourself).
//
// Why Express?
// - Writing a raw Node.js server is tedious (manual routing, body parsing, etc.)
// - Express abstracts that complexity with a clean API
// - It's the most popular Node.js framework (over 30 million weekly downloads)
// - Most other frameworks (Fastify, Koa, NestJS) are either inspired by or built on Express
// =============================================================================

// Install: npm install express
// npm install --save-dev @types/express (for TypeScript type hints)

const express = require("express");

// =============================================================================
// SECTION 1: Creating a Basic Express App
// =============================================================================

const app = express(); // Creates an Express application instance

// app is an object with methods:
// app.get(), app.post(), app.put(), app.delete(), app.patch() — route handlers
// app.use() — attach middleware
// app.listen() — start the server

// =============================================================================
// SECTION 2: Your First Route
// =============================================================================

// app.METHOD(path, handler)
// METHOD = HTTP verb (get, post, put, delete, patch)
// path   = URL path to match
// handler = function(req, res, next) { ... }

app.get("/", (req, res) => {
  // req = IncomingMessage + Express extras
  // res = ServerResponse + Express extras

  res.send("Hello World!"); // sends text response, sets Content-Type: text/html
});

// Route with URL path
app.get("/about", (req, res) => {
  res.send("About page");
});

// Send JSON (sets Content-Type: application/json automatically)
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// =============================================================================
// SECTION 3: HTTP Status Codes
// =============================================================================

// Common status codes you MUST know:
// 200 OK               — request succeeded
// 201 Created          — resource was created
// 204 No Content       — success, nothing to return (DELETE)
// 400 Bad Request      — client sent invalid data
// 401 Unauthorized     — not authenticated (no/invalid token)
// 403 Forbidden        — authenticated but not authorized (wrong role)
// 404 Not Found        — resource doesn't exist
// 409 Conflict         — resource already exists (duplicate email)
// 422 Unprocessable    — valid format but fails validation
// 500 Internal Server  — something broke on the server

// Send with explicit status code
app.get("/api/notfound-example", (req, res) => {
  res.status(404).json({ error: "Resource not found" });
  // .status() sets status code. Chain with .json() or .send()
});

// =============================================================================
// SECTION 4: Route Parameters — Dynamic URLs
// =============================================================================
// Use `:paramName` to capture parts of the URL

app.get("/users/:id", (req, res) => {
  const { id } = req.params; // Extract route parameters
  // id is always a STRING — convert if needed: Number(id) or parseInt(id)
  res.json({ message: `Getting user with id: ${id}` });
});

// Multiple parameters
app.get("/users/:userId/posts/:postId", (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// =============================================================================
// SECTION 5: Query String Parameters
// =============================================================================
// URL: /search?q=javascript&page=1&limit=10
// These are key-value pairs after the ? in the URL

app.get("/search", (req, res) => {
  const { q, page = "1", limit = "10" } = req.query;
  // req.query values are always STRINGS — convert numbers: Number(page)

  res.json({
    query: q,
    page: Number(page),
    limit: Number(limit),
  });
});

// =============================================================================
// SECTION 6: Request Body — POST/PUT/PATCH
// =============================================================================
// Request body = data sent by client (JSON, form data)
// MUST add middleware to parse the body before accessing req.body

app.use(express.json()); // Parse JSON request bodies
// Without this: req.body === undefined for JSON requests

app.post("/users", (req, res) => {
  const { name, email, password } = req.body; // Parsed JSON body

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  // In real app: save to database
  const newUser = { id: Date.now(), name, email };

  res.status(201).json({ message: "User created", user: newUser });
});

// Also useful: parse URL-encoded form data (from HTML forms)
app.use(express.urlencoded({ extended: true })); // Parse form body

// =============================================================================
// SECTION 7: Response Methods Reference
// =============================================================================

app.get("/response-examples", (req, res) => {
  // res.send(data)        — sends text/html. Sets Content-Type intelligently.
  // res.json(object)      — sends JSON. Sets Content-Type: application/json.
  // res.status(code)      — sets status code. Must chain with send/json.
  // res.sendStatus(code)  — sets code AND sends code as body ("OK", "Not Found").
  // res.redirect(url)     — 302 redirect to another URL.
  // res.sendFile(path)    — sends a file from filesystem.
  // res.render(view, data)— renders a template (EJS, Handlebars).
  // res.end()             — ends response without sending data.
  // res.set(header, value)— set response headers manually.
  // res.cookie(name, val) — set a cookie.
  // res.clearCookie(name) — clear a cookie.

  res.json({ message: "See the comments above for all response methods" });
});

// =============================================================================
// SECTION 8: Starting the Server
// =============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // This callback runs when server is ready to accept connections
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

// =============================================================================
// FILL IN THE BLANK EXERCISES
// =============================================================================

// Exercise 1: Create a GET route at "/api/hello" that returns:
// { message: "Hello from Express!", time: <current ISO timestamp> }
// FILL IN:
// ______________________

// Exercise 2: Create a GET route at "/products/:productId" that:
// - Returns { productId: <value>, name: "Sample Product" }
// FILL IN:
// ______________________

// Exercise 3: Create a GET route at "/items" that:
// - Accepts query params: category, page (default 1), limit (default 20)
// - Returns { category, page: <number>, limit: <number>, items: [] }
// FILL IN:
// ______________________

// Exercise 4: Create a POST route at "/api/products" that:
// - Reads { name, price, category } from req.body
// - If any field missing, return 400 with error message
// - Otherwise return 201 with { id: Date.now(), name, price, category }
// FILL IN:
// ______________________
