# =============================================================================
# DAY 15 — LESSON 7: Async Python (asyncio)
# =============================================================================
# Python's asyncio enables concurrent I/O operations WITHOUT multiple threads.
# KEY: asyncio is for I/O-BOUND tasks (network, file, database).
#      For CPU-BOUND tasks: use multiprocessing or ThreadPoolExecutor.
#
# Core concepts:
# - coroutine:   function defined with `async def`. Returns a coroutine object.
# - await:       pauses current coroutine, lets event loop run others.
# - event loop:  runs coroutines, switches between them at each await.
# - task:        wraps a coroutine for concurrent execution.
# =============================================================================

import asyncio
import time

# =============================================================================
# SECTION 1: Basic async/await
# =============================================================================

# Regular function — BLOCKS everything while sleeping
def sync_sleep(n):
    time.sleep(n)  # Blocks the entire program
    print(f"sync_sleep({n}) done")

# Async function (coroutine) — SUSPENDS itself, lets others run
async def async_sleep(n):
    await asyncio.sleep(n)  # Non-blocking sleep
    print(f"async_sleep({n}) done")
    return f"Result from sleep {n}"

# Running a single coroutine
async def main():
    print("Starting")
    result = await async_sleep(1)  # Wait for it to finish
    print(f"Got: {result}")
    print("Done")

# Run the event loop
asyncio.run(main())

# =============================================================================
# SECTION 2: Running Coroutines Concurrently with asyncio.gather
# =============================================================================

async def fetch_data(url, delay):
    """Simulates fetching data from a URL."""
    print(f"Starting fetch: {url}")
    await asyncio.sleep(delay)  # Simulate network I/O
    print(f"Completed fetch: {url}")
    return {"url": url, "data": f"Response from {url}"}

# Sequential (slow) — runs one at a time
async def sequential():
    start = time.perf_counter()
    r1 = await fetch_data("https://api.example.com/users", 2)
    r2 = await fetch_data("https://api.example.com/posts", 1)
    r3 = await fetch_data("https://api.example.com/comments", 3)
    elapsed = time.perf_counter() - start
    print(f"Sequential: {elapsed:.1f}s")  # ~6 seconds
    return [r1, r2, r3]

# Concurrent (fast) — all start simultaneously, finish when all done
async def concurrent():
    start = time.perf_counter()
    results = await asyncio.gather(
        fetch_data("https://api.example.com/users", 2),
        fetch_data("https://api.example.com/posts", 1),
        fetch_data("https://api.example.com/comments", 3),
    )
    elapsed = time.perf_counter() - start
    print(f"Concurrent: {elapsed:.1f}s")  # ~3 seconds (limited by slowest)
    return results

# asyncio.gather:
# - Takes multiple coroutines
# - Runs ALL of them concurrently in the same thread (event loop)
# - Returns list of results in INPUT ORDER (not completion order)
# - If any raises exception: all others cancelled, exception propagated
# - Use gather(return_exceptions=True) to get exceptions as values instead

# =============================================================================
# SECTION 3: asyncio.create_task — Fire and Forget
# =============================================================================

async def background_task(name, delay):
    await asyncio.sleep(delay)
    print(f"Background task '{name}' completed")
    return name

async def main_with_tasks():
    # create_task starts the coroutine immediately (doesn't wait for it)
    task1 = asyncio.create_task(background_task("cleanup", 2), name="cleanup")
    task2 = asyncio.create_task(background_task("notify", 1), name="notify")

    print("Tasks started, doing other work...")
    await asyncio.sleep(0.5)  # Do something else
    print("Back to waiting for tasks...")

    # Wait for specific tasks
    result1 = await task1
    result2 = await task2
    print(f"Done: {result1}, {result2}")

    # Or wait for multiple tasks at once
    # results = await asyncio.gather(task1, task2)

# =============================================================================
# SECTION 4: Error Handling in async code
# =============================================================================

async def might_fail(fail=False):
    await asyncio.sleep(0.1)
    if fail:
        raise ValueError("Something went wrong!")
    return "Success"

async def safe_gather():
    # With return_exceptions=True: exceptions returned as values, not raised
    results = await asyncio.gather(
        might_fail(fail=False),
        might_fail(fail=True),
        might_fail(fail=False),
        return_exceptions=True,
    )

    for i, result in enumerate(results):
        if isinstance(result, Exception):
            print(f"Task {i} failed: {result}")
        else:
            print(f"Task {i} succeeded: {result}")

async def with_timeout():
    try:
        # asyncio.wait_for: raise TimeoutError if coroutine doesn't finish in time
        result = await asyncio.wait_for(fetch_data("slow-api", 5), timeout=2)
    except asyncio.TimeoutError:
        print("Request timed out!")
        result = None
    return result

