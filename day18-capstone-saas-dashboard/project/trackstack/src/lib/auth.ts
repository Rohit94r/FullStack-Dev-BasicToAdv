// =============================================================================
// Auth helpers — JWT or session (your choice, document in README)
// =============================================================================

// TODO: hashPassword(plain) using bcrypt
// TODO: verifyPassword(plain, hash)
// TODO: signToken(payload) / verifyToken(token)
// TODO: getCurrentUser() — read from cookie/header, return User or null
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER (JWT pattern from Day 7) ───
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// export async function hashPassword(plain: string) {
//   return bcrypt.hash(plain, 12);
// }
// export async function verifyPassword(plain: string, hash: string) {
//   return bcrypt.compare(plain, hash);
// }

export async function getCurrentUser() {
  throw new Error("Implement getCurrentUser");
}
