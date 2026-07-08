import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

export interface AuthUser {
  id: number;
  email: string;
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

interface AccessTokenPayload {
  userId: number;
  email: string;
  role: "user" | "admin";
}

// ── EXERCISE: requireAuth — verify JWT and attach req.user ──
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // TODO: Extract token from "Bearer <token>" header
  // const token = _____________________

  // TODO: If no token, call next(new UnauthorizedError())
  // _____________________

  try {
    // TODO: Verify token with jwt.verify and process.env.JWT_ACCESS_SECRET
    // Cast result to AccessTokenPayload
    // const payload = jwt.verify(_____, process.env.JWT_ACCESS_SECRET!) as AccessTokenPayload

    // TODO: Attach user to req.user from payload fields
    // req.user = { id: payload.userId, email: payload.email, role: payload.role }

    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
}

// ── EXERCISE: requireRole factory — check req.user.role ──
export function requireRole(...allowedRoles: AuthUser["role"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // TODO: If req.user is missing → next(new UnauthorizedError())
    // _____________________

    // TODO: If req.user.role not in allowedRoles → next(new ForbiddenError())
    // _____________________

    next();
  };
}
