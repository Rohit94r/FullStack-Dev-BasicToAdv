// =============================================================================
// Task API routes — nested under /projects/:projectId/tasks
// =============================================================================

import { Router } from "express";

const router = Router({ mergeParams: true });

// TODO: GET / — list with search, status filter, pagination
// TODO: POST / — create task
// TODO: PATCH /:taskId — update (including status for kanban drag)
// TODO: DELETE /:taskId
// YOUR IDEA: write your attempt here first ↓


router.get("/", (_req, res) => {
  res.status(501).json({ error: "Implement GET /tasks" });
});

router.post("/", (_req, res) => {
  res.status(501).json({ error: "Implement POST /tasks" });
});

export default router;
