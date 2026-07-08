// =============================================================================
// DAY 17 — LESSON 2: Environment Variables & Config Validation
// =============================================================================
// Run: npx tsx lessons/02-env-and-config.ts
// Install: npm install dotenv zod
// =============================================================================
//
// Golden rules:
// 1. NEVER commit .env to git (.env.example only)
// 2. Validate ALL required env vars ON STARTUP — fail fast
// 3. Separate config from code (12-factor app)
// =============================================================================

import "dotenv/config";
import { z } from "zod";

// =============================================================================
// SECTION 1: Raw process.env is untyped and unsafe
// =============================================================================

// BAD — silent undefined at runtime:
// const port = process.env.PORT;  // string | undefined

// =============================================================================
// SECTION 2: Zod schema for env — crash early with clear message
// =============================================================================

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 chars"),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);
    process.exit(1); // fail fast — don't start half-configured server
  }

  return result.data;
}

export const env = loadEnv();

// =============================================================================
// SECTION 3: Config object — single source of truth for app
// =============================================================================

export const config = {
  isDev: env.NODE_ENV === "development",
  isProd: env.NODE_ENV === "production",
  port: env.PORT,
  db: { url: env.DATABASE_URL },
  jwt: { secret: env.JWT_SECRET },
  cors: { origin: env.CORS_ORIGIN },
  log: { level: env.LOG_LEVEL },
} as const;

console.log("✅ Config loaded:", {
  nodeEnv: config.isDev ? "development" : env.NODE_ENV,
  port: config.port,
  cors: config.cors.origin,
});

// =============================================================================
// SECTION 4: .env.example (commit this, NOT .env)
// =============================================================================
// NODE_ENV=development
// PORT=3000
// DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
// JWT_SECRET=change-me-to-a-long-random-string-at-least-32-chars
// CORS_ORIGIN=http://localhost:5173
// LOG_LEVEL=info

// =============================================================================
// INTERVIEW Q&A
// =============================================================================
// Q: Why validate env on startup?
// A: Fail fast with clear errors instead of mysterious runtime crashes in prod.
//
// Q: Where do secrets live in production?
// A: Platform secret managers (Railway, Render, AWS Secrets Manager) — injected
//    as env vars, never in git or Docker images.
