# DAY 3 — JavaScript Advanced (The Interview Killers)

## Today's Goal
Closures, event loop, promises, prototypes, `this` — the topics EVERY interviewer asks.
By tonight you can predict the output of any async code snippet.

## Morning Revision (2 hr)
From memory, write: FizzBuzz, a function that removes duplicates from an array,
group-by-category with reduce, and a curried add function. No peeking.

## Lessons (in order) — ALL FILES ALREADY EXIST in `lessons/`
| # | File | Time |
|---|------|------|
| 1 | `01-closures-and-scope.js` — closures, counters, memoization, data privacy | 60 min |
| 2 | `02-hoisting.js` — hoisting rules, TDZ, declaration vs expression | 40 min |
| 3 | `03-event-loop.js` — call stack, microtask vs macrotask queue, execution order | 60 min |
| 4 | `04-promises-async-await.js` — all Promise statics, async/await, retry, timeout | 75 min |
| 5 | `05-prototype-and-this.js` — prototype chain, what `new` does, call/apply/bind, 4 rules of this | 70 min |
| 6 | `06-classes-and-modules.js` — classes, private fields, inheritance, mixins, ESM vs CJS | 60 min |
| 7 | `07-array-methods-and-hof.js` — HOF, building own map/filter/reduce, compose, pipe, curry | 55 min |

## Project (6 hours): Async Data Pipeline
Create `project/async-pipeline/`. Simulates real backend work WITHOUT needing a server.

Features (each one uses today's concepts):
- [ ] Fake API module: `fetchUser(id)`, `fetchPosts(userId)` with random delay + random failures (Promises)
- [ ] Retry wrapper with exponential backoff (async/await + closures)
- [ ] Timeout wrapper using `Promise.race`
- [ ] Cache layer with closure (memoization + TTL expiry)
- [ ] Batch fetch users in parallel with `Promise.all` + partial failure handling with `allSettled`
- [ ] Rate limiter: max 2 requests running at once (queue + event loop understanding)
- [ ] EventEmitter class to log pipeline events (classes + this)
- [ ] Pipeline composer: `pipe(fetchUser, enrichUser, saveUser)` (HOF + compose)

**Project scaffold ready:** `project/async-pipeline/` — fill in every `TODO` before checking answers.

## Tonight's Notes
- Draw the event loop (stack, microtask queue, callback queue)
- Closure definition + 2 real uses
- What `new` does (4 steps)
- Promise.all vs allSettled vs race vs any — table
- 4 rules of `this`

## Interview Questions
1. What is a closure? Give a practical use.
2. Output order of: sync log → setTimeout(0) → Promise.then → sync log?
3. Why doesn't `await` work inside forEach?
4. call vs apply vs bind?
5. What is the prototype chain?
6. What is the TDZ?
