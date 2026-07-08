import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { AuthUser } from "../middleware/auth.middleware";

// In-memory store for learning — replace with PostgreSQL/Prisma in production
interface StoredUser {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: Date;
}

interface RefreshRecord {
  userId: number;
  expiresAt: number;
}

const users: StoredUser[] = [];
const refreshStore = new Map<string, RefreshRecord>();
let nextId = 1;

// Safe user shape — NEVER include passwordHash in API responses
export type SafeUser = Omit<StoredUser, "passwordHash">;

function toSafeUser(user: StoredUser): SafeUser {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

function createAccessToken(user: StoredUser): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );
}

function createRefreshToken(userId: number): string {
  const token = crypto.randomBytes(40).toString("hex");
  const ttlMs = 7 * 24 * 60 * 60 * 1000; // 7 days
  refreshStore.set(token, { userId, expiresAt: Date.now() + ttlMs });
  return token;
}

export const authService = {
  // ── EXERCISE: register ──
  register: async (input: RegisterInput): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> => {
    // TODO: Check if email already exists (case-insensitive) → throw ConflictError
    // _____________________

    // TODO: Hash password with bcrypt.hash(input.password, 10)
    // const passwordHash = await _____________________

    // TODO: Create user object, push to users array, increment nextId
    // Default role: "user"
    // _____________________

    // TODO: Generate accessToken and refreshToken, return { user: toSafeUser(...), accessToken, refreshToken }
    // _____________________

    throw new Error("Not implemented — fill in register()");
  },

  // ── EXERCISE: login ──
  login: async (input: LoginInput): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> => {
    // TODO: Find user by email (case-insensitive)
    // _____________________

    // TODO: If user not found, still run bcrypt.compare on a dummy hash
    // (timing attack / user enumeration defense) then throw UnauthorizedError("Invalid credentials")
    // _____________________

    // TODO: Compare input.password with user.passwordHash using bcrypt.compare
    // If false → throw UnauthorizedError("Invalid credentials")
    // _____________________

    // TODO: Return safe user + tokens
    // _____________________

    throw new Error("Not implemented — fill in login()");
  },

  // ── EXERCISE: refresh (with rotation) ──
  refresh: async (oldToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    // TODO: Look up oldToken in refreshStore
    // If missing → throw UnauthorizedError("Invalid refresh token")
    // _____________________

    // TODO: If expired, delete token and throw UnauthorizedError("Refresh token expired")
    // _____________________

    // TODO: Delete old token (rotation), find user, issue new pair
    // _____________________

    throw new Error("Not implemented — fill in refresh()");
  },

  // ── EXERCISE: logout ──
  logout: async (refreshToken: string): Promise<void> => {
    // TODO: Delete refreshToken from refreshStore
    // _____________________
  },

  getMe: async (userId: number): Promise<SafeUser> => {
    const user = users.find((u) => u.id === userId);
    if (!user) throw new UnauthorizedError("User not found");
    return toSafeUser(user);
  },

  getAllUsers: async (): Promise<SafeUser[]> => {
    return users.map(toSafeUser);
  },

  // Seed an admin for testing (called from server.ts on startup)
  seedAdmin: async () => {
    const exists = users.some((u) => u.email === "admin@example.com");
    if (exists) return;
    const passwordHash = await bcrypt.hash("Admin123!", 10);
    users.push({
      id: nextId++,
      email: "admin@example.com",
      name: "Admin User",
      passwordHash,
      role: "admin",
      createdAt: new Date(),
    });
    console.log("Seeded admin: admin@example.com / Admin123!");
  },
};
