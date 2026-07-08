import { Router, Request, Response, NextFunction } from "express";
import { authController } from "../controllers/auth.controller";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { loginRateLimit } from "../middleware/rateLimit.middleware";

const router = Router();

// Zod validation middleware factory
const validate =
  (schema: typeof registerSchema | typeof loginSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        error: "Validation failed",
        issues: result.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    req.body = result.data;
    next();
  };

// POST /auth/register
router.post("/register", validate(registerSchema), authController.register);

// POST /auth/login — with rate limiting
router.post("/login", loginRateLimit, validate(loginSchema), authController.login);

// POST /auth/refresh — cookie sent automatically by browser; use curl -b/-c for testing
router.post("/refresh", authController.refresh);

// POST /auth/logout
router.post("/logout", authController.logout);

export default router;
