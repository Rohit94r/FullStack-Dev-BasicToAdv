import { Request, Response, NextFunction } from "express";

// Simple in-memory rate limiter for POST /auth/login
// Production: use express-rate-limit + Redis

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function getClientKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

// ── EXERCISE: loginRateLimit middleware ──
export function loginRateLimit(req: Request, res: Response, next: NextFunction) {
  const key = getClientKey(req);
  const now = Date.now();

  // TODO: Get existing record from loginAttempts Map for this key
  // let record = _____________________

  // TODO: If no record OR record.resetAt < now, create fresh record
  // { count: 0, resetAt: now + WINDOW_MS } and set it in the Map
  // _____________________

  // TODO: If record.count >= MAX_ATTEMPTS, return 429 with:
  // { error: "Too many login attempts", retryAfter: Math.ceil((record.resetAt - now) / 1000) }
  // _____________________

  // TODO: Increment record.count before calling next()
  // _____________________

  next();
}

// Call on successful login to reset counter (optional nice-to-have)
export function resetLoginAttempts(req: Request) {
  loginAttempts.delete(getClientKey(req));
}
