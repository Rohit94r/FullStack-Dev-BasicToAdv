# =============================================================================
# DAY 16 — LESSON 6: Error Handling in FastAPI
# =============================================================================
# Run: uvicorn 06_error_handling:app --reload
# Install: pip install fastapi uvicorn
# =============================================================================

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field


app = FastAPI(title="Error Handling Demo")


# =============================================================================
# SECTION 1: HTTPException — your main tool (like throw AppError in Express)
# =============================================================================


class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1)


items_db: dict[int, dict] = {}
next_id = 1


@app.post("/items", status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate):
    global next_id
    # Business rule example
    if payload.name.lower() == "forbidden":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Item name 'forbidden' is not allowed",
        )
    item = {"id": next_id, "name": payload.name}
    items_db[next_id] = item
    next_id += 1
    return item


@app.get("/items/{item_id}")
def get_item(item_id: int):
    item = items_db.get(item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} not found",
        )
    return item


# =============================================================================
# SECTION 2: Custom exception + global handler
# =============================================================================


class UnauthorizedError(Exception):
    def __init__(self, message: str = "Not authenticated"):
        self.message = message


@app.exception_handler(UnauthorizedError)
async def unauthorized_handler(request: Request, exc: UnauthorizedError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"error": "Unauthorized", "message": exc.message},
    )


@app.get("/protected")
def protected_route(token: str | None = None):
    if not token:
        raise UnauthorizedError("Missing token")
    return {"ok": True}


# =============================================================================
# SECTION 3: Validation errors — customize 422 response shape
# =============================================================================


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "ValidationError",
            "details": exc.errors(),
        },
    )


# =============================================================================
# SECTION 4: Consistent error response shape (production pattern)
# =============================================================================
# {
#   "error": "NotFound",
#   "message": "Todo 42 not found",
#   "path": "/api/v1/todos/42"
# }


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail if isinstance(exc.detail, str) else "HTTPError",
            "message": exc.detail if isinstance(exc.detail, str) else str(exc.detail),
            "path": str(request.url.path),
        },
    )


# =============================================================================
# INTERVIEW Q&A
# =============================================================================
# Q: HTTPException vs custom exceptions?
# A: HTTPException for simple cases; custom exceptions + handlers for reusable
#    domain errors (NotFound, Forbidden) with consistent JSON shape.
#
# Q: What is status 422?
# A: Unprocessable Entity — Pydantic validation failed on request body/query.
#
# Q: How compare to Express error middleware?
# A: FastAPI uses @app.exception_handler decorators; Express uses
#    app.use((err, req, res, next) => ...) at the end of middleware chain.
