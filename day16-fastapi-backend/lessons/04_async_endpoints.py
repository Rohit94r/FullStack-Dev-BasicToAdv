# =============================================================================
# DAY 16 — LESSON 4: Async Endpoints in FastAPI
# =============================================================================
# Run: uvicorn 04_async_endpoints:app --reload
# Install: pip install fastapi uvicorn httpx
# =============================================================================
#
# Key insight: async def vs def in FastAPI
# - async def → runs on event loop, can await I/O (DB, HTTP, files)
# - def → FastAPI runs in a thread pool (blocking code won't freeze other requests)
#
# Rule: use async def ONLY if you await something inside. Otherwise use def.
# =============================================================================

import asyncio
from typing import Annotated

import httpx
from fastapi import BackgroundTasks, FastAPI

app = FastAPI(title="Async Endpoints Demo")


# =============================================================================
# SECTION 1: Sync vs Async routes
# =============================================================================


@app.get("/sync-hello")
def sync_hello():
    """CPU-bound or quick work — def is fine."""
    return {"message": "Hello from sync route"}


@app.get("/async-hello")
async def async_hello():
    """Async route — can await I/O."""
    await asyncio.sleep(0.1)  # simulates non-blocking wait
    return {"message": "Hello from async route"}


# =============================================================================
# SECTION 2: Awaiting external HTTP (real async I/O)
# =============================================================================


@app.get("/github/{username}")
async def get_github_user(username: str):
    """Fetch from GitHub API — MUST use async httpx in async route."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/users/{username}",
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()
        return {
            "login": data.get("login"),
            "public_repos": data.get("public_repos"),
            "followers": data.get("followers"),
        }


# =============================================================================
# SECTION 3: Background tasks — fire-and-forget after response
# =============================================================================


def write_log(message: str) -> None:
    print(f"[LOG] {message}")


@app.post("/notify")
async def send_notification(
    email: str,
    background_tasks: BackgroundTasks,
):
    """Return immediately; log runs after response is sent."""
    background_tasks.add_task(write_log, f"Notification queued for {email}")
    return {"status": "queued", "email": email}


# =============================================================================
# SECTION 4: Parallel async calls with asyncio.gather
# =============================================================================


async def fetch_status(url: str) -> dict:
    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(url, timeout=5.0)
            return {"url": url, "status": r.status_code}
        except httpx.HTTPError as exc:
            return {"url": url, "error": str(exc)}


@app.get("/health-check-sites")
async def check_sites():
    urls = [
        "https://httpbin.org/status/200",
        "https://httpbin.org/delay/1",
    ]
    results = await asyncio.gather(*[fetch_status(u) for u in urls])
    return {"results": results}


# =============================================================================
# SECTION 5: Common mistake — blocking call inside async def
# =============================================================================
# BAD (blocks event loop):
# @app.get("/bad")
# async def bad():
#     time.sleep(5)  # DON'T — blocks ALL concurrent requests
#     return {"ok": True}
#
# GOOD options:
# 1) Use def + blocking code (thread pool)
# 2) Use async libraries (httpx, asyncpg, motor)
# 3) asyncio.to_thread() for legacy blocking code


# =============================================================================
# INTERVIEW Q&A
# =============================================================================
# Q: async def vs def in FastAPI?
# A: async def runs on asyncio event loop; def runs in thread pool. Use async
#    when you await async I/O. Blocking sync code in async def hurts throughput.
#
# Q: When does async matter in FastAPI?
# A: Under concurrent load with I/O-bound work (DB, HTTP APIs). For a simple
#    CRUD app with low traffic, the difference may be negligible.
#
# Q: What are BackgroundTasks for?
# A: Run work after sending the HTTP response (emails, logging) without making
#    the client wait.
