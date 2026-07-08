// =============================================================================
// Auth API routes — use if Option B (separate Express/FastAPI backend)
// Or Next.js route handlers at app/api/auth/[...]/route.ts
// =============================================================================

import { Router } from "express";

const router = Router();

// TODO: POST /register — validate, hash password, create user, return token
// TODO: POST /login — verify, return JWT
// TODO: POST /logout — invalidate refresh token (if using)
// YOUR IDEA: write your attempt here first ↓


router.post("/register", (_req, res) => {
  res.status(501).json({ error: "Implement POST /register" });
});

router.post("/login", (_req, res) => {
  res.status(501).json({ error: "Implement POST /login" });
});

export default router;
