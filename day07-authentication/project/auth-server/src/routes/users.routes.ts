import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";

const router = Router();

// GET /users/me — any authenticated user
router.get("/me", requireAuth, authController.getMe);

// GET /users — admin only (alias for admin dashboard)
// GET /admin/users — admin only (as specified in day README)
router.get("/", requireAuth, requireRole("admin"), authController.getAllUsers);

export default router;
