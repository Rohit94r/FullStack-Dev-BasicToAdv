# Day 5 — Node.js Fundamentals Interview Questions & Answers

---

## SECTION A — What is Node.js

**Q1. What is Node.js?**
A: Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.
   It allows you to run JavaScript on the SERVER (outside the browser).
   Built on: V8 engine (compiles JS to machine code) + libuv (async I/O, event loop).
   Key features: single-threaded, non-blocking I/O, event-driven, very fast for I/O-heavy tasks.

**Q2. What makes Node.js good for backend development?**
A: 1. Non-blocking I/O — can handle many concurrent requests without blocking.
   2. Same language on frontend and backend — reduced context switching.
   3. npm ecosystem — largest package registry in the world.
   4. Event-driven — efficient for real-time apps (chat, live updates).
   5. JSON-native — perfect for REST APIs, works naturally with MongoDB.
   6. Microservices — lightweight, fast startup, ideal for containerized services.

**Q3. What is Node.js NOT good for?**
A: CPU-intensive tasks (image processing, video encoding, complex math).
   Why: single-threaded. A CPU-heavy task BLOCKS the event loop, making all other requests wait.
   Solutions: Worker Threads (Node.js built-in), child processes, or use a different language (Go, Rust).
   Node is NOT a silver bullet — use it for I/O-heavy work, not CPU-heavy work.

**Q4. What is V8 and what does it do?**
A: V8 is Google's open-source JavaScript engine, written in C++.
   It compiles JavaScript to NATIVE machine code using JIT (Just-In-Time) compilation.
   This is why JavaScript is fast — V8 doesn't interpret JS, it compiles it.
   Both Chrome browser and Node.js use V8.

