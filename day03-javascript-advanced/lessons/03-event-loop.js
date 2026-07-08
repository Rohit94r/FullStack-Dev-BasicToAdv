// ============================================================
// DAY 1 — JavaScript: EVENT LOOP, CALLBACK QUEUE & MICROTASK QUEUE
// Interview Level: Beginner → Advanced
// ============================================================

// KEY INSIGHT: JavaScript is SINGLE-THREADED — it can only do
// ONE thing at a time. But it handles async operations via the
// EVENT LOOP which manages multiple queues.

// ─────────────────────────────────────────────────────────────
// THE JAVASCRIPT RUNTIME — HOW IT WORKS
// ─────────────────────────────────────────────────────────────
//
//  ┌──────────────────────────────────────────────────┐
//  │               JS ENGINE (V8)                     │
//  │  ┌─────────────────┐  ┌───────────────────────┐  │
//  │  │   CALL STACK    │  │      MEMORY HEAP      │  │
//  │  │  (LIFO order)   │  │  (object storage)     │  │
//  │  └─────────────────┘  └───────────────────────┘  │
//  └──────────────────────────────────────────────────┘
//              ↕ Event Loop checks constantly
//  ┌──────────────────────────────────────────────────┐
//  │             WEB APIs / NODE APIs                 │
//  │   setTimeout, fetch, DOM events, fs.readFile     │
//  └──────────────────────────────────────────────────┘
//              ↓ Completed callbacks go to queues
//  ┌─────────────────────┐  ┌────────────────────────┐
//  │   MICROTASK QUEUE   │  │    CALLBACK QUEUE      │
//  │  (Promises, queueM) │  │  (setTimeout, setInt.) │
//  │  ← HIGHER PRIORITY  │  │  ← LOWER PRIORITY      │
//  └─────────────────────┘  └────────────────────────┘

// ─────────────────────────────────────────────────────────────
// SECTION 1: CALL STACK
// ─────────────────────────────────────────────────────────────
// Call stack = where JS tracks what function is being executed.
// LIFO = Last In, First Out (like a stack of plates).

function third()  { console.log("third"); }
function second() { third(); console.log("second"); }
function first()  { second(); console.log("first"); }

// When first() is called:
// Stack: [first] → [first, second] → [first, second, third]
// third() returns → [first, second]
// second() returns → [first]
// first() returns → []
first();

// ─────────────────────────────────────────────────────────────
// SECTION 2: THE CALLBACK QUEUE (Macrotask Queue)
// ─────────────────────────────────────────────────────────────
// setTimeout, setInterval, setImmediate(Node), DOM events
// Their callbacks go into the CALLBACK QUEUE (also called Macrotask Queue).
// The event loop moves them to the call stack ONLY when the stack is EMPTY.

console.log("1 — synchronous start");

setTimeout(function () {
  // Goes to Callback Queue after 0ms delay
  // But won't run until call stack is empty!
  console.log("3 — setTimeout callback (macrotask)");
}, 0);

console.log("2 — synchronous end");

// OUTPUT ORDER:
// 1 — synchronous start
// 2 — synchronous end
// 3 — setTimeout callback (macrotask)  ← runs AFTER sync code!

// ─────────────────────────────────────────────────────────────
// SECTION 3: MICROTASK QUEUE
// ─────────────────────────────────────────────────────────────
// Promises (.then/.catch/.finally) and queueMicrotask()
// go into the MICROTASK QUEUE.
// HIGHER PRIORITY than callback queue!
// Event loop drains ALL microtasks before processing next macrotask.

console.log("--- Microtask Demo ---");

console.log("A — sync");

setTimeout(() => console.log("D — setTimeout (macrotask)"), 0);

Promise.resolve()
  .then(() => console.log("B — Promise microtask 1"))
  .then(() => console.log("C — Promise microtask 2"));

console.log("A2 — sync");

// OUTPUT ORDER:
// A — sync
// A2 — sync           ← all sync runs first
// B — Promise microtask 1  ← microtasks drain fully
// C — Promise microtask 2  ← this microtask was queued by B's .then
// D — setTimeout (macrotask) ← macrotask runs last

// ─────────────────────────────────────────────────────────────
// SECTION 4: EVENT LOOP — THE FULL PICTURE
// ─────────────────────────────────────────────────────────────
// Event Loop Algorithm (simplified):
// 1. Execute all synchronous code (call stack empties)
// 2. Drain ALL microtasks (Promise .then callbacks) — repeat until empty
// 3. Execute ONE macrotask (setTimeout callback)
// 4. Drain ALL microtasks again
// 5. Render (browser only)
// 6. Go to step 3

console.log("--- Full Event Loop Order ---");

// Macrotask 1 (the script itself):
console.log("Script start");                             // 1

setTimeout(() => console.log("setTimeout 1"), 0);       // Macrotask queue
setTimeout(() => console.log("setTimeout 2"), 0);       // Macrotask queue

