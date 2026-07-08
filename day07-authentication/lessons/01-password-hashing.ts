// ─────────────────────────────────────────────────────────────────────────────
// LESSON 01 — PASSWORD HASHING (basic → advanced)
// ─────────────────────────────────────────────────────────────────────────────
//
// HOW TO RUN THIS FILE:
//   1. In this lessons/ folder run:  npm init -y && npm install bcrypt ts-node typescript @types/node @types/bcrypt
//   2. Then run:                     npx ts-node 01-password-hashing.ts
//   (Or copy pieces into the day07 project, which already has bcrypt installed.)
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 1 — WHY STORING PLAINTEXT PASSWORDS IS DEADLY (basic)
// ─────────────────────────────────────────────────────────────────────────────
//
// Imagine you write every user's password in a notebook, exactly as they typed
// it. Now imagine a thief steals the notebook. Every single account is
// instantly broken. Worse: people REUSE passwords, so the thief can now log in
// to their email, bank, everything.
//
// This happens in real life. Databases get leaked ALL the time (hacks, backups
// left public, angry employees). So the rule is:
//
//   ✅ NEVER store the password itself. Store something derived from it that
//      cannot be turned back into the password.
//
// That "something" is a HASH.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 2 — WHAT IS A HASH? (basic)
// ─────────────────────────────────────────────────────────────────────────────
//
// A hash function is a one-way blender:
//
//   "banana123"  →  [BLENDER]  →  "a8f5f167f44f4964e6c998dee827110c"
//
// Properties:
//   1. Same input ALWAYS gives the same output (deterministic).
//   2. You CANNOT un-blend it. There is no reverse function.
//   3. A tiny input change gives a totally different output
//      ("banana123" vs "banana124" → completely different hashes).
//
// So on registration we store hash("banana123").
// On login the user types their password again, we hash what they typed,
// and compare the two hashes. If they match → correct password.
// We verified the password WITHOUT ever storing it. That is the whole trick.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 3 — WHY PLAIN SHA-256/MD5 IS NOT ENOUGH (intermediate)
// ─────────────────────────────────────────────────────────────────────────────
//
// Problem A: RAINBOW TABLES (precomputed answers)
//   Fast hashes like MD5/SHA-256 were designed to be FAST. Attackers have
//   already hashed billions of common passwords and saved the results in giant
//   lookup tables ("rainbow tables"). If your DB leaks and it contains
//   sha256("password123"), the attacker just looks it up — instant crack.
//
// Problem B: SPEED ITSELF
//   A GPU can compute billions of SHA-256 hashes per second. Brute-forcing
//   short passwords becomes trivial when the hash is that cheap.
//
// The two fixes:
//   1. SALT   → defeats rainbow tables.
//   2. SLOWNESS (cost/rounds) → defeats brute force.
//
// bcrypt gives us both, which is why we use it instead of SHA-256.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 4 — SALT, EXPLAINED WITH FOOD (intermediate)
// ─────────────────────────────────────────────────────────────────────────────
//
// A salt is a RANDOM string mixed into the password before hashing.
//
//   hash("banana123" + "xK9#pQ")   ← salt makes the input unique
//
// Analogy: two chefs cook the same recipe (same password), but each adds their
// own secret spice (salt). The final dishes (hashes) taste completely
// different. A "taste lookup table" (rainbow table) becomes useless because
// every dish is unique.
//
// Important facts about salt:
//   - The salt is NOT secret. bcrypt stores it inside the hash string itself.
//   - Its job is only to make every hash UNIQUE, so precomputed tables fail
//     and two users with the same password get different hashes.
//   - bcrypt generates a fresh random salt automatically on every hash() call.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 5 — ROUNDS / COST FACTOR (intermediate)
// ─────────────────────────────────────────────────────────────────────────────
//
// bcrypt takes a "cost" number (also called rounds). Cost 10 means the
// internal work is repeated 2^10 = 1024 times. Each +1 DOUBLES the time.
//
//   cost 10  → ~50-100ms per hash   ← common default, good for most apps
//   cost 12  → ~250-400ms per hash  ← more secure, slower logins
//
// WHY slow is good here (it feels backwards!):
//   - For YOU: hashing happens once per login. 100ms is invisible to a user.
//   - For an ATTACKER: they must hash BILLIONS of guesses. At 100ms per guess
//     a brute-force attack that took 1 hour with SHA-256 now takes centuries.
//
// You are buying security with CPU time. The cost knob lets you keep raising
// the price as computers get faster.
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 6 — RUNNABLE CODE
// ─────────────────────────────────────────────────────────────────────────────

import bcrypt from "bcrypt";

