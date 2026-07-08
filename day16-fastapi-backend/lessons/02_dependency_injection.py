# =============================================================================
# DAY 16 — LESSON 2: Dependency Injection in FastAPI
# =============================================================================
# FastAPI's dependency injection (DI) system is one of its most powerful features.
# It lets you:
# - Share logic across routes (auth, DB sessions, caching)
# - Test easily (swap real dependencies with mocks)
# - Manage resources (DB connections, cleanup)
# - Declare sub-dependencies (auth depends on token which depends on header)
# =============================================================================

from fastapi import FastAPI, Depends, HTTPException, Header, Query, status
from typing import Annotated, Optional
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="DI Examples")

# =============================================================================
# SECTION 1: Basic Dependency — A Function
# =============================================================================
# Any Python function can be a dependency.
# FastAPI calls it and injects the result into your route.

def get_current_time():
    """A simple dependency — returns current timestamp."""
    return datetime.now().isoformat()

@app.get("/time")
async def get_time(current_time: Annotated[str, Depends(get_current_time)]):
    # FastAPI calls get_current_time() and passes result as current_time
    return {"timestamp": current_time}

# =============================================================================
# SECTION 2: Dependency with Parameters
# =============================================================================

class PaginationParams:
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        limit: int = Query(10, ge=1, le=100, description="Items per page"),
    ):
        self.page = page
        self.limit = limit
        self.skip = (page - 1) * limit  # Calculate offset

# Type alias makes it cleaner to use
Pagination = Annotated[PaginationParams, Depends(PaginationParams)]

@app.get("/items")
async def get_items(pagination: Pagination):
    # pagination.page, pagination.limit, pagination.skip are all available
    return {
        "page": pagination.page,
        "limit": pagination.limit,
        "skip": pagination.skip,
        "items": [f"Item {i}" for i in range(pagination.skip, pagination.skip + pagination.limit)],
    }

@app.get("/products")
async def get_products(pagination: Pagination):
    # REUSE the same pagination dependency
    return {
        "page": pagination.page,
        "limit": pagination.limit,
        "products": [],
    }

# =============================================================================
# SECTION 3: Authentication Dependency
# =============================================================================

# Simulated user database
FAKE_USERS_DB = {
    "user-token-123": {"id": "1", "name": "Rohit", "role": "admin"},
    "user-token-456": {"id": "2", "name": "Priya", "role": "user"},
}