Promise.resolve()
  .then(() => {
    console.log("Promise 1");                           // Microtask
    return Promise.resolve();
  })
  .then(() => console.log("Promise 2"));               // Microtask (queued by Promise 1)

Promise.resolve().then(() => console.log("Promise 3")); // Microtask

console.log("Script end");                              // 2

// FULL OUTPUT ORDER:
// Script start          (sync)
// Script end            (sync)
// Promise 1             (microtask — highest priority)
// Promise 3             (microtask)
// Promise 2             (microtask — queued after Promise 1 resolved)
// setTimeout 1          (macrotask)
// setTimeout 2          (macrotask)

// ─────────────────────────────────────────────────────────────
// SECTION 5: queueMicrotask() — Manual Microtask
// ─────────────────────────────────────────────────────────────
// You can manually queue a microtask using queueMicrotask()
// It has same priority as Promise.then()

console.log("--- queueMicrotask ---");
console.log("sync 1");
queueMicrotask(() => console.log("microtask via queueMicrotask"));
console.log("sync 2");
// Output: sync 1, sync 2, microtask via queueMicrotask

// ─────────────────────────────────────────────────────────────
// SECTION 6: STARVATION — Microtasks blocking Macrotasks
// ─────────────────────────────────────────────────────────────
// If microtasks keep adding more microtasks → macrotasks never run!
// This is called "callback starvation" or "task starvation"

// DANGEROUS — this would block the event loop:
// function infiniteMicrotask() {
//   Promise.resolve().then(infiniteMicrotask); // keeps adding to microtask queue
// }
// infiniteMicrotask(); // setTimeout would NEVER run!

// ─────────────────────────────────────────────────────────────
// SECTION 7: PRACTICAL EXAMPLES
// ─────────────────────────────────────────────────────────────

// ── Example: Order of execution quiz (common interview question) ──
function runAllThree() {
  console.log("=== Quiz ===");

  setTimeout(() => console.log("timeout"), 0);     // macrotask

  new Promise((resolve) => {
    console.log("promise executor"); // SYNC! This runs immediately
    resolve();
  }).then(() => console.log("promise .then"));      // microtask

  console.log("after promise");                    // sync

  // Output:
  // "=== Quiz ==="
  // "promise executor"  ← Promise constructor body is SYNC
  // "after promise"
  // "promise .then"     ← microtask
  // "timeout"           ← macrotask
}
runAllThree();

// ── Example: setTimeout vs setInterval ───────────────────────
// setTimeout  → fires ONCE after delay
// setInterval → fires REPEATEDLY every delay ms

const timerId = setInterval(() => {
  console.log("interval tick");
}, 1000);

// Stop after 3 ticks (in real code you'd do this after 3000ms)
// clearInterval(timerId); // clears the interval

// ─────────────────────────────────────────────────────────────
// SECTION 8: ASYNC OPERATIONS — WHERE DOES THE WORK HAPPEN?
// ─────────────────────────────────────────────────────────────
// JS itself is single-threaded but the browser/Node provides
// Web APIs / Node APIs that run in SEPARATE THREADS (C++ threads in Node).
//
// Flow:
// 1. JS calls setTimeout(fn, 1000) → hands off to Web API
// 2. Web API counts 1000ms (in background thread)
// 3. After 1000ms, Web API puts fn into Callback Queue
// 4. Event Loop sees stack is empty → moves fn to Call Stack
// 5. fn executes
//
// This is why JS can handle I/O without blocking!

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
/*
Q: What is the Event Loop?
A: A mechanism that continuously checks if the Call Stack is empty.
   If it is, it moves tasks from the Microtask Queue (first) or
   Callback Queue (second) to the Call Stack for execution.

Q: What is the difference between Microtask and Macrotask queue?
A: Microtask Queue: Promise .then/.catch, queueMicrotask() — HIGHER priority
   Macrotask Queue: setTimeout, setInterval, I/O — LOWER priority
   Event loop drains ALL microtasks before processing one macrotask.

Q: Why does setTimeout with 0ms delay not run immediately?
A: Even with 0ms, the callback goes to the Macrotask Queue.
   It runs only after: current sync code + all microtasks are done.

Q: Is JavaScript single-threaded?
A: The JS ENGINE runs on one thread. But browsers/Node.js provide
   Web/Node APIs that run in parallel (separate threads), sending
   callbacks back through the queues when done.

Q: What is call stack overflow?
A: When functions call each other too deeply (infinite recursion),
   the call stack runs out of space → "Maximum call stack size exceeded"

Q: What is task starvation?
A: Microtasks keep adding more microtasks endlessly, so macrotasks
   (setTimeout etc.) never get a chance to execute.

Q: What is the order of execution?
A: 1. Synchronous code
   2. Microtasks (all of them, drain fully)
   3. One macrotask
   4. Microtasks again (drain fully)
   5. Next macrotask...
*/
