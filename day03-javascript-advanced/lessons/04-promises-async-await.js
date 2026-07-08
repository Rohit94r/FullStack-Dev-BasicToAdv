// ============================================================
// DAY 1 — JavaScript: PROMISES & ASYNC/AWAIT
// Interview Level: Beginner → Advanced
// ============================================================

// ─────────────────────────────────────────────────────────────
// WHY PROMISES? — The Callback Hell Problem
// ─────────────────────────────────────────────────────────────
// Before Promises, async operations used nested callbacks.
// This creates "Callback Hell" or "Pyramid of Doom":

// ❌ Callback Hell Example:
function callbackHell() {
  getUser(1, function (user) {
    getOrders(user.id, function (orders) {
      getProduct(orders[0].productId, function (product) {
        getReview(product.id, function (review) {
          // 4 levels deep — hard to read, error-prone!
          console.log(review);
        });
      });
    });
  });
}

// ✅ Promises solve this with .then() chaining:
// getUser(1)
//   .then(user => getOrders(user.id))
//   .then(orders => getProduct(orders[0].productId))
//   .then(product => getReview(product.id))
//   .then(review => console.log(review))
//   .catch(err => console.error(err));

// ─────────────────────────────────────────────────────────────
// SECTION 1: PROMISES — THE BASICS
// ─────────────────────────────────────────────────────────────
// A Promise is an object representing the EVENTUAL completion
// (or failure) of an async operation.
//
// Promise has 3 states:
//   1. PENDING   → initial state, operation in progress
//   2. FULFILLED → operation completed successfully (resolve called)
//   3. REJECTED  → operation failed (reject called)
//
// Once settled (fulfilled or rejected), state CANNOT change.

// ── 1A. Creating a Promise ────────────────────────────────────
const myPromise = new Promise(function (resolve, reject) {
  // This function runs IMMEDIATELY (synchronous)
  const success = true;

  if (success) {
    resolve("Data loaded!");     // fulfills the promise
  } else {
    reject(new Error("Failed!")); // rejects the promise
  }
});

// ── 1B. Consuming a Promise ───────────────────────────────────
myPromise
  .then(function (result) {
    console.log("Success:", result); // "Data loaded!"
    return result.toUpperCase();     // pass value to next .then
  })
  .then(function (uppercased) {
    console.log("Chained:", uppercased); // "DATA LOADED!"
  })
  .catch(function (error) {
    console.error("Error:", error.message); // handles rejection
  })
  .finally(function () {
    console.log("Always runs — cleanup here"); // always executes
  });

// ─────────────────────────────────────────────────────────────
// SECTION 2: SIMULATING ASYNC WITH setTimeout
// ─────────────────────────────────────────────────────────────
// In real apps you'd use fetch(), fs.readFile() etc.
// We simulate with setTimeout.

function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "Rohit", email: "rohit@example.com" });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 500); // simulates 500ms network delay
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Learning JS", userId },
        { id: 2, title: "Learning TS", userId },
      ]);
    }, 300);
  });
}

// ── 2A. Promise Chaining ──────────────────────────────────────
fetchUser(1)
  .then((user) => {
    console.log("User:", user.name);
    return fetchUserPosts(user.id); // return next promise
  })
  .then((posts) => {
    console.log("Posts:", posts.length);
  })
  .catch((err) => console.error("Error:", err.message));

// ─────────────────────────────────────────────────────────────
// SECTION 3: PROMISE STATIC METHODS
// ─────────────────────────────────────────────────────────────

// ── 3A. Promise.resolve() / Promise.reject() ──────────────────
// Create already-settled promises instantly
const resolved = Promise.resolve(42);
const rejected = Promise.reject(new Error("instant fail"));

resolved.then((v) => console.log("Resolved:", v)); // 42
rejected.catch((e) => console.log("Rejected:", e.message)); // "instant fail"

// ── 3B. Promise.all() — All must succeed ──────────────────────
// Runs ALL promises in PARALLEL.
// Resolves when ALL resolve. Rejects if ANY rejects.
const p1 = Promise.resolve("result1");
const p2 = new Promise((res) => setTimeout(() => res("result2"), 100));
const p3 = Promise.resolve("result3");

Promise.all([p1, p2, p3])
  .then((results) => {
    console.log("Promise.all:", results); // ["result1", "result2", "result3"]
  })
  .catch((err) => console.error("One failed:", err));

// ── 3C. Promise.allSettled() — Wait for ALL regardless ─────────
// Resolves when ALL settle (fulfilled or rejected).
// Never rejects. Returns array of { status, value/reason }.
const pa = Promise.resolve("success");
const pb = Promise.reject(new Error("fail"));
const pc = Promise.resolve("also success");

Promise.allSettled([pa, pb, pc]).then((results) => {
  results.forEach((r) => {
    if (r.status === "fulfilled") console.log("✅", r.value);
    if (r.status === "rejected")  console.log("❌", r.reason.message);
  });
  // ✅ success
  // ❌ fail
  // ✅ also success
});

// ── 3D. Promise.race() — First to settle wins ─────────────────
// Returns result of WHICHEVER promise settles first (success or fail)
const slow = new Promise((res) => setTimeout(() => res("slow"), 1000));
const fast = new Promise((res) => setTimeout(() => res("fast"), 100));

Promise.race([slow, fast]).then((winner) => {
  console.log("Race winner:", winner); // "fast"
});

