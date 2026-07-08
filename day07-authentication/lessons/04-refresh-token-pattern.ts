// ─────────────────────────────────────────────────────────────────────────────
// LESSON 04 — THE REFRESH TOKEN PATTERN (basic → advanced)
// Short access token + long refresh token, rotation, revocation
// ─────────────────────────────────────────────────────────────────────────────
//
// HOW TO RUN:  npx ts-node 04-refresh-token-pattern.ts
// (needs jsonwebtoken installed — same as lesson 02)
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 1 — THE PROBLEM: ONE TOKEN CANNOT WIN (basic)
// ─────────────────────────────────────────────────────────────────────────────
//
// From lesson 02 we know: a JWT cannot be taken back. Once issued, it works
// until it expires. So how long should a token live?
//
//   Long-lived token (say 30 days):
//     ✅ user stays logged in, nice UX
//     ❌ if stolen, the thief has a 30-day free pass — and you CANNOT stop it
//
//   Short-lived token (say 15 minutes):
//     ✅ stolen token is nearly useless — dies in minutes
//     ❌ user is forced to type their password every 15 minutes — horrible
//
// One token can't be both safe and convenient. So we use TWO tokens with two
// different jobs. This is the refresh token pattern.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 2 — THE TWO TOKENS (basic)
// ─────────────────────────────────────────────────────────────────────────────
//
// ACCESS TOKEN — the day pass
//   - Short-lived: 5-15 minutes.
//   - Sent with EVERY API request (Authorization header).
//   - Verified statelessly (just the signature) — fast, no DB lookup.
//   - Because it travels constantly, it's the most exposed → keep it short.
//
// REFRESH TOKEN — the membership card kept in the safe
//   - Long-lived: 7-30 days.
//   - Sent to exactly ONE endpoint: POST /auth/refresh. Never anywhere else.
//   - Stored in an httpOnly cookie (JS can't steal it — lesson 03), ideally
//     with Path=/auth/refresh so the browser only attaches it there.
//   - The server KEEPS A RECORD of valid refresh tokens (DB or memory).
//     Yes — this one is STATEFUL on purpose, so we can revoke it!
//
// Analogy: a hotel. The access token is your room keycard — it expires daily
// and nobody panics if you lose it. The refresh token is your booking
// confirmation at the front desk — you show it to get a NEW keycard, and the
// hotel can cancel the booking (revoke) at any moment.
//
// THE FLOW:
//
//   LOGIN    client ── email+password ──▶ server
//            client ◀── access (15m) + refresh cookie (7d) ── server
//
//   NORMAL   client ── request + access token ──▶ server (verify signature)
//
//   EXPIRED  client ── request ──▶ server ── 401 "token expired"
//            client ── POST /auth/refresh (cookie goes automatically) ──▶
//            server: is this refresh token in my valid list? yes →
//            client ◀── NEW access token + NEW refresh cookie ── server
//            client retries the original request. User noticed nothing.
//
//   LOGOUT   client ── POST /auth/logout ──▶ server deletes the refresh
//            token from its list → it can never mint access tokens again.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 3 — ROTATION & REUSE DETECTION (advanced — great interview material)
// ─────────────────────────────────────────────────────────────────────────────
//
// ROTATION: every time a refresh token is USED, the server invalidates it and
// issues a brand-new one. Each refresh token is single-use.
//
// WHY? It creates a beautiful theft alarm called REUSE DETECTION:
//   1. Thief steals the refresh token and uses it → gets new tokens; the
//      stolen one is now dead.
//   2. The REAL user's app later tries to refresh with the old (stolen &
//      now-dead) token.
//   3. Server sees a DEAD token being used → someone has a copy! → it
//      revokes the ENTIRE token family, logging out both the thief and the
//      user. The user just logs in again; the thief is locked out.
//
// Without rotation, a stolen refresh token silently works for its whole
// 7-30 day life and nobody ever finds out.
//
// REVOCATION: because the server stores refresh tokens, it can delete them:
//   - on logout (delete that one token)
//   - on password change / "log out everywhere" (delete all the user's tokens)
//   - on reuse detection (delete the family)
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 4 — RUNNABLE SIMULATION
// ─────────────────────────────────────────────────────────────────────────────
// We simulate the whole pattern in one file with an in-memory store.
// (In the project you'll split this into services/middleware properly.)

import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_SECRET = "access-secret";
const ACCESS_TTL = "15m";
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// The server-side refresh token store. Keys are token strings.
// This map IS the "state" that makes refresh tokens revocable.
type RefreshRecord = { userId: number; expiresAt: number };
const refreshStore = new Map<string, RefreshRecord>();

// A refresh token does NOT need to be a JWT — a long random string is
// perfect, because we look it up server-side anyway.
function createRefreshToken(userId: number): string {
  const token = crypto.randomBytes(40).toString("hex");
  refreshStore.set(token, { userId, expiresAt: Date.now() + REFRESH_TTL_MS });
  return token;
}