**Q5. What is libuv and why does Node.js need it?**
A: libuv is a C library that provides Node.js with:
   - The event loop
   - Thread pool (for operations that can't be non-blocking like file I/O, DNS)
   - Cross-platform async I/O (Windows and Unix)
   V8 handles JS execution. libuv handles everything async (I/O, timers, networking).
   Together they make Node.js possible.

---

## SECTION B — Modules

**Q6. What are Node.js modules? What are the 3 types?**
A: Modules are self-contained pieces of code. Node.js uses modules to avoid polluting global scope.
   3 types:
   1. Core modules  → built-in with Node (fs, path, http, os, events, crypto, stream).
   2. Local modules → files you create. `require("./myModule")`.
   3. Third-party   → installed via npm. `require("express")`.

**Q7. What is the difference between CommonJS and ES Modules?**
A: CommonJS (CJS): `require()` / `module.exports`. Original Node.js module system.
   - Synchronous loading. Works anywhere in code. No browser support natively.
   ES Modules (ESM): `import` / `export`. Browser-native. Modern standard.
   - Async loading. Static imports at top of file only. Supports tree-shaking.
   Node supports both. New projects: use ESM (`"type": "module"` in package.json).

**Q8. What does `require()` actually do step by step?**
A: 1. Resolve the path (determine absolute path of the module).
   2. Load — check cache first. If already loaded, return cached version.
   3. Wrap — wraps module code in a function: `(function(exports, require, module, __filename, __dirname) { ... })`
   4. Execute — run the wrapped function.
   5. Cache — store result in `require.cache` for future calls.
   This is why `require` is synchronous and why modules are singletons.

**Q9. What is `__dirname` and `__filename`?**
A: `__filename` → ABSOLUTE path of the current file.
   `__dirname`  → ABSOLUTE path of the DIRECTORY containing the current file.
   These are injected by Node's module wrapper. Only available in CommonJS.
   In ES Modules, use: `import.meta.url` and `path.dirname(fileURLToPath(import.meta.url))`.

---

## SECTION C — File System

**Q10. What is the difference between `fs.readFile` (async) and `fs.readFileSync`?**
A: readFile (async) → non-blocking. Takes callback. Node continues other work while reading.
   readFileSync     → BLOCKING. Node.js waits until file is fully read. Nothing else runs.
   ALWAYS use async versions in production. Only use sync in startup/init or CLI scripts.
   Modern alternative: `fs.promises.readFile()` — returns Promise, use with async/await.

**Q11. What is `fs.watch`? How is it different from `fs.watchFile`?**
A: fs.watch     → uses OS-native file watching. Fast. May miss events or fire multiple times on some OS.
   fs.watchFile → polling-based. More reliable but slower. Uses stat calls on interval.
   For real projects, use chokidar npm package — it handles cross-platform quirks.

---

## SECTION D — HTTP Module

**Q12. Can you build a web server with just Node.js, without Express?**
A: YES. Node's built-in `http` module:
   ```javascript
   const http = require("http");
   const server = http.createServer((req, res) => {
     res.writeHead(200, { "Content-Type": "application/json" });
     res.end(JSON.stringify({ message: "Hello" }));
   });
   server.listen(3000);
   ```
   Express is just a wrapper that makes this easier with routing, middleware, etc.

**Q13. What is the `req` object in an HTTP server?**
A: An IncomingMessage instance (extends Readable stream). Contains:
   - `req.method` → "GET", "POST", "PUT", "DELETE"
   - `req.url`    → the requested URL path (e.g. "/api/users?page=2")
   - `req.headers` → object of request headers
   - `req.socket` → the underlying TCP socket
   Body is a STREAM — must read it chunk by chunk (Express does this automatically).

**Q14. How do you read the request body in a raw Node.js HTTP server?**
A: ```javascript
   let body = "";
   req.on("data", (chunk) => { body += chunk.toString(); });
   req.on("end", () => {
     const parsed = JSON.parse(body);
     // now handle the request
   });
   ```
   Express does this automatically with `express.json()` middleware.

---

## SECTION E — Streams & Buffers

**Q15. What are streams in Node.js? Why are they important?**
A: Streams process data in CHUNKS instead of loading everything into memory first.
   Without streams: read entire 1GB file → holds 1GB in RAM → process it.
   With streams: read 64KB chunk → process it → discard → read next chunk. RAM stays low.
   4 types: Readable, Writable, Duplex (both), Transform (duplex that modifies data).

**Q16. What is piping in streams?**
A: Connecting a readable stream to a writable stream. Data flows from source to destination automatically.
   `readableStream.pipe(writableStream)`
   Example: `fs.createReadStream("input.txt").pipe(fs.createWriteStream("output.txt"))`
   Handles backpressure automatically — won't overwhelm the destination.
   Can chain: `source.pipe(gzip).pipe(encrypt).pipe(output)` — Transform streams in between.

**Q17. What is a Buffer?**
A: A fixed-size allocation of raw memory outside V8's heap.
   Used for: binary data (files, images, network packets, crypto operations).
   Streams use Buffers internally for chunks of data.
   `Buffer.from("hello", "utf8")` → creates buffer. `buf.toString("utf8")` → back to string.

---

## SECTION F — Event-Driven / EventEmitter

**Q18. What is the EventEmitter pattern?**
A: An implementation of the Observer/PubSub pattern.
   Objects emit NAMED EVENTS. Other code can LISTEN to those events.
   Node.js is built on this — http.Server, streams, process are all EventEmitters.
   `emitter.on("event", handler)` — subscribe.
   `emitter.emit("event", data)` — trigger.
   `emitter.off("event", handler)` — unsubscribe.

**Q19. What happens if you emit an "error" event with no listener?**
A: Node.js throws an UNCAUGHT EXCEPTION and crashes the process.
   Always add error listeners to EventEmitters, especially streams and servers.
   `server.on("error", (err) => console.error(err));`

**Q20. What is `process.on("uncaughtException")` vs `process.on("unhandledRejection")`?**
A: uncaughtException  → handles errors thrown synchronously that weren't caught by any try/catch.
   unhandledRejection → handles Promise rejections that have no .catch() attached.
   Both should log the error and call `process.exit(1)` — the process is in unknown state after.
   Better solution: use a process manager (PM2) that automatically restarts on crash.

---

## SECTION G — npm & Package.json

**Q21. What is `package.json`? What are its most important fields?**
A: Describes the project and its dependencies.
   Key fields:
   - `name`, `version` → project identity
   - `main` → entry point file
   - `scripts` → run with `npm run <name>` (dev, build, test, start)
   - `dependencies` → production packages
   - `devDependencies` → only needed during development (TypeScript, testing tools)
   - `engines` → which Node.js version is required
   - `type` → "module" for ESM

**Q22. What is the difference between `dependencies` and `devDependencies`?**
A: dependencies    → packages needed in PRODUCTION. Installed in all environments.
                    Examples: express, prisma, bcryptjs, jsonwebtoken.
   devDependencies → only needed during DEVELOPMENT. Not installed in production with `npm install --production`.
                    Examples: typescript, jest, nodemon, eslint, @types/*.

**Q23. What does `package-lock.json` do? Should you commit it?**
A: Records the EXACT version of every installed package and all its transitive dependencies.
   Ensures everyone on the team (and CI/CD) gets identical installs.
   YES — always commit package-lock.json. It prevents "works on my machine" dependency bugs.
   Never manually edit it. npm manages it automatically.

**Q24. What is the difference between `npm install`, `npm ci`, and `npm install --save-dev`?**
A: npm install           → installs all dependencies. Updates package-lock.json if needed.
   npm ci                → clean install. Deletes node_modules first. Strictly uses package-lock.json.
                          Use in CI/CD environments for reproducible builds.
   npm install --save-dev → installs and saves to devDependencies. Short: npm i -D.

**Q25. What is `npx`?**
A: Runs an npm package WITHOUT installing it globally.
   `npx create-react-app myapp` → downloads, runs, done. No global install needed.
   Also runs locally installed binaries: `npx ts-node src/index.ts`.
   Preferred over global installs for project tools (keeps project self-contained).
