// ─────────────────────────────────────────────────────────────────────────────
// LESSON 05 — RBAC & AUTHORIZATION (basic → advanced)
// Authentication vs Authorization, roles, requireRole middleware
// ─────────────────────────────────────────────────────────────────────────────
//
// HOW TO RUN:  npx ts-node 05-rbac-authorization.ts
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 1 — AUTHENTICATION vs AUTHORIZATION (basic)
// ─────────────────────────────────────────────────────────────────────────────
//
// Authentication (AuthN): "WHO are you?"
//   → Login, password, JWT, session cookie. Proves identity.
//
// Authorization (AuthZ): "WHAT are you allowed to do?"
//   → Roles, permissions, middleware that blocks forbidden actions.
//
// Analogy: a nightclub.
//   AuthN = showing your ID at the door (you are a real person on the list).
//   AuthZ = VIP wristband vs general admission (what areas you can enter).
//
// You can be authenticated (logged in) but NOT authorized (regular user
// hitting GET /admin/users → 403 Forbidden).
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 2 — RBAC (Role-Based Access Control) (intermediate)
// ─────────────────────────────────────────────────────────────────────────────
//
// Instead of checking permissions on every route manually:
//
//   if (user.role === "admin") { ... }  // gets messy fast
//
// RBAC assigns each user a ROLE. Each role maps to a set of permissions.
//
//   roles:  "user" | "admin" | "moderator"
//   permissions: "books:read", "books:write", "users:manage"
//
// For this course we keep it simple: role strings on the user object.
// Production apps often use a permissions table or services like Casbin.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 3 — THE MIDDLEWARE CHAIN (intermediate)
// ─────────────────────────────────────────────────────────────────────────────
//
// Protected admin route flow:
//
//   Request → requireAuth → requireRole("admin") → controller
//                ↓                    ↓
//           verify JWT          check req.user.role
//           attach req.user     403 if wrong role
//
// requireAuth MUST run before requireRole — otherwise req.user is undefined.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 4 — RUNNABLE EXAMPLE + FILL-IN-THE-BLANK EXERCISES
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";

// Simulated user attached by requireAuth after JWT verification
interface AuthUser {
  id: number;
  email: string;
  role: "user" | "admin";
}

// Extend Express Request so TypeScript knows about req.user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// ── EXERCISE 1: requireAuth middleware (fill in the blanks) ──
//
// Steps:
//   1. Read token from Authorization header ("Bearer <token>")
//   2. If missing → 401 Unauthorized
//   3. Verify JWT (here we simulate with a fake lookup)
//   4. Attach user to req.user and call next()

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // TODO: Extract token from "Bearer <token>" format
  // Hint: header?.startsWith("Bearer ") then slice(7)
  // const token = _____________________

  // TODO: If no token, return 401 JSON { error: "Authentication required" }
  // _____________________

  // Simulated JWT decode — in the project you'll use jwt.verify()
  const fakeUsers: Record<string, AuthUser> = {
    "user-token-abc": { id: 1, email: "alice@example.com", role: "user" },
    "admin-token-xyz": { id: 2, email: "admin@example.com", role: "admin" },
  };

  // TODO: Look up user by token; if not found return 401
  // const user = fakeUsers[_______]
  // if (!user) return res.status(____).json({ error: "Invalid token" })

  // TODO: Attach user to req and call next()
  // req._____ = user
  // _______()
}

// ── EXERCISE 2: requireRole factory (fill in the blanks) ──
//
// requireRole is a FACTORY — it returns middleware configured for a role.
// Usage: router.get("/admin/users", requireAuth, requireRole("admin"), handler)

function requireRole(...allowedRoles: AuthUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: If req.user is missing, return 401 (defense in depth)
    // _____________________

    // TODO: If req.user.role is NOT in allowedRoles, return 403 Forbidden
    // Hint: !allowedRoles.includes(req.user.role)
    // _____________________

    // TODO: Role matches — allow the request through
    // _______()
  };
}

// ── EXERCISE 3: Wire it together (fill in the blanks) ──
//
// Pseudocode for GET /admin/users:
//
//   router.get(
//     "/admin/users",
//     _______,                    // 1. verify identity
//     _______("admin"),           // 2. verify role
//     (req, res) => {
//       res.json({ users: [...] });
//     }
//   );
//
// Answers: requireAuth, requireRole

// ── Quick demo (uncomment after filling in exercises) ──
/*
const mockReq = (authHeader?: string): Partial<Request> => ({
  headers: { authorization: authHeader },
});

const mockRes = () => {
  const res: Partial<Response> = {};
  res.status = (code: number) => {
    res.statusCode = code;
    return res as Response;
  };
  res.json = (body: unknown) => {
    console.log("response:", res.statusCode, body);
    return res as Response;
  };
  return res as Response;
};

const req1 = mockReq("Bearer admin-token-xyz") as Request;
const res1 = mockRes();
requireAuth(req1, res1, () => {
  requireRole("admin")(req1, res1, () => {
    console.log("✅ Admin access granted for", req1.user?.email);
  });
});
*/

// ─────────────────────────────────────────────────────────────────────────────
// PART 5 — BEYOND SIMPLE ROLES (advanced)
// ─────────────────────────────────────────────────────────────────────────────
//
// RBAC scales until it doesn't. Common upgrades:
//
//   ABAC (Attribute-Based): "user can edit IF they own the resource"
//     → requireOwnership middleware checks req.params.id === req.user.id
//
//   Permission lists: user.permissions = ["posts:read", "posts:write"]
//     → requirePermission("posts:write") instead of broad roles
//
//   Multi-tenancy: role is scoped to an organization
//     → req.user.roleInOrg[orgId] === "admin"
//
// Principle of least privilege: default DENY, explicitly ALLOW.
//
// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────────────────────
//
// Q1: Authentication vs Authorization?
// A1: AuthN = proving identity (login). AuthZ = checking permissions
//     (can this identity perform this action?).
//
// Q2: What is RBAC?
// A2: Role-Based Access Control — users get roles, roles grant permissions.
//     Routes check roles instead of hardcoding per-user logic.
//
// Q3: What HTTP status for "not logged in" vs "logged in but forbidden"?
// A3: 401 Unauthorized = no/invalid credentials. 403 Forbidden = identity
//     known but lacks permission.
//
// Q4: Why is requireRole a factory function?
// A4: Express middleware signature is (req, res, next). A factory lets you
//     configure the allowed role(s) and return a middleware with that config
//     closed over: requireRole("admin") returns the actual handler.
//
// Q5: What order should auth middleware run?
// A5: requireAuth first (establish identity), then requireRole/requirePermission
//     (check authorization). Never the reverse.
//
// Q6: Where should authorization logic live?
// A6: Middleware for route-level checks; service layer for resource-level
//     rules (e.g., "only edit your own posts"). Don't scatter if/role checks
//     inside controllers.
// ─────────────────────────────────────────────────────────────────────────────
