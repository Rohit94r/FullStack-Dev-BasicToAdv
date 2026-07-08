// =============================================================================
// Project API routes — nested under /workspaces/:workspaceId/projects
// =============================================================================

import { Router } from "express";

const router = Router({ mergeParams: true });

// TODO: GET / — list projects in workspace
// TODO: POST / — create project
// TODO: PATCH /:projectId — update
// TODO: DELETE /:projectId — delete
// YOUR IDEA: write your attempt here first ↓


router.get("/", (_req, res) => {
  res.status(501).json({ error: "Implement GET /projects" });
});

router.post("/", (_req, res) => {
  res.status(501).json({ error: "Implement POST /projects" });
});

export default router;
