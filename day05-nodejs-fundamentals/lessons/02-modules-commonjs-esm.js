// ============================================================
// DAY 5 — LESSON 2: MODULES — CommonJS vs ES Modules + npm basics
// Level: Basic → Intermediate
// Run with:  node 02-modules-commonjs-esm.js
// ============================================================

// ─────────────────────────────────────────────────────────────
// SECTION 1: WHY MODULES EXIST
// ─────────────────────────────────────────────────────────────
//
// Problem: if all code lived in ONE giant file, it would be
// impossible to read, test, or reuse.
//
// ANALOGY: A kitchen. You don't keep everything in one drawer.
// Knives drawer, spices drawer, plates drawer. A MODULE is a
// drawer: it hides its mess inside and only hands you what you
// asked for.
//
// A module = one file with PRIVATE scope. Nothing leaks out
// unless you EXPORT it. Nothing comes in unless you IMPORT it.

// ─────────────────────────────────────────────────────────────
// SECTION 2: CommonJS (CJS) — Node's ORIGINAL module system
// ─────────────────────────────────────────────────────────────
// Keywords: require() to import, module.exports to export.
// This file uses CommonJS (that's the default for .js files
// unless package.json says otherwise — see Section 5).

// 2a. Every CJS file secretly gets wrapped by Node like this:
//
//   (function (exports, require, module, __filename, __dirname) {
//       ... your code ...
//   })
//
// That wrapper is WHY require, module, __dirname "just exist" —
// they are parameters of a hidden function! And it is why your
// top-level variables are private to the file.

// 2b. Exporting — imagine this is a file called mathUtils.js:
//
//   function add(a, b) { return a + b; }
//   function mul(a, b) { return a * b; }
//   const PI = 3.14159;
//
//   // Option 1: export an object with many things
//   module.exports = { add, mul, PI };
//
//   // Option 2: attach one by one (same result)
//   // exports.add = add;   ← `exports` is a shortcut to module.exports
//
//   // ❌ TRAP: `exports = { add }` does NOT work!
//   // You replaced the shortcut variable, not module.exports itself.

// 2c. Importing — from another file you would write:
//
//   const { add, PI } = require("./mathUtils");   // ./ = same folder
//   const fs = require("fs");                     // no ./ = built-in or npm
//
// require() runs the target file ONCE, stores the result in a
// CACHE, and returns module.exports. Import the same file twice →
// same object, file does NOT run again. (Like a singleton.)

// Real runnable demo — a built-in module:
const path = require("path");
console.log(path.basename(__filename));
// Expected output: 02-modules-commonjs-esm.js

// Proof of the cache:
const path2 = require("path");
console.log("same cached object?", path === path2);
// Expected output: same cached object? true

// ─────────────────────────────────────────────────────────────
// SECTION 3: ES MODULES (ESM) — the MODERN standard
// ─────────────────────────────────────────────────────────────
// Keywords: import / export. Same system browsers use.
// The examples below are COMMENTED because this file is CJS —
// mixing the syntaxes in one file is not allowed.
//
//   // exporting (file: mathUtils.mjs)
//   export function add(a, b) { return a + b; }
//   export const PI = 3.14159;
//   export default function greet() { console.log("hi"); }
//
//   // importing (file: main.mjs)
//   import greet, { add, PI } from "./mathUtils.mjs"; // note: extension required!
//   import * as math from "./mathUtils.mjs";           // grab everything
//
// HOW to make Node treat a file as ESM (any ONE of these):
//   1. name the file .mjs
//   2. put  "type": "module"  in package.json (then ALL .js are ESM,
//      and CJS files must be renamed .cjs)
//
// KEY DIFFERENCES (interview gold):
// ┌────────────────────┬──────────────────────┬─────────────────────┐
// │                    │ CommonJS             │ ES Modules          │
// ├────────────────────┼──────────────────────┼─────────────────────┤
// │ import syntax      │ require()            │ import              │
// │ export syntax      │ module.exports       │ export / default    │
// │ loading            │ synchronous, runtime │ async, parsed first │
// │ can require in if()│ ✅ yes (it's a func)│ ❌ static only*     │
// │ __dirname          │ ✅ exists           │ ❌ use import.meta  │
// │ top-level await    │ ❌ no               │ ✅ yes              │
// └────────────────────┴──────────────────────┴─────────────────────┘
// * ESM has import() — a dynamic, promise-based import for special cases.
//
// WHY "parsed first" matters: ESM reads all imports BEFORE running
// code, so tools can tree-shake (remove unused exports) and catch
// typos in import names early. CJS only discovers exports while
// running, so bundlers can optimize it less.

