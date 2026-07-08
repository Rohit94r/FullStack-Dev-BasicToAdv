// =============================================================================
// Request logging middleware — pino-http with request IDs
// =============================================================================

import pino from "pino";
import pinoHttp from "pino-http";
import { randomUUID } from "crypto";
import { config } from "../config/env.js";

export const logger = pino({
  level: config.log.level,
  transport:
    config.nodeEnv !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

// TODO: Export requestLogger middleware using pinoHttp
// - genReqId: use x-request-id header or randomUUID()
// - set x-request-id on response
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER ───
// export const requestLogger = pinoHttp({
//   logger,
//   genReqId(req, res) {
//     const existing = req.headers["x-request-id"];
//     const id = typeof existing === "string" ? existing : randomUUID();
//     res.setHeader("x-request-id", id);
//     return id;
//   },
// });

export function requestLogger(req, res, next) {
  req.log = logger;
  next();
}
