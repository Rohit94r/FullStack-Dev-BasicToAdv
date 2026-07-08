// ─────────────────────────────────────────────────────────────────────────────
// LESSON 02 — JWT (JSON WEB TOKENS) EXPLAINED (basic → advanced)
// ─────────────────────────────────────────────────────────────────────────────
//
// HOW TO RUN:
//   npm install jsonwebtoken @types/jsonwebtoken   (ts-node + typescript too)
//   npx ts-node 02-jwt-explained.ts
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 1 — THE PROBLEM JWT SOLVES (basic)
// ─────────────────────────────────────────────────────────────────────────────
//
// HTTP is STATELESS: every request is a stranger. The server does not remember
// that you logged in 5 seconds ago. So after login, how does the server know
// it's still you on the next request?
//
// OLD ANSWER — SESSIONS:
//   Server creates a random ID, stores "session abc123 = user 42" in ITS OWN
//   memory/database, and gives you the ID in a cookie. Every request, the
//   server looks the ID up.
//   Analogy: a coat-check ticket. The ticket itself says nothing; the cloak
//   room (server) keeps the list of which ticket belongs to which coat.
//   Downside: the server must STORE and LOOK UP every session. With millions
//   of users and multiple servers, that shared session store becomes work.
//
// NEW ANSWER — JWT:
//   The server writes your identity ON the ticket itself and SIGNS it so
//   nobody can forge it.
//   Analogy: a passport. The passport itself contains your name and photo,
//   plus official stamps (the signature) that are very hard to fake. Any
//   border officer (any server) can check it WITHOUT phoning the government.
//   This is what "STATELESS" means: the server stores NOTHING per user.
//   All the info travels inside the token, and the signature proves it's real.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 2 — THE 3 PARTS: header.payload.signature (basic)
// ─────────────────────────────────────────────────────────────────────────────
//
// A JWT is just a string with two dots in it:
//
//   eyJhbGciOiJIUzI1NiJ9 . eyJ1c2VySWQiOjQyfQ . SflKxwRJSMeKKF2QT4fwpM
//   └────── header ─────┘ └──── payload ────┘ └───── signature ─────┘
//
// 1. HEADER  — metadata: which algorithm was used (e.g. HS256).
// 2. PAYLOAD — the actual data ("claims"): user id, role, expiry time.
// 3. SIGNATURE — a cryptographic stamp computed as:
//        HMAC_SHA256( base64(header) + "." + base64(payload), SECRET )
//    Only someone who knows the SECRET can produce a valid signature.
//
// ⚠️ THE MOST IMPORTANT FACT ABOUT JWT:
//   Header and payload are only BASE64-ENCODED, not encrypted.
//   Base64 is like writing in a different alphabet — anyone can convert it
//   back. So:
//     ✅ Anyone can READ a JWT payload (never put passwords/secrets in it!)
//     ❌ Nobody can MODIFY it without breaking the signature,
//        because they don't know the server's secret.
//   Reading ≠ forging. That's the whole design.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 3 — RUNNABLE CODE: sign, decode, verify, tamper, expire
// ─────────────────────────────────────────────────────────────────────────────

import jwt from "jsonwebtoken";

// In a real app this comes from an environment variable, NEVER from code.
const SECRET = "super-secret-key-do-not-commit";

function section(title: string) {
  console.log("\n─── " + title + " " + "─".repeat(Math.max(0, 50 - title.length)));
}

// ── 3a. SIGNING (creating) a token ──
section("1. SIGN");
const token = jwt.sign(
  { userId: 42, role: "admin" },   // payload (claims we choose)
  SECRET,                          // secret used to build the signature
  { expiresIn: "15m" }             // adds an "exp" claim automatically
);
console.log(token);

// ── 3b. DECODING a real token WITHOUT the secret ──
// This proves the payload is readable by anyone. We split the string on "."
// and base64-decode part 2. No secret needed!
section("2. DECODE BY HAND (no secret!)");
const [headerB64, payloadB64] = token.split(".");
console.log("header :", JSON.parse(Buffer.from(headerB64, "base64url").toString()));
console.log("payload:", JSON.parse(Buffer.from(payloadB64, "base64url").toString()));
// You will see: { userId: 42, role: 'admin', iat: ..., exp: ... }
//   iat = "issued at" (seconds since 1970)
//   exp = "expires at"
// Paste any JWT into https://jwt.io and it does exactly this.

// ── 3c. VERIFYING (the server-side check) ──
// verify() recomputes the signature with the secret and compares. It also
// checks the exp claim. If both pass, we can TRUST the payload.
section("3. VERIFY");
const verified = jwt.verify(token, SECRET);
console.log("verified payload:", verified);

// ── 3d. TAMPERING — why forging fails ──
// Let's edit the payload to claim userId 999 and reattach the ORIGINAL
// signature. verify() must reject it, because the signature was computed
// over the OLD payload.
section("4. TAMPER (attack simulation)");
const fakePayload = Buffer.from(JSON.stringify({ userId: 999, role: "admin" }))
  .toString("base64url");
