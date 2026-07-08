// =============================================================================
// DAY 6 — LESSON 3: Routing in Express
// =============================================================================
// Routing = how your app responds to specific URL paths and HTTP methods.
// Express Router lets you MODULARIZE routes into separate files.
// This is critical for building maintainable, large-scale APIs.
// =============================================================================

const express = require("express");

// =============================================================================
// SECTION 1: Basic Routing — app.METHOD(path, handler)
// =============================================================================

const app = express();
app.use(express.json());

// CRUD operations conventionally map to HTTP methods:
// GET     → read data
// POST    → create data
// PUT     → replace entire resource
// PATCH   → update partial resource
// DELETE  → delete resource

// Example: Full CRUD for a resource
const users = [
  { id: 1, name: "Rohit", email: "rohit@example.com" },
  { id: 2, name: "Priya", email: "priya@example.com" },
];

// GET /users — get ALL users (with optional filtering via query params)
app.get("/users", (req, res) => {
  const { name, page = "1", limit = "10" } = req.query;
  let result = [...users];

  if (name) {
    result = result.filter((u) => u.name.toLowerCase().includes(name.toLowerCase()));
  }

  const start = (Number(page) - 1) * Number(limit);
  const paginated = result.slice(start, start + Number(limit));

  res.json({
    data: paginated,
    total: result.length,
    page: Number(page),
    limit: Number(limit),
  });
});

// GET /users/:id — get ONE user by ID
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id); // Convert string to number
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  res.json(user);
});

// POST /users — create a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const newUser = {
    id: users.length + 1,
    name: name.trim(),
    email: email.trim().toLowerCase(),
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id — replace the entire user (all fields required)
app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required for PUT" });
  }

  users[index] = { id, name, email }; // Complete replacement
  res.json(users[index]);
});

// PATCH /users/:id — partial update (only send what changes)
app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // Spread existing user, then overlay changes from body
  users[index] = { ...users[index], ...req.body, id }; // keep original id
  res.json(users[index]);
});

// DELETE /users/:id — delete a user
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(index, 1);
  res.status(204).send(); // 204 = No Content (successful delete, no body)
});

// =============================================================================
// SECTION 2: Express Router — Modular Routing
// =============================================================================
// In a real app, you don't define all routes in one file.
// Each resource gets its own router file.

// --- FILE: src/routes/products.js (this would be a separate file) ---
const productRouter = express.Router();

const products = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Phone", price: 499 },
];

productRouter.get("/", (req, res) => {
  res.json(products);
});

productRouter.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

