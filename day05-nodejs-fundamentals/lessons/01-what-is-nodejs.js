// ============================================================
// DAY 5 — LESSON 1: WHAT IS NODE.JS?
// Level: Absolute Basic → Intermediate
// Run with:  node 01-what-is-nodejs.js
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: WHAT IS NODE.JS? (the one-sentence answer)
// ─────────────────────────────────────────────────────────────
//
// Node.js = a program that lets JavaScript run OUTSIDE the browser.
//
// ANALOGY: JavaScript is like a fish. The browser was its aquarium.
// Node.js is a new aquarium built for your computer, so the same
// fish (JS) can now swim on servers, laptops, anywhere.
//
// Technically, Node.js is:
//   1. Google's V8 engine (the same JS engine Chrome uses)
//      → V8 reads your JS text and turns it into fast machine code.
//   2. + libuv (a C library that gives access to files, network,
//      timers, and runs the EVENT LOOP)
//   3. + built-in modules (fs, http, path, os ...) so JS can talk
//      to the operating system.
//
// Browser JS:  window, document, alert, DOM        → for web pages
// Node.js:     fs, http, process, __dirname, os    → for servers
// BOTH share:  the language itself (functions, promises, classes)

// ─────────────────────────────────────────────────────────────
// SECTION 2: WHY DOES NODE EXIST? (blocking vs non-blocking I/O)
// ─────────────────────────────────────────────────────────────
//
// I/O = Input/Output = reading files, talking to databases,
// receiving network requests. I/O is SLOW compared to CPU work.
//
// ANALOGY: A restaurant.
//   BLOCKING waiter: takes your order, walks to the kitchen, and
//     STANDS THERE waiting until your food is cooked. Other tables
//     get no service. To serve 10 tables you need 10 waiters (threads).
//   NON-BLOCKING waiter (Node): takes your order, gives it to the
//     kitchen, immediately serves other tables. When the kitchen
//     rings the bell (callback / event), he delivers the food.
//     ONE waiter serves many tables.
//
// Node uses ONE main thread + the event loop. It never "stands
// and waits" for I/O — it registers a callback and moves on.
// That is why Node can handle thousands of connections cheaply.

// ─────────────────────────────────────────────────────────────
// SECTION 3: NODE GLOBALS (things that exist without importing)
// ─────────────────────────────────────────────────────────────

// 3a. globalThis — the global object.
// In the browser the global object is `window`.
// In Node it is `global` (and `globalThis` works in BOTH).
console.log(typeof globalThis); // Expected output: "object"
console.log(typeof window); // Expected output: "undefined"  ← no browser here!

// 3b. console — works like in the browser, but prints to the TERMINAL.
console.log("Hello from Node!"); // Expected output: Hello from Node!

// 3c. __dirname and __filename (CommonJS files only)
// __dirname  = full folder path of THIS file
// __filename = full path of THIS file including its name
console.log("This folder:", __dirname);
console.log("This file:  ", __filename);
// Expected output: absolute paths like /Users/.../lessons and .../01-what-is-nodejs.js

// 3d. Timers exist in Node too (provided by libuv, not the browser):
setTimeout(() => console.log("timer fired after ~100ms"), 100);
// Expected output (after other sync logs): timer fired after ~100ms

// ─────────────────────────────────────────────────────────────
// SECTION 4: THE `process` OBJECT (Node's control panel)
// ─────────────────────────────────────────────────────────────
// `process` = information + control over the CURRENT running program.
// ANALOGY: the dashboard of a car — speed, fuel, and the off switch.

console.log("Node version:", process.version); // e.g. v24.14.0
console.log("Platform:    ", process.platform); // "darwin" (Mac), "linux", "win32"
console.log("Process id:  ", process.pid); // a number, unique per run
console.log("Current dir: ", process.cwd()); // folder you RAN node from
// NOTE: process.cwd() = where you typed the command.
//       __dirname      = where the FILE lives. They can differ!

// process.memoryUsage() shows RAM usage in bytes:
const mem = process.memoryUsage();
console.log("Heap used (MB):", (mem.heapUsed / 1024 / 1024).toFixed(1));
// Expected output: a small number like 4.5

// ─────────────────────────────────────────────────────────────
// SECTION 5: THE EVENT LOOP IN NODE (quick preview)
// ─────────────────────────────────────────────────────────────
// Same idea as browser JS (Day 3 lesson), but Node's loop has
// named PHASES: timers → pending callbacks → poll → check → close.
// We go deep in lesson 07. Here is proof async ordering exists:

console.log("A — sync");
setTimeout(() => console.log("C — macrotask (timer phase)"), 0);
Promise.resolve().then(() => console.log("B — microtask (runs first)"));
console.log("A2 — sync");
// Expected output order:  A — sync,  A2 — sync,  B — microtask,  C — macrotask
// WHY: sync code runs first; microtasks (promises) drain before timers.

// ─────────────────────────────────────────────────────────────
// SECTION 6: THE REPL (Read-Eval-Print Loop)
// ─────────────────────────────────────────────────────────────
// Type just `node` (no filename) in your terminal → you get an
// interactive JS playground. Try:
//   > 2 + 2            → 4
//   > process.platform → 'darwin'
//   > .exit            → leave the REPL
// ANALOGY: a calculator that speaks JavaScript.

// ─────────────────────────────────────────────────────────────
// SECTION 7: WHERE IS NODE USED IN REAL LIFE? (the WHY)
// ─────────────────────────────────────────────────────────────
// - REST APIs / backends (Express, Fastify, NestJS)
// - Build tools you already use (Vite, webpack, TypeScript compiler)
// - CLIs (npm itself is a Node program!)
// - Real-time apps (chat, games) because of cheap connections
// NOT ideal for: heavy CPU math (video encoding) — one thread
// would block. For that, use worker threads or another language.

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
//
// Q1: What is Node.js?
// A1: A JavaScript runtime built on Chrome's V8 engine that runs
//     JS outside the browser. It adds OS abilities (files, network)
//     through libuv and built-in modules, using an event-driven,
//     non-blocking I/O model.
//
// Q2: How is Node different from browser JavaScript?
// A2: Same language, different environment. Browser has window,
//     document, DOM APIs. Node has process, fs, http, __dirname.
//     No DOM in Node; no file system access in the browser.
//
// Q3: Is Node.js single-threaded?
// A3: The JS you write runs on ONE main thread. But libuv keeps a
//     small thread pool (default 4) for heavy tasks like file I/O
//     and crypto. So: single-threaded JS, multi-threaded helpers.
//
// Q4: What is non-blocking I/O?
// A4: Node never waits for slow operations (disk, network). It
//     starts them, registers a callback, and keeps executing other
//     code. When the operation finishes, the event loop runs the
//     callback. Like a waiter serving many tables at once.
//
// Q5: What is V8?
// A5: Google's open-source JS engine (written in C++). It compiles
//     JavaScript to machine code (JIT compilation) for speed. Both
//     Chrome and Node use it.
//
// Q6: What is libuv?
// A6: A C library inside Node that provides the event loop, a
//     thread pool, and cross-platform access to files, networking
//     and timers. It is what makes async I/O possible in Node.
//
// Q7: process.cwd() vs __dirname?
// A7: process.cwd() = the directory you launched node FROM (can
//     change). __dirname = the directory this FILE lives in (fixed).
//
// Q8: When would you NOT choose Node?
// A8: CPU-heavy work (image/video processing, big math), because
//     long computations block the single JS thread and freeze all
//     other requests. Use worker threads or a different language.
