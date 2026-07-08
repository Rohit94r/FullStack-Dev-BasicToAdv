// ============================================================
// DAY 5 — LESSON 4: path, os, process — TALKING TO THE MACHINE
// Level: Basic → Intermediate
// Run with:  node 04-path-os-process.js
// Try also:  node 04-path-os-process.js hello world
// Try also:  GREETING=namaste node 04-path-os-process.js
// ============================================================

const path = require("path");
const os = require("os");

// ─────────────────────────────────────────────────────────────
// SECTION 1: THE path MODULE — never glue paths with + again
// ─────────────────────────────────────────────────────────────
//
// PROBLEM: Windows uses backslashes (C:\Users\me), Mac/Linux use
// forward slashes (/Users/me). If you write "folder" + "/" + "file"
// your code may break on another OS.
// SOLUTION: the path module builds paths correctly for ANY OS.
// ANALOGY: a universal travel adapter for file paths.

// 1a. path.join — glue pieces with the CORRECT separator
console.log(path.join("users", "rohit", "docs", "notes.txt"));
// Expected output (Mac/Linux): users/rohit/docs/notes.txt

// join also cleans up weird pieces:
console.log(path.join("/a", "b", "..", "c")); // ".." means "go up one folder"
// Expected output: /a/c

// 1b. path.resolve — build an ABSOLUTE path (starts from / or C:\)
// It works right-to-left until it finds an absolute start,
// otherwise uses the current working directory.
console.log(path.resolve("data", "db.json"));
// Expected output: <your cwd>/data/db.json  (absolute!)

// THE classic safe pattern — file relative to THIS script:
const configPath = path.join(__dirname, "config.json");
console.log("config would be at:", configPath);
// WHY: process.cwd() changes depending on where the user runs node
// from; __dirname never changes. Use __dirname for files that
// belong to your app.

// 1c. Taking paths APART:
const p = "/home/rohit/photos/cat.png";
console.log(path.basename(p)); // Expected: cat.png        (file name)
console.log(path.basename(p, ".png")); // Expected: cat    (without extension)
console.log(path.dirname(p)); // Expected: /home/rohit/photos (folder)
console.log(path.extname(p)); // Expected: .png            (extension)
console.log(path.parse(p).name); // Expected: cat
// path.parse gives an object: { root, dir, base, ext, name }

// ─────────────────────────────────────────────────────────────
// SECTION 2: THE os MODULE — asking about the computer
// ─────────────────────────────────────────────────────────────
// Useful for logs, diagnostics, and deciding how many workers to run.

console.log("OS platform :", os.platform()); // "darwin" | "linux" | "win32"
console.log("CPU cores   :", os.cpus().length); // e.g. 8 — one number per core
console.log("Total RAM GB:", (os.totalmem() / 1024 ** 3).toFixed(1));
console.log("Free RAM GB :", (os.freemem() / 1024 ** 3).toFixed(1));
console.log("Home folder :", os.homedir()); // e.g. /Users/rohitjadhav
console.log("Temp folder :", os.tmpdir()); // good place for scratch files
console.log("Uptime hours:", (os.uptime() / 3600).toFixed(1));
// Real-world WHY: production servers often start one worker process
// per CPU core → os.cpus().length tells you how many.

// ─────────────────────────────────────────────────────────────
// SECTION 3: process.argv — COMMAND-LINE ARGUMENTS
// ─────────────────────────────────────────────────────────────
// When you run:  node 04-path-os-process.js hello world
// process.argv is an ARRAY:
//   [0] path to the node binary        (ignore)
//   [1] path to this script            (ignore)
//   [2] "hello"   ← YOUR args start at index 2!
//   [3] "world"
// ANALOGY: argv is the note you hand the program as it starts.

const args = process.argv.slice(2); // keep only the user's args
console.log("your args:", args);
// Expected output (plain run):        your args: []
// Expected output (with hello world): your args: [ 'hello', 'world' ]

if (args[0]) {
  console.log(`First argument received: ${args[0]}`);
}
// This is how CLIs work: npm, git, eslint all read argv.

