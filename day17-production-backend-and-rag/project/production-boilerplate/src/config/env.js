// =============================================================================
// Validated environment config — crash on startup if invalid
// =============================================================================

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

// TODO: safeParse process.env — log errors and process.exit(1) if invalid
// TODO: export config object with port, db.url, cors.origin, log.level
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER ───
// const result = envSchema.safeParse(process.env);
// if (!result.success) {
//   console.error("Invalid env:", result.error.flatten().fieldErrors);
//   process.exit(1);
// }
// const env = result.data;
// export const config = {
//   port: env.PORT,
//   nodeEnv: env.NODE_ENV,
//   db: { url: env.DATABASE_URL },
//   jwt: { secret: env.JWT_SECRET },
//   cors: { origin: env.CORS_ORIGIN },
//   log: { level: env.LOG_LEVEL },
// };

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  db: { url: process.env.DATABASE_URL || "" },
  jwt: { secret: process.env.JWT_SECRET || "" },
  cors: { origin: process.env.CORS_ORIGIN || "http://localhost:5173" },
  log: { level: process.env.LOG_LEVEL || "info" },
};