const tampered = `${headerB64}.${fakePayload}.${token.split(".")[2]}`;
try {
  jwt.verify(tampered, SECRET);
  console.log("❌ this should never print");
} catch (err) {
  console.log("✅ rejected:", (err as Error).message); // "invalid signature"
}

// ── 3e. EXPIRY ──
section("5. EXPIRY");
const shortToken = jwt.sign({ userId: 42 }, SECRET, { expiresIn: "1s" });
setTimeout(() => {
  try {
    jwt.verify(shortToken, SECRET);
  } catch (err) {
    console.log("✅ expired token rejected:", (err as Error).message);
    // WHY expiry matters: a JWT cannot be "deleted" from the server (the
    // server stores nothing!). If a token is stolen, expiry is the ONLY
    // built-in thing that limits the damage. That's why access tokens are
    // short-lived (minutes) — see lesson 04 for the refresh-token pattern.
  }
}, 1500);

// ─────────────────────────────────────────────────────────────────────────────
// PART 4 — STATELESS: THE REAL MEANING (intermediate)
// ─────────────────────────────────────────────────────────────────────────────
//
// "Stateless" = the server keeps NO record of issued tokens.
// Verification needs only two things: the token and the secret.
//
// Consequences (know these for interviews):
//   ✅ Scales beautifully: 50 servers can all verify tokens independently;
//      no shared session database, no lookup per request.
//   ❌ You cannot easily "log someone out" server-side. The token stays
//      valid until it expires, even if you want to revoke it NOW.
//      Workarounds: short expiry + refresh tokens (lesson 04), or a token
//      blocklist (which quietly reintroduces state — a common trade-off
//      question).
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 5 — ALGORITHMS: HS256 vs RS256 (advanced)
// ─────────────────────────────────────────────────────────────────────────────
//
// HS256 (what we used): ONE shared secret signs AND verifies.
//   Fine when the same app does both. Risk: anyone who can verify can also
//   forge, because it's the same key.
//
// RS256: a PRIVATE key signs, a PUBLIC key verifies.
//   Used in microservices / third-party login (Google, Auth0): the auth
//   server keeps the private key; every other service gets only the public
//   key, so they can verify tokens but never create them.
//
// Classic vulnerability to mention: some old libraries accepted a token whose
// header said "alg": "none" (no signature at all!). Modern libraries reject
// this, and you should always pass an explicit allowed-algorithms list:
//   jwt.verify(token, SECRET, { algorithms: ["HS256"] })
//
// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────────────────────
//
// Q1: What are the 3 parts of a JWT?
// A1: header (algorithm info), payload (claims: userId, role, exp), and
//     signature (HMAC/RSA over the first two parts using a secret/private
//     key). They are joined with dots: header.payload.signature.
//
// Q2: Can the client read the JWT payload? Can it modify it?
// A2: Read: YES — it is only base64-encoded, anyone can decode it. Modify:
//     effectively NO — any change breaks the signature, and the client
//     cannot re-sign without the server's secret.
//
// Q3: What does "stateless authentication" mean?
// A3: The server stores nothing per logged-in user. All identity info is
//     inside the signed token, so any server can verify a request using only
//     the secret — no session store or DB lookup.
//
// Q4: JWT vs sessions — trade-offs?
// A4: Sessions: server stores state, easy instant revocation, but needs a
//     shared session store to scale. JWT: no server storage, scales easily,
//     but revocation is hard — you rely on short expiry or a blocklist.
//
// Q5: How do you log a user out with JWTs?
// A5: You can't invalidate a signed token remotely. Options: keep access
//     tokens very short-lived and revoke the refresh token server-side, or
//     maintain a blocklist of revoked token IDs (sacrificing statelessness).
//
// Q6: What are iat and exp?
// A6: Standard claims: iat = issued-at timestamp, exp = expiry timestamp
//     (seconds since 1970). verify() rejects tokens past exp.
//
// Q7: Why should access tokens be short-lived?
// A7: A stolen JWT works until it expires — the server can't take it back.
//     Short expiry (5-15 min) limits the damage window; refresh tokens
//     restore convenience.
//
// Q8: HS256 vs RS256?
// A8: HS256 = symmetric, one shared secret signs and verifies. RS256 =
//     asymmetric, private key signs, public key verifies — better when other
//     services must verify tokens but must not be able to create them.
//
// Q9: What should you never put in a JWT payload?
// A9: Anything secret: passwords, API keys, sensitive personal data. The
//     payload is readable by anyone who holds the token.
//
// Q10: What is the "alg: none" attack?
// A10: Old libraries trusted the header's algorithm field; attackers set it
//      to "none" and sent unsigned tokens that got accepted. Fix: pin the
//      allowed algorithms explicitly when calling verify().
// ─────────────────────────────────────────────────────────────────────────────
