// =============================================================================
// DAY 17 — LESSON 4: Logging & Monitoring (pino, request IDs)
// =============================================================================
// Run: npx tsx lessons/04-logging-and-monitoring.ts
// Install: npm install express pino pino-http uuid
// =============================================================================

import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import { randomUUID } from "crypto";

// =============================================================================
// SECTION 1: Structured logging with pino
// =============================================================================
// JSON logs → easy to search in Datadog, CloudWatch, etc.
// Log levels: fatal > error > warn > info > debug > trace

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

logger.info({ event: "startup" }, "Logger initialized");

// =============================================================================
// SECTION 2: Request ID middleware — trace every request
// =============================================================================

const app = express();

app.use(
  pinoHttp({
    logger,
    genReqId(req, res) {
      const existing = req.headers["x-request-id"];
      const id = typeof existing === "string" ? existing : randomUUID();
      res.setHeader("x-request-id", id);
      return id;
    },
    customLogLevel(_req, res, err) {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    serializers: {
      req(req) {
        return { method: req.method, url: req.url, id: req.id };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

// =============================================================================
// SECTION 3: Health check endpoint — load balancers & k8s probes
// =============================================================================

app.get("/health", (_req, res) => {
  // Production: also check DB, Redis, etc.
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/demo", (req, res) => {
  req.log.info({ userId: "demo" }, "Handling demo request");
  res.json({ message: "Check terminal for structured log with request id" });
});

// =============================================================================
// SECTION 4: Graceful shutdown — log SIGTERM
// =============================================================================

const server = app.listen(3098, () => {
  logger.info({ port: 3098 }, "Server listening");
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received — shutting down gracefully");
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});

// =============================================================================
// INTERVIEW Q&A
// =============================================================================
// Q: Why structured (JSON) logs?
// A: Machine-parseable — filter by requestId, userId, statusCode in log tools.
//
// Q: What is a request ID for?
// A: Correlate all logs for one HTTP request across services (distributed tracing lite).
//
// Q: What should /health return?
// A: 200 if app (and critical deps) are healthy — used by load balancers and orchestrators.
