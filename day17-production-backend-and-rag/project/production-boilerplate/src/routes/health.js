// =============================================================================
// Health check — verifies DB connectivity
// =============================================================================

import { Router } from "express";
import pg from "pg";
import { config } from "../config/env.js";

const router = Router();
const pool = new pg.Pool({ connectionString: config.db.url });

router.get("/", async (_req, res) => {
  // TODO: Run SELECT 1 against pool
  // Return 200 { status: "ok", db: "connected" } or 503 if DB fails
  // YOUR IDEA: write your attempt here first ↓


  // ─── ANSWER ───
  // try {
  //   await pool.query("SELECT 1");
  //   res.json({ status: "ok", db: "connected", timestamp: new Date().toISOString() });
  // } catch (err) {
  //   res.status(503).json({ status: "degraded", db: "disconnected", error: err.message });
  // }

  res.status(503).json({ status: "todo", message: "Implement health check" });
});

export default router;
