# DAY 5 — Node.js Fundamentals (How the Backend Actually Works)

## Today's Goal
Understand what Node.js IS underneath — so Express (tomorrow) is not magic.
You'll build your own tiny Express to prove it.

## Content Ready
All **7 lesson files** in `lessons/` and the **mini-express** project in `project/mini-express/` are pre-built. Open them and start — fill every `TODO` before checking answers.
Re-implement from the Task API from memory: `filterTasks` and `getStats`.
Explain generics out loud.

## Lessons (in order) — ALL FILES EXIST in `lessons/`
| # | File | What You'll Learn | Time |
|---|------|-------------------|------|
| 1 | `01-what-is-nodejs.js` | V8, event loop in Node, process, globals, REPL | 40 min |
| 2 | `02-modules-commonjs-esm.js` | require vs import, module.exports, package.json, npm basics | 45 min |
| 3 | `03-file-system.js` | fs sync vs async vs promises, read/write/append, JSON files, directories | 60 min |
| 4 | `04-path-os-process.js` | path.join/resolve, __dirname, os info, process.argv, env vars, exit codes | 40 min |
| 5 | `05-http-module.js` | Create a server WITHOUT Express: req, res, headers, status codes, URL parsing | 75 min |
| 6 | `06-streams-and-buffers.js` | What buffers are, readable/writable streams, pipe, why streams matter for big files | 60 min |
| 7 | `07-events-and-async-node.js` | EventEmitter, timers in Node, setImmediate vs setTimeout vs nextTick | 45 min |

## Project (6 hours): Mini Express Clone
Build a tiny framework that works like Express — so tomorrow Express has zero mystery.

Features:
- [ ] `App` class with `.get(path, handler)`, `.post()`, `.delete()`, `.listen(port)`
- [ ] Router that matches method + path (including params like `/users/:id`)
- [ ] Middleware chain: `app.use(fn)` with `next()` (THE most important Express concept)
- [ ] Request parser: query strings, JSON body parsing (collect stream chunks!)
- [ ] Response helpers: `res.json(data)`, `res.status(code)`, `res.send(text)`
- [ ] 404 handler + error-handling middleware
- [ ] Demo routes: GET /users, GET /users/:id, POST /users, DELETE /users/:id (in-memory array)
- [ ] Test with curl or a REST client

## Tonight's Notes
- What is Node.js (one sentence a 10-year-old understands)
- Blocking vs non-blocking I/O with example
- What is a stream and why not read whole file into memory
- What middleware means (draw request → mw1 → mw2 → handler → response)

## Interview Questions
1. What is Node.js and how is it different from browser JS?
2. What is the difference between readFileSync and readFile?
3. What is a Buffer? What is a Stream?
4. process.nextTick vs setImmediate vs setTimeout(0)?
5. CommonJS vs ES Modules?
6. How does middleware work in Express? (you built it — explain YOURS)
