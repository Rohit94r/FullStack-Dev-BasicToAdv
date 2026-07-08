// =============================================================================
// Production Express server — wire everything together
// =============================================================================

import "dotenv/config";
import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config/env.js";
import { logger, requestLogger } from "./middleware/requestLogger.js";
import healthRouter from "./routes/health.js";

const app = express();

// TODO: helmet(), cors({ origin: config.cors.origin, credentials: true })
// TODO: rateLimit on /api/, compression(), express.json({ limit: "10kb" })
// TODO: requestLogger middleware
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER ───
// app.use(helmet());
// app.use(cors({ origin: config.cors.origin, credentials: true }));
// app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
// app.use(compression());
// app.use(express.json({ limit: "10kb" }));
// app.use(requestLogger);

app.use(express.json());
app.use("/health", healthRouter);

app.get("/", (_req, res) => {
  res.json({ name: "Production Boilerplate", version: "1.0.0" });
});

const server = app.listen(config.port, () => {
  logger.info({ port: config.port }, "Server started");
});

// TODO: SIGTERM handler — server.close() then process.exit(0)
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER ───
// process.on("SIGTERM", () => {
//   logger.info("SIGTERM received");
//   server.close(() => process.exit(0));
// });

export default app;