# =============================================================================
# SECTION 5: Async Context Managers
# =============================================================================
# Many async libraries use `async with` instead of `with`.

class AsyncDatabase:
    """Simulates an async database connection."""
    async def __aenter__(self):
        print("Connecting to database...")
        await asyncio.sleep(0.1)  # Simulate connection time
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection...")
        await asyncio.sleep(0.05)
        # Return True to suppress exceptions, False/None to propagate
        return False

    async def query(self, sql):
        await asyncio.sleep(0.1)  # Simulate query time
        return [{"id": 1, "name": "Rohit"}]

async def use_database():
    async with AsyncDatabase() as db:
        users = await db.query("SELECT * FROM users")
        print(f"Got {len(users)} users")
    # Database automatically closed here

# =============================================================================
# SECTION 6: Async Iterators
# =============================================================================
# For iterating over async sequences (like database cursors, event streams).

class AsyncDataStream:
    def __init__(self, items):
        self.items = items
        self.index = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.index >= len(self.items):
            raise StopAsyncIteration
        await asyncio.sleep(0.01)  # Simulate async fetch
        item = self.items[self.index]
        self.index += 1
        return item

async def process_stream():
    stream = AsyncDataStream([1, 2, 3, 4, 5])
    async for item in stream:  # Use async for
        print(f"Processing: {item}")

# Async generator (cleaner syntax)
async def async_range(start, stop, delay=0.01):
    for i in range(start, stop):
        await asyncio.sleep(delay)
        yield i  # async generator uses yield

async def use_async_generator():
    async for num in async_range(0, 5):
        print(num)

# Async list comprehension
async def async_comprehension():
    result = [i async for i in async_range(0, 5)]
    return result

# =============================================================================
# SECTION 7: Real-World Pattern — Async HTTP Requests with httpx
# =============================================================================
# pip install httpx (async-native HTTP client)

# import httpx  # uncomment in real project

async def fetch_all_users(user_ids: list[int]):
    """Fetch multiple users concurrently from an API."""
    # In real code:
    # async with httpx.AsyncClient() as client:
    #     tasks = [client.get(f"https://api.example.com/users/{id}") for id in user_ids]
    #     responses = await asyncio.gather(*tasks)
    #     return [r.json() for r in responses]

    # Simulated:
    async def fetch_one(uid):
        await asyncio.sleep(0.1)  # Simulate HTTP request
        return {"id": uid, "name": f"User {uid}"}

    users = await asyncio.gather(*[fetch_one(uid) for uid in user_ids])
    return users

async def demo():
    users = await fetch_all_users([1, 2, 3, 4, 5])
    print(f"Fetched {len(users)} users concurrently")

# =============================================================================
# SECTION 8: Semaphore — Limit Concurrency
# =============================================================================
# Without limits, you might overwhelm an API with too many concurrent requests.

async def limited_fetches():
    semaphore = asyncio.Semaphore(3)  # Max 3 concurrent requests at once

    async def fetch_with_limit(url):
        async with semaphore:  # Acquire semaphore (blocks if 3 already active)
            await asyncio.sleep(0.5)  # Simulate request
            return f"Data from {url}"

    urls = [f"https://api.example.com/item/{i}" for i in range(10)]
    results = await asyncio.gather(*[fetch_with_limit(url) for url in urls])
    return results

# =============================================================================
# FILL IN THE BLANK EXERCISES
# =============================================================================

# Exercise 1: Write an async function `batch_process(items, processor, batch_size)`:
# - Splits items into batches of batch_size
# - Processes each batch concurrently with asyncio.gather
# - Returns a flat list of all results
# FILL IN:
# async def batch_process(items, processor, batch_size=5):
#     _____________________

# Exercise 2: Write an async context manager `timing_context(name)` using class:
# - __aenter__: record start time, print "Starting {name}"
# - __aexit__: print "{name} took {elapsed:.3f}s"
# FILL IN:
# class timing_context:
#     _____________________

# Exercise 3: Write a coroutine `retry_async(coro_factory, attempts=3, delay=1)`:
# - coro_factory is a function that returns a coroutine
# - Try up to `attempts` times, waiting `delay` seconds between tries
# - Return result if success, raise last exception if all fail
# FILL IN:
# async def retry_async(coro_factory, attempts=3, delay=1):
#     _____________________

# Run the event loop
if __name__ == "__main__":
    asyncio.run(concurrent())
    asyncio.run(safe_gather())
    asyncio.run(demo())

print("\n✓ Lesson 7: Async Python complete")