// ─────────────────────────────────────────────────────────────
// SECTION 4: HOW require() FINDS THINGS (module resolution)
// ─────────────────────────────────────────────────────────────
// require("./x")  → relative path: look next to this file (.js, .json, folder/index.js)
// require("fs")   → 1) is it a built-in? yes → done.
// require("zod")  → 2) not built-in → look in ./node_modules,
//                     then ../node_modules, then ../../ ... up to the root.
// ANALOGY: looking for sugar — check your kitchen, then your
// neighbor's, then the shop down the street.

// ─────────────────────────────────────────────────────────────
// SECTION 5: package.json + npm IN 2 MINUTES
// ─────────────────────────────────────────────────────────────
// package.json = the ID card of a project. Created with `npm init -y`.
//
//   {
//     "name": "my-app",
//     "version": "1.0.0",
//     "type": "commonjs",            // or "module" for ESM
//     "main": "index.js",            // entry file
//     "scripts": { "start": "node index.js" },   // run: npm run start
//     "dependencies": { "express": "^4.19.0" },  // needed to RUN
//     "devDependencies": { "typescript": "^5.5.0" } // needed to BUILD only
//   }
//
// Commands you will use daily:
//   npm init -y             → create package.json
//   npm install express     → download into node_modules + save to deps
//   npm install -D typescript → save as devDependency
//   npm run <script>        → run a script from "scripts"
//
// Version "^4.19.0" means: accept 4.x.x updates but NOT 5.0.0
// (major version = breaking changes, per semantic versioning:
//  MAJOR.MINOR.PATCH = breaking.feature.bugfix).
//
// package-lock.json = the EXACT versions installed, so teammates
// get identical node_modules. Commit it to git. Never edit by hand.

// ─────────────────────────────────────────────────────────────
// SECTION 6: RUNNABLE MINI-DEMO (module privacy in action)
// ─────────────────────────────────────────────────────────────
// We can't create extra files inside one lesson, but we can FAKE
// two modules with functions to show the idea of private scope:

function fakeModuleCounter() {
  // `count` is PRIVATE — like a top-level variable in a module file
  let count = 0;
  // this object is what we would put on module.exports
  return {
    increment() { count++; },
    getCount() { return count; },
  };
}

const counter = fakeModuleCounter(); // like require("./counter")
counter.increment();
counter.increment();
console.log("count is:", counter.getCount()); // Expected output: count is: 2
console.log("can we touch count directly?", typeof count); // Expected: undefined
// WHY: modules (like closures) expose an API and hide internals.

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
//
// Q1: CommonJS vs ES Modules — main differences?
// A1: CJS uses require/module.exports, loads synchronously at
//     runtime, and is Node's original system. ESM uses import/export,
//     is the official JS standard, is statically analyzed (imports
//     resolved before code runs), supports top-level await and
//     tree-shaking. New projects should prefer ESM.
//
// Q2: What happens when you require() a module twice?
// A2: The file runs only ONCE. The result is cached in
//     require.cache, and later require calls return the same
//     exported object.
//
// Q3: Difference between `module.exports` and `exports`?
// A3: `exports` is just a variable pointing to module.exports.
//     Adding properties (exports.foo = ...) works. Reassigning
//     (exports = {...}) breaks the link and exports nothing.
//
// Q4: How does Node decide if a .js file is CJS or ESM?
// A4: By the nearest package.json "type" field: "module" → ESM,
//     missing or "commonjs" → CJS. File extensions .mjs / .cjs
//     override this per-file.
//
// Q5: dependencies vs devDependencies?
// A5: dependencies are needed at runtime in production (express).
//     devDependencies are only needed while developing/building
//     (typescript, nodemon, eslint). `npm install --production`
//     (or --omit=dev) skips devDependencies.
//
// Q6: What does the ^ in "^4.19.0" mean?
// A6: Semver range: allow minor and patch updates (4.19.1, 4.20.0)
//     but never a new major (5.0.0), because majors may break code.
//     A ~ allows only patch updates (4.19.x).
//
// Q7: What is package-lock.json for?
// A7: It records the exact resolved version of every package (and
//     sub-package) so every install produces the same node_modules.
//     It should be committed to version control.
//
// Q8: How does require() resolve "express"?
// A8: Not a core module and no ./ prefix → Node walks up the folder
//     tree looking in each node_modules directory until it finds it
//     (or throws MODULE_NOT_FOUND).