// ─────────────────────────────────────────────────────────────
// SECTION 4: ENVIRONMENT VARIABLES — process.env
// ─────────────────────────────────────────────────────────────
// env vars = settings that live OUTSIDE your code, in the shell.
// ANALOGY: the thermostat on the wall — the house (code) behaves
// differently depending on the setting, without rebuilding the house.
//
// WHY they matter (VERY important for real jobs):
//   - secrets (API keys, DB passwords) must NOT be written in code
//     or committed to git — you pass them via environment variables.
//   - the same code runs in dev/test/production with different
//     settings (different DB, different port).

// Reading (every value is a STRING or undefined):
console.log("HOME =", process.env.HOME); // your home dir (set by the OS)

// The default-value pattern you will use in every project:
const PORT = process.env.PORT || 3000; // use env if set, else 3000
console.log("PORT =", PORT); // Expected: 3000 (unless you set PORT)

// Custom var demo — run:  GREETING=namaste node 04-path-os-process.js
console.log("GREETING =", process.env.GREETING || "(not set — try GREETING=namaste node 04-...)");

// NODE_ENV: a convention, not magic. Frameworks check it:
//   NODE_ENV=production → less logging, more caching
//   NODE_ENV=development → verbose errors
// In real projects you'll put vars in a .env file and load them
// with the dotenv package (or node --env-file=.env since Node 20).

// ─────────────────────────────────────────────────────────────
// SECTION 5: EXIT CODES — how programs report success/failure
// ─────────────────────────────────────────────────────────────
// Every process ends with a NUMBER: 0 = success, anything else = failure.
// Shells, CI pipelines and Docker read this number to decide
// "did the script work?". ANALOGY: a thumbs up (0) or down (1)
// the program gives as it leaves the room.
//
//   process.exitCode = 1;  // ✅ polite: "when you finish, report failure"
//   process.exit(1);       // ⚠️ immediate: kills the process NOW,
//                          //    pending writes/callbacks may be LOST
// Prefer setting exitCode and letting Node finish naturally.
// (In bash you can check the last exit code with: echo $?)

// A related useful event — run something just before dying:
process.on("exit", (code) => {
  // Only SYNC code works here (the loop is already stopping).
  console.log(`(process exiting with code ${code})`);
});
// Expected output (last line): (process exiting with code 0)

console.log("main script finished — exit event fires next");

// ─────────────────────────────────────────────────────────────
// INTERVIEW Q&A CHEAT SHEET
// ─────────────────────────────────────────────────────────────
//
// Q1: Why use path.join instead of string concatenation?
// A1: Separators differ per OS (\ vs /). path.join inserts the
//     correct one and normalizes segments like "..", making code
//     portable across Windows/Mac/Linux.
//
// Q2: path.join vs path.resolve?
// A2: join just glues segments (result may be relative).
//     resolve always returns an ABSOLUTE path, starting from the
//     current working directory unless a segment is already absolute.
//
// Q3: __dirname vs process.cwd()?
// A3: __dirname = folder of the current FILE (constant).
//     process.cwd() = folder the process was STARTED from (depends
//     on the user). For files bundled with your app, use __dirname.
//
// Q4: What is process.argv? What are the first two entries?
// A4: An array of command-line arguments. [0] is the node binary
//     path, [1] is the script path, real arguments start at [2] —
//     hence the common `process.argv.slice(2)`.
//
// Q5: What are environment variables and why store secrets there?
// A5: Key-value settings provided by the OS/shell to a process,
//     read via process.env. Secrets in env vars stay out of source
//     code and git, and can differ per environment (dev/prod)
//     without changing code.
//
// Q6: What does exit code 0 mean? Non-zero?
// A6: 0 = success. Any non-zero = failure. CI systems and shells
//     use it to decide whether a step passed.
//
// Q7: process.exit(1) vs process.exitCode = 1?
// A7: exit(1) terminates immediately — queued async work (like
//     log flushes) may be lost. exitCode = 1 lets the program end
//     naturally and then report failure. Prefer exitCode.
//
// Q8: How would you make your server's port configurable?
// A8: const PORT = process.env.PORT || 3000; — read from the
//     environment with a sensible default. Deployment platforms
//     (Heroku, Render, Docker) inject PORT this way.
//
// Q9: What is NODE_ENV?
// A9: A conventional env var describing the environment
//     ("development", "production", "test"). Libraries like Express
//     optimize behavior when NODE_ENV=production.