async function main() {
  const password = "banana123";

  // 1. HASH the password. 10 = cost factor (2^10 internal rounds).
  //    bcrypt generates a random salt for us automatically.
  const hash1 = await bcrypt.hash(password, 10);
  const hash2 = await bcrypt.hash(password, 10);

  console.log("hash1:", hash1);
  console.log("hash2:", hash2);
  // Notice: SAME password, but hash1 !== hash2, because each got a
  // different random salt. This is exactly what defeats rainbow tables.

  // 2. READ the hash format. A bcrypt hash is self-describing:
  //
  //    $2b$10$N9qo8uLOickgx2ZMRZoMye.IjZAgcfl7p92ldGxad68LJZdL17lhW
  //    └┬─┘└┬┘└──────────┬──────────┘└────────────┬───────────────┘
  //  algorithm cost     salt (22 chars)          the actual hash
  //
  //    Everything needed to verify later (algorithm, cost, salt) is stored
  //    IN the string. That's why we don't need a separate salt column.

  // 3. VERIFY on login. compare() extracts the salt+cost from the stored
  //    hash, hashes the typed password the same way, and compares.
  const correct = await bcrypt.compare("banana123", hash1);
  const wrong = await bcrypt.compare("banana124", hash1);
  console.log("correct password matches:", correct); // true  ✅
  console.log("wrong password matches:  ", wrong);   // false ❌

  // 4. MEASURE the cost factor. Watch the time double as cost goes up.
  for (const cost of [8, 10, 12]) {
    const start = Date.now();
    await bcrypt.hash(password, cost);
    console.log(`cost ${cost}: ${Date.now() - start}ms`);
  }
}

main();

// ─────────────────────────────────────────────────────────────────────────────
// PART 7 — TIMING ATTACKS (advanced)
// ─────────────────────────────────────────────────────────────────────────────
//
// A timing attack: the attacker measures HOW LONG your server takes to answer
// and learns secrets from the difference.
//
// Example with a naive string compare (===): JavaScript stops comparing at the
// first different character. So comparing "aaaa" vs "abcd" returns faster than
// "abca" vs "abcd". By measuring response times millions of times, an attacker
// can guess a secret character by character.
//
// Defenses you should know:
//   1. bcrypt.compare() is designed to be constant-time — it does not exit
//      early, so response time leaks nothing about how "close" a guess was.
//   2. For comparing raw tokens/secrets yourself, use
//      crypto.timingSafeEqual() from Node's crypto module, never ===.
//   3. On login, when the EMAIL does not exist, still run a dummy bcrypt
//      compare. Otherwise "user not found" replies in 1ms and "wrong
//      password" replies in 100ms — the time difference tells attackers
//      which emails are registered (user enumeration).
//
// ─────────────────────────────────────────────────────────────────────────────
// PART 8 — WHAT ABOUT ARGON2? (advanced, good interview bonus)
// ─────────────────────────────────────────────────────────────────────────────
//
// bcrypt is battle-tested and fine. The newer recommendation is Argon2
// (winner of the 2015 Password Hashing Competition). Its advantage: it is
// MEMORY-hard, not just CPU-hard. GPUs have thousands of cores but limited
// memory per core, so forcing each hash to use e.g. 64MB of RAM makes GPU
// cracking farms much less effective. If you start a new project and can use
// it, Argon2id is the modern choice; bcrypt remains a solid, safe answer.
//
// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────────────────────
//
// Q1: How do you store passwords securely?
// A1: Never store the password itself. Store a hash produced by a slow,
//     salted algorithm like bcrypt (or Argon2). On login, hash the typed
//     password and compare with the stored hash.
//
// Q2: What is a hash function?
// A2: A one-way function: same input always gives the same output, but you
//     cannot compute the input back from the output. Used to verify data
//     without storing it.
//
// Q3: What is a salt and why do we need it?
// A3: A random value mixed into the password before hashing. It makes every
//     hash unique, so precomputed rainbow tables fail and two users with the
//     same password get different hashes. It is stored with the hash and is
//     not secret.
//
// Q4: Why bcrypt instead of SHA-256 for passwords?
// A4: SHA-256 is designed to be fast — great for checksums, terrible for
//     passwords because attackers can try billions of guesses per second.
//     bcrypt is deliberately slow and has a tunable cost factor, plus
//     built-in salting.
//
// Q5: What does the bcrypt cost factor (rounds) mean?
// A5: The work is repeated 2^cost times. Each +1 doubles the hashing time.
//     Typical value is 10-12: fast enough for one login, brutally slow for
//     billions of brute-force guesses.
//
// Q6: Two users have the same password. Are their bcrypt hashes the same?
// A6: No — each hash gets a fresh random salt, so the stored strings differ.
//
// Q7: Where is the salt stored?
// A7: Inside the bcrypt hash string itself ($2b$cost$salt+hash). compare()
//     extracts it automatically.
//
// Q8: What is a timing attack and how do you prevent it?
// A8: Attacker learns secrets by measuring response-time differences.
//     Prevent with constant-time comparison (bcrypt.compare,
//     crypto.timingSafeEqual) and by doing equal work on "user not found"
//     vs "wrong password" paths.
//
// Q9: Can you decrypt a bcrypt hash?
// A9: No. Hashing is not encryption — there is no key and no reverse
//     operation. The only "attack" is guessing inputs and comparing outputs.
//
// Q10: What is Argon2 and why is it recommended?
// A10: A modern password hashing algorithm that is memory-hard as well as
//      CPU-hard, which makes GPU/ASIC cracking farms far less effective.
//      Argon2id is the current best-practice choice for new systems.
// ─────────────────────────────────────────────────────────────────────────────
