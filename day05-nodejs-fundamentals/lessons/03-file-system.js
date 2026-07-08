// ============================================================
// DAY 5 — LESSON 3: THE FILE SYSTEM (fs) — sync, async, promises
// Level: Basic → Advanced
// Run with:  node 03-file-system.js
// (This file creates a temporary folder "fs-playground" next to
//  itself, writes files there, and cleans up at the end.)
// ============================================================

const fs = require("fs"); // callback + sync APIs
const fsp = require("fs/promises"); // promise-based API (modern favorite)
const path = require("path");

// All demo files go into ONE playground folder so we never touch
// your real files. path.join builds a safe path (lesson 4 explains).
const DIR = path.join(__dirname, "fs-playground");

// ─────────────────────────────────────────────────────────────
// SECTION 1: THE THREE FLAVORS OF fs
// ─────────────────────────────────────────────────────────────
//
// Node gives every file operation in 3 styles:
//
// 1. SYNC      fs.readFileSync(...)      → BLOCKS the whole program
// 2. CALLBACK  fs.readFile(..., cb)      → old async style
// 3. PROMISES  fsp.readFile(...)         → modern async, works with await ✅
//
// ANALOGY: ordering food.
//   SYNC     = stand at the counter, stare at the cook. Nobody
//              behind you gets served until your food is ready.
//   CALLBACK = leave your phone number; they call you back.
//              (Works, but many orders = "callback hell" of nested calls.)
//   PROMISES = take a buzzer. Clean, composable, awaits nicely.
//
// RULE OF THUMB:
//   - Server handling requests → NEVER sync (blocks all users!)
//   - Small script / app startup (read config once) → sync is fine.
//   - Everything else → fs/promises + async/await. ✅

// Setup: make the playground folder (recursive = no error if exists)
fs.mkdirSync(DIR, { recursive: true });

// ─────────────────────────────────────────────────────────────
// SECTION 2: SYNC — readFileSync / writeFileSync
// ─────────────────────────────────────────────────────────────

const syncFile = path.join(DIR, "sync.txt");

// writeFileSync(path, data) → creates the file (or REPLACES it fully)
fs.writeFileSync(syncFile, "line 1\n");

// appendFileSync → adds to the END instead of replacing
fs.appendFileSync(syncFile, "line 2\n");

// readFileSync returns a Buffer (raw bytes) unless you give an encoding.
// "utf8" tells Node: decode the bytes into a normal string.
const syncContent = fs.readFileSync(syncFile, "utf8");
console.log("1) sync read:", JSON.stringify(syncContent));
// Expected output: 1) sync read: "line 1\nline 2\n"

// ─────────────────────────────────────────────────────────────
// SECTION 3: CALLBACK STYLE — fs.readFile(path, enc, callback)
// ─────────────────────────────────────────────────────────────
// The callback ALWAYS has the shape (err, data) —
// "error-first callback" is a Node convention:
//   err  = an Error object if something failed, otherwise null
//   data = the result if it worked

fs.readFile(syncFile, "utf8", (err, data) => {
  if (err) {
    // e.g. file does not exist → err.code === "ENOENT"
    console.error("callback read failed:", err.message);
    return; // ← always return/stop after handling the error!
  }
  console.log("3) callback read first line:", data.split("\n")[0]);
  // Expected output: 3) callback read first line: line 1
  // NOTE: this prints AFTER the sync logs below — it's async!
});

console.log("2) this line prints BEFORE the callback read (non-blocking)");

// ─────────────────────────────────────────────────────────────
// SECTION 4: PROMISES — the way you should write new code ✅
// ─────────────────────────────────────────────────────────────

