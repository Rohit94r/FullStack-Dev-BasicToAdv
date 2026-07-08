// =============================================================================
// Workspace API routes
// =============================================================================

import { Router } from "express";

const router = Router();

// TODO: GET / — list workspaces for authenticated user
// TODO: POST / — create workspace (user becomes OWNER)
// TODO: POST /:id/members — invite member
// YOUR IDEA: write your attempt here first ↓


router.get("/", (_req, res) => {
  res.status(501).json({ error: "Implement GET /workspaces" });
});

router.post("/", (_req, res) => {
  res.status(501).json({ error: "Implement POST /workspaces" });
});

export default router;
