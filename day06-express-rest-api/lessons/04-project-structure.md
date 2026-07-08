# Day 6 — Lesson 4: Express Project Structure & Architecture

## The Layered Architecture (Industry Standard)

Real Express APIs use a **layered architecture** — each layer has one responsibility.
This makes code: testable, maintainable, scalable.

```
src/
├── routes/          → Define URL paths. Map to controllers. Nothing else.
├── controllers/     → Extract data from req. Call service. Send res.
├── services/        → Business logic. Calls repository. No HTTP awareness.
├── repositories/    → Database queries only. Returns raw data.
├── middleware/      → Reusable middleware (auth, validate, logger).
├── schemas/         → Validation schemas (Zod/Joi).
├── utils/           → Pure utility functions (helpers, formatters).
├── config/          → Environment variables, database config.
└── app.js           → Express app setup (no listen call).
    server.js        → Only thing: app.listen(). Keeps app testable.
```

## Data Flow: Request → Response

```
Client Request
    ↓
routes/users.js          — "POST /users" → userController.create
    ↓
middleware/validate.js   — validate body schema (Zod)
    ↓
controllers/user.js      — extract req.body, call userService.create()
    ↓
services/user.js         — hash password, apply business rules, call userRepo.create()
    ↓
repositories/user.js     — INSERT INTO users... (Prisma/SQL query)
    ↓
services/user.js         — strip password from result
    ↓
controllers/user.js      — res.status(201).json(user)
    ↓
Client Response
```

## Why Each Layer Exists

| Layer | Knows About | Does NOT Know About |
|-------|-------------|---------------------|
| Route | HTTP paths, controllers | Business logic |
| Controller | req/res, services | Database |
| Service | Business rules, repository | HTTP, req/res |
| Repository | Database (Prisma/SQL) | Business logic |

**Key insight:** If you swap PostgreSQL for MongoDB, only the repository changes.
If you add a CLI interface, only controllers change. Business logic stays the same.

## File Examples

### routes/users.js
```javascript
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");
const { createUserSchema, updateUserSchema } = require("../schemas/user");
const userController = require("../controllers/user");

router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.post("/", validateBody(createUserSchema), userController.create);
router.put("/:id", authenticate, validateBody(updateUserSchema), userController.update);
router.delete("/:id", authenticate, userController.remove);

module.exports = router;
```

### controllers/user.js
```javascript
const userService = require("../services/user");

// Controller is THIN — just glue between HTTP and service layer
const userController = {
  getAll: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const users = await userService.findAll({ page: Number(page), limit: Number(limit) });
      res.json(users);
    } catch (err) {
      next(err); // Always forward errors to error handler
    }
  },

  getOne: async (req, res, next) => {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      await userService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
```

### services/user.js
```javascript
const userRepo = require("../repositories/user");
const bcrypt = require("bcryptjs");

// Service is where BUSINESS LOGIC lives
const userService = {
  findAll: async ({ page = 1, limit = 10 } = {}) => {
    const users = await userRepo.findAll({ skip: (page - 1) * limit, take: limit });
    return users.map(u => omit(u, ["password"])); // Strip passwords from list
  },

  findById: async (id) => {
    const user = await userRepo.findById(id);
    if (!user) return null;
    return omit(user, ["password"]);
  },

  create: async ({ name, email, password }) => {
    // Business rule: check duplicate email
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      const err = new Error("Email already in use");
      err.statusCode = 409;
      throw err;
    }

    // Business rule: hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userRepo.create({ name, email, password: hashedPassword });
    return omit(user, ["password"]); // Never return password
  },

  update: async (id, updates) => {
    // Business rule: cannot change email to an existing one
    if (updates.email) {
      const existing = await userRepo.findByEmail(updates.email);
      if (existing && existing.id !== id) {
        const err = new Error("Email already in use");
        err.statusCode = 409;
        throw err;
      }
    }

    // Business rule: hash new password if provided
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const user = await userRepo.update(id, updates);
    return omit(user, ["password"]);
  },

  remove: async (id) => {
    await userRepo.remove(id);
  },
};

// Utility: exclude keys from object
function omit(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
}

module.exports = userService;
```

### repositories/user.js
```javascript
// This would use Prisma in a real app (Day 9)
// For now, simulated in-memory store

const db = [
  { id: "1", name: "Rohit", email: "rohit@example.com", password: "hashed" },
];

const userRepo = {
  findAll: async ({ skip = 0, take = 10 } = {}) => {
    return db.slice(skip, skip + take);
  },

  findById: async (id) => {
    return db.find(u => u.id === id) || null;
  },

  findByEmail: async (email) => {
    return db.find(u => u.email === email) || null;
  },

  create: async (data) => {
    const user = { id: Date.now().toString(), ...data };
    db.push(user);
    return user;
  },

  update: async (id, updates) => {
    const index = db.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    db[index] = { ...db[index], ...updates };
    return db[index];
  },

  remove: async (id) => {
    const index = db.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    db.splice(index, 1);
  },
};

module.exports = userRepo;
```

### app.js (Express app setup)
```javascript
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoutes = require("./routes/users");
const { errorHandler } = require("./middleware/error");
const { notFound } = require("./middleware/notFound");

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check (no auth needed)
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// API Routes (versioned)
app.use("/api/v1/users", userRoutes);

// 404 for unmatched routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app; // Export app for testing without starting server
```

### server.js (entry point)
```javascript
require("dotenv").config(); // Load .env BEFORE anything else
const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown — finish in-flight requests before exiting
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
});
```

## Environment Variables — .env

```env
# Never commit this file to git!
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

Always validate env vars at startup:
```javascript
// config/env.js
const required = ["DATABASE_URL", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

## Summary Checklist
- [ ] Route → Controller → Service → Repository separation
- [ ] Controllers always wrap in try/catch and pass errors to next()
- [ ] Services contain ALL business logic
- [ ] Never access req/res in services or repositories
- [ ] Separate app.js (setup) from server.js (listen)
- [ ] Load .env before requiring any other modules
- [ ] Validate required env vars at startup
- [ ] Version your API: /api/v1/