async def get_current_user(
    authorization: Annotated[Optional[str], Header()] = None
):
    """
    Dependency that extracts and validates the auth token.
    Called automatically for any route that depends on it.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},  # Standard header
        )

    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization format")

    token = parts[1]
    user = FAKE_USERS_DB.get(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user  # Returns dict — route receives it via Depends

# Type aliases for cleaner code
CurrentUser = Annotated[dict, Depends(get_current_user)]

@app.get("/profile")
async def get_profile(user: CurrentUser):
    return {"profile": user}

@app.get("/me")
async def get_me(user: CurrentUser):
    # Re-uses get_current_user — FastAPI calls it once and caches per request
    return {"id": user["id"], "name": user["name"]}

# =============================================================================
# SECTION 4: Role-Based Authorization Dependency
# =============================================================================
# Dependencies can be nested — sub-dependencies compose naturally.

def require_role(*roles: str):
    """Factory that returns an authorization dependency for specific roles."""

    async def check_role(user: CurrentUser):
        if user["role"] not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires role: {', '.join(roles)}"
            )
        return user

    return check_role

AdminUser = Annotated[dict, Depends(require_role("admin", "superadmin"))]

@app.get("/admin/stats")
async def admin_stats(admin: AdminUser):
    # Only admins and superadmins can reach this route
    return {"users_total": 100, "revenue": 99999}

@app.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, admin: AdminUser):
    return {"message": f"User {user_id} deleted by admin {admin['name']}"}

# =============================================================================
# SECTION 5: Database Session Dependency (the most important real-world pattern)
# =============================================================================
# In real apps with SQLAlchemy, you inject a database session dependency.
# The session is created per request and closed after (even if error occurs).

# Simulated database connection
class FakeDBSession:
    def __init__(self):
        self.is_open = True
        print("DB Session opened")

    def execute(self, query: str):
        return [{"id": 1, "name": "Mock result"}]

    def close(self):
        self.is_open = False
        print("DB Session closed")

async def get_db():
    """
    Dependency that yields a database session.
    yield instead of return = FastAPI runs cleanup code after request.
    """
    db = FakeDBSession()
    try:
        yield db          # Route handler receives this
    finally:
        db.close()        # ALWAYS runs — even if route raised an exception

# Type alias
DBSession = Annotated[FakeDBSession, Depends(get_db)]

@app.get("/db-test")
async def test_db(db: DBSession):
    # db is a live FakeDBSession
    result = db.execute("SELECT * FROM users")
    # After this function returns, db.close() is called automatically
    return {"users": result}

# In real SQLAlchemy code:
# from sqlalchemy.ext.asyncio import AsyncSession
# async def get_db() -> AsyncGenerator[AsyncSession, None]:
#     async with SessionLocal() as session:
#         yield session
#         await session.commit()  # commit on success

# =============================================================================
# SECTION 6: Combining Multiple Dependencies
# =============================================================================
# A route can depend on multiple things simultaneously.

@app.get("/users/{user_id}/orders")
async def get_user_orders(
    user_id: str,
    current_user: CurrentUser,      # Auth check
    pagination: Pagination,          # Pagination params
    db: DBSession,                   # DB connection
):
    # All three dependencies resolved before this runs
    if current_user["id"] != user_id and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Can only view your own orders")

    orders = db.execute(f"SELECT * FROM orders WHERE user_id = '{user_id}'")
    return {
        "user_id": user_id,
        "orders": orders[pagination.skip: pagination.skip + pagination.limit],
        "page": pagination.page,
    }

# =============================================================================
# SECTION 7: Global Dependencies (applied to entire app or router)
# =============================================================================

# Apply dependency to ALL routes:
# app = FastAPI(dependencies=[Depends(some_middleware_function)])

# Apply to a specific router:
# router = APIRouter(dependencies=[Depends(require_role("admin"))])

# =============================================================================
# SECTION 8: Dependency with Cleanup (yield) — Resource Management
# =============================================================================

import asyncio

async def get_cache():
    """
    Simulates a cache connection with cleanup.
    yield dependencies are like context managers.
    """
    print("Cache connected")
    cache = {"connected": True}  # Simulated cache

    yield cache  # Route handler gets the cache

    # Cleanup after request — even if exception occurred
    cache["connected"] = False
    print("Cache disconnected")

@app.get("/cached-data")
async def cached_endpoint(cache: Annotated[dict, Depends(get_cache)]):
    return {"cache_status": cache["connected"], "data": "cached result"}

# =============================================================================
# FILL IN THE BLANK EXERCISES
# =============================================================================

# Exercise 1: Create a dependency `verify_api_key` that:
# - Reads X-API-Key header
# - Returns 403 if key is not in VALID_API_KEYS = {"key1", "key2", "key3"}
# - Returns the key if valid
# FILL IN:
# VALID_API_KEYS = {"key1", "key2", "key3"}
# async def verify_api_key(
#     x_api_key: Annotated[Optional[str], Header()] = None
# ):
#     _____________________

# Exercise 2: Create a rate limiter dependency that:
# - Tracks request counts per "client" (use a dict as counter)
# - If client has made > 10 requests in the current minute: raise 429
# - Use request.client.host as client identifier
# FILL IN:
# from fastapi import Request
# request_counts = {}  # {"ip": {"count": 0, "reset_time": timestamp}}
# async def rate_limit(request: Request):
#     _____________________

# Exercise 3: Create a search params dependency:
# - q: Optional[str] — search query, max 100 chars
# - sort_by: Literal["created_at", "updated_at", "title"] = "created_at"
# - order: Literal["asc", "desc"] = "desc"
# FILL IN:
# from typing import Literal
# class SearchParams:
#     def __init__(self, ...):
#         _____________________
