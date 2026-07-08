// =============================================================================
// DAY 17 — LESSON 3: Security Middleware (helmet, CORS, rate limit)
// =============================================================================
// Run: npx tsx lessons/03-security-middleware.ts
// Install: npm install express helmet cors express-rate-limit compression
// =============================================================================

import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();

// =============================================================================
// SECTION 1: helmet — secure HTTP headers
// =============================================================================
// Sets headers like X-Content-Type-Options, X-Frame-Options, etc.
// Protects against XSS, clickjacking, MIME sniffing — NOT a substitute for
// input validation or auth.

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
      },
    },
  })
);

// =============================================================================
// SECTION 2: CORS — browser-enforced cross-origin policy
// =============================================================================
// CORS is NOT server-to-server security. Browsers block frontend JS from
// reading responses from a different origin unless the API sends Allow headers.

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://your-app.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    },
    credentials: true, // allow cookies — must list exact origins, not *
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =============================================================================
// SECTION 3: Rate limiting — slow down abuse
// =============================================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter on login/register
  message: { error: "Too many auth attempts" },
});

app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// =============================================================================
// SECTION 4: compression — gzip responses (bandwidth)
// =============================================================================

app.use(compression());

app.use(express.json({ limit: "10kb" })); // limit body size early

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// =============================================================================
// INTERVIEW Q&A
// =============================================================================
// Q: What is CORS and who enforces it?
// A: Cross-Origin Resource Sharing. The BROWSER enforces it for frontend JS.
//    Servers can allow origins via Access-Control-* headers.
//
// Q: What does helmet protect against?
// A: Common web vulnerabilities via HTTP headers (XSS, clickjacking, sniffing).
//
// Q: Why rate limit auth routes separately?
// A: Brute-force password guessing — tighter limits on /login and /register.

const PORT = 3099;
app.listen(PORT, () => console.log(`Security demo on http://localhost:${PORT}`));
