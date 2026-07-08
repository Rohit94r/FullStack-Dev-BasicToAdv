// =============================================================================
// DAY 3 PROJECT — cache.js
// In-memory cache with TTL using closures (memoization pattern)
// Concepts: closures, Map, Date.now()
// =============================================================================

/**
 * Create a cache with time-to-live (TTL) in milliseconds.
 *
 * Usage:
 *   const cache = createCache({ ttlMs: 5000 });
 *   cache.set("user:1", { id: 1, name: "A" });
 *   cache.get("user:1"); // hit if within TTL, else undefined
 *
 * @param {{ ttlMs?: number }} options
 * @returns {{ get, set, has, delete, clear, size }}
 */
export function createCache(options = {}) {
  const { ttlMs = 60_000 } = options;

  // TODO: Use a closure — private Map to store { value, expiresAt }
  // Do NOT expose the Map directly
  // YOUR IDEA: _________________________________________________
  // ANSWER: const store = new Map();
  // _____________________

  function isExpired(entry) {
    // TODO: Return true if Date.now() > entry.expiresAt
    // YOUR IDEA: _________________________________________________
    // ANSWER: return Date.now() > entry.expiresAt;
    // _____________________
  }

  return {
    get(key) {
      // TODO: Look up key; if missing or expired → delete and return undefined
      // Otherwise return entry.value
      // YOUR IDEA: _________________________________________________
      // _____________________
    },

    set(key, value) {
      // TODO: Store { value, expiresAt: Date.now() + ttlMs }
      // YOUR IDEA: _________________________________________________
      // _____________________
    },

    has(key) {
      // TODO: Return true only if key exists AND not expired
      // YOUR IDEA: _________________________________________________
      // _____________________
    },

    delete(key) {
      // TODO: Remove key from store, return boolean
      // _____________________
    },

    clear() {
      // TODO: Clear the store
      // _____________________
    },

    get size() {
      // TODO: Return count of non-expired entries (optional: prune expired first)
      // _____________________
    },
  };
}

/**
 * Wrap an async function with caching by stringified args.
 *
 * @param {Function} fn — async function
 * @param {object} options — passed to createCache
 */
export function memoizeAsync(fn, options = {}) {
  const cache = createCache(options);

  // TODO: Return a new async function that:
  // 1. Builds cache key from JSON.stringify(args)
  // 2. Returns cached value on hit
  // 3. Calls fn(...args), stores result, returns it
  // YOUR IDEA: _________________________________________________
  //
  // ANSWER:
  // return async function (...args) {
  //   const key = JSON.stringify(args);
  //   if (cache.has(key)) return cache.get(key);
  //   const result = await fn(...args);
  //   cache.set(key, result);
  //   return result;
  // };
  // _____________________
}