// ── 3E. Promise.any() — First to FULFILL wins ─────────────────
// Like race() but ignores rejections — only cares about first success.
// Rejects only if ALL promises reject (AggregateError).
const fail1  = Promise.reject(new Error("err1"));
const fail2  = Promise.reject(new Error("err2"));
const winner = Promise.resolve("winner!");

Promise.any([fail1, fail2, winner]).then((result) => {
  console.log("Any:", result); // "winner!"
});

Promise.any([fail1, fail2]).catch((err) => {
  console.log("All failed:", err.constructor.name); // AggregateError
});

// ─────────────────────────────────────────────────────────────
// SECTION 4: ASYNC / AWAIT — Syntactic Sugar for Promises
// ─────────────────────────────────────────────────────────────
// async/await makes async code look like synchronous code.
// Under the hood, it's still Promises!

// Rules:
// 1. async function ALWAYS returns a Promise
// 2. await pauses the async function until the Promise settles
// 3. await can ONLY be used inside an async function

// ── 4A. Basic async/await ─────────────────────────────────────
async function loadUser() {
  // No callback hell, reads like sync code!
  const user  = await fetchUser(1);          // waits for promise
  const posts = await fetchUserPosts(user.id); // waits for promise
  console.log(`${user.name} has ${posts.length} posts`);
  return user; // async function wraps this in Promise.resolve()
}

loadUser(); // returns a Promise

// ── 4B. Error Handling with try/catch ─────────────────────────
async function loadUserSafe() {
  try {
    const user = await fetchUser(-1); // will reject
    console.log(user);
  } catch (error) {
    console.error("Caught:", error.message); // "Invalid user ID"
  } finally {
    console.log("Cleanup in finally block");
  }
}
loadUserSafe();

// ── 4C. Parallel with async/await ─────────────────────────────
// ❌ SLOW: Sequential (one waits for the other)
async function sequential() {
  const user1 = await fetchUser(1); // wait 500ms
  const user2 = await fetchUser(2); // wait ANOTHER 500ms → total 1000ms
  return [user1, user2];
}

// ✅ FAST: Parallel using Promise.all
async function parallel() {
  const [user1, user2] = await Promise.all([
    fetchUser(1), // both start at the SAME TIME → total ~500ms
    fetchUser(2),
  ]);
  return [user1, user2];
}

// ── 4D. Async/Await with loops ────────────────────────────────
// ❌ forEach does NOT work with await:
async function badLoop() {
  const ids = [1, 2, 3];
  ids.forEach(async (id) => {
    const user = await fetchUser(id); // await inside forEach is ignored!
    console.log(user); // may not print in order
  });
}

// ✅ Use for...of for sequential:
async function goodLoopSequential() {
  const ids = [1, 2, 3];
  for (const id of ids) {
    const user = await fetchUser(id); // awaits each one sequentially
    console.log(user.name);
  }
}

// ✅ Use Promise.all for parallel:
async function goodLoopParallel() {
  const ids = [1, 2, 3];
  const users = await Promise.all(ids.map((id) => fetchUser(id)));
  users.forEach((u) => console.log(u.name));
}

// ── 4E. await at top level (Node 14+ / ES Modules) ───────────
// In modern code with ES modules (.mjs or package.json "type": "module")
// you can use await at the top level without async wrapper:
// const result = await fetchUser(1); // top-level await

// ─────────────────────────────────────────────────────────────
// SECTION 5: ADVANCED PATTERNS
// ─────────────────────────────────────────────────────────────

// ── 5A. Promise wrapping callback-based functions ─────────────
// Promisifying: convert old callback API to promise
function readFileCallback(path, callback) {
  // simulates old-style callback (error-first pattern)
  setTimeout(() => callback(null, `content of ${path}`), 100);
}

function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    readFileCallback(path, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

readFilePromise("./file.txt").then(console.log); // "content of ./file.txt"

// ── 5B. Promise with timeout (race pattern) ───────────────────
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

withTimeout(fetchUser(1), 200) // 200ms timeout, fetchUser takes 500ms
  .then(console.log)
  .catch((err) => console.log("Timed out:", err.message));

// ── 5C. Retry logic with async/await ─────────────────────────
async function withRetry(fn, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`Attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw err; // rethrow after final attempt
    }
  }
}

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What is a Promise?
A: An object representing the eventual result of an async operation.
   Has 3 states: pending, fulfilled, rejected. Once settled, immutable.

Q: What's the difference between Promise.all and Promise.allSettled?
A: Promise.all    → rejects fast if any promise fails
   Promise.allSettled → waits for ALL, gives {status, value/reason} for each

Q: What's the difference between Promise.race and Promise.any?
A: Promise.race → first to SETTLE (fulfilled or rejected) wins
   Promise.any  → first to FULFILL wins (rejects only if ALL fail)

Q: How does async/await relate to Promises?
A: async/await is syntactic sugar for Promises.
   async function always returns a Promise.
   await pauses execution inside the async function until the Promise settles.

Q: Why doesn't await work inside forEach?
A: forEach is not async-aware. It fires all callbacks without waiting.
   Use for...of for sequential, or Promise.all + .map() for parallel.

Q: How do you run multiple async operations in parallel?
A: const [a, b] = await Promise.all([fetchA(), fetchB()]);
   This runs both at the same time vs awaiting them sequentially.

Q: What happens if you forget try/catch with await?
A: Unhandled promise rejection → in Node.js, process can crash.
   Always wrap await in try/catch or use .catch() on the returned promise.

Q: What is an unhandled promise rejection?
A: A rejected promise with no .catch() handler. Modern environments
   treat this as a fatal error (process exits in Node.js).
*/
