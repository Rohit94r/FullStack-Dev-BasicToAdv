// =============================================================================
// DAY 6 — LESSON 2: Middleware in Express
// =============================================================================
// MIDDLEWARE is the single most important concept in Express.
// It is a function that runs BETWEEN the request arriving and the response being sent.
// Every piece of Express functionality — routing, auth, logging, parsing — is middleware.
//
// Middleware function signature:
//   function(req, res, next) { ... }
//   - req  → the request object
//   - res  → the response object
//   - next → function to call to pass control to the NEXT middleware
//
// If you don't call next(), the request HANGS (no response ever sent).
// If you call res.send() or res.json(), the chain ends.
// =============================================================================

const express = require("express");
const app = express();

// =============================================================================
// SECTION 1: The Middleware Pipeline
// =============================================================================
// Every incoming request travels through a PIPELINE of middleware functions.
// They execute in ORDER, from top to bottom.

//    Request
//      ↓
//   Middleware 1 (logger)
//      ↓
//   Middleware 2 (auth)
//      ↓
//   Middleware 3 (validate body)
//      ↓
//   Route Handler (the actual logic)
//      ↓
//   Response

// =============================================================================
// SECTION 2: Global Middleware — app.use()
// =============================================================================
// `app.use(middleware)` → applies middleware to EVERY request

// Example: Simple request logger
app.use((req, res, next) => {
  const start = Date.now();

  // `res.on("finish")` fires after response is sent
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });

  next(); // MUST call next() to continue to the next middleware
});

// =============================================================================
// SECTION 3: Built-in Middleware
// =============================================================================

// Parse incoming JSON bodies → populates req.body
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded form bodies (from HTML <form> submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files from a folder
// app.use(express.static("public")); // serves files in /public folder
// GET /style.css → serves public/style.css automatically

// =============================================================================
// SECTION 4: Third-party Middleware
// =============================================================================
// npm install cors helmet morgan

// CORS — allow requests from other origins (frontend on different port/domain)
// Without CORS: browser blocks frontend from calling your API (SAME-ORIGIN POLICY)
const cors = require("cors");
app.use(cors({
  origin: ["http://localhost:3000", "https://myapp.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // allow cookies to be sent
}));

// Helmet — sets secure HTTP response headers
const helmet = require("helmet");
app.use(helmet()); // Adds: X-Frame-Options, X-XSS-Protection, Content-Security-Policy, etc.

// Morgan — HTTP request logger (more detailed than our custom logger above)
const morgan = require("morgan");
app.use(morgan("dev")); // "dev" format: GET /api/users 200 12ms

// =============================================================================
// SECTION 5: Route-Level Middleware
// =============================================================================
// Apply middleware to specific routes only

// A simple authentication middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
    // return early — stops the chain. next() is NOT called.
  }

  // In real app: verify JWT token
  // try {
  //   req.user = jwt.verify(token, process.env.JWT_SECRET);
  //   next();
  // } catch { res.status(401).json({ error: "Invalid token" }); }

  // For this example, simulate a user
  req.user = { id: "user-123", role: "admin" };
  next(); // Token valid — pass to next middleware/route
}

// Apply authenticate ONLY to this specific route
app.get("/api/profile", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// =============================================================================
// SECTION 6: Middleware Order MATTERS
// =============================================================================

// This middleware only applies to routes DEFINED AFTER it
app.use("/api/admin", authenticate); // protect all /api/admin/* routes

app.get("/api/admin/dashboard", (req, res) => {
  // authenticate already ran — req.user is available
  res.json({ message: "Admin dashboard", user: req.user });
});

// =============================================================================
// SECTION 7: Multiple Middleware on One Route
// =============================================================================
// Pass middleware as extra arguments before the route handler

function validateBody(req, res, next) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  // Sanitize — trim whitespace
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
}

function checkEmailUnique(req, res, next) {
  const { email } = req.body;
  // In real app: check database
  const existingEmails = ["taken@example.com", "admin@example.com"];
  if (existingEmails.includes(email)) {
    return res.status(409).json({ error: "Email already in use" });
  }
  next();
}

