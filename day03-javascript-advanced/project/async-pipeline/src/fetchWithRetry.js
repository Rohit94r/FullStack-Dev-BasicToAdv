// =============================================================================
// DAY 3 PROJECT — fetchWithRetry.js
// Retry wrapper with exponential backoff + optional timeout via Promise.race
// Concepts: Promises, async/await, closures
// =============================================================================

/**
 * Sleep for ms milliseconds (returns a Promise).
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrap fn so failures are retried with exponential backoff.
 *
 * @param {Function} fn — async function to call (no args)
 * @param {object} options
 * @param {number} options.maxRetries — total attempts minus 1 (default 3)
 * @param {number} options.baseDelayMs — first delay before retry (default 100)
 * @param {number|null} options.timeoutMs — if set, race fn against a timeout
 * @returns {Promise<any>}
 */
export async function fetchWithRetry(fn, options = {}) {
  const { maxRetries = 3, baseDelayMs = 100, timeoutMs = null } = options;

  // TODO: Loop attempt from 0 to maxRetries (inclusive)
  // Try calling fn() — optionally wrapped in timeout race
  // On success → return result
  // On failure → if last attempt, rethrow; else wait baseDelayMs * 2^attempt
  // YOUR IDEA: _________________________________________________
  //
  // ANSWER (core loop):
  // for (let attempt = 0; attempt <= maxRetries; attempt++) {
  //   try {
  //     const run = () => fn();
  //     const result = timeoutMs
  //       ? await Promise.race([run(), sleep(timeoutMs).then(() => { throw new Error("Timeout"); })])
  //       : await run();
  //     return result;
  //   } catch (err) {
  //     if (attempt === maxRetries) throw err;
  //     const delay = baseDelayMs * Math.pow(2, attempt);
  //     await sleep(delay);
  //   }
  // }
  // _____________________
}

/**
 * Fake API: fetch a user by id (random delay + ~30% failure rate).
 */
export function fetchUser(id) {
  return new Promise((resolve, reject) => {
    const delay = 100 + Math.random() * 400;
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error(`fetchUser(${id}) failed`));
        return;
      }
      resolve({ id, name: `User ${id}`, email: `user${id}@example.com` });
    }, delay);
  });
}

/**
 * Fake API: fetch posts for a user (random delay + ~20% failure rate).
 */
export function fetchPosts(userId) {
  return new Promise((resolve, reject) => {
    const delay = 80 + Math.random() * 300;
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(new Error(`fetchPosts(${userId}) failed`));
        return;
      }
      resolve([
        { id: 1, userId, title: "Hello World" },
        { id: 2, userId, title: "Async is fun" },
      ]);
    }, delay);
  });
}