productRouter.post("/", (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) return res.status(400).json({ error: "name and price required" });
  const newProduct = { id: products.length + 1, name, price: Number(price) };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Mount the router at a PREFIX
// Now productRouter handles /products, /products/:id etc.
app.use("/products", productRouter);

// =============================================================================
// SECTION 3: router.route() — Chain Methods on Same Path
// =============================================================================
// Instead of repeating the path for each method, chain them:

const itemRouter = express.Router();

itemRouter
  .route("/")                                    // /items
  .get((req, res) => res.json({ items: [] }))
  .post((req, res) => res.status(201).json({ message: "created" }));

itemRouter
  .route("/:id")                                 // /items/:id
  .get((req, res) => res.json({ id: req.params.id }))
  .put((req, res) => res.json({ updated: req.params.id }))
  .delete((req, res) => res.status(204).send());

app.use("/items", itemRouter);

// =============================================================================
// SECTION 4: Router-Level Middleware
// =============================================================================
// Middleware applied ONLY within a specific router

const adminRouter = express.Router();

// This middleware runs for ALL routes in adminRouter
adminRouter.use((req, res, next) => {
  const isAdmin = req.headers["x-admin-key"] === "secret-key";
  if (!isAdmin) return res.status(403).json({ error: "Admin access required" });
  next();
});

adminRouter.get("/stats", (req, res) => {
  res.json({ totalUsers: 1000, revenue: 99999 });
});

adminRouter.get("/logs", (req, res) => {
  res.json({ logs: ["...log entries..."] });
});

app.use("/admin", adminRouter);

// =============================================================================
// SECTION 5: Route Parameter Middleware — router.param()
// =============================================================================
// Runs middleware when a specific parameter is present in a route

const userRouter = express.Router();
const allUsers = [{ id: 1, name: "Rohit" }, { id: 2, name: "Priya" }];

// This runs whenever :userId appears in ANY route in this router
userRouter.param("userId", (req, res, next, value) => {
  const user = allUsers.find((u) => u.id === Number(value));
  if (!user) return res.status(404).json({ error: "User not found" });
  req.targetUser = user; // Attach to req for route handlers to use
  next();
});

userRouter.get("/:userId", (req, res) => {
  res.json(req.targetUser); // User already loaded by param middleware
});

userRouter.get("/:userId/profile", (req, res) => {
  res.json({ profile: true, user: req.targetUser }); // Same here
});

userRouter.delete("/:userId", (req, res) => {
  // User already verified to exist
  const index = allUsers.findIndex((u) => u.id === req.targetUser.id);
  allUsers.splice(index, 1);
  res.status(204).send();
});

app.use("/api/users", userRouter);

// =============================================================================
// SECTION 6: Nested Routers
// =============================================================================
// /users/:userId/posts — posts belong to a user

const postRouter = express.Router({ mergeParams: true }); // mergeParams = can access parent params
// { mergeParams: true } lets postRouter access req.params.userId from parent

postRouter.get("/", (req, res) => {
  const { userId } = req.params; // Comes from parent router thanks to mergeParams
  res.json({ posts: [], forUser: userId });
});

postRouter.post("/", (req, res) => {
  const { userId } = req.params;
  const { title, content } = req.body;
  res.status(201).json({ post: { userId, title, content }, id: Date.now() });
});

// Mount postRouter under userRouter
userRouter.use("/:userId/posts", postRouter);
// Now: GET /api/users/:userId/posts → postRouter.get("/")

// =============================================================================
// SECTION 7: Catch-All Route — 404 Handler
// =============================================================================
// Define AFTER all other routes. Catches any unmatched requests.

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.path,
  });
});

// =============================================================================
// SECTION 8: REST API Design — URL Naming Conventions
// =============================================================================
// GOOD REST API URL design:
//
// Resources are NOUNS (not verbs):
//   ✓ GET    /users           — get all users
//   ✓ POST   /users           — create user
//   ✓ GET    /users/:id       — get one user
//   ✓ PUT    /users/:id       — replace user
//   ✓ PATCH  /users/:id       — partial update
//   ✓ DELETE /users/:id       — delete user
//   ✓ GET    /users/:id/posts — nested resource
//
// BAD (using verbs in URL — common mistake):
//   ✗ GET  /getUsers
//   ✗ POST /createUser
//   ✗ GET  /deleteUser?id=5
//
// Collections are plural: /users, /products, /orders (not /user, /product)
// Use kebab-case for multi-word: /blog-posts, /user-profiles
// Version your API: /api/v1/users (lets you make breaking changes later)

// =============================================================================
// FILL IN THE BLANK EXERCISES
// =============================================================================

// Exercise 1: Create a router for /categories resource with:
// - GET /categories → return all categories (empty array for now)
// - POST /categories → create category from req.body.name
// - GET /categories/:id → find by id, 404 if not found
// - DELETE /categories/:id → delete and return 204
// FILL IN:
// const categoryRouter = express.Router();
// _____________________

// Exercise 2: The route GET /orders should accept these query params:
// status ("pending" | "shipped" | "delivered"), userId, page, limit
// Return filtered/paginated mock data.
// FILL IN:
// app.get("/orders", (req, res) => {
//   _____________________
// })

const PORT = 3001;
app.listen(PORT, () => console.log(`✓ Routing examples on port ${PORT}`));