async function promisesDemo() {
  const file = path.join(DIR, "promise.txt");

  // write, append, read — each returns a Promise, so we await
  await fsp.writeFile(file, "hello ");
  await fsp.appendFile(file, "promises!");
  const text = await fsp.readFile(file, "utf8");
  console.log("4) promise read:", text);
  // Expected output: 4) promise read: hello promises!

  // ── JSON files: THE most common real-world pattern ──────────
  // A JSON file is just text. Recipe:
  //   read text → JSON.parse → object → change → JSON.stringify → write
  const dbFile = path.join(DIR, "users.json");

  const users = [{ id: 1, name: "Rohit" }];
  // JSON.stringify(value, null, 2) → the `2` pretty-prints with 2-space indent
  await fsp.writeFile(dbFile, JSON.stringify(users, null, 2));

  const loaded = JSON.parse(await fsp.readFile(dbFile, "utf8"));
  loaded.push({ id: 2, name: "Asha" }); // modify in memory
  await fsp.writeFile(dbFile, JSON.stringify(loaded, null, 2)); // save back

  const final = JSON.parse(await fsp.readFile(dbFile, "utf8"));
  console.log("5) users in JSON 'database':", final.map((u) => u.name).join(", "));
  // Expected output: 5) users in JSON 'database': Rohit, Asha
  // (This read-modify-write pattern is your project database until Day 8!)

  // ── Directories ─────────────────────────────────────────────
  const sub = path.join(DIR, "logs");
  await fsp.mkdir(sub, { recursive: true }); // recursive: create parents, no error if exists
  await fsp.writeFile(path.join(sub, "app.log"), "started\n");

  // readdir → list of names in a folder
  const names = await fsp.readdir(DIR);
  console.log("6) playground contains:", names.sort().join(", "));
  // Expected output: 6) playground contains: logs, promise.txt, sync.txt, users.json

  // stat → info ABOUT a file: size, dates, is it a folder?
  const info = await fsp.stat(dbFile);
  console.log("7) users.json size:", info.size, "bytes | is file?", info.isFile());
  // Expected output: 7) users.json size: <some number> bytes | is file? true

  // ── Checking existence THE RIGHT WAY ───────────────────────
  // ❌ Old way: fs.exists (deprecated) or check-then-read (race condition:
  //    the file can be deleted BETWEEN your check and your read!)
  // ✅ New way: just try, and catch the specific error:
  try {
    await fsp.readFile(path.join(DIR, "ghost.txt"), "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("8) ghost.txt does not exist (ENOENT = Error NO ENTry)");
      // Expected output: 8) ghost.txt does not exist (ENOENT = Error NO ENTry)
    } else {
      throw err; // a DIFFERENT problem (permissions?) — don't hide it
    }
  }

  // ── rename / copy / delete ──────────────────────────────────
  await fsp.copyFile(file, path.join(DIR, "promise-copy.txt"));
  await fsp.rename(path.join(DIR, "promise-copy.txt"), path.join(DIR, "renamed.txt"));
  await fsp.unlink(path.join(DIR, "renamed.txt")); // unlink = delete a FILE
  console.log("9) copy → rename → delete: done");
  // Expected output: 9) copy → rename → delete: done

  // ── Cleanup: rm the whole playground ───────────────────────
  // rm with recursive+force = delete folder and everything inside
  await fsp.rm(DIR, { recursive: true, force: true });
  console.log("10) cleaned up playground folder ✅");
  // Expected output: 10) cleaned up playground folder ✅
}

promisesDemo().catch((err) => {
  console.error("demo failed:", err);
  process.exitCode = 1; // mark the process as failed (lesson 4 explains)
});

// ─────────────────────────────────────────────────────────────
// SECTION 5: WHY SYNC IS DANGEROUS IN A SERVER (the big WHY)
// ─────────────────────────────────────────────────────────────
// Imagine an HTTP server where each request does:
//     const data = fs.readFileSync("big-500MB-file");
// While that line runs (maybe 2 seconds), the event loop is FROZEN.
// EVERY other user's request waits. 100 users → 200 seconds for
// the last one. With async fs, the disk work happens in libuv's
// thread pool and the event loop keeps serving everyone.
//
// Remember: Node's superpower is "never wait". Sync fs = waiting.

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
//
// Q1: readFile vs readFileSync?
// A1: readFileSync blocks the event loop until the file is fully
//     read — nothing else runs. readFile is asynchronous: the read
//     happens in libuv's thread pool and a callback (or promise)
//     delivers the result. In servers, always use the async form.
//
// Q2: What are the three fs API styles?
// A2: Sync (fs.readFileSync), error-first callbacks (fs.readFile),
//     and promises (require("fs/promises")). Promises + async/await
//     is the modern recommended style.
//
// Q3: What is an error-first callback?
// A3: Node convention: callback(err, result). First argument is the
//     error (null if success), second is the data. You must check
//     err before using result.
//
// Q4: What does ENOENT mean?
// A4: "Error NO ENTry" — the path does not exist. Common err.codes:
//     ENOENT (missing), EACCES (no permission), EEXIST (already
//     exists), EISDIR (expected file, got directory).
//
// Q5: How do you read and update a JSON file?
// A5: text = await fsp.readFile(p, "utf8") → obj = JSON.parse(text)
//     → modify obj → await fsp.writeFile(p, JSON.stringify(obj, null, 2)).
//
// Q6: Why is "check if file exists, then read it" a bad pattern?
// A6: Race condition — the file can change between the check and
//     the read. Better: attempt the operation and handle ENOENT in
//     catch. (TOCTOU: time-of-check to time-of-use bug.)
//
// Q7: writeFile vs appendFile?
// A7: writeFile replaces the whole file (creates if missing).
//     appendFile adds to the end (creates if missing).
//
// Q8: When is sync fs acceptable?
// A8: One-time work before the server starts (loading config at
//     startup) or small CLI scripts, where blocking hurts nobody.
//
// Q9: How would you read a 2 GB file?
// A9: NOT with readFile (loads all of it into RAM). Use a stream
//     (fs.createReadStream) and process it chunk by chunk — see
//     lesson 06.
