// =============================================================================
// DAY 3 PROJECT — Async Data Pipeline (fill-in-the-blank)
// Run: npm start   (or: node src/index.js)
// Simulates backend async work: retry, cache, batch, compose
// =============================================================================

import { fetchUser, fetchPosts, fetchWithRetry } from "./fetchWithRetry.js";
import { createCache, memoizeAsync } from "./cache.js";
import { createQueue, runBatch, PipelineEvents } from "./queue.js";

const events = new PipelineEvents();

// ── PIPELINE COMPOSER (HOF + compose) ─────────────────────────────────────────

/**
 * Compose functions right-to-left: pipe(a, b, c)(x) === c(b(a(x)))
 * Each fn can be sync or async — use async/await inside.
 */
export function pipe(...fns) {
  // TODO: Return a function that passes value through each fn in order
  // Hint: reduce with async — await each step
  // YOUR IDEA: _________________________________________________
  //
  // ANSWER:
  // return async (input) => {
  //   let result = input;
  //   for (const fn of fns) {
  //     result = await fn(result);
  //   }
  //   return result;
  // };
  // _____________________
}

// ── PIPELINE STEPS ────────────────────────────────────────────────────────────

async function loadUser(userId) {
  events.log("fetch_start", { userId });
  const user = await fetchWithRetry(() => fetchUser(userId), {
    maxRetries: 2,
    baseDelayMs: 50,
    timeoutMs: 800,
  });
  events.log("fetch_done", { userId, name: user.name });
  return user;
}

async function enrichUser(user) {
  // TODO: Call fetchPosts(user.id) with fetchWithRetry
  // Return { ...user, posts }
  // YOUR IDEA: _________________________________________________
  // _____________________
}

async function saveUser(user) {
  // Simulated persist — just log and return
  events.log("save", { id: user.id, postCount: user.posts?.length ?? 0 });
  return user;
}

// ── CACHED FETCH ──────────────────────────────────────────────────────────────

// TODO: Wrap loadUser with memoizeAsync and createCache({ ttlMs: 3000 })
// const cachedLoadUser = memoizeAsync(loadUser, { ttlMs: 3000 });
// _____________________

// ── MAIN DEMO ─────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Async Pipeline Demo ===\n");

  // ── 1. Single user through pipe ─────────────────────────────────────────────
  console.log("--- 1. pipe(loadUser, enrichUser, saveUser) ---");

  // TODO: Build pipeline with pipe() and run for userId 1
  // const runPipeline = pipe(______, ______, ______);
  // const result = await runPipeline(1);
  // console.log("Result:", result);
  // _____________________

  // ── 2. Batch fetch with rate limit ──────────────────────────────────────────
  console.log("\n--- 2. Batch users (max 2 concurrent) ---");

  const userIds = [1, 2, 3, 4, 5];
  const tasks = userIds.map(
    (id) => () => fetchWithRetry(() => fetchUser(id), { maxRetries: 2 })
  );

  // TODO: Call runBatch(tasks, 2) and log fulfilled vs rejected counts
  // YOUR IDEA: _________________________________________________
  // _____________________

  // ── 3. Cache demo ───────────────────────────────────────────────────────────
  console.log("\n--- 3. Cache hit (same user twice) ---");

  // TODO: Call cachedLoadUser(1) twice — second should be faster (cache hit)
  // Log timing with console.time / console.timeEnd
  // _____________________

  console.log("\n=== Done ===");
}

// TODO: Run main and catch errors
// main().catch((err) => {
//   console.error("Pipeline failed:", err.message);
//   process.exit(1);
// });
