# Day 3 Project — Async Data Pipeline (Fill-in-the-Blank)

Simulates real backend async work **without a server**. Each module teaches one Day 3 concept.

## Setup

```bash
cd project/async-pipeline
npm start
```

Uses ES modules (`"type": "module"` in `package.json`).

## Build Checklist

### `src/fetchWithRetry.js`

- [ ] `sleep(ms)` — already done; study the pattern
- [ ] `fetchWithRetry(fn, options)` — retry loop with exponential backoff
- [ ] Optional `timeoutMs` using `Promise.race`
- [ ] Fake APIs `fetchUser` / `fetchPosts` — already scaffolded

### `src/cache.js`

- [ ] `createCache({ ttlMs })` — closure over private `Map`
- [ ] `get` / `set` / `has` — expire entries after TTL
- [ ] `memoizeAsync(fn)` — cache async results by args

### `src/queue.js`

- [ ] `createQueue(maxConcurrent)` — max 2 tasks running at once
- [ ] `add(fn)` returns a Promise; waits in queue if at capacity
- [ ] `runBatch(tasks, maxConcurrent)` — `Promise.allSettled` for partial failures
- [ ] `PipelineEvents` — log pipeline stages

### `src/index.js`

- [ ] `pipe(...fns)` — compose async steps (HOF)
- [ ] `enrichUser` — attach posts to user object
- [ ] Wire `pipe(loadUser, enrichUser, saveUser)` for one user
- [ ] Batch-fetch 5 users with concurrency limit of 2
- [ ] Cache demo — second fetch of same user should hit cache

## Concepts Map

| Feature | JS Concept |
|---------|------------|
| Retry + backoff | async/await, loops, closures |
| Timeout | `Promise.race` |
| Cache + TTL | closures, `Map`, memoization |
| Rate limiter | Promise queue, event loop |
| Pipeline | HOF, compose, async chaining |
| Batch | `Promise.allSettled` |

## Expected Output (when complete)

```
=== Async Pipeline Demo ===

--- 1. pipe(loadUser, enrichUser, saveUser) ---
[pipeline:fetch_start] { userId: 1 }
[pipeline:fetch_done] { userId: 1, name: 'User 1' }
[pipeline:save] { id: 1, postCount: 2 }
Result: { id: 1, name: 'User 1', posts: [...] }

--- 2. Batch users (max 2 concurrent) ---
Fulfilled: 4, Rejected: 1

--- 3. Cache hit (same user twice) ---
cached-user-1: 2ms   ← second call much faster

=== Done ===
```

(Failure counts vary — fake APIs randomly fail by design.)

## Self-Test

- [ ] Retry succeeds after transient failures
- [ ] Timeout rejects when API is too slow
- [ ] Cache returns stale data after TTL expires
- [ ] Queue never runs more than 2 tasks at once (add logging to verify)
- [ ] `pipe` passes output of each step to the next

## Hints

- Exponential backoff: `delay = baseDelayMs * 2 ** attempt`
- `Promise.allSettled` never rejects — inspect `.status` per result
- Closures keep `store`, `running`, and `waiting` private