app.post(
  "/api/users",
  authenticate,    // 1. Must be logged in
  validateBody,    // 2. Must provide valid body
  checkEmailUnique, // 3. Email must not be taken
  (req, res) => {  // 4. The actual handler
    // If we reach here, all checks passed
    const { name, email } = req.body;
    res.status(201).json({ id: "new-id", name, email });
  }
);

// =============================================================================
// SECTION 8: Passing Data Between Middleware
// =============================================================================
// Middleware can ATTACH data to req to pass to next middleware
// Convention: use req.user, req.context, req.data, etc.

function loadUser(req, res, next) {
  const userId = req.params.id;
  // Simulated database lookup
  const user = { id: userId, name: "Rohit", role: "admin" };
  req.foundUser = user; // Attach to req
  next();
}

function checkRole(role) {
  return function (req, res, next) {
    if (req.foundUser.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

app.get("/api/users/:id/settings", loadUser, checkRole("admin"), (req, res) => {
  res.json({ settings: "...", for: req.foundUser.name });
});

// =============================================================================
// SECTION 9: Error-Handling Middleware — 4 Parameters
// =============================================================================
// Express identifies error middleware by its 4-parameter signature: (err, req, res, next)
// MUST have EXACTLY 4 parameters — Express won't treat it as error middleware otherwise.
// Must be defined LAST, after all routes and other middleware.

function errorHandler(err, req, res, next) {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: message,
    // Only show stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

// Register the error handler LAST
app.use(errorHandler);

// Any route can trigger it:
app.get("/fail", (req, res, next) => {
  const error = new Error("Something broke!");
  error.statusCode = 500;
  next(error); // Pass error to next middleware — Express routes to error handler
});

// Or use try/catch with async:
app.get("/async-fail", async (req, res, next) => {
  try {
    // const data = await someDatabaseCall();
    throw new Error("Database connection failed");
  } catch (err) {
    next(err); // ALWAYS pass async errors to next()
  }
});

// =============================================================================
// SECTION 10: CUSTOM MIDDLEWARE FACTORY (Higher-Order Middleware)
// =============================================================================
// Middleware can be a FUNCTION that RETURNS middleware
// This allows configuration / dependency injection

function rateLimit({ maxRequests = 100, windowMs = 60000 } = {}) {
  const counts = new Map(); // ip -> { count, resetTime }

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if (!counts.has(ip) || counts.get(ip).resetTime < now) {
      counts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const entry = counts.get(ip);
    entry.count++;

    if (entry.count > maxRequests) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      });
    }

    next();
  };
}

// Apply configured rate limiter
app.use("/api", rateLimit({ maxRequests: 50, windowMs: 60000 }));

// =============================================================================
// FILL IN THE BLANK EXERCISES
// =============================================================================

// Exercise 1: Write a middleware that adds a request ID to each request.
// - Generate an ID: `req.id = Date.now().toString(36) + Math.random().toString(36).slice(2)`
// - Set response header: `res.setHeader("X-Request-Id", req.id)`
// - Call next()
// FILL IN:
// function requestId(req, res, next) {
//   ______________________
// }

// Exercise 2: Write a middleware called `requireAdmin` that:
// - Checks if req.user.role === "admin"
// - If not: return 403 with { error: "Admins only" }
// - If yes: call next()
// FILL IN:
// function requireAdmin(req, res, next) {
//   ______________________
// }

// Exercise 3: Write a middleware factory `validateBody(fields)` that:
// - Takes an array of required field names
// - Returns middleware that checks req.body for all those fields
// - If any missing: return 400 with { error: `${fieldName} is required` }
// - If all present: call next()
// FILL IN:
// function validateBody(fields) {
//   return function(req, res, next) {
//     ______________________
//   };
// }

// =============================================================================
// KEY INTERVIEW POINTS TO REMEMBER
// =============================================================================
// 1. Middleware signature: (req, res, next) — MUST call next() or send response.
// 2. Error middleware signature: (err, req, res, next) — exactly 4 params.
// 3. app.use() = applies to all routes. app.get("/path", mw, handler) = specific route.
// 4. Order matters — middleware runs top-to-bottom as defined.
// 5. Attach data to req (req.user, req.context) to share between middleware.
// 6. next(error) → skips to error handler. next() → goes to next normal middleware.
// 7. Built-in: express.json(), express.urlencoded(), express.static().
// 8. Common third-party: cors, helmet, morgan, express-rate-limit.