function createAccessToken(userId: number): string {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

// LOGIN: issue both tokens.
function login(userId: number) {
  return {
    accessToken: createAccessToken(userId),
    refreshToken: createRefreshToken(userId),
  };
}

// REFRESH with ROTATION: old token dies, new pair is born.
function refresh(oldToken: string) {
  const record = refreshStore.get(oldToken);

  if (!record) {
    // Token unknown OR already used → possible theft (reuse detection).
    // Real apps would revoke the whole token family here.
    throw new Error("Invalid refresh token — possible reuse detected!");
  }
  if (record.expiresAt < Date.now()) {
    refreshStore.delete(oldToken);
    throw new Error("Refresh token expired — please log in again.");
  }

  refreshStore.delete(oldToken); // ← THE ROTATION: single-use
  return {
    accessToken: createAccessToken(record.userId),
    refreshToken: createRefreshToken(record.userId),
  };
}

// LOGOUT / REVOCATION: simply forget the token.
function logout(refreshToken: string) {
  refreshStore.delete(refreshToken);
}

// ── Walk through the whole story ──
console.log("1. LOGIN");
const session = login(42);
console.log("   access :", session.accessToken.slice(0, 30) + "...");
console.log("   refresh:", session.refreshToken.slice(0, 20) + "...");

console.log("\n2. REFRESH (rotation)");
const session2 = refresh(session.refreshToken);
console.log("   ✅ got new pair; old refresh token is now dead");

console.log("\n3. THIEF replays the OLD refresh token");
try {
  refresh(session.refreshToken); // already rotated away
} catch (err) {
  console.log("   ✅ blocked:", (err as Error).message);
}

console.log("\n4. LOGOUT");
logout(session2.refreshToken);
try {
  refresh(session2.refreshToken);
} catch (err) {
  console.log("   ✅ after logout, refresh fails:", (err as Error).message);
}

// ─────────────────────────────────────────────────────────────────────────────
// PART 5 — PRACTICAL NOTES (advanced)
// ─────────────────────────────────────────────────────────────────────────────
//
// - Store only a HASH of the refresh token in the DB (like passwords!).
//   If the DB leaks, raw tokens can't be replayed.
// - Give the refresh cookie Path=/auth/refresh so it is not attached to
//   every request — smaller attack surface.
// - Mobile apps can't use httpOnly cookies easily; they keep the refresh
//   token in the OS secure storage (Keychain/Keystore) instead.
// - "Sliding sessions": each refresh extends the 7-day window, so active
//   users never get logged out while inactive ones eventually do.
//
// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────────────────────
//
// Q1: What is a refresh token and why use one?
// A1: A long-lived credential used only to obtain new short-lived access
//     tokens. It lets access tokens stay short (limiting stolen-token
//     damage) while users stay logged in for days. It's stored server-side,
//     so it can be revoked — fixing JWT's "can't log out" problem.
//
// Q2: Why not just one long-lived access token?
// A2: Access tokens are stateless — if stolen, they can't be revoked and
//     work until expiry. A 30-day stolen token is a disaster. Short access +
//     revocable refresh gives security AND convenience.
//
// Q3: What is refresh token rotation?
// A3: Every use of a refresh token invalidates it and issues a new one —
//     single-use tokens. It enables reuse detection: if a dead token is
//     presented, a copy exists (theft), and the server revokes everything.
//
// Q4: Where should refresh tokens be stored on the client?
// A4: Browser: httpOnly + Secure + SameSite cookie, ideally scoped with
//     Path=/auth/refresh. Mobile: OS secure storage (Keychain/Keystore).
//     Never localStorage.
//
// Q5: Does the refresh token pattern break "stateless" auth?
// A5: Partially, by design. Access token verification stays stateless (fast,
//     every request). Refresh tokens are stateful (stored server-side) but
//     hit the server only once every ~15 minutes — a cheap price for
//     revocation ability.
//
// Q6: Must a refresh token be a JWT?
// A6: No. Since it's looked up server-side anyway, a long random string is
//     ideal (and hashed at rest). A JWT refresh token also works but adds
//     little.
//
// Q7: How do you implement "log out from all devices"?
// A7: Delete all refresh tokens belonging to that user. Their access tokens
//     die within minutes and can't be renewed anywhere.
//
// Q8: What happens when the refresh token itself expires?
// A8: The user must log in with credentials again. Expiry defines the
//     maximum "remember me" period (e.g. 7-30 days of inactivity).
//
// Q9: How does the frontend usually handle access-token expiry?
// A9: An HTTP interceptor (e.g. axios): on a 401 response it silently calls
//     /auth/refresh, stores the new access token, and retries the original
//     request. The user never notices.
//
// Q10: Why store only a hash of the refresh token in the database?
// A10: Same reason as passwords — if the DB leaks, attackers get hashes,
//      not usable tokens. On refresh, hash the presented token and compare.
// ─────────────────────────────────────────────────────────────────────────────
